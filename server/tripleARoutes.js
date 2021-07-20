//define router
const tripleARouter = require('express').Router();
//external libraries
const crypto = require('crypto');
const ExpressBrute = require('express-brute');
const store = new ExpressBrute.MemoryStore(); // TODO: stores state locally, don't use this in production
const bruteforce = new ExpressBrute(store);
const sgMail = require('@sendgrid/mail');
//Models
const User = require("./models/user");
const TripleANotification = require('./models/tripleA-notification');
const FinancialLog = require('./models/financiallog');
const Addon = require('./models/addon');
//local helpers
const simpleresponsive = require('./emailtemplates/simpleresponsive');
const fromEmailName = 'PAYPER WIN';
const fromEmailAddress = 'donotreply@payperwin.co';
const config = require('../config.json');
const FinancialStatus = config.FinancialStatus;
const CountryInfo = config.CountryInfo;

const ID = function () {
    return '' + Math.random().toString(10).substr(2, 9);
};

const signatureCheck = async (req, res, next) => {
    if (req.body) {
        const sig = req.headers['triplea-signature'];
        const noti = await TripleANotification.create({ signature: sig, body: req.body, rawBody: req.rawBody });
        let timestamp, signature;
        for (let sig_part of sig.split(',')) {
            let [key, value] = sig_part.split('=');

            switch (key) {
                case 't':
                    timestamp = value;
                    break;
                case 'v1':
                    signature = value;
                    break;
            }
        }

        const tripleAAddon = await Addon.findOne({ name: 'tripleA' });
        if (!tripleAAddon || !tripleAAddon.value || !tripleAAddon.value.merchant_key) {
            console.warn("TripleA Api is not set");
            return false;
        }
        const {
            notify_secret,
        } = tripleAAddon.value;

        let check_signature = crypto.createHmac('sha256', notify_secret)
            .update(`${timestamp}.${req.rawBody}`)
            .digest('hex');

        let curr_timestamp = Math.round((new Date()).getTime() / 1000);

        if (signature === check_signature && Math.abs(curr_timestamp - timestamp) <= 300) {
            noti.succeed = true;
            await noti.save();
            return next();
        } else {
            return res.json({
                error: "Signature mismatch"
            });
        }
    }
    else {
        return res.json({
            error: "Signature mismatch"
        });
    }
}

tripleARouter.post('/deposit',
    bruteforce.prevent,
    signatureCheck,
    async (req, res) => {
        const { receive_amount, payment_tier, webhook_data, crypto_currency } = req.body;
        if (webhook_data && (payment_tier == 'good' || payment_tier == 'short')) {
            const uniqid = `D${ID()}`;
            const user = await User.findById(webhook_data.payer_id);
            if (!user) {
                return res.json({ succes: false, message: "Can't find User." });
            }
            let method = 'Bitcoin';
            switch (crypto_currency) {
                case "ETH":
                    method = 'Ethereum';
                    break;
                case "USDT":
                    method = 'Tether';
                    break;
                case "testBTC":
                case "BTC":
                    method = 'Bitcoin';
                    break;
            }

            await FinancialLog.create({
                financialtype: 'deposit',
                uniqid,
                user: webhook_data.payer_id,
                amount: receive_amount,
                method: method,
                status: FinancialStatus.success
            });
            await user.update({
                $inc: {
                    balance: receive_amount
                }
            });

            const msg = {
                from: `"${fromEmailName}" <${fromEmailAddress}>`,
                to: user.email,
                subject: 'You’ve got funds in your account',
                text: `You’ve got funds in your account`,
                html: simpleresponsive(
                    `Hi <b>${user.email}</b>.
                    <br><br>
                    Just a quick reminder that you currently have funds in your PAYPER WIN account. You can find out how much is in
                    your PAYPER WIN account by logging in now.
                    <br><br>`),
            };
            sgMail.send(msg);

            return res.json({
                success: true,
                message: "Deposit success"
            });
        } else {
            return res.json({
                success: false,
                message: "Waiting for payment"
            });
        }
    }
);

tripleARouter.post('/withdraw',
    bruteforce.prevent,
    signatureCheck,
    async (req, res) => {
        const { payout_reference, status } = req.body;
        const withdraw = await FinancialLog.findOne({ note: payout_reference });
        if (!withdraw) {
            console.log("triple Payout", 'Can\'t find withdraw log.');
            return res.json({ success: false, message: 'Can\'t find withdraw log.' });
        }
        if (withdraw.status == FinancialStatus.success) {
            console.log("triple Payout", 'Can\'t update finished withdraw.');
            return res.json({ success: false, message: 'Can\'t update finished withdraw.' });
        }
        const userdata = await User.findById(withdraw.user);
        if (!userdata) {
            console.log("triple Payout", 'Can\'t find user.');
            return res.json({ success: false, message: 'Can\'t find user.' });
        }
        if (status == "done") {
            console.log("triple Payout", 'success withdraw');
            // const fee = CountryInfo.find(info => info.currency == userdata.currency).fee;
            // userdata.balance = parseInt(userdata.balance) - parseInt(withdraw.amount) - fee;
            await withdraw.update({ status: FinancialStatus.success }).exec();
            // await userdata.save();

            const msg = {
                from: `"${fromEmailName}" <${fromEmailAddress}>`,
                to: userdata.email,
                subject: 'You’ve got withdraw in your account',
                text: `You’ve got withdraw from your account`,
                html: simpleresponsive(
                    `Hi <b>${userdata.email}</b>.
                    <br><br>
                    Just a quick reminder that you currently have withdraw from your PAYPER WIN account. You can find out how much is in
                    your PAYPER WIN account by logging in now.
                    <br><br>`),
            };
            sgMail.send(msg);

            return res.json({ success: true });
        } else if (status == "cancel") {
            console.log("triple Payout", 'cancel withdraw');
            await withdraw.update({ status: FinancialStatus.onhold }).exec();
            const msg = {
                from: `"${fromEmailName}" <${fromEmailAddress}>`,
                to: userdata.email,
                subject: 'Withdraw is canceled',
                text: `Withdraw is canceled`,
                html: simpleresponsive(
                    `Hi <b>${userdata.email}</b>.
                    <br><br>
                    Just a quick reminder that withdraw from your PayPerWin account was canceled. You can find out how much is in
                    your PAYPER WIN account by logging in now.
                    <br><br>`),
            };
            sgMail.send(msg);
            return res.json({ success: true });
        } else {
            return res.json({ success: false, message: 'Waiting approve.' });
        }
    }
);

module.exports = tripleARouter;
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
//local helpers
const simpleresponsive = require('./emailtemplates/simpleresponsive');
const fromEmailName = 'PAYPER Win';
const fromEmailAddress = 'donotreply@payperwin.co';
const config = require('../config.json');
const TripleA = config.TripleA;
const FinancialStatus = config.FinancialStatus;

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

        let check_signature = crypto.createHmac('sha256', TripleA.notify_secret)
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

tripleARouter.post('/bitcoin-deposit',
    bruteforce.prevent,
    signatureCheck,
    async (req, res) => {
        const { payment_amount, payment_tier, webhook_data } = req.body;
        if (webhook_data && payment_tier == 'good') {
            const uniqid = `D${ID()}`;
            const user = await User.findById(webhook_data.payer_id);
            if (!user) {
                return res.json({ succes: false, message: "Can't find User." });
            }
            await FinancialLog.create({
                financialtype: 'deposit',
                uniqid,
                user: webhook_data.payer_id,
                amount: payment_amount,
                method: 'Bitcoin',
                status: FinancialStatus.success
            });
            await user.update({
                $inc: {
                    balance: payment_amount
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
                    Just a quick reminder that you currently have funds in your Payper Win account. You can find out how much is in
                    your Payper Win account by logging in now.
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

tripleARouter.post('/bitcoin-withdraw',
    bruteforce.prevent,
    signatureCheck,
    async (req, res) => {
        res.json({ success: true });
    }
);

module.exports = tripleARouter;
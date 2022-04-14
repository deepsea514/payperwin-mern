//define router
const tripleARouter = require('express').Router();
//external libraries
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
const bodyParser = require('body-parser');
//Models
const User = require("./models/user");
const FinancialLog = require('./models/financiallog');
const Addon = require('./models/addon');
const Preference = require('./models/preference');
const Affiliate = require('./models/affiliate');
const AffiliateCommission = require('./models/affiliate_commission');
const ErrorLog = require('./models/errorlog');
//local helpers
const simpleresponsive = require('./emailtemplates/simpleresponsive');
const fromEmailName = 'PAYPER WIN';
const fromEmailAddress = 'donotreply@payperwin.com';
const sendSMS = require("./libs/sendSMS");
const config = require('../config.json');
const FinancialStatus = config.FinancialStatus;
const inviteBonus = config.inviteBonus;
const affiliateCommission = config.affiliateCommission;
const {
    ID,
    checkSignupBonusPromotionEnabled,
    isSignupBonusUsed,
    checkFirstDeposit
} = require('./libs/functions');

const signatureCheck = async (req, res, next) => {
    if (req.body) {
        try {
            const sig = req.headers['triplea-signature'];
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
                return res.json({
                    error: "Cannot verify signature"
                });;
            }
            const { notify_secret } = tripleAAddon.value;

            let check_signature = crypto.createHmac('sha256', notify_secret)
                .update(`${timestamp}.${req.rawBody}`)
                .digest('hex');

            let curr_timestamp = Math.round((new Date()).getTime() / 1000);

            if (signature === check_signature && Math.abs(curr_timestamp - timestamp) <= 300) {
                return next();
            } else {
                console.error('Triple A signature mismatch.', sig, req.rawBody, `${timestamp}.${req.rawBody}`);
                return res.json({
                    error: "Signature mismatch"
                });
            }
        } catch (error) {
            console.error(error);
            return res.json({ success: false, error: 'Internal Server Error.' });
        }
    } else {
        console.error('Triple A signature mismatch.', req.rawBody);
        return res.json({
            error: "Signature mismatch"
        });
    }
}

tripleARouter.post(
    '/deposit',
    signatureCheck,
    async (req, res) => {
        try {
            let { receive_amount, payment_tier, webhook_data, crypto_currency } = req.body;
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
                receive_amount = Number(receive_amount);
                const afterBalance = user.balance + receive_amount;
                await FinancialLog.create({
                    financialtype: 'deposit',
                    uniqid,
                    user: webhook_data.payer_id,
                    amount: receive_amount,
                    method: method,
                    status: FinancialStatus.success,
                    beforeBalance: user.balance,
                    afterBalance: user.balance + receive_amount
                });
                await user.update({ $inc: { balance: receive_amount } });

                const promotionEnabled = await checkSignupBonusPromotionEnabled(user._id);
                const promotionUsed = await isSignupBonusUsed(user._id);
                if (promotionEnabled && !promotionUsed) {
                    await FinancialLog.create({
                        financialtype: 'signupbonus',
                        uniqid: `SB${ID()}`,
                        user: user._id,
                        amount: receive_amount,
                        method: method,
                        status: FinancialStatus.success,
                        beforeBalance: afterBalance,
                        afterBalance: afterBalance + receive_amount
                    });
                    await user.update({ $inc: { balance: receive_amount } });
                }

                if (user.invite) {
                    try {
                        const firstDeposit = await checkFirstDeposit(user);
                        if (firstDeposit && receive_amount >= 100) {
                            const affiliate = await Affiliate.findOne({ unique_id: user.invite });
                            if (affiliate) {
                                await affiliate.update({ $inc: { balance: affiliateCommission } });
                                await AffiliateCommission.create({
                                    affiliater: affiliate._id,
                                    user: user._id,
                                    amount: affiliateCommission
                                })
                            } else {
                                const invitor = await User.findOne({ username: user.invite });
                                if (invitor) {
                                    await FinancialLog.create({
                                        financialtype: 'invitebonus',
                                        uniqid: `IB${ID()}`,
                                        user: invitor._id,
                                        amount: inviteBonus * receive_amount,
                                        method: method,
                                        status: FinancialStatus.success,
                                        beforeBalance: invitor.balance,
                                        afterBalance: invitor.balance + inviteBonus * receive_amount
                                    });
                                    await invitor.update({ $inc: { balance: inviteBonus * receive_amount } });
                                }
                            }
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }

                const preference = await Preference.findOne({ user: user._id });
                if (!preference || !preference.notification_settings || preference.notification_settings.deposit_confirmation.email) {
                    const msg = {
                        from: `${fromEmailName} <${fromEmailAddress}>`,
                        to: user.email,
                        subject: 'You’ve got funds in your account',
                        text: `You’ve got funds in your account`,
                        html: simpleresponsive(
                            `Hi <b>${user.email}</b>.
                                <br><br>
                                Just a quick reminder that you currently have funds in your PAYPER WIN account. You can find out how much is in your PAYPER WIN account by logging in now.
                                <br><br>`),
                    };
                    sgMail.send(msg).catch(error => {
                        ErrorLog.findOneAndUpdate(
                            {
                                name: 'Send Grid Error',
                                "error.stack": error.stack
                            },
                            {
                                name: 'Send Grid Error',
                                error: {
                                    name: error.name,
                                    message: error.message,
                                    stack: error.stack
                                }
                            },
                            { upsert: true }
                        );
                    });
                }
                if (user.roles.phone_verified && (!preference || !preference.notification_settings || preference.notification_settings.deposit_confirmation.sms)) {
                    sendSMS('Just a quick reminder that you currently have funds in your PAYPER WIN account. You can find out how much is in your PAYPER WIN account by logging in now.', user.phone);
                }

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
        } catch (error) {
            console.error(error);
            res.json({
                success: false,
                message: "Internal Server Error."
            })
        }
    }
);

tripleARouter.post('/withdraw',
    signatureCheck,
    async (req, res) => {
        try {
            const { payout_reference, status } = req.body;
            const withdraw = await FinancialLog.findOne({ note: payout_reference });
            if (!withdraw) {
                return res.json({ success: false, message: 'Can\'t find withdraw log.' });
            }
            if (withdraw.status == FinancialStatus.success) {
                return res.json({ success: false, message: 'Can\'t update finished withdraw.' });
            }
            const user = await User.findById(withdraw.user);
            if (!user) {
                return res.json({ success: false, message: 'Can\'t find user.' });
            }
            if (status == "done") {
                // const fee = CountryInfo.find(info => info.currency == user.currency).fee;
                // user.balance = parseInt(user.balance) - parseInt(withdraw.amount) - fee;
                await withdraw.update({ status: FinancialStatus.success });
                // await user.save();

                const preference = await Preference.findOne({ user: user._id });
                if (!preference || !preference.notification_settings || preference.notification_settings.withdraw_confirmation.email) {
                    const msg = {
                        from: `${fromEmailName} <${fromEmailAddress}>`,
                        to: user.email,
                        subject: 'You’ve got withdraw in your account',
                        text: `You’ve got withdraw from your account`,
                        html: simpleresponsive(
                            `Hi <b>${user.email}</b>.
                            <br><br>
                            Just a quick reminder that you currently have withdraw from your PAYPER WIN account. You can find out how much is in your PAYPER WIN account by logging in now.
                            <br><br>`),
                    };
                    sgMail.send(msg).catch(error => {
                        ErrorLog.findOneAndUpdate(
                            {
                                name: 'Send Grid Error',
                                "error.stack": error.stack
                            },
                            {
                                name: 'Send Grid Error',
                                error: {
                                    name: error.name,
                                    message: error.message,
                                    stack: error.stack
                                }
                            },
                            { upsert: true }
                        );
                    });
                }
                if (user.roles.phone_verified && (!preference || !preference.notification_settings || preference.notification_settings.withdraw_confirmation.sms)) {
                    sendSMS('Just a quick reminder that you currently have withdraw from your PAYPER WIN account. You can find out how much is in your PAYPER WIN account by logging in now.', user.phone);
                }

                return res.json({ success: true });
            } else if (status == "cancel") {
                await withdraw.update({ status: FinancialStatus.onhold });

                await FinancialLog.create({
                    financialtype: 'withdrawcancel',
                    uniqid: `WC${ID()}`,
                    user: user._id,
                    amount: withdraw.amount + withdraw.fee,
                    method: withdraw.method,
                    status: FinancialStatus.success,
                    fee: 0,
                    beforeBalance: user.balance,
                    afterBalance: withdraw.amount + withdraw.fee
                });
                await user.update({
                    $inc: { balance: withdraw.amount + withdraw.fee }
                });

                const preference = await Preference.findOne({ user: user._id });
                if (!preference || !preference.notification_settings || preference.notification_settings.withdraw_confirmation.email) {
                    const msg = {
                        from: `${fromEmailName} <${fromEmailAddress}>`,
                        to: user.email,
                        subject: 'Withdraw is cancelled',
                        text: `Withdraw is cancelled`,
                        html: simpleresponsive(
                            `Hi <b>${user.email}</b>.
                            <br><br>
                            Just a quick reminder that withdraw from your PayPerWin account was cancelled. You can find out how much is in your PAYPER WIN account by logging in now.
                            <br><br>`),
                    };
                    sgMail.send(msg).catch(error => {
                        ErrorLog.findOneAndUpdate(
                            {
                                name: 'Send Grid Error',
                                "error.stack": error.stack
                            },
                            {
                                name: 'Send Grid Error',
                                error: {
                                    name: error.name,
                                    message: error.message,
                                    stack: error.stack
                                }
                            },
                            { upsert: true }
                        );
                    });
                }
                if (user.roles.phone_verified && (!preference || !preference.notification_settings || preference.notification_settings.withdraw_confirmation.sms)) {
                    sendSMS('Just a quick reminder that withdraw from your PayPerWin account was cancelled. You can find out how much is in your PAYPER WIN account by logging in now.', user.phone);
                }
                return res.json({ success: true });
            } else {
                return res.json({ success: false, message: 'Waiting approve.' });
            }
        } catch (error) {
            console.error(error);
            res.json({ success: false })
        }
    }
);

module.exports = tripleARouter;
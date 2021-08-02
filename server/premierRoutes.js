//define router
const premierRouter = require('express').Router();
//external libraries
const ExpressBrute = require('express-brute');
const store = new ExpressBrute.MemoryStore(); // TODO: stores state locally, don't use this in production
const bruteforce = new ExpressBrute(store);
const { ObjectId } = require('bson');
const sgMail = require('@sendgrid/mail');
//Models
const User = require("./models/user");
const PremierNotification = require('./models/premier-notification');
const FinancialLog = require('./models/financiallog');
const Preference = require('./models/preference');
//local helpers
const { generatePremierNotificationSignature } = require('./libs/generatePremierSignature');
const simpleresponsive = require('./emailtemplates/simpleresponsive');
const fromEmailName = 'PAYPER WIN';
const fromEmailAddress = 'donotreply@payperwin.co';
const sendSMS = require("./libs/sendSMS");
const config = require('../config.json');
const FinancialStatus = config.FinancialStatus;
const DepositHeld = 8;

const signatureCheck = async (req, res, next) => {
    if (req.body) {
        const data = req.body;
        const notify = await PremierNotification.create(data);
        const signature = await generatePremierNotificationSignature(data.txid, data.status, data.amount_raw, data.descriptor)
        if (signature == data.signature_v2) {
            notify.succeed = true;
            await notify.save();
            return next();
        }
        else {
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

async function isFirstDepositDone(user) {
    const existingDeposit = await FinancialLog.find({
        user: user._id,
        type: 'deposit',
        status: FinancialStatus.success,
    });

    if (existingDeposit && existingDeposit.length) {
        return true
    }
    return false;
}

premierRouter.post('/etransfer-deposit',
    bruteforce.prevent,
    signatureCheck,
    async (req, res) => {
        const { udf1: user_id, udf2: uniqid, status, tx_action } = req.body;
        try {
            const deposit = await FinancialLog.findOne({ uniqid });
            if (!deposit) {
                return res.json({
                    success: "Can't find log"
                });
            }
            if (tx_action == "PAYMENT" && status == "APPROVED") {
                const user = await User.findById(ObjectId(user_id));
                if (!user) {
                    return res.json({
                        error: "Doesn't make changes"
                    });
                }
                await deposit.update({
                    status: FinancialStatus.success
                });

                const firstDepositDone = await isFirstDepositDone(user);
                if (firstDepositDone) {
                    await user.update({ $inc: { balance: deposit.amount } });
                } else {
                    await FinancialLog.create({
                        financialtype: 'depositheld',
                        uniqid: `DH${ID()}`,
                        user: webhook_data.payer_id,
                        amount: DepositHeld,
                        method: method,
                        status: FinancialStatus.success
                    });
                    await user.update({ $inc: { balance: receive_amount - DepositHeld } });
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
                    sgMail.send(msg);
                }
                if (user.roles.phone_verified && (!preference || !preference.notification_settings || preference.notification_settings.deposit_confirmation.sms)) {
                    sendSMS('Just a quick reminder that you currently have funds in your PAYPER WIN account. You can find out how much is in your PAYPER WIN account by logging in now.', user.phone);
                }

                return res.json({
                    success: "Deposit success"
                });
            } else if (status == "DECLINED") {
                await deposit.update({
                    status: "On-hold"
                });
                return res.json({
                    success: "Deposit declined"
                });
            } else {
                return res.json({
                    error: "Doesn't make changes"
                });
            }
        } catch (error) {
            return res.json({
                error: "Can't find log"
            });
        }
    }
);


// premierRouter.post('/etransfer-withdraw',
//     bruteforce.prevent,
//     signatureCheck,
//     async (req, res) => {
//         const { udf1: user_id, udf2: uniqid, status, tx_action } = req.body;
//         try {
//             const withdraw = await FinancialLog.findOne({ uniqid });
//             if (!withdraw) {
//                 return res.json({
//                     success: "Can't find log"
//                 });
//             }
//             if (tx_action == "PAYOUT" && status == "APPROVED") {
//                 const user = await User.findById(ObjectId(user_id));
//                 if (!user) {
//                     return res.json({
//                         error: "Doesn't make changes"
//                     });
//                 }
//                 await withdraw.update({
//                     status: "Success"
//                 });
//                 await user.update({
//                     balance: user.balance - withdraw.amount
//                 });

//                 const msg = {
//                     from: `${fromEmailName} <${fromEmailAddress}>`,
//                     to: user.email,
//                     subject: 'You’ve got funds out from your account',
//                     text: `You’ve got funds out from your account`,
//                     html: simpleresponsive(
//                         `Hi <b>${user.firstname}</b>.
//                         <br><br>
//                         Just a quick reminder that you currently have funds out from your PAYPER WIN account. You can find out how much is out from
//                         your PAYPER WIN account by logging in now.
//                         <br><br>`),
//                 };
//                 sgMail.send(msg);

//                 return res.json({
//                     success: "Withdraw success"
//                 });
//             } else if (status == "DECLINED") {
//                 await withdraw.update({
//                     status: "On-hold"
//                 });
//                 return res.json({
//                     success: "Withdraw declined"
//                 });
//             } else {
//                 return res.json({
//                     error: "Doesn't make changes"
//                 });
//             }
//         } catch (error) {
//             return res.json({
//                 error: "Can't find log"
//             });
//         }
//     }
// );

module.exports = premierRouter;
const premierRouter = require('express').Router();
const ExpressBrute = require('express-brute');
const store = new ExpressBrute.MemoryStore(); // TODO: stores state locally, don't use this in production
const bruteforce = new ExpressBrute(store);
const User = require("./models/user");
const config = require("../config.json");
const { ObjectId } = require('bson');
const simpleresponsive = require('./emailtemplates/simpleresponsive');
const sgMail = require('@sendgrid/mail');
const PremierNotification = require('./models/premier-notification');
const { generatePremierNotificationSignature } = require('./generateSignature');
const FinancialLog = require('./models/financiallog');
const fromEmailName = 'PAYPER Win';
const fromEmailAddress = 'donotreply@payperwin.co';

const signatureCheck = async (req, res, next) => {
    if (req.body) {
        const data = req.body;
        await PremierNotification.create(data);
        const signature = generatePremierNotificationSignature(data.txid, data.status, data.amount_row, data.descriptor)
        if (signature == data.signature_v2) {
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

premierRouter.post('/result',
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
                    status: "Success"
                });
                await user.update({
                    balance: user.balance + deposit.amount
                });

                const msg = {
                    from: `"${fromEmailName}" <${fromEmailAddress}>`,
                    to: user.email,
                    subject: 'You’ve got funds in your account',
                    text: `You’ve got funds in your account`,
                    html: simpleresponsive(
                        `Hi <b>${user.firstname}</b>.
                        <br><br>
                        Just a quick reminder that you currently have funds in your Payper Win account. You can find out how much is in
                        your Payper Win account by logging in now.
                        <br><br>`),
                };
                sgMail.send(msg);

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
    });

module.exports = premierRouter;
//define router
const tripleARouter = require('express').Router();
//external libraries
const crypto = require('crypto');
const ExpressBrute = require('express-brute');
const store = new ExpressBrute.MemoryStore(); // TODO: stores state locally, don't use this in production
const bruteforce = new ExpressBrute(store);
const { ObjectId } = require('bson');
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

const signatureCheck = async (req, res, next) => {
    if (req.body) {
        const sig = req.headers['triplea-signature'];
        const noti = await TripleANotification.create({ signature: sig, body: req.body });
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

        let check_signature = crypto.createHmac('sha256', TripleA)
            .update(`${timestamp}.${JSON.stringify(req.body)}`)
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
        res.json({ success: true });
    }
);

module.exports = tripleARouter;
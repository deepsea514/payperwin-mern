// define router
const v1Router = require('express').Router();
// external libraries
const { ObjectId } = require('bson');
const sgMail = require('@sendgrid/mail');

//Models
const User = require("./models/user");
const Pinnacle = require('./models/pinnacle');
const BetSportsBook = require("./models/betsportsbook");
const TransactionSportsBook = require('./models/transactionsportsbook');
const V1Request = require('./models/v1requests');
const FinancialLog = require('./models/financiallog');
const Addon = require("./models/addon");
//local helpers
const { generatePinnacleToken } = require('./libs/generatePinnacleToken');
const io = require('./libs/socket');
const simpleresponsive = require('./emailtemplates/simpleresponsive');
const config = require("../config.json");
const InsufficientFunds = 8;
const fromEmailName = 'PAYPER Win';
const fromEmailAddress = 'donotreply@payperwin.co';
const FinancialStatus = config.FinancialStatus;

const ErrorCode = {
    Success: 0,
    UnknownError: -1,
    AccountFrozen: -4,
    AccountNotFound: -5,
    AuthenticationFailed: -6,
}

const ActionErrorCode = {
    Success: 0,
    UnknownError: -1,
    InsufficientFunds: -2,
}

const ID = function () {
    return '' + Math.random().toString(10).substr(2, 9);
};

const tokenCheck = async (req, res, next) => {
    if (req.body) {
        const SignatureFromReq = req.body.Signature;
        const Timestamp = req.body.Timestamp;
        if (!SignatureFromReq || !Timestamp) {
            return res.json({
                "ErrorCode": ErrorCode.AuthenticationFailed,
                "Timestamp": new Date()
            });
        }
        const signatureTime = new Date(Timestamp + ".000-04:00").getTime();
        const currentTime = new Date().getTime();
        //////// check time is expired
        if (currentTime - signatureTime > 15 * 60 * 1000) {
            return res.json({
                "ErrorCode": ErrorCode.AuthenticationFailed,
                "Timestamp": new Date()
            });
        }

        const pinnacleSandboxAddon = await Addon.findOne({ name: 'pinnacle sandbox' });
        if (!pinnacleSandboxAddon || !pinnacleSandboxAddon.value || !pinnacleSandboxAddon.value.agentCode) {
            console.warn("Pinnacel Sandbox Api is not set");
            return res.status(400).json({
                error: "Can't create pinnacle user."
            });
        }
        const { agentCode, agentKey, secretKey } = pinnacleSandboxAddon.value;

        const token = generatePinnacleToken(agentCode, agentKey, secretKey, Timestamp);
        if (token != SignatureFromReq) {
            return res.json({
                "ErrorCode": ErrorCode.AuthenticationFailed,
                "Timestamp": new Date()
            });
        }
        return next();
    }
    else {
        return res.json({
            "ErrorCode": ErrorCode.AuthenticationFailed,
            "Timestamp": new Date()
        });
    }
}

// Pinnacle
v1Router.post('/ping', (req, res) => {
    res.json({
        "Result": {
            "Available": true
        },
        "ErrorCode": ErrorCode.Success,
        "Timestamp": new Date()
    });
});

v1Router.post('/:agentcode/wallet/usercode/:usercode/balance',
    tokenCheck,
    async (req, res) => {
        const agentcode = req.params.agentcode;
        const usercode = req.params.usercode;
        await V1Request.create({
            request: req.body,
            type: 'getBalance',
            params: {
                agentcode,
                usercode
            }
        });
        const pinnacleSandboxAddon = await Addon.findOne({ name: 'pinnacle sandbox' });
        if (!pinnacleSandboxAddon || !pinnacleSandboxAddon.value || !pinnacleSandboxAddon.value.agentCode) {
            console.warn("Pinnacel Sandbox Api is not set");
            return res.status(400).json({
                error: "Can't create pinnacle user."
            });
        }
        const { agentCode } = pinnacleSandboxAddon.value;
        if (agentcode != agentCode) {
            return res.json({
                "ErrorCode": ErrorCode.UnknownError,
                "Timestamp": new Date()
            });
        }
        const pinnacle = await Pinnacle.findOne({ userCode: usercode }).populate('user');
        if (!pinnacle) {
            return res.json({
                "ErrorCode": ErrorCode.AccountNotFound,
                "Timestamp": new Date(),
            });
        }

        if (!pinnacle.user) {
            return res.json({
                "ErrorCode": ErrorCode.AccountNotFound,
                "Timestamp": new Date(),
            });
        }

        return res.json({
            "Result": {
                "UserCode": usercode,         // (String)
                "AvailableBalance": pinnacle.user.balance
            },
            "ErrorCode": ErrorCode.Success,
            "Timestamp": new Date(),
        });

    }
);

v1Router.post('/:agentcode/wagering/usercode/:usercode/request/:requestid',
    tokenCheck,
    async (req, res) => {
        const agentcode = req.params.agentcode;
        const usercode = req.params.usercode;
        const requestid = req.params.requestid;

        await V1Request.create({
            request: req.body,
            type: 'wagering',
            params: {
                agentcode,
                usercode,
                requestid
            }
        });
        const pinnacleSandboxAddon = await Addon.findOne({ name: 'pinnacle sandbox' });
        if (!pinnacleSandboxAddon || !pinnacleSandboxAddon.value || !pinnacleSandboxAddon.value.agentCode) {
            console.warn("Pinnacel Sandbox Api is not set");
            return res.status(400).json({
                error: "Can't create pinnacle user."
            });
        }
        const { agentCode } = pinnacleSandboxAddon.value;

        if (agentcode != agentCode) {
            return res.json({
                "ErrorCode": ErrorCode.UnknownError,
                "Timestamp": new Date()
            });
        }
        const pinnacle = await Pinnacle.findOne({ userCode: usercode }).populate('user');
        if (!pinnacle) {
            return res.json({
                "ErrorCode": ErrorCode.AccountNotFound,
                "Timestamp": new Date(),
            });
        }

        if (!pinnacle.user) {
            return res.json({
                "ErrorCode": ErrorCode.AccountNotFound,
                "Timestamp": new Date(),
            });
        }

        const { Actions } = req.body;
        let resactions = [];
        for (let i = 0; i < Actions.length; i++) {
            const action = Actions[i];
            const { Name } = action;
            let res = null;
            switch (Name.toUpperCase()) {
                case 'BETTED':
                    res = await bettedAction(action, pinnacle.user);
                    resactions.push(res);
                    break;
                case "ACCEPTED":
                case "SETTLED":
                case "CANCELLED":
                case "REJECTED":
                case "ROLLBACKED":
                case "UNSETTLED":
                    res = await updateAction(action, pinnacle.user);
                    resactions.push(res);
                    break;
                default:
                    break;
            }
        }
        res.json({
            Result: {
                UserCode: pinnacle.userCode,
                AvailableBalance: pinnacle.user.balance,
                Actions: resactions
            },
            ErrorCode: ErrorCode.Success,
            Timestamp: new Date()
        })
    }
);

async function bettedAction(action, user) {
    const { Id, Name, Transaction, WagerInfo } = action;
    try {
        if (Transaction && user.balance < (Transaction.Amount + InsufficientFunds)) {
            return {
                Id,
                TransactionId: Transaction.TransactionId,
                WagerId: WagerInfo.WagerId,
                ErrorCode: ActionErrorCode.InsufficientFunds
            }
        }
        const bet = await BetSportsBook.create({
            userId: user._id,
            originId: WagerInfo.WagerId,
            Name,
            WagerInfo
        });

        await TransactionSportsBook.create({
            userId: user._id,
            ...Transaction
        })

        const betSportsbookHistory = [...user.betSportsbookHistory, bet._id];

        await User.findByIdAndUpdate(
            new ObjectId(user._id),
            {
                balance: user.balance - Transaction.Amount,
                betSportsbookHistory
            }
        );

        await FinancialLog.create({
            financialtype: 'bet',
            uniqid: `BP${ID()}`,
            user: user._id,
            amount: Transaction.Amount,
            method: `bet - ${Name}`,
            status: FinancialStatus.success,
        });

        return {
            Id,
            TransactionId: Transaction.TransactionId,
            WagerId: WagerInfo.WagerId,
            ErrorCode: ActionErrorCode.Success
        }
    } catch (error) {
        return {
            Id,
            TransactionId: Transaction.TransactionId,
            WagerId: WagerInfo.WagerId,
            ErrorCode: ActionErrorCode.UnknownError
        }
    }
}

async function updateAction(action, user) {
    const { Id, Name, Transaction, WagerInfo } = action;
    try {
        if (Transaction && Transaction.TransactionType == "DEBIT") {
            if (user.balance < (Transaction.Amount + InsufficientFunds)) {
                return {
                    Id,
                    TransactionId: Transaction.TransactionId,
                    WagerId: WagerInfo.WagerId,
                    ErrorCode: ActionErrorCode.InsufficientFunds
                }
            }
        }

        const bet = await BetSportsBook.findOne({
            userId: user._id,
            originId: WagerInfo.WagerId,
        });
        await bet.update({
            Name,
            WagerInfo: {
                ...bet.WagerInfo,
                ...WagerInfo
            }
        });

        if (Name.toUpperCase() == "ACCEPTED") {
            if (WagerInfo.Legs) {
                let string = "";
                WagerInfo.Legs.map(leg => {
                    string += `${leg.Sport} ${WagerInfo.Type} <br>`
                })
                const msg = {
                    from: `"${fromEmailName}" <${fromEmailAddress}>`,
                    to: user.email,
                    subject: 'Your bet was accepted',
                    text: `Your bet was accepted`,
                    html: simpleresponsive(
                        `Hi <b>${user.firstname}</b>.
                        <br><br>
                        This email is to advise that your bet for 
                        ${string}
                        for ${WagerInfo.ToRisk} was accepted on ${new Date()}
                        <br><br>`),
                };
                sgMail.send(msg);
            }
            else {
                const msg = {
                    from: `"${fromEmailName}" <${fromEmailAddress}>`,
                    to: user.email,
                    subject: 'Your bet was accepted',
                    text: `Your bet was accepted`,
                    html: simpleresponsive(
                        `Hi <b>${user.firstname}</b>.
                        <br><br>
                        This email is to advise that your bet for ${WagerInfo.Sport} ${WagerInfo.Type} for ${WagerInfo.ToRisk} was accepted on ${new Date()}
                        <br><br>`),
                };
                sgMail.send(msg);
            }
        }
        let returnObj = {
            Id,
            WagerId: WagerInfo.WagerId,
            ErrorCode: ActionErrorCode.Success
        };
        if (Transaction) {
            if (Transaction.TransactionType == "DEBIT") {
                await FinancialLog.create({
                    financialtype: 'bet',
                    uniqid: `BP${ID()}`,
                    user: user._id,
                    amount: Transaction.Amount,
                    method: `bet - ${Name}`,
                    status: FinancialStatus.success,
                });
                await User.findByIdAndUpdate(new ObjectId(user._id),
                    { balance: user.balance - Transaction.Amount });
            } else {
                await FinancialLog.create({
                    financialtype: 'bet',
                    uniqid: `BP${ID()}`,
                    user: user._id,
                    amount: Transaction.Amount,
                    method: `bet - ${Name}`,
                    status: FinancialStatus.success,
                });
                await User.findByIdAndUpdate(new ObjectId(user._id),
                    { balance: user.balance + Transaction.Amount });
            }

            returnObj = {
                Id,
                TransactionId: Transaction.TransactionId,
                WagerId: WagerInfo.WagerId,
                ErrorCode: ActionErrorCode.Success
            };
        }
        if (Name.toUpperCase() == "ACCEPTED") {
            console.log("ACCEPTED", user._id);
            io.emit("sportsbook-accepted", user._id);
        }

        return returnObj;
    } catch (error) {
        console.log(error);
        if (Transaction) {
            return {
                Id,
                TransactionId: Transaction.TransactionId,
                WagerId: WagerInfo.WagerId,
                ErrorCode: ActionErrorCode.UnknownError
            }
        }
        return {
            Id,
            WagerId: WagerInfo.WagerId,
            ErrorCode: ActionErrorCode.UnknownError
        }
    }
}

module.exports = v1Router;
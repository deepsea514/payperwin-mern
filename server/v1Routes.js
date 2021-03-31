const v1Router = require('express').Router();
const ExpressBrute = require('express-brute');
const store = new ExpressBrute.MemoryStore(); // TODO: stores state locally, don't use this in production
const bruteforce = new ExpressBrute(store);
const User = require("./models/user");
const Pinnacle = require('./models/pinnacle');
const BetSportsBook = require("./models/betsportsbook");
const TransactionSportsBookSchema = require('./models/transactionsportsbook');
const V1Request = require('./models/v1requests');
const config = require("../config.json");
const { generateToken } = require('./generateToken');
const { ObjectId } = require('bson');
const InsufficientFunds = 8;
const simpleresponsive = require('./emailtemplates/simpleresponsive');
const sgMail = require('@sendgrid/mail');
const fromEmailName = 'PAYPER Win';
const fromEmailAddress = 'donotreply@payperwin.co';
const io = require('./libs/socket');

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

const { agentCode, agentKey, secretKey } = config;

const ID = function () {
    return '' + Math.random().toString(10).substr(2, 9);
};

const tokenCheck = (req, res, next) => {
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

        const token = generateToken(agentCode, agentKey, secretKey, Timestamp);
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
        await BetSportsBook.create({
            userId: user._id,
            pinnacleId: WagerInfo.WagerId,
            Name,
            WagerInfo
        });

        await TransactionSportsBookSchema.create({
            userId: user._id,
            ...Transaction
        })

        await User.findByIdAndUpdate(new ObjectId(user._id),
            { balance: user.balance - Transaction.Amount });

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
            pinnacleId: WagerInfo.WagerId,
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
                    string += `${leg.Sport} ${WagerInfo.type} <br>`
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
                        for ${Transaction.Amount} was accepted on ${new Date()}
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
                        This email is to advise that your bet for ${WagerInfo.Sport} ${WagerInfo.type} for ${Transaction.Amount} was accepted on ${new Date()}
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
                await User.findByIdAndUpdate(new ObjectId(user._id),
                    { balance: user.balance - Transaction.Amount });
            } else {
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
        console.log(Name);
        if (Name.toUpperCase() == "ACCEPTED") {
            console.log("ACCEPTED", user._id);
            io.emit("sportsbook-accepted", user._id);
        }

        return returnObj;
    } catch (error) {
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
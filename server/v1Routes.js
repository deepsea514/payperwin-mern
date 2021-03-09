const v1Router = require('express').Router();
const ExpressBrute = require('express-brute');
const store = new ExpressBrute.MemoryStore(); // TODO: stores state locally, don't use this in production
const bruteforce = new ExpressBrute(store);
const User = require("./models/user");
const DepositReason = require("./models/depositreason");
const Bet = require("./models/bet");
const Sport = require("./models/sport");
const Pinnacle = require('./models/pinnacle');
const config = require("../config.json");
const FinancialStatus = config.FinancialStatus;
const CountryInfo = config.CountryInfo;
const { ObjectId } = require('mongodb');
const { generateToken } = require('./generateToken');

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
    InsufficientFunds: 2,
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
        const signatureTime = new Date(Timestamp).getTime();
        const currentTime = new Date().getTime();
        ////////// check time is expired
        // if (currentTime - signatureTime > 15 * 60 * 1000) {
        //     return res.json({
        //         "ErrorCode": ErrorCode.AuthenticationFailed,
        //         "Timestamp": new Date()
        //     });
        // }

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

        
    }
)

module.exports = v1Router;
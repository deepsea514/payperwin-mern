// Define Router
const adminRouter = require('express').Router();
// Models
const Admin = require('./models/admin');
const User = require("./models/user");
const DepositReason = require("./models/depositreason");
const FinancialLog = require("./models/financiallog");
const Bet = require("./models/bet");
const Sport = require("./models/sport");
const LoginLog = require('./models/loginlog');
const Email = require("./models/email");
const AutoBet = require("./models/autobet");
const Promotion = require("./models/promotion");
const PromotionLog = require("./models/promotionlog");
const Verification = require("./models/verification");
const Preference = require("./models/preference");
const FAQSubject = require("./models/faq_subject");
const Event = require("./models/event");
const Message = require("./models/message");
const MetaTag = require("./models/meta-tag");
const Addon = require("./models/addon");
const Article = require("./models/article");
const ArticleCategory = require("./models/article_category");
const ArticleAuthor = require('./models/article_author');
const Frontend = require("./models/frontend");
const Ticket = require('./models/ticket');
const FAQItem = require('./models/faq_item');
const BetPool = require('./models/betpool');
const ErrorLog = require('./models/errorlog');
const LoyaltyLog = require('./models/loyaltylog');
const ParlayBetPool = require('./models/parlaybetpool');
const GiftCard = require('./models/giftcard');
const PromotionBanner = require('./models/promotion_banner');
const Member = require('./models/member');
const Affiliate = require('./models/affiliate');
const AffiliateCommission = require('./models/affiliate_commission');
//external Libraries
const ExpressBrute = require('express-brute');
const store = new ExpressBrute.MemoryStore(); // TODO: stores state locally, don't use this in production
const bruteforce = new ExpressBrute(store);
const jwt = require('jsonwebtoken');
const accessTokenSecret = 'PPWAdminSecretKey-1234567890~!@#$%^&*()_+';
const dateformat = require("dateformat");
const { ObjectId } = require('mongodb');
const sgMail = require('@sendgrid/mail');
const axios = require('axios');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const _ = require("lodash");
const fileUpload = require('express-fileupload');
const fs = require('fs');
//local helpers
const sendSMS = require("./libs/sendSMS");
const config = require("../config.json");
const FinancialStatus = config.FinancialStatus;
const EventStatus = config.EventStatus;
const AdminRoles = config.AdminRoles;
const isDstObserved = config.isDstObserved;
const inviteBonus = config.inviteBonus;
const simpleresponsive = require('./emailtemplates/simpleresponsive');
const fromEmailName = 'PAYPER WIN';
const fromEmailAddress = 'donotreply@payperwin.com';
const calculateNewOdds = require('./libs/calculateNewOdds');
const {
    checkSignupBonusPromotionEnabled,
    isSignupBonusUsed,
    ID,
    get2FACode,
    isFreeWithdrawalUsed,
    calculateBetsStatus,
    calculateToWinFromBet,
    calculateParlayBetsStatus,
    getLinePoints,
    sendBetWinConfirmEmail,
    sendBetLoseConfirmEmail,
    checkFirstDeposit,
    cancelBetPool
} = require('./libs/functions');
const {
    generatePremierRequestSignature,
    generatePremierResponseSignature
} = require('./libs/generatePremierSignature');
const convertOdds = require('./libs/convertOdds');
const getTeaserOdds = require('./libs/getTeaserOdds');

const BetFee = 0.05;
const loyaltyPerBet = 25;
const maximumWin = 2000;
const affiliateCommission = config.affiliateCommission;

Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, accessTokenSecret, async (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            const admin = await Admin.findById(user._id);
            if (admin) {
                if (user._2fa_passed) {
                    req.user = admin;
                    return next();
                }
                return res.sendStatus(403);
            }
            return res.sendStatus(403);
        });
    } else {
        res.sendStatus(401);
    }
};

const authenticate2FAJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, accessTokenSecret, async (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            const admin = await Admin.findById(user._id);
            if (admin) {
                if (user._2fa_passed) {
                    return res.sendStatus(403);
                }
                req.user = admin;
                req._2fa_code = user._2fa_code
                return next();
            }
            return res.sendStatus(403);
        });
    } else {
        res.sendStatus(401);
    }
}

const limitRoles = (field) => (req, res, next) => {
    if (!req.user)
        return res.sendStatus(403);
    if (AdminRoles[req.user.role] && AdminRoles[req.user.role][field]) {
        return next();
    }
    return res.sendStatus(403);
}


const getTwoFactorAuthenticationCode = (email) => {
    const secretCode = speakeasy.generateSecret({
        name: `${email}(PPW)`
    });
    return {
        otpauthUrl: secretCode.otpauth_url,
        base32: secretCode.base32,
    }
}

const verifyTwoFactorAuthenticationCode = (twoFactorAuthenticationCode, token, time) => {
    const token1 = speakeasy.time({ secret: twoFactorAuthenticationCode, encoding: 'base32' });
    return speakeasy.totp.verify({
        secret: twoFactorAuthenticationCode,
        encoding: 'base32',
        token: token,
        time: time
    });
}

const verifyTwoFactorAuthenticationCodeMiddleware = async (req, res, next) => {
    const admin = await Admin.findById(req.user._id);
    let { _2fa_code, time } = req.query;
    if (!_2fa_code) return res.status(403).json({ error: 'Authentication failed.' });
    if (!time) {
        time = (new Date()).getTime();
        time = Math.floor(time / 1000);
    }
    const isCodeValid = await verifyTwoFactorAuthenticationCode(admin.twoFactorAuthenticationCode, _2fa_code, time);
    if (!isCodeValid) {
        return res.status(403).json({ error: 'Invalid Code.' });
    }
    next();
}

adminRouter.post(
    '/generateAuthCode',
    bruteforce.prevent,
    authenticateJWT,
    async (req, res, next) => {
        const { user, body } = req;
        const { password } = body;
        const admin = await Admin.findById(user._id);
        if (admin)
            admin.comparePassword(password, async (error, isMatch) => {
                if (error) {
                    return res.status(400).json({ error: "Can't generate qrcode" });
                }
                if (isMatch) {
                    if (admin.otpauthUrl && admin.twoFactorAuthenticationCode) {
                        QRCode.toDataURL(admin.otpauthUrl, {}, (error, url) => {
                            if (error) return res.status(400).json({ error: "Can't get qrcode" });
                            return res.json({ qrcode: url });
                        });
                    } else {
                        const { otpauthUrl, base32 } = getTwoFactorAuthenticationCode(user.email);
                        await Admin.findByIdAndUpdate(user._id, {
                            twoFactorAuthenticationCode: base32,
                            otpauthUrl: otpauthUrl,
                        });
                        QRCode.toDataURL(otpauthUrl, {}, (error, url) => {
                            if (error) return res.status(400).json({ error: "Can't generate qrcode" });
                            return res.json({ qrcode: url });
                        });
                    }
                }
                else {
                    return res.json({ qrcode: null, error: "Password doesn't not match." });
                }
            });
        else {
            return res.status(400).json({ error: "Can't generate qrcode" });
        }
    }
);

adminRouter.post(
    '/login',
    bruteforce.prevent,
    async (req, res, next) => {
        const { email, password } = req.body;

        try {
            const admin = await Admin.findOne({ email });
            if (admin) {
                admin.comparePassword(password, (error, isMatch) => {
                    if (error) {
                        res.status(404).json({ error: 'Admin doesn\'t exist.' });
                        return;
                    }
                    if (isMatch) {
                        const data = { _id: admin._id, _2fa_passed: true };
                        if (admin._2fa_enabled) {
                            const _2fa_code = get2FACode();
                            data._2fa_passed = false;
                            data._2fa_code = _2fa_code;
                            if (admin.phone) {
                                sendSMS(`PAYPER WIN Admin 2FA code - ${_2fa_code}`, admin.phone);
                            }
                        }
                        const accessToken = jwt.sign(data, accessTokenSecret, { expiresIn: '1d' });
                        res.json({ accessToken, _2fa_enabled: admin._2fa_enabled });
                    }
                    else {
                        res.status(403).json({ error: 'Password doesn\'t match.' });
                        return;
                    }
                })
            }
            else {
                res.status(404).json({ error: 'Admin doesn\'t exist.' });
                return;
            }
        } catch (error) {
            console.error(error);
            res.status(404).json({ error: 'Can\'t find admin.' });
            return;
        }
    }
);

adminRouter.post(
    '/verify-2fa',
    authenticate2FAJWT,
    async (req, res) => {
        const { _2fa_code } = req.body;
        const { _2fa_code: origin_2fa_code, user } = req;
        if (!_2fa_code || !origin_2fa_code) {
            res.status(400).json({ success: false, error: '2FA Code required.' });
            return;
        }
        if (_2fa_code == origin_2fa_code) {
            const data = { _id: user._id, _2fa_passed: true };
            const accessToken = jwt.sign(data, accessTokenSecret, { expiresIn: '1d' });
            res.json({ accessToken, success: true });
        } else {
            res.json({ success: false });
        }
    }
)

adminRouter.post(
    '/resend-2fa',
    authenticate2FAJWT,
    async (req, res) => {
        const { _2fa_code, user } = req;
        if (!_2fa_code) {
            res.status(400).json({ success: false, error: '2FA Code required.' });
            return;
        }
        if (user.phone) {
            sendSMS(`PAYPER WIN Admin 2FA code - ${_2fa_code}`, user.phone);
        }
    }
)

adminRouter.patch(
    '/changePassword',
    authenticateJWT,
    async (req, res) => {
        const { password, newpassword } = req.body;
        const { email } = req.user;
        const admin = await Admin.findOne({ email });

        admin.comparePassword(password, async (error, isMatch) => {
            if (error) {
                res.status(404).json({ error: 'Admin doesn\'t exist.' });
                return;
            }
            if (isMatch) {
                admin.password = newpassword;
                await admin.save();
                res.json("Password changed.");
            }
            else {
                res.status(403).json({ error: 'Password doesn\'t match.' });
                return;
            }
        })
    }
)

adminRouter.get('/logout', (req, res) => {
});

adminRouter.get(
    '/user',
    authenticateJWT,
    async (req, res) => {
        let admin = req.user;
        res.json({ username: admin.username, email: admin.email, role: admin.role, _id: admin._id });
    },
);

adminRouter.get(
    '/customers',
    authenticateJWT,
    limitRoles('users'),
    async (req, res) => {
        try {
            let { page, perPage, email, name, balancemin, balancemax, sortby, sort } = req.query;
            if (!perPage) perPage = 25;
            perPage = parseInt(perPage);
            if (!page) page = 1;
            page--;
            let searchObj = {};
            if (email) {
                searchObj = { ...searchObj, email: { "$regex": email, "$options": "i" } }
            }
            if (name) {
                searchObj = {
                    ...searchObj,
                    $or: [
                        { firstname: { "$regex": name, "$options": "i" } },
                        { lastname: { "$regex": name, "$options": "i" } }
                    ]
                }
            }
            if (balancemin || balancemax) {
                let balanceObj = {
                }
                if (balancemin) {
                    balanceObj = { ...balanceObj, $gte: parseInt(balancemin) }
                }
                if (balancemax) {
                    balanceObj = { ...balanceObj, $lte: parseInt(balancemax) }
                }
                searchObj = { ...searchObj, balance: balanceObj }
            }
            const total = await User.find(searchObj).count();
            let sortObj = {
                createdAt: -1,
            }
            switch (sortby) {
                case 'joined_date':
                    sortObj = {
                        createdAt: sort == 'asc' ? 1 : -1
                    }
                    break;
                case 'balance':
                    sortObj = {
                        balance: sort == 'asc' ? 1 : -1
                    }
                    break;
                case 'num_bets':
                    sortObj = {
                        totalBetCount: sort == 'asc' ? 1 : -1
                    }
                    break;
                case 'total_wager':
                    sortObj = {
                        totalWager: sort == 'asc' ? 1 : -1
                    }
                    break;
                default:
                    break;
            }

            User.aggregate(
                [
                    {
                        $match: searchObj
                    },
                    {
                        $lookup: {
                            from: 'bets',
                            localField: '_id',
                            foreignField: 'userId',
                            as: 'betHistory'
                        }
                    },
                    {
                        $lookup: {
                            from: 'bets',
                            let: { user_id: "$_id" },
                            pipeline: [{
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$userId", "$$user_id"] },
                                            { $in: ["$status", ["Pending", "Partial Match", "Partial Accepted", "Matched", "Accepted"]] }
                                        ]
                                    },
                                },
                            }],
                            as: 'pendingBets'
                        }
                    },
                    {
                        $project: {
                            username: 1,
                            email: 1,
                            firstname: 1,
                            lastname: 1,
                            currency: 1,
                            balance: 1,
                            roles: 1,
                            totalBetCount: { '$size': '$betHistory' },
                            totalWager: { $sum: '$betHistory.bet' },
                            inplay: { $sum: '$pendingBets.bet' },
                            maxBetLimitTier: 1,
                            createdAt: 1
                        }
                    },
                    { $sort: sortObj },
                    { $skip: page * perPage },
                    { $limit: perPage },
                ],
                (error, data) => {
                    if (error) {
                        console.error(error);
                        res.status(404).json({ error: 'Can\'t find customers.' });
                        return;
                    }
                    res.status(200).json({ total, perPage, page: page + 1, data });
                }
            )
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Can\'t find customers.', message: error });
        }
    }
)

adminRouter.get(
    '/customer',
    authenticateJWT,
    limitRoles('users'),
    async (req, res) => {
        const { id } = req.query;
        if (!id) {
            res.status(404).json({ error: 'Customer id is not given.' });
            return;
        }
        try {
            let customer = await User.findById(id);
            let preference = await Preference.findOne({ user: id });
            if (!preference)
                preference = await Preference.create({ user: id });
            customer = JSON.parse(JSON.stringify(customer));
            customer.preference = preference;
            res.status(200).json(customer);
        }
        catch (error) {
            res.status(500).json({ error: 'Can\'t find customer.', result: error });
        }
    }
)

adminRouter.get(
    '/customer-overview',
    authenticateJWT,
    limitRoles('users'),
    async (req, res) => {
        const { id } = req.query;
        if (!id) {
            res.status(404).json({ error: 'Customer id is not given.' });
            return;
        }
        try {
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            const lastsportsbookbets = await Bet
                .find({
                    userId: id,
                    sportsbook: true
                })
                .sort({ createdAt: -1 })
                .limit(8);

            let totalwagers = await Bet.aggregate(
                { $match: { userId: new ObjectId(id) } },
                { $group: { _id: null, total: { $sum: "$bet" } } }
            );
            if (totalwagers.length) totalwagers = totalwagers[0].total;
            else totalwagers = 0;

            const lastbets = await Bet.find({
                userId: id,
                $or: [
                    { sportsbook: false },
                    { sportsbook: { $exists: false } }
                ]
            })
                .sort({ createdAt: -1 }).limit(8);

            let totaldeposit = await FinancialLog.aggregate(
                {
                    $match: {
                        financialtype: "deposit",
                        user: new ObjectId(id),
                        status: FinancialStatus.success,
                    }
                },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            )
            if (totaldeposit.length) totaldeposit = totaldeposit[0].total;
            else totaldeposit = 0;

            let totalwithdraw = await FinancialLog.aggregate(
                {
                    $match: {
                        financialtype: "withdraw",
                        user: new ObjectId(id),
                    }
                },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            )
            if (totalwithdraw.length) totalwithdraw = totalwithdraw[0].total;
            else totalwithdraw = 0;

            let fees = await FinancialLog.aggregate(
                {
                    $match: {
                        financialtype: { $in: ["betfee", "withdrawfee"] },
                        user: new ObjectId(id),
                        status: FinancialStatus.success,
                    }
                },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            )
            if (fees.length) fees = fees[0].total;
            else fees = 0;

            let winamount = await Bet.aggregate(
                {
                    $match: {
                        status: 'Settled - Win',
                        userId: user._id
                    }
                },
                { $group: { _id: null, total: { $sum: "$payableToWin" } } }
            );
            if (winamount.length) winamount = winamount[0].total;
            else winamount = 0;

            let lossamount = await Bet.aggregate(
                {
                    $match: {
                        status: 'Settled - Lose',
                        userId: user._id
                    }
                },
                { $group: { _id: null, total: { $sum: "$bet" } } }
            );
            if (lossamount.length) lossamount = lossamount[0].total;
            else lossamount = 0;

            const winloss = user.balance + totalwithdraw - totaldeposit;
            const betcount = await Bet.find({ userId: id }).count();
            const days = Math.ceil((new Date().getTime() - new Date(user.createdAt).getTime()) / (24 * 3600 * 1000));

            const bets = await Bet.find({ userId: id });
            let winbets = 0;
            let averagebetafter2loss = 0;
            let prevBet = null;
            for (const bet of bets) {
                if (bet.status == 'Settled - Lose') {
                    if (prevBet != null) {
                        averagebetafter2loss = (prevBet + bet.bet) / 2;
                    } else {
                        prevBet = bet.bet;
                    }
                } else {
                    prevBet = null;
                }
                if (bet.status == 'Settled - Win') {
                    winbets++;
                }
            }

            const wins = (winbets / (bets.length ? bets.length : 1) * 100).toFixed(2);

            let usedCredit = await FinancialLog.aggregate(
                {
                    $match: {
                        user: new ObjectId(user._id),
                        financialtype: { $in: ['transfer-out', 'transfer-in'] }
                    }
                },
                { $group: { _id: "$financialtype", total: { $sum: "$amount" } } }
            );
            const inamount = usedCredit.find(credit => credit._id == 'transfer-in');
            const outamount = usedCredit.find(credit => credit._id == 'transfer-out');
            usedCredit = (outamount ? outamount.total : 0) - (inamount ? inamount.total : 0);

            let credit = await FinancialLog.aggregate(
                {
                    $match: {
                        user: new ObjectId(user._id),
                        financialtype: { $in: ['credit', 'debit'] }
                    }
                },
                { $group: { _id: '$financialtype', total: { $sum: "$amount" } } }
            );
            const creditamount = credit.find(credit => credit._id == 'credit');
            const debitamount = credit.find(credit => credit._id == 'debit');
            credit = (creditamount ? creditamount.total : 0) - (debitamount ? debitamount.total : 0);

            let inplay = await Bet.aggregate(
                {
                    $match: {
                        userId: user._id,
                        status: { $in: ["Pending", "Partial Match", "Partial Accepted", "Matched", "Accepted"] }
                    }
                },
                { $group: { _id: null, total: { $sum: "$bet" } } }
            )
            if (inplay.length > 0) inplay = inplay[0].total;
            else inplay = 0;

            res.status(200).json({
                lastbets,
                lastsportsbookbets,
                totalwagers,
                totaldeposit,
                winloss,
                fees,
                averagebet: betcount > 0 ? totalwagers / betcount : 0,
                averagebetwin: betcount > 0 ? winamount / betcount : 0,
                averagebetloss: betcount > 0 ? lossamount / betcount : 0,
                betsperday: days > 0 ? betcount / days : 0,
                betsperweek: days > 0 ? betcount / days * 7 : 0,
                averagebetafter2loss,
                wins,
                usedCredit,
                credit,
                inplay
            });
        }
        catch (error) {
            console.error(error)
            res.status(500).json({ error: 'Can\'t find customer.', result: error });
        }
    }
)

adminRouter.put(
    '/customer/:id/suspend',
    authenticateJWT,
    limitRoles('users'),
    async (req, res) => {
        const { id } = req.params;
        const { suspended } = req.body;
        try {
            if (!id) {
                return res.status(404).json({ error: 'User not found' });
            }
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            user.roles = {
                ...user.roles,
                suspended: suspended ? true : false
            }
            await user.save();
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: 'Can\'t suspend user.', result: error });
        }
    }
)

adminRouter.get(
    '/customer-loginhistory',
    authenticateJWT,
    limitRoles('users'),
    async (req, res) => {
        let { id, perPage, page } = req.query;
        if (!perPage) perPage = 15;
        else perPage = parseInt(perPage);
        if (!page) page = 1;
        else page = parseInt(page);
        if (!id) {
            res.status(404).json({ error: 'Customer id is not given.' });
            return;
        }
        try {
            const total = await LoginLog.find({ user: id }).count();
            const loginHistory = await LoginLog.find({ user: id }).sort({ createdAt: -1 }).skip((page - 1) * perPage).limit(perPage);
            res.json({ total, page, perPage, loginHistory });
        }
        catch (error) {
            res.status(500).json({ error: 'Can\'t find History.', result: error });
        }
    }
)

adminRouter.get(
    '/customer-credits',
    authenticateJWT,
    limitRoles('users'),
    async (req, res) => {
        let { id, perPage, page } = req.query;
        if (!perPage) perPage = 10;
        else perPage = parseInt(perPage);
        if (!page) page = 1;
        else page = parseInt(page);
        page--;
        if (!id) {
            return res.status(404).json({ error: 'Customer id is not given.' });
        }
        try {
            let searchObj = { financialtype: { $in: ['credit', 'debit', 'transfer-out', 'transfer-in'] }, user: id };
            const total = await FinancialLog.find(searchObj).count();
            const data = await FinancialLog.find(searchObj)
                .skip(page * perPage)
                .limit(perPage);

            let credit = await FinancialLog.aggregate(
                {
                    $match: {
                        user: new ObjectId(user._id),
                        financialtype: { $in: ['credit', 'debit'] }
                    }
                },
                { $group: { _id: '$financialtype', total: { $sum: "$amount" } } }
            );
            const creditamount = credit.find(credit => credit._id == 'credit');
            const debitamount = credit.find(credit => credit._id == 'debit');
            credit = (creditamount ? creditamount.total : 0) - (debitamount ? debitamount.total : 0);

            return res.json({ total: total, data: data, credit });
        }
        catch (error) {
            return res.status(500).json({ error: 'Can\'t find Credits.', result: error });
        }
    }
)


adminRouter.get(
    '/customer-referrals',
    authenticateJWT,
    limitRoles('users'),
    async (req, res) => {
        let { id, perPage, page } = req.query;
        if (!perPage) perPage = 10;
        else perPage = parseInt(perPage);
        if (!page) page = 1;
        else page = parseInt(page);
        page--;
        if (!id) {
            return res.status(404).json({ error: 'Customer id is not given.' });
        }
        try {
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({ error: 'Customer not found.' });
            }
            let searchObj = { invite: user.username };
            const total = await User.find(searchObj).count();
            const data = await User.aggregate(
                { $match: searchObj },
                {
                    $lookup: {
                        from: 'financiallogs',
                        let: { 'user_id': "$_id" },
                        pipeline: [{
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$user', '$$user_id'] },
                                        { $eq: ['$financialtype', "deposit"] },
                                        { $eq: ['$status', FinancialStatus.success] },
                                    ]
                                }
                            }
                        }],
                        as: 'deposits',
                    }
                },
                {
                    $project: {
                        email: 1,
                        createdAt: 1,
                        firstDeposit: {
                            $cond: {
                                if: { $gte: [{ $size: '$deposits' }, 0] },
                                then: true,
                                else: false,
                            }
                        }
                    }
                },
                { $skip: page * perPage },
                { $limit: perPage }
            );

            let comission = await FinancialLog.aggregate(
                {
                    $match: {
                        financialtype: "invitebonus",
                        user: user._id,
                        status: FinancialStatus.success
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$amount" }
                    }
                }
            );
            if (comission.length) comission = comission[0].total;
            else comission = 0;

            return res.json({ total: total, data: data, comission });
        }
        catch (error) {
            console.error(error)
            return res.status(500).json({ error: 'Can\'t find Credits.', result: error });
        }
    }
)

adminRouter.get(
    '/customer-deposits',
    authenticateJWT,
    limitRoles('users'),
    async (req, res) => {
        let { id, perPage, page } = req.query;
        if (!perPage) perPage = 15;
        else perPage = parseInt(perPage);
        if (!page) page = 1;
        else page = parseInt(page);
        if (!id) {
            return res.status(404).json({ error: 'Customer id is not given.' });
        }
        try {
            const searchObj = { user: id, financialtype: "deposit" };
            const total = await FinancialLog.find(searchObj).count();
            const deposits = await FinancialLog.find(searchObj).sort({ createdAt: -1 }).skip((page - 1) * perPage).limit(perPage).populate('reason');
            return res.json({ total, page, perPage, deposits });
        }
        catch (error) {
            return res.status(500).json({ error: 'Can\'t find Deposits.', result: error });
        }
    }
)

adminRouter.get(
    '/customer-withdraws',
    authenticateJWT,
    limitRoles('users'),
    async (req, res) => {
        let { id, perPage, page } = req.query;
        if (!perPage) perPage = 15;
        else perPage = parseInt(perPage);
        if (!page) page = 1;
        else page = parseInt(page);
        if (!id) {
            return res.status(404).json({ error: 'Customer id is not given.' });
        }
        try {
            const searchObj = { user: id, financialtype: "withdraw" };
            const total = await FinancialLog.find(searchObj).count();
            const withdraws = await FinancialLog.find(searchObj).sort({ createdAt: -1 }).skip((page - 1) * perPage).limit(perPage);
            res.json({ total, page, perPage, withdraws });
        }
        catch (error) {
            res.status(500).json({ error: 'Can\'t find Withdraws.', result: error });
        }
    }
)

adminRouter.get(
    '/customer-transactions',
    authenticateJWT,
    limitRoles('users'),
    async (req, res) => {
        let { id, perPage, page } = req.query;
        if (!perPage) perPage = 15;
        else perPage = parseInt(perPage);
        if (!page) page = 1;
        else page = parseInt(page);
        if (!id) {
            return res.status(404).json({ error: 'Customer id is not given.' });
        }
        try {
            const searchObj = {
                $or: [
                    { user: id, status: FinancialStatus.success, financialtype: { $ne: 'withdraw' } },
                    { user: id, financialtype: 'withdraw' }
                ]
            };
            const total = await FinancialLog.find(searchObj).count();
            const transactions = await FinancialLog.find(searchObj)
                .sort({ updatedAt: -1 })
                .skip((page - 1) * perPage)
                .limit(perPage)
                .populate('betId');
            return res.json({ total, page, perPage, transactions });
        }
        catch (error) {
            return res.status(500).json({ error: 'Can\'t find Withdraws.', result: error });
        }
    }
)

adminRouter.get(
    '/customer-bets',
    authenticateJWT,
    limitRoles('users'),
    async (req, res) => {
        let { id, perPage, page, src } = req.query;
        if (!perPage) perPage = 15;
        else perPage = parseInt(perPage);
        if (!page) page = 1;
        else page = parseInt(page);
        if (!id) {
            res.status(404).json({ error: 'Customer id is not given.' });
            return;
        }
        try {
            if (src == 'sportsbook') {
                const searchObj = { userId: id, sportsbook: true };
                const total = await Bet.find(searchObj).count();
                const bets = await Bet.find(searchObj).sort({ createdAt: -1 }).skip((page - 1) * perPage).limit(perPage);
                res.json({ total, page, perPage, bets });
            }
            else {
                const searchObj = { userId: id, $or: [{ sportsbook: false }, { sportsbook: { $exists: false } }] };
                const total = await Bet.find(searchObj).count();
                const bets = await Bet.find(searchObj).sort({ createdAt: -1 }).skip((page - 1) * perPage).limit(perPage);
                res.json({ total, page, perPage, bets });
            }
        }
        catch (error) {
            res.status(500).json({ error: 'Can\'t find bets.', result: error });
        }
    }
)

adminRouter.get(
    '/customer-preference/:id',
    authenticateJWT,
    limitRoles('users'),
    async (req, res) => {
        const { id } = req.params;
        const preference = await Preference.findOne({ user: id });
        return res.json(preference);
    }
)

adminRouter.put(
    '/customer-preference/:id',
    authenticateJWT,
    limitRoles('users'),
    async (req, res) => {
        const { id } = req.params;
        const data = req.body;
        const preference = await Preference.findOne({ user: id });
        try {
            if (preference) {
                await preference.update(data);
            } else {
                await await Preference.create({
                    user: id,
                    ...Preferencedata
                });
            }
            res.json({ success: true });
        } catch (error) {
            return res.status(500).json({ success: false });
        }
    }
)

adminRouter.patch(
    '/customer',
    authenticateJWT,
    limitRoles('users'),
    async (req, res) => {
        const { id, data } = req.body;
        try {
            const customer = await User.findByIdAndUpdate(id, data);
            if (data.password) {
                customer.password = data.password;
            }
            customer.save();
            res.status(200).json(customer);
        } catch (erorr) {
            res.status(500).json({ error: 'Can\'t Update customer.', result: error });
        }
    }
)

adminRouter.delete(
    '/customer',
    authenticateJWT,
    limitRoles('users'),
    async (req, res) => {
        const { id } = req.query;
        if (id) {
            try {
                const customer = await User.deleteMany({ _id: id });
                res.status(200).json(customer);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Can\'t Update customer.', result: error });
            }
        }
        else {
            res.status(500).json({ error: 'Customer id is required.', result: error });
        }
    }
)

adminRouter.get(
    '/depositreasons',
    authenticateJWT,
    limitRoles('deposit_logs'),
    async (req, res) => {
        try {
            const reasons = await DepositReason.find({});
            res.status(200).json(reasons);
        } catch (erorr) {
            res.status(500).json({ error: 'Can\'t get deposit reasons.', result: error });
        }
    }
)

adminRouter.post(
    '/depositreasons',
    authenticateJWT,
    limitRoles('deposit_logs'),
    async (req, res) => {
        try {
            const { title } = req.body;
            if (title) {
                const existing = await DepositReason.findOne({ title });
                if (existing) {
                    res.status(400).json({ error: 'Already exist.' });
                }
                else {
                    const reason = new DepositReason({ title });
                    reason.save();
                    res.status(200).json(reason);
                }
            }
            else {
                res.status(400).json({ error: 'Title is required.' });
            }
        } catch (erorr) {
            res.status(500).json({ error: 'Can\'t save deposit reasons.', result: error });
        }
    }
)

adminRouter.post(
    '/deposit',
    authenticateJWT,
    limitRoles('deposit_logs'),
    async (req, res) => {
        try {
            let { user: userId, reason, amount, method, status, sendEmail } = req.body;
            if (!userId) res.status(400).json({ error: 'User field is required.' });
            if (!amount) res.status(400).json({ error: 'Amount field is required.' });
            if (!method) res.status(400).json({ error: 'Method field is required.' });
            if (!status) status = FinancialStatus.pending;
            amount = Number(amount);
            const user = await User.findById(userId);
            if (!user) {
                res.status(400).json({ error: 'Can\'t find user.' });
                return;
            }
            if (reason) {
                const reasonData = await DepositReason.findById(reason);
                if (!reasonData) {
                    res.status(400).json({ error: 'Can\'t find reason.' });
                    return;
                }
            }
            const deposit = await FinancialLog.create({
                financialtype: 'deposit',
                uniqid: `D${ID()}`,
                user: user._id,
                reason: reason ? reason : null,
                amount,
                method,
                status
            });

            if (status == FinancialStatus.success) {
                const afterBalance = user.balance + amount;
                await deposit.update({
                    beforeBalance: user.balance,
                    afterBalance: afterBalance
                })
                await user.update({ $inc: { balance: amount } });
                const promotionEnabled = await checkSignupBonusPromotionEnabled(user._id);
                const promotionUsed = await isSignupBonusUsed(user._id);
                if (promotionEnabled && !promotionUsed) {
                    await FinancialLog.create({
                        financialtype: 'signupbonus',
                        uniqid: `SB${ID()}`,
                        user: user._id,
                        amount,
                        method,
                        status,
                        beforeBalance: afterBalance,
                        afterBalance: afterBalance + amount
                    });
                    await user.update({ $inc: { balance: amount } });
                }
                if (user.invite) {
                    try {
                        const firstDeposit = await checkFirstDeposit(user);
                        if (firstDeposit && amount >= 100) {
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
                                        amount: inviteBonus * amount,
                                        method: method,
                                        status: FinancialStatus.success,
                                        beforeBalance: invitor.balance,
                                        afterBalance: invitor.balance + inviteBonus * amount
                                    });
                                    await invitor.update({ $inc: { balance: inviteBonus * amount } });
                                }
                            }
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }
            }

            if (sendEmail) {
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
            }
            res.json(deposit);
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: 'Can\'t save deposit.', result: error });
        }
    }
)

adminRouter.get(
    '/deposit',
    authenticateJWT,
    limitRoles('deposit_logs'),
    async (req, res) => {
        try {
            let { page, datefrom, dateto, method, status, minamount, maxamount, perPage } = req.query;
            if (!page) page = 1;
            if (!perPage) perPage = 25;
            perPage = parseInt(perPage);
            page--;
            let searchObj = { financialtype: 'deposit' };
            if (minamount || maxamount) {
                let amountObj = {}
                if (minamount) {
                    amountObj = {
                        ...amountObj,
                        ...{ $gte: parseInt(minamount) }
                    }
                }
                if (maxamount) {
                    amountObj = {
                        ...amountObj,
                        ...{ $lte: parseInt(maxamount) }
                    }
                }
                searchObj = {
                    ...searchObj,
                    ...{ amount: amountObj }
                }
            }
            if (status) {
                searchObj = {
                    ...searchObj,
                    ...{ status }
                }
            }
            if (method) {
                searchObj = {
                    ...searchObj,
                    ...{ method }
                }
            }
            if (datefrom || dateto) {
                let dateObj = {};
                if (datefrom) {
                    datefrom = new Date(datefrom);
                    if (!isNaN(datefrom.getTime())) {
                        dateObj = {
                            ...dateObj,
                            ...{ $gte: datefrom }
                        }
                    }
                }
                if (dateto) {
                    dateto = new Date(dateto);
                    if (!isNaN(dateto.getTime())) {
                        dateObj = {
                            ...dateObj,
                            ...{ $lte: dateto }
                        }
                    }
                }
                searchObj = {
                    ...searchObj,
                    ...{ createdAt: dateObj }
                }
            }
            const total = await FinancialLog.find(searchObj).count();
            const deposits = await FinancialLog.find(searchObj)
                .sort({ createdAt: -1 })
                .skip(page * perPage)
                .limit(perPage)
                .populate('user', ['email', 'currency'])
                .populate('reason', ['title']);
            res.json({ perPage, total, page: page + 1, data: deposits });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Can\'t get deposits.', result: error });
        }
    }
)

adminRouter.get(
    '/deposit-csv',
    authenticateJWT,
    limitRoles('deposit_logs'),
    async (req, res) => {
        try {
            let { datefrom, dateto } = req.query;
            let searchObj = { financialtype: 'deposit', status: FinancialStatus.success };
            if (datefrom || dateto) {
                let dateObj = {};
                if (datefrom) {
                    datefrom = new Date(datefrom);
                    if (!isNaN(datefrom.getTime())) {
                        dateObj = {
                            ...dateObj,
                            ...{ $gte: datefrom }
                        }
                    }
                }
                if (dateto) {
                    dateto = new Date(dateto);
                    if (!isNaN(dateto.getTime())) {
                        dateObj = {
                            ...dateObj,
                            ...{ $lte: dateto }
                        }
                    }
                }
                searchObj = {
                    ...searchObj,
                    ...{ createdAt: dateObj }
                }
            }
            const withdraws = await FinancialLog.find(searchObj)
                .sort({ createdAt: -1 })
                .populate('user', ['username', 'currency', 'email']);
            let csvbody = [['Date', 'Name', 'Email', 'Amount', 'Method']];
            withdraws.forEach(withdraw => {
                csvbody.push([
                    dateformat(withdraw.updatedAt, "default"),
                    withdraw.user.username,
                    withdraw.user.email,
                    `$${Number(withdraw.amount).toFixed(2)}`,
                    withdraw.method]);
            })
            res.send(csvbody);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Can\'t get withdrawa.', result: error });
        }
    }
)

adminRouter.patch(
    '/deposit',
    authenticateJWT,
    limitRoles('deposit_logs'),
    async (req, res) => {
        try {
            const { id, data } = req.body;

            const deposit = await FinancialLog.findById(id);
            // if (deposit.status == FinancialStatus.success) {
            //     res.status(400).json({ error: 'Can\'t update finished deposit.' });
            //     return;
            // }
            if (!deposit) {
                return res.status(400).json({ error: 'Can\'t find deposit.' });
            }
            const user = await User.findById(deposit.user);
            if (!user) {
                return res.status(400).json({ error: 'Can\'t find user.' });
            }
            await deposit.update(data, { new: true }).exec();
            if (data.status == FinancialStatus.success) {
                const afterBalance = user.balance + deposit.amount;
                await deposit.update({
                    beforeBalance: user.balance ? user.balance : 0,
                    afterBalance: afterBalance
                })
                await user.update({ $inc: { balance: deposit.amount } });

                const promotionEnabled = await checkSignupBonusPromotionEnabled(user._id);
                const promotionUsed = await isSignupBonusUsed(user._id);
                if (promotionEnabled && !promotionUsed) {
                    await FinancialLog.create({
                        financialtype: 'signupbonus',
                        uniqid: `SB${ID()}`,
                        user: user._id,
                        amount: deposit.amount,
                        method: deposit.method,
                        status: FinancialStatus.success,
                        beforeBalance: afterBalance,
                        afterBalance: afterBalance + deposit.amount
                    });
                    await user.update({ $inc: { balance: deposit.amount } });
                }

                if (user.invite) {
                    try {
                        const firstDeposit = await checkFirstDeposit(user);
                        if (firstDeposit && deposit.amount >= 100) {
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
                                        amount: inviteBonus * deposit.amount,
                                        method: deposit.method,
                                        status: FinancialStatus.success,
                                        beforeBalance: invitor.balance,
                                        afterBalance: invitor.balance + inviteBonus * deposit.amount
                                    });
                                    await invitor.update({ $inc: { balance: inviteBonus * deposit.amount } });
                                }
                            }
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }
            }
            const result = await FinancialLog.findById(id).populate('user', ['email']).populate('reason', ['title']);
            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Can\'t update deposit.', result: error });
        }
    }
)

adminRouter.delete(
    '/deposit',
    authenticateJWT,
    limitRoles('deposit_logs'),
    async (req, res) => {
        try {
            let { id } = req.query;
            const deposit = await FinancialLog.findById(id);
            if (deposit.status == FinancialStatus.success) {
                res.status(400).json({ error: 'Can\'t delete finished log.' });
                return;
            }
            await FinancialLog.deleteOne({ _id: id })
            res.json(deposit);
        } catch (error) {
            res.status(500).json({ error: 'Can\'t update deposit.', result: error });
        }
    }
)

adminRouter.post(
    '/withdraw',
    authenticateJWT,
    limitRoles('withdraw_logs'),
    async (req, res) => {
        try {
            let { user: userId, amount, method, status, note } = req.body;
            if (!userId) res.status(400).json({ error: 'User field is required.' });
            if (!amount) res.status(400).json({ error: 'Amount field is required.' });
            amount = Number(amount);
            if (!method) res.status(400).json({ error: 'Method field is required.' });
            if (!status) status = FinancialStatus.pending;

            const user = await User.findById(userId);
            if (!user) {
                res.status(400).json({ error: 'Can\'t find user.' });
                return;
            }
            const freeWithdrawalUsed = await isFreeWithdrawalUsed(user);
            let fee = 0;
            if (freeWithdrawalUsed) {
                switch (method) {
                    case 'eTransfer':
                        fee = 15;
                        break;
                    case "Bitcoin":
                    case "Ethereum":
                    case "Tether":
                    case "USDC":
                    case "Binance":
                        fee = 25;
                        break;
                    case "CREDIT":
                    case "DEBIT":
                        fee = 0;
                        break;
                    default:
                        return res.status(400).json({ error: 'Invalid withdraw method.' });
                }
            }

            if (user.balance < amount + fee) {
                return res.status(400).json({ error: 'Withdraw amount overflows balance.' });
            }

            const afterBalance = user.balance - amount;
            await FinancialLog.create({
                financialtype: 'withdraw',
                uniqid: `W${ID()}`,
                user: user._id,
                amount: amount,
                method: method,
                status: status,
                note: note,
                fee: fee,
                beforeBalance: user.balance,
                afterBalance: afterBalance
            });

            if (fee > 0) {
                await FinancialLog.create({
                    financialtype: 'withdrawfee',
                    uniqid: `WF${ID()}`,
                    user: user._id,
                    amount: fee,
                    method: method,
                    note: note,
                    status: FinancialStatus.success,
                    beforeBalance: afterBalance,
                    afterBalance: afterBalance - fee
                });
            }

            await user.update({ $inc: { balance: -(amount + fee) } });
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: 'Can\'t save withdraw.', result: error });
        }
    }
)

adminRouter.get(
    '/withdraw',
    authenticateJWT,
    limitRoles('withdraw_logs'),
    async (req, res) => {
        try {
            let { page, perPage, datefrom, dateto, method, status, minamount, maxamount } = req.query;
            if (!page) page = 1;
            if (!perPage) perPage = 25;
            perPage = parseInt(perPage);
            page--;
            let searchObj = { financialtype: 'withdraw' };
            if (minamount || maxamount) {
                let amountObj = {}
                if (minamount) {
                    amountObj = { ...amountObj, $gte: parseInt(minamount) }
                }
                if (maxamount) {
                    amountObj = { ...amountObj, $lte: parseInt(maxamount) }
                }
                searchObj = { ...searchObj, amount: amountObj }
            }
            if (status) {
                searchObj = { ...searchObj, status }
            }
            if (method) {
                searchObj = { ...searchObj, method }
            }
            if (datefrom || dateto) {
                let dateObj = {};
                if (datefrom) {
                    datefrom = new Date(datefrom);
                    if (!isNaN(datefrom.getTime())) {
                        dateObj = { ...dateObj, $gte: datefrom }
                    }
                }
                if (dateto) {
                    dateto = new Date(dateto);
                    if (!isNaN(dateto.getTime())) {
                        dateObj = { ...dateObj, $lte: dateto }
                    }
                }
                searchObj = { ...searchObj, createdAt: dateObj }
            }
            const total = await FinancialLog.find(searchObj).count();
            const withdraws = await FinancialLog.find(searchObj)
                .sort({ createdAt: -1 })
                .skip(page * perPage)
                .limit(perPage)
                .populate('user', ['email', 'currency']).populate('reason', ['title']);
            const pending_total = await FinancialLog.find({}).count({ financialtype: 'withdraw', status: FinancialStatus.pending });
            res.json({ perPage, total, page: page + 1, data: withdraws, pending_total });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Can\'t get withdrawa.', result: error });
        }
    }
)

adminRouter.get(
    '/withdraw-csv',
    authenticateJWT,
    limitRoles('withdraw_logs'),
    async (req, res) => {
        try {
            let { datefrom, dateto } = req.query;
            let searchObj = { financialtype: 'withdraw', status: FinancialStatus.success };
            if (datefrom || dateto) {
                let dateObj = {};
                if (datefrom) {
                    datefrom = new Date(datefrom);
                    if (!isNaN(datefrom.getTime())) {
                        dateObj = { ...dateObj, $gte: datefrom }
                    }
                }
                if (dateto) {
                    dateto = new Date(dateto);
                    if (!isNaN(dateto.getTime())) {
                        dateObj = { ...dateObj, $lte: dateto }
                    }
                }
                searchObj = { ...searchObj, createdAt: dateObj }
            }
            const withdraws = await FinancialLog.find(searchObj)
                .sort({ createdAt: -1 })
                .populate('user', ['username', 'currency', 'email']);
            let csvbody = [['Date', 'Name', 'Email', 'Amount', 'Method']];
            withdraws.forEach(withdraw => {
                csvbody.push([
                    dateformat(withdraw.updatedAt, "default"),
                    withdraw.user.username,
                    withdraw.user.email,
                    `$${Number(withdraw.amount).toFixed(2)}`,
                    withdraw.method]);
            })
            res.send(csvbody);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Can\'t get withdrawa.', result: error });
        }
    }
)

const tripleAWithdraw = async (req, res, data, user, withdraw) => {
    const amount = data.amount ? data.amount : withdraw.amount;
    const withdrawamount = parseInt(amount);

    const tripleAAddon = await Addon.findOne({ name: 'tripleA' });
    if (!tripleAAddon || !tripleAAddon.value || !tripleAAddon.value.merchant_key) {
        console.warn("TripleA Api is not set");
        return false;
    }
    const {
        client_id,
        client_secret,
        notify_secret,
        merchant_key,
        testMode,
    } = tripleAAddon.value;

    let access_token = null;
    try {
        const params = new URLSearchParams();
        params.append('client_id', client_id);
        params.append('client_secret', client_secret);
        params.append('grant_type', 'client_credentials');
        const { data } = await axios.post('https://api.triple-a.io/api/v2/oauth/token', params);
        access_token = data.access_token;
    } catch (error) {
        res.status(500).json({ success: 0, message: "Can't get Access Token." });
        return false;
    }
    if (!access_token) {
        res.status(500).json({ success: 0, message: "Can't get Access Token." });
        return false
    }

    let crypto_currency = "testBTC";
    switch (withdraw.method) {
        case "Ethereum":
            crypto_currency = "ETH";
            break;
        case "Tether":
            crypto_currency = "USDT";
            break;
        case "USDC":
            crypto_currency = "USDC";
            break;
        case "USDC":
            crypto_currency = "Binance";
            break;
        case "Bitcoin":
        default:
            crypto_currency = "BTC";
    }
    crypto_currency = testMode ? "testBTC" : crypto_currency

    const body = {
        "merchant_key": merchant_key,
        "email": user.email,
        "withdraw_currency": "CAD",
        "withdraw_amount": withdrawamount,
        "crypto_currency": crypto_currency,
        "remarks": "Bitcoin Withdraw |" + withdraw._id,
        "notify_url": "https://api.payperwin.com/triplea/withdraw",
        "notify_secret": notify_secret
    };
    let payout_reference = null;
    try {
        const { data } = await axios.post('https://api.triple-a.io/api/v2/payout/withdraw/local/crypto', body, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });
        payout_reference = data.payout_reference;
    } catch (error) {
        ErrorLog.findOneAndUpdate(
            {
                name: 'Triple-A Error',
                "error.stack": error.stack
            },
            {
                name: 'Triple-A Error',
                error: {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                }
            },
            { upsert: true }
        );
        res.status(500).json({ success: 0, message: "Can't make withdraw." });
        return false;
    }
    withdraw.note = payout_reference;
    await withdraw.save();
    return true;
}

adminRouter.patch(
    '/withdraw',
    authenticateJWT,
    limitRoles('withdraw_logs'),
    verifyTwoFactorAuthenticationCodeMiddleware,
    async (req, res) => {
        try {
            let { id, data } = req.body;

            const withdraw = await FinancialLog.findById(id);
            if (withdraw.status == FinancialStatus.success) {
                res.status(400).json({ error: 'Can\'t update finished withdraw.' });
                return;
            }

            const user = await User.findById(withdraw.user);
            if (!user) {
                res.status(400).json({ error: 'Can\'t find user.' });
                return;
            }

            if (data.status == FinancialStatus.approved) {
                if (["Bitcoin", 'Ethereum', "Tether", "USDC", "Binance"].includes(withdraw.method)) {
                    const result = tripleAWithdraw(req, res, data, user, withdraw)
                    if (!result)
                        return;
                }
                if (withdraw.method == 'eTransfer') {
                    const premierpayAddon = await Addon.findOne({ name: 'premierpay' });
                    if (!premierpayAddon || !premierpayAddon.value || !premierpayAddon.value.sid) {
                        console.warn("PremierPay Api is not set");
                        return res.status(400).json({ success: 0, message: "PremierPay Api is not set" });
                    }
                    const { sid } = premierpayAddon.value;
                    const signature = await generatePremierRequestSignature(user.email, withdraw.amount, user._id, withdraw.uniqid);
                    const amount2 = Number(withdraw.amount).toFixed(2);

                    try {
                        const { data } = await axios.post(`https://secure.premierpay.ca/api/v2/payout/${sid}`,
                            {
                                "payby": "etransfer",
                                "amount": amount2,
                                "first_name": user.firstname,
                                "last_name": user.lastname,
                                "email": user.email,
                                "phone": user.phone,
                                "address": "Artery roads",
                                "city": "Edmonton",
                                "state": "AB",
                                "country": "CA",
                                "zip_code": "T5A",
                                "ip_address": "159.203.4.60",
                                "notification_url": "https://api.payperwin.com/premier/etransfer-withdraw",
                                "amount_shipping": 0.00,
                                "udf1": user._id,
                                "udf2": withdraw.uniqid,
                                "signature": signature
                            }
                        );

                        const responsesignature = await generatePremierResponseSignature(data.txid, data.status, data.descriptor, data.udf1, data.udf2);
                        if (responsesignature != data.signature) {
                            return res.status(400).json({ success: 0, message: "Failed to create etransfer. Signatuer mismatch" });
                        }

                        if (data.status != "APPROVED") {
                            return res.status(400).json({ success: 0, message: "Failed to create etransfer. Not approved" });
                        }
                    } catch (error) {
                        return res.status(500).json({ error: 'Can\'t update withdraw.', result: error });
                    }
                }
            }

            await withdraw.update(data, { new: true }).exec();
            const result = await FinancialLog.findById(id).populate('user', ['username']).populate('reason', ['title']);
            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Can\'t update withdraw.', result: error });
        }
    }
);

adminRouter.delete(
    '/withdraw',
    authenticateJWT,
    limitRoles('withdraw_logs'),
    async (req, res) => {
        try {
            const { id } = req.query;
            const withdraw = await FinancialLog.findById(id);
            if (withdraw.status == FinancialStatus.success) {
                res.status(400).json({ error: 'Can\'t delete finished log.' });
                return;
            }
            await FinancialLog.deleteOne({ _id: id });
            const user = await User.findById(withdraw.user);
            if (!user) {
                res.status(400).json({ error: 'Can\'t find user.' });
                return;
            }
            await user.update({ $inc: { balance: withdraw.amount + withdraw.fee } });

            res.json(withdraw);
        } catch (error) {
            res.status(500).json({ error: 'Can\'t update withdraw.', result: error });
        }
    }
)

adminRouter.get(
    '/searchusers',
    authenticateJWT,
    async (req, res) => {
        const { name } = req.query;
        try {
            let searchObj = {};
            if (name) {
                searchObj = {
                    ...searchObj,
                    ...{ email: { "$regex": name, "$options": "i" } }
                }
            }

            User.find(searchObj)
                .sort('createdAt')
                .select(['email', 'balance', 'currency', 'firstname', 'lastname'])
                .exec((error, data) => {
                    if (error) {
                        res.status(404).json({ error: 'Can\'t find customers.' });
                        return;
                    }
                    const result = data.map(user => {
                        return {
                            value: user._id,
                            label: `${user.email} (${user.firstname} ${user.lastname})`,
                            balance: user.balance,
                        }
                    })
                    res.status(200).json(result);
                })
        }
        catch (error) {
            res.status(500).json({ error: 'Can\'t find customers.', message: error });
        }
    }
)

adminRouter.get(
    '/searchautobetusers',
    authenticateJWT,
    async (req, res) => {
        const { name } = req.query;
        try {
            let searchObj = { status: 'Active' };
            if (name) {
                searchObj = {
                    ...searchObj,
                    ...{ "userId.email": { "$regex": name, "$options": "i" } }
                }
            }

            const autobets = await AutoBet.aggregate([
                {
                    $lookup: {
                        from: 'users',
                        let: { user_id: "$userId" },
                        pipeline: [{
                            $match: {
                                $expr: { $eq: ["$_id", "$$user_id"] },
                            },
                        }],
                        as: 'userId',
                    }
                },
                { $unwind: "$userId" },
                { $match: searchObj },
                { $sort: { "createdAt": -1 } },
                { $limit: 20 }
            ]);
            const results = autobets.map(autobet => (autobet.userId ? {
                value: autobet.userId._id,
                label: `${autobet.userId.email} (${autobet.userId.firstname} ${autobet.userId.lastname})`,
                balance: autobet.userId.balance,
            } : null)).filter(autobet => autobet != null);
            res.status(200).json(results);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Can\'t find customers.', message: error });
        }
    }
)

adminRouter.get(
    '/searchsports',
    authenticateJWT,
    async (req, res) => {
        const { name } = req.query;
        try {
            let searchObj = {};
            if (name) {
                searchObj = {
                    ...searchObj,
                    ...{ name: { "$regex": name, "$options": "i" } }
                }
            }

            Sport.find(searchObj)
                .sort('createdAt')
                .select(['name'])
                .exec((error, data) => {
                    if (error) {
                        res.status(404).json({ error: 'Can\'t find customers.' });
                        return;
                    }
                    const result = data.map(sport => {
                        return {
                            value: sport.name,
                            label: sport.name,
                        }
                    })
                    res.status(200).json(result);
                })
        }
        catch (error) {
            res.status(500).json({ error: 'Can\'t find customers.', message: error });
        }
    }
)

adminRouter.get(
    '/bets',
    authenticateJWT,
    limitRoles('bet_activities'),
    async (req, res) => {
        try {
            let { page, datefrom, dateto, sport, status, minamount, maxamount, house, match, perPage, email } = req.query;
            if (!perPage) perPage = 50;
            perPage = parseInt(perPage);
            if (!page) page = 1;
            page--;
            let searchObj = {};
            if (house == 'p2p') {
                searchObj = {
                    ...searchObj,
                    sportsbook: { $in: [null, false] },
                    isParlay: { $in: [null, false] },
                };
            } else if (house == 'sportsbook') {
                searchObj = {
                    ...searchObj,
                    sportsbook: true,
                    isParlay: { $in: [null, false] },
                };
            } else if (house == 'parlay') {
                searchObj = {
                    ...searchObj,
                    isParlay: true,
                };
            }

            if (status && status == 'open') {
                searchObj = {
                    ...searchObj,
                    status: { $in: [null, 'Pending', 'Partial Match', 'Matched', 'Accepted', 'Partial Accepted'] }
                };

                if (match && match == 'pending') {
                    searchObj = {
                        ...searchObj,
                        matchingStatus: { $in: [null, 'Pending', 'Partial Match', 'Partial Accepted'] }
                    };
                }
                else if (match && match == 'matched') {
                    searchObj = {
                        ...searchObj,
                        matchingStatus: { $in: ['Matched', 'Accepted'] }
                    };
                }
            } else if (status && status == 'settled') {
                searchObj = {
                    ...searchObj,
                    status: { $in: ['Settled - Win', 'Settled - Lose', 'Cancelled', 'Draw'] }
                };
            } else if (status && status == 'win') {
                searchObj = {
                    ...searchObj,
                    status: 'Settled - Win'
                };
            } else if (status && status == 'lose') {
                searchObj = {
                    ...searchObj,
                    status: 'Settled - Lose'
                };
            } else if (status && status == 'draw') {
                searchObj = {
                    ...searchObj,
                    status: 'Draw'
                };
            } else if (status && status == 'cancelled') {
                searchObj = {
                    ...searchObj,
                    status: 'Cancelled'
                };
            }

            if (datefrom || dateto) {
                let dateObj = {};
                if (datefrom) {
                    datefrom = new Date(datefrom);
                    if (!isNaN(datefrom.getTime())) {
                        dateObj = { ...dateObj, $gte: datefrom }
                    }
                }
                if (dateto) {
                    dateto = new Date(dateto);
                    if (!isNaN(dateto.getTime())) {
                        dateObj = { ...dateObj, $lte: dateto }
                    }
                }
                searchObj = { ...searchObj, createdAt: dateObj }
            }

            if (sport) {
                searchObj = { ...searchObj, "lineQuery.sportId": parseInt(sport) }
            }

            if (minamount || maxamount) {
                let amountObj = {}
                if (minamount) {
                    amountObj = { ...amountObj, $gte: parseInt(minamount) }
                }
                if (maxamount) {
                    amountObj = { ...amountObj, $lte: parseInt(maxamount) }
                }
                searchObj = { ...searchObj, bet: amountObj }
            }

            if (!email) email = '';

            let aggregate = [
                { $match: searchObj },
                {
                    $lookup: {
                        from: 'users',
                        let: { user_id: "$userId" },
                        pipeline: [
                            { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } },
                            { $project: { email: 1, currency: 1 } }
                        ],
                        as: 'userId',
                    }
                },
                { $unwind: '$userId' },
                { $match: { "userId.email": { "$regex": email, "$options": "i" } } },
            ]
            let total = await Bet.aggregate([
                ...aggregate,
                { $count: "total" }
            ]);
            if (total.length > 0) total = total[0].total;
            else total = 0;
            const data = await Bet.aggregate([
                ...aggregate,
                { $sort: { createdAt: -1 } },
                { $skip: page * perPage },
                { $limit: perPage }
            ]);

            page++;
            return res.json({ total: total, perPage, page, data });
        } catch (error) {
            return res.status(500).json({ error: 'Can\'t find bets.', message: error });
        }
    }
)

adminRouter.delete(
    '/bets/:id',
    authenticateJWT,
    limitRoles('bet_activities'),
    async (req, res) => {
        try {
            const { id } = req.params;
            const bet = await Bet.findById(id);
            const user_id = bet.userId;
            if (!bet) {
                return res.status(404).json({ success: false });
            }
            const user = await User.findById(user_id);
            if (user) {
                await FinancialLog.create({
                    financialtype: 'betcancel',
                    uniqid: `BC${ID()}`,
                    user: user._id,
                    betId: bet._id,
                    amount: bet.bet,
                    method: 'betcancel',
                    status: FinancialStatus.success,
                    beforeBalance: user.balance,
                    afterBalance: user.balance + bet.bet
                });
                user.balance = user.balance + bet.bet;
                await user.save();
            }
            if (bet.isParlay) {
                const betpool = await ParlayBetPool.findOne({
                    $or: [
                        { homeBets: bet._id },
                        { awayBets: bet._id },
                        { drawBets: bet._id },
                        { nonDrawBets: bet._id },
                    ]
                });
                if (betpool) {
                    const docChanges = {
                        $pull: { homeBets: id, awayBets: id, nonDrawBets: id, drawBets: id },
                        $inc: {}
                    };
                    switch (bet.pick) {
                        case 'home':
                            docChanges.$inc['teamA.betTotal'] = -bet.bet;
                            docChanges.$inc['teamA.toWinTotal'] = -bet.toWin;
                            break;
                        case 'draw':
                            docChanges.$inc['teamDraw.betTotal'] = -bet.bet;
                            docChanges.$inc['teamDraw.toWinTotal'] = -bet.toWin;
                            break;
                        case 'nondraw':
                            docChanges.$inc['teamNonDraw.betTotal'] = -bet.bet;
                            docChanges.$inc['teamNonDraw.toWinTotal'] = -bet.toWin;
                            break;
                        default:
                            docChanges.$inc['teamB.betTotal'] = -bet.bet;
                            docChanges.$inc['teamB.toWinTotal'] = -bet.toWin;
                            break;
                    }
                    await betpool.update(docChanges);
                    calculateParlayBetsStatus(betpool._id);
                }
            } else {
                const betpool = await BetPool.findOne({
                    $or: [
                        { homeBets: bet._id },
                        { awayBets: bet._id },
                        { drawBets: bet._id },
                        { nonDrawBets: bet._id },
                    ]
                });
                if (betpool) {
                    const docChanges = {
                        $pull: { homeBets: id, awayBets: id, nonDrawBets: id, drawBets: id },
                        $inc: {}
                    };
                    switch (bet.pick) {
                        case 'home':
                            docChanges.$inc['teamA.betTotal'] = -bet.bet;
                            docChanges.$inc['teamA.toWinTotal'] = -bet.toWin;
                            break;
                        case 'draw':
                            docChanges.$inc['teamDraw.betTotal'] = -bet.bet;
                            docChanges.$inc['teamDraw.toWinTotal'] = -bet.toWin;
                            break;
                        case 'nondraw':
                            docChanges.$inc['teamNonDraw.betTotal'] = -bet.bet;
                            docChanges.$inc['teamNonDraw.toWinTotal'] = -bet.toWin;
                            break;
                        default:
                            docChanges.$inc['teamB.betTotal'] = -bet.bet;
                            docChanges.$inc['teamB.toWinTotal'] = -bet.toWin;
                            break;
                    }
                    await betpool.update(docChanges);
                    calculateBetsStatus(betpool.uid);
                }
            }
            await Bet.deleteMany({ _id: id });
            res.json({ success: true });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false });
        }
    }
)

adminRouter.post(
    '/bets/:id/settle',
    authenticateJWT,
    limitRoles('bet_activities'),
    async (req, res) => {
        try {
            const { id } = req.params;
            const bet = await Bet.findById(id);
            if (!bet || bet.origin == 'custom') {
                return res.status(404).json({ error: 'Bet not found' });
            }
            if (bet.isParlay) {
                const results = req.body;
                const parlayQuery = JSON.parse(JSON.stringify(bet.parlayQuery));
                const betpool = await ParlayBetPool.findOne({ $or: [{ homeBets: id }, { awayBets: id }] });
                if (!betpool) {
                    return res.status(404).json({ error: 'BetPool not found' });
                }
                const { homeBets, awayBets } = betpool;
                if (homeBets.length > 0 && awayBets.length > 0) {
                    let homeWin = true;
                    const drawIds = [];
                    for (const query of parlayQuery) {
                        const lineQuery = query.lineQuery;
                        const result = results.find(result => {
                            return result.lineQuery.eventId == lineQuery.eventId &&
                                result.lineQuery.subtype == lineQuery.subtype
                        });
                        if (!result) {
                            return res.status(400).json({ success: false, error: 'Result not exists.' });
                        }
                        const { teamAScore: homeScore, teamBScore: awayScore } = result.score;
                        query.homeScore = parseInt(homeScore);
                        query.awayScore = parseInt(awayScore);

                        let moneyLineWinner = null;
                        if (homeScore > awayScore) moneyLineWinner = 'home';
                        else if (awayScore > homeScore) moneyLineWinner = 'away';

                        const linePoints = lineQuery.points ? lineQuery.points : getLinePoints(query.pickName, query.pick, lineQuery);
                        let betWin;
                        let draw = false;
                        if (lineQuery.type === 'moneyline') {
                            betWin = query.pick === moneyLineWinner;
                            draw = homeScore == awayScore;
                        } else if (['spread', 'alternative_spread'].includes(lineQuery.type)) {
                            const spread = { home: linePoints, away: 0 };
                            const homeScoreHandiCapped = homeScore + spread.home;
                            const awayScoreHandiCapped = awayScore + spread.away;
                            let spreadWinner;
                            if (homeScoreHandiCapped > awayScoreHandiCapped) spreadWinner = 'home';
                            else if (awayScoreHandiCapped > homeScoreHandiCapped) spreadWinner = 'away';
                            betWin = query.pick === spreadWinner;
                            draw = homeScoreHandiCapped == awayScoreHandiCapped;
                        } else if (['total', 'alternative_total'].includes(lineQuery.type)) {
                            const totalPoints = homeScore + awayScore;
                            const overUnderWinner = totalPoints > linePoints ? 'home' : 'away';
                            betWin = query.pick === overUnderWinner;
                            draw = totalPoints == linePoints
                        } else if (lineQuery.type == 'home_total') {
                            const overUnderWinner = homeScore > linePoints ? 'home' : 'away';
                            betWin = query.pick === overUnderWinner;
                            draw = homeScore == linePoints
                        } else if (lineQuery.type == 'away_total') {
                            const overUnderWinner = awayScore > linePoints ? 'awayhome' : 'away';
                            betWin = query.pick === overUnderWinner;
                            draw = awayScore == linePoints
                        }

                        if (draw) {
                            if (['Boxing-UFC', 'Boxing/MMA'].includes(lineQuery.sportName)) {
                                draw = false;
                                betWin = false;
                            } else {
                                drawIds.push(lineQuery.eventId);
                            }
                        }

                        homeWin = homeWin && (betWin || draw);
                        query.status = betWin ? 'Win' : 'Lose';
                        query.status = draw ? 'Draw' : query.status;
                        delete query.result;
                    }

                    if (drawIds.length > 0) {
                        const originParlayQuery = bet.parlayQuery;
                        let teaserPoint = null;
                        for (const query of originParlayQuery) {
                            if (query.lineQuery.teaserPoint != undefined) {
                                teaserPoint = query.lineQuery.teaserPoint;
                                break;
                            }
                        }

                        if (drawIds.length == originParlayQuery.length) {
                            await cancelBetPool(betpool);
                            return res.json({ success: true });
                        }

                        let parlayOdds = 1;
                        const newParlayQuery = [];
                        if (teaserPoint != null) {
                            let sportName = null;
                            for (const query of originParlayQuery) {
                                const { lineQuery: { eventId, sportName: querySportName } } = query;
                                sportName = querySportName;
                                const cancelled = drawIds.find(event => event == eventId);
                                if (cancelled) continue;
                                newParlayQuery.push(query);
                            }
                            if (newParlayQuery.length <= 1) {
                                await cancelBetPool(betpool);
                                return res.json({ success: true });
                            }
                            parlayOdds = getTeaserOdds(sportName, teaserPoint, newParlayQuery.length);
                        } else {
                            for (const query of originParlayQuery) {
                                const { pickOdds, lineQuery: { eventId } } = query;
                                const cancelled = drawIds.find(event => event == eventId);
                                if (cancelled) continue;
                                parlayOdds *= Number(convertOdds(Number(pickOdds), 'decimal'));
                                newParlayQuery.push(query);
                            }
                            if (parlayOdds >= 2) {
                                parlayOdds = parseInt((parlayOdds - 1) * 100);
                            } else {
                                parlayOdds = parseInt(-100 / (parlayOdds - 1));
                            }
                        }

                        const { homeBets, awayBets } = betpool;
                        const teamA = { odds: parlayOdds, betTotal: 0, toWinTotal: 0 };
                        const teamB = { odds: -parlayOdds, betTotal: 0, toWinTotal: 0 };
                        const newHomeBets = [];
                        const newAwayBets = [];
                        for (const bet_id of homeBets) {
                            const bet = await Bet.findById(bet_id);
                            if (bet) {
                                newHomeBets.push(bet._id);
                                const { bet: betAmount } = bet;
                                const toWin = calculateToWinFromBet(betAmount, parlayOdds);
                                teamA.betTotal = betAmount;
                                teamA.toWinTotal = toWin;
                                await bet.update({
                                    toWin: toWin,
                                    payableToWin: 0,
                                    pickOdds: parlayOdds,
                                });
                            }
                        }

                        const totalAwayBet = teamA.toWinTotal;
                        const prevTotalAwayBet = betpool.teamB.betTotal;
                        if (totalAwayBet == 0 || prevTotalAwayBet <= 0) {
                            await cancelBetPool(betpool);
                            return res.json({ success: true });
                        }

                        for (const bet_id of awayBets) {
                            const bet = await Bet.findById(bet_id);
                            if (bet) {
                                newAwayBets.push(bet._id);
                                const { userId, bet: betAmount } = bet;
                                let newBetAmount = betAmount;
                                if (totalAwayBet < prevTotalAwayBet) {
                                    const rate = betAmount / prevTotalAwayBet;
                                    newBetAmount = totalAwayBet * rate;
                                }
                                const toWin = calculateToWinFromBet(newBetAmount, -parlayOdds);
                                teamB.betTotal += newBetAmount;
                                teamB.toWinTotal += toWin;
                                await bet.update({
                                    bet: newBetAmount,
                                    toWin: toWin,
                                    payableToWin: 0,
                                    pickOdds: -parlayOdds,
                                });
                                if (newBetAmount < betAmount) {
                                    const user = await User.findById(userId);
                                    if (user) {
                                        await FinancialLog.create({
                                            financialtype: 'betrefund',
                                            uniqid: `BF${ID()}`,
                                            user: userId,
                                            betId: bet_id,
                                            amount: betAmount - newBetAmount,
                                            method: 'betrefund',
                                            status: FinancialStatus.success,
                                            beforeBalance: user.balance,
                                            afterBalance: user.balance + betAmount - newBetAmount
                                        });
                                        await user.update({ $inc: { balance: betAmount - newBetAmount } });
                                    }
                                }
                            }
                        }
                        await betpool.update({ teamA, teamB, homeBets: newHomeBets, awayBets: newAwayBets });
                        await calculateParlayBetsStatus(betpool._id);
                    }

                    const winBets = homeWin ? homeBets : awayBets;
                    const lossBets = homeWin ? awayBets : homeBets;

                    for (const bet_id of winBets) {
                        const bet = await Bet.findById(bet_id);
                        if (bet) {
                            const { _id, userId, bet: betAmount, payableToWin } = bet;
                            const user = await User.findById(userId);
                            if (user) {
                                const betFee = Number((payableToWin * BetFee).toFixed(2));
                                const betChanges = {
                                    $set: {
                                        status: 'Settled - Win',
                                        credited: betAmount + payableToWin,
                                        fee: betFee,
                                        parlayQuery: parlayQuery
                                    }
                                }
                                await bet.update(betChanges);
                                if (payableToWin > 0) {
                                    await user.update({ $inc: { balance: betAmount + payableToWin - betFee } });
                                    const afterBalance = user.balance + betAmount + payableToWin;
                                    await FinancialLog.create({
                                        financialtype: 'betwon',
                                        uniqid: `BW${ID()}`,
                                        user: userId,
                                        betId: _id,
                                        amount: betAmount + payableToWin,
                                        method: 'betwon',
                                        status: FinancialStatus.success,
                                        beforeBalance: user.balance,
                                        afterBalance: afterBalance
                                    });
                                    await FinancialLog.create({
                                        financialtype: 'betfee',
                                        uniqid: `BF${ID()}`,
                                        user: userId,
                                        betId: _id,
                                        amount: betFee,
                                        method: 'betfee',
                                        status: FinancialStatus.success,
                                        beforeBalance: afterBalance,
                                        afterBalance: afterBalance - betFee
                                    });
                                }
                                // TODO: email winner
                                sendBetWinConfirmEmail(user, bet);
                            }
                        }
                    }
                    for (const bet_id of lossBets) {
                        const bet = await Bet.findById(bet_id);
                        if (bet) {
                            const { userId, payableToWin, toWin, bet: betAmount } = bet;
                            const betChanges = {
                                $set: {
                                    status: 'Settled - Lose',
                                    parlayQuery: parlayQuery
                                }
                            }
                            const unplayableBet = payableToWin < toWin
                                ? Number(((1 - payableToWin / toWin) * betAmount).toFixed(2)) : null;

                            const user = await User.findById(userId);
                            if (user) {
                                sendBetLoseConfirmEmail(user, betAmount);
                                if (unplayableBet) {
                                    betChanges.$set.credited = unplayableBet;
                                    await FinancialLog.create({
                                        financialtype: 'betrefund',
                                        uniqid: `BF${ID()}`,
                                        user: userId,
                                        betId: bet_id,
                                        amount: unplayableBet,
                                        method: 'betrefund',
                                        status: FinancialStatus.success,
                                        beforeBalance: user.balance,
                                        afterBalance: user.balance + unplayableBet
                                    });
                                    await user.update({ $inc: { balance: unplayableBet } });
                                }
                            }
                            await bet.update(betChanges);
                        }
                    }
                    await betpool.update({ $set: { result: 'Settled' } });
                } else {
                    cancelBetPool(betpool);
                }
                return res.json({ success: true });
            } else {
                const lineQuery = bet.lineQuery;
                const linePoints = lineQuery.points ? lineQuery.points : getLinePoints(bet.pickName, bet.pick, lineQuery)

                const betpool = await BetPool.findOne({
                    $or: [
                        { homeBets: bet._id },
                        { awayBets: bet._id },
                        { drawBets: bet._id },
                        { nonDrawBets: bet._id },
                    ]
                });
                if (!betpool) {
                    return res.status(404).json({ error: 'BetPool not found' });
                }
                const {
                    homeBets,
                    awayBets,
                    drawBets,
                    nonDrawBets,
                    uid,
                    lineType,
                    points
                } = betpool;
                let matchCancelled = false;
                let drawCancelled = false;

                if (drawBets.length > 0 && nonDrawBets.length > 0) {
                    const { teamAScore, teamBScore, cancellationReason } = req.body;
                    const homeScore = parseInt(teamAScore);
                    const awayScore = parseInt(teamBScore);
                    if (cancellationReason) {
                        drawCancelled = true;
                    } else {
                        let moneyLineWinner = null;
                        if (awayScore == homeScore) {
                            moneyLineWinner = 'draw';
                        }
                        else {
                            moneyLineWinner = 'nondraw'
                        }

                        const bets = await Bet.find({ _id: { $in: [...drawBets, ...nonDrawBets] } });

                        for (const bet of bets) {
                            const { _id, userId, bet: betAmount, toWin, pick, payableToWin, status } = bet;

                            if (payableToWin <= 0 || status == 'Pending') {
                                const { _id, userId, bet: betAmount } = bet;
                                await Bet.findOneAndUpdate({ _id }, { status: 'Cancelled' });
                                const user = await User.findById(userId);
                                if (user) {
                                    await FinancialLog.create({
                                        financialtype: 'betcancel',
                                        uniqid: `BC${ID()}`,
                                        user: userId,
                                        betId: _id,
                                        amount: betAmount,
                                        method: 'betcancel',
                                        status: FinancialStatus.success,
                                        beforeBalance: user.balance,
                                        afterBalance: user.balance + betAmount
                                    });
                                    await user.update({ $inc: { balance: betAmount } });
                                }
                                continue;
                            }

                            let betWin = false;
                            if (lineType === 'moneyline') {
                                betWin = pick === moneyLineWinner;
                            }

                            if (betWin === true) {
                                const user = await User.findById(userId);
                                const betFee = Number((payableToWin * BetFee).toFixed(2));
                                const betChanges = {
                                    $set: {
                                        status: 'Settled - Win',
                                        credited: betAmount + payableToWin,
                                        homeScore: homeScore,
                                        awayScore: awayScore,
                                        fee: betFee
                                    }
                                }
                                await Bet.findOneAndUpdate({ _id }, betChanges);
                                if (user) {
                                    if (payableToWin > 0) {
                                        const user = await User.findById(userId);
                                        if (user) {
                                            const afterBalance = user.balance + betAmount + payableToWin;
                                            await FinancialLog.create({
                                                financialtype: 'betwon',
                                                uniqid: `BW${ID()}`,
                                                user: userId,
                                                betId: _id,
                                                amount: betAmount + payableToWin,
                                                method: 'betwon',
                                                status: FinancialStatus.success,
                                                beforeBalance: user.balance,
                                                afterBalance: afterBalance
                                            });
                                            await FinancialLog.create({
                                                financialtype: 'betfee',
                                                uniqid: `BF${ID()}`,
                                                user: userId,
                                                betId: _id,
                                                amount: betFee,
                                                method: 'betfee',
                                                status: FinancialStatus.success,
                                                beforeBalance: afterBalance,
                                                afterBalance: afterBalance - betFee
                                            });
                                            await user.update({ $inc: { balance: betAmount + payableToWin - betFee } });
                                        }
                                    }
                                    // TODO: email winner
                                    sendBetWinConfirmEmail(user, bet);
                                }
                            } else if (betWin === false) {
                                const user = await User.findById(userId);
                                const betChanges = {
                                    $set: {
                                        status: 'Settled - Lose',
                                        homeScore,
                                        awayScore,
                                    }
                                }
                                const unplayableBet = payableToWin < toWin
                                    ? Number(((1 - payableToWin / toWin) * betAmount).toFixed(2)) : null;
                                if (user) {
                                    sendBetLoseConfirmEmail(user, betAmount);
                                    if (unplayableBet) {
                                        betChanges.$set.credited = unplayableBet;
                                        if (user) {
                                            await FinancialLog.create({
                                                financialtype: 'betrefund',
                                                uniqid: `BF${ID()}`,
                                                user: userId,
                                                betId: _id,
                                                amount: unplayableBet,
                                                method: 'betrefund',
                                                status: FinancialStatus.success,
                                                beforeBalance: user.balance,
                                                afterBalance: user.balance + unplayableBet
                                            });
                                            await user.update({ $inc: { balance: unplayableBet } });
                                        }
                                    }
                                }
                                await Bet.findOneAndUpdate({ _id }, betChanges);
                            } else {
                                console.error('error: somehow', lineType, 'bet did not result in win or loss. betWin value:', betWin);
                            }
                            await BetPool.findOneAndUpdate({ uid }, { $set: { result: 'Settled' } });
                        }
                    }
                } else {
                    drawCancelled = true;
                }

                if (homeBets.length > 0 && awayBets.length > 0) {
                    const { teamAScore, teamBScore, cancellationReason } = req.body;
                    const homeScore = parseInt(teamAScore);
                    const awayScore = parseInt(teamBScore);
                    if (cancellationReason) {
                        matchCancelled = true;
                    } else {
                        let moneyLineWinner = null;
                        if (homeScore > awayScore) moneyLineWinner = 'home';
                        else if (awayScore > homeScore) moneyLineWinner = 'away';
                        const bets = await Bet.find({ _id: { $in: [...homeBets, ...awayBets] } });

                        for (const bet of bets) {
                            const { _id, userId, bet: betAmount, toWin, pick, payableToWin, status } = bet;

                            if (payableToWin <= 0 || status == 'Pending') {
                                const { _id, userId, bet: betAmount } = bet;
                                await Bet.findOneAndUpdate({ _id }, { status: 'Cancelled' });
                                const user = await User.findById(userId);
                                if (user) {
                                    await FinancialLog.create({
                                        financialtype: 'betcancel',
                                        uniqid: `BC${ID()}`,
                                        user: userId,
                                        betId: _id,
                                        amount: betAmount,
                                        method: 'betcancel',
                                        status: FinancialStatus.success,
                                        beforeBalance: user.balance,
                                        afterBalance: user.balance + betAmount
                                    });
                                    await user.update({ $inc: { balance: betAmount } });
                                }
                                continue;
                            }

                            let betWin;
                            let draw = false;
                            if (lineType === 'moneyline') {
                                betWin = pick === moneyLineWinner;
                                draw = awayScore == homeScore;
                            } else if (['spread', 'alternative_spread'].includes(lineType)) {
                                const spread = {
                                    home: Number(points),
                                    away: 0,
                                };
                                const homeScoreHandiCapped = Number(homeScore) + spread.home;
                                const awayScoreHandiCapped = Number(awayScore) + spread.away;
                                let spreadWinner;
                                if (homeScoreHandiCapped > awayScoreHandiCapped) spreadWinner = 'home';
                                else if (awayScoreHandiCapped > homeScoreHandiCapped) spreadWinner = 'away';
                                betWin = pick === spreadWinner;
                                draw = homeScoreHandiCapped == awayScoreHandiCapped;
                            } else if (['total', 'alternative_total'].includes(lineType)) {
                                const totalPoints = homeScore + awayScore;
                                const overUnderWinner = totalPoints > points ? 'home' : 'away';
                                betWin = pick === overUnderWinner;
                                draw = totalPoints == linePoints
                            } else if (lineType == 'home_total') {
                                const overUnderWinner = homeScore > points ? 'home' : 'away';
                                betWin = pick === overUnderWinner;
                            } else if (lineType == 'away_total') {
                                const overUnderWinner = awayScore > points ? 'home' : 'away';
                                betWin = pick === overUnderWinner;
                            }

                            if (draw) {
                                // refund user
                                await Bet.findOneAndUpdate({ _id: _id }, { status: 'Draw' });
                                const user = await User.findById(userId);
                                if (user) {
                                    await FinancialLog.create({
                                        financialtype: 'betdraw',
                                        uniqid: `BD${ID()}`,
                                        user: userId,
                                        betId: _id,
                                        amount: betAmount,
                                        method: 'betdraw',
                                        status: FinancialStatus.success,
                                        beforeBalance: user.balance,
                                        afterBalance: user.balance + betAmount
                                    });
                                    await user.update({ $inc: { balance: betAmount } });
                                }
                                continue;
                            }

                            if (betWin === true) {
                                // TODO: credit back bet ammount
                                const user = await User.findById(userId);
                                const betFee = Number((payableToWin * BetFee).toFixed(2));
                                const betChanges = {
                                    $set: {
                                        status: 'Settled - Win',
                                        credited: betAmount + payableToWin,
                                        homeScore: homeScore,
                                        awayScore: awayScore,
                                        fee: betFee
                                    }
                                }
                                await Bet.findOneAndUpdate({ _id }, betChanges);
                                if (user) {
                                    if (payableToWin > 0) {
                                        const afterBalance = user.balance + betAmount + payableToWin;
                                        await FinancialLog.create({
                                            financialtype: 'betwon',
                                            uniqid: `BW${ID()}`,
                                            user: userId,
                                            betId: _id,
                                            amount: betAmount + payableToWin,
                                            method: 'betwon',
                                            status: FinancialStatus.success,
                                            beforeBalance: user.balance,
                                            afterBalance: afterBalance
                                        });
                                        await FinancialLog.create({
                                            financialtype: 'betfee',
                                            uniqid: `BF${ID()}`,
                                            user: userId,
                                            betId: _id,
                                            amount: betFee,
                                            method: 'betfee',
                                            status: FinancialStatus.success,
                                            beforeBalance: afterBalance,
                                            afterBalance: afterBalance - betFee
                                        });
                                        await user.update({ $inc: { balance: betAmount + payableToWin - betFee } });
                                    }
                                    // TODO: email winner
                                    sendBetWinConfirmEmail(user, bet);
                                }
                            } else if (betWin === false) {
                                const betChanges = {
                                    $set: {
                                        status: 'Settled - Lose',
                                        homeScore,
                                        awayScore,
                                    }
                                }
                                const unplayableBet = payableToWin < toWin
                                    ? Number(((1 - payableToWin / toWin) * betAmount).toFixed(2)) : null;
                                const user = await User.findById(userId);
                                if (user) {
                                    sendBetLoseConfirmEmail(user, betAmount);
                                    if (unplayableBet) {
                                        betChanges.$set.credited = unplayableBet;
                                        await FinancialLog.create({
                                            financialtype: 'betrefund',
                                            uniqid: `BF${ID()}`,
                                            user: userId,
                                            betId: _id,
                                            amount: unplayableBet,
                                            method: 'betrefund',
                                            status: FinancialStatus.success,
                                            beforeBalance: user.balance,
                                            afterBalance: user.balance + unplayableBet
                                        });
                                        await user.update({ $inc: { balance: unplayableBet } });
                                    }
                                }
                                await Bet.findOneAndUpdate({ _id }, betChanges);
                            } else {
                                console.error('error: somehow', lineType, 'bet did not result in win or loss. betWin value:', betWin);
                            }
                            await BetPool.findOneAndUpdate({ uid }, { $set: { result: 'Settled' } });
                        }
                    }
                } else {
                    matchCancelled = true;
                }

                if (matchCancelled) {
                    for (const betId of [...homeBets, ...awayBets]) {
                        const bet = await Bet.findOne({ _id: betId });
                        const { _id, userId, bet: betAmount } = bet;
                        // refund user
                        await Bet.findOneAndUpdate({ _id }, { status: 'Cancelled' });
                        const user = await User.findById(userId);
                        if (user) {
                            await FinancialLog.create({
                                financialtype: 'betcancel',
                                uniqid: `BC${ID()}`,
                                user: userId,
                                betId: _id,
                                amount: betAmount,
                                method: 'betcancel',
                                status: FinancialStatus.success,
                                beforeBalance: user.balance,
                                afterBalance: user.balance + betAmount
                            });
                            await user.update({ $inc: { balance: betAmount } });
                        }
                    }
                    await BetPool.findOneAndUpdate({ uid }, { $set: { result: 'Cancelled' } });
                }

                if (drawCancelled) {
                    for (const betId of [...drawBets, ...nonDrawBets]) {
                        const bet = await Bet.findOne({ _id: betId });
                        const { _id, userId, bet: betAmount } = bet;
                        // refund user
                        await Bet.findOneAndUpdate({ _id }, { status: 'Cancelled' });
                        const user = await User.findById(userId);
                        if (user) {
                            await FinancialLog.create({
                                financialtype: 'betcancel',
                                uniqid: `BC${ID()}`,
                                user: userId,
                                betId: _id,
                                amount: betAmount,
                                method: 'betcancel',
                                status: FinancialStatus.success,
                                beforeBalance: user.balance,
                                afterBalance: user.balance + betAmount
                            });
                            await user.update({ $inc: { balance: betAmount } });
                        }
                    }
                    await BetPool.findOneAndUpdate({ uid }, { $set: { result: 'Cancelled' } });
                }

                return res.json({ success: true });
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false });
        }
    }
)

adminRouter.post(
    '/bets/:id/remove',
    authenticateJWT,
    limitRoles('bet_activities'),
    async (req, res) => {
        const { cancelIds } = req.body;
        if (!cancelIds || !cancelIds.length) {
            return res.status(400).json({ success: false });
        }

        const { id } = req.params;
        const bet = await Bet.findById(id);
        if (!bet || !bet.isParlay) {
            return res.status(404).json({ success: false });
        }

        const betpool = await ParlayBetPool.findOne({
            $or: [
                { homeBets: bet._id },
                { awayBets: bet._id },
            ]
        })
        if (!betpool) {
            return res.json({ success: false, error: 'Betpool not found.' });
        }

        const originParlayQuery = bet.parlayQuery;
        let teaserPoint = null;
        for (const query of originParlayQuery) {
            if (query.lineQuery.teaserPoint != undefined) {
                teaserPoint = query.lineQuery.teaserPoint;
                break;
            }
        }

        if (cancelIds.length == originParlayQuery.length) {
            await cancelBetPool(betpool);
            return res.json({ success: true });
        }

        let parlayOdds = 1;
        const newParlayQuery = [];
        if (teaserPoint != null) {
            let sportName = null;
            for (const query of originParlayQuery) {
                const { lineQuery: { eventId, sportName: querySportName } } = query;
                sportName = querySportName;
                const cancelled = cancelIds.find(event => event == eventId);
                if (cancelled) continue;
                newParlayQuery.push(query);
            }
            if (newParlayQuery.length <= 1) {
                await cancelBetPool(betpool);
                return res.json({ success: true });
            }
            parlayOdds = getTeaserOdds(sportName, teaserPoint, newParlayQuery.length);
        } else {
            for (const query of originParlayQuery) {
                const { pickOdds, lineQuery: { eventId } } = query;
                const cancelled = cancelIds.find(event => event == eventId);
                if (cancelled) continue;
                parlayOdds *= Number(convertOdds(Number(pickOdds), 'decimal'));
                newParlayQuery.push(query);
            }
            if (parlayOdds >= 2) {
                parlayOdds = parseInt((parlayOdds - 1) * 100);
            } else {
                parlayOdds = parseInt(-100 / (parlayOdds - 1));
            }
        }

        const { homeBets, awayBets } = betpool;
        const teamA = { odds: parlayOdds, betTotal: 0, toWinTotal: 0 };
        const teamB = { odds: -parlayOdds, betTotal: 0, toWinTotal: 0 };
        const newHomeBets = [];
        const newAwayBets = [];
        for (const bet_id of homeBets) {
            const bet = await Bet.findById(bet_id);
            if (bet) {
                newHomeBets.push(bet._id);
                const { bet: betAmount } = bet;
                const toWin = calculateToWinFromBet(betAmount, parlayOdds);
                teamA.betTotal = betAmount;
                teamA.toWinTotal = toWin;
                await bet.update({
                    toWin: toWin,
                    payableToWin: 0,
                    pickOdds: parlayOdds,
                    parlayQuery: newParlayQuery
                });
            }
        }

        const totalAwayBet = teamA.toWinTotal;
        const prevTotalAwayBet = betpool.teamB.betTotal;
        if (totalAwayBet == 0 || prevTotalAwayBet <= 0) {
            await cancelBetPool(betpool);
            return res.json({ success: true });
        }

        for (const bet_id of awayBets) {
            const bet = await Bet.findById(bet_id);
            if (bet) {
                newAwayBets.push(bet._id);
                const { userId, bet: betAmount } = bet;
                let newBetAmount = betAmount;
                if (totalAwayBet < prevTotalAwayBet) {
                    const rate = betAmount / prevTotalAwayBet;
                    newBetAmount = totalAwayBet * rate;
                }
                const toWin = calculateToWinFromBet(newBetAmount, -parlayOdds);
                teamB.betTotal += newBetAmount;
                teamB.toWinTotal += toWin;
                await bet.update({
                    bet: newBetAmount,
                    toWin: toWin,
                    payableToWin: 0,
                    pickOdds: -parlayOdds,
                    parlayQuery: newParlayQuery
                });
                if (newBetAmount < betAmount) {
                    const user = await User.findById(userId);
                    if (user) {
                        await FinancialLog.create({
                            financialtype: 'betrefund',
                            uniqid: `BF${ID()}`,
                            user: userId,
                            betId: bet_id,
                            amount: betAmount - newBetAmount,
                            method: 'betrefund',
                            status: FinancialStatus.success,
                            beforeBalance: user.balance,
                            afterBalance: user.balance + betAmount - newBetAmount
                        });
                        await user.update({ $inc: { balance: betAmount - newBetAmount } });
                    }
                }
            }
        }
        await betpool.update({ teamA, teamB, homeBets: newHomeBets, awayBets: newAwayBets, parlayQuery: newParlayQuery });
        await calculateParlayBetsStatus(betpool._id);

        res.json({ success: true });
    }
)

adminRouter.post(
    '/bets/:id/cancel',
    authenticateJWT,
    limitRoles('bet_activities'),
    async (req, res) => {
        try {
            const { id } = req.params;
            const bet = await Bet.findById(id);
            if (!bet) {
                return res.status(404).json({ success: false });
            }
            if (bet.isParlay) {
                return res.status(404).json({ success: false });
            }
            const betpool = await BetPool.findOne({
                $or: [
                    { homeBets: bet._id },
                    { awayBets: bet._id },
                    { drawBets: bet._id },
                    { nonDrawBets: bet._id },
                ]
            });
            if (betpool) {
                await cancelBetPool(betpool);
            } else {
                const { _id, userId, bet: betAmount } = bet;
                const user = await User.findById(userId);
                await bet.update({ status: 'Cancelled' });
                if (user) {
                    await FinancialLog.create({
                        financialtype: 'betcancel',
                        uniqid: `BC${ID()}`,
                        user: userId,
                        betId: _id,
                        amount: betAmount,
                        method: 'betcancel',
                        status: FinancialStatus.success,
                        beforeBalance: user.balance,
                        afterBalance: user.balance + betAmount
                    });
                    await user.update({ $inc: { balance: betAmount } });
                }
            }
            return res.json({ success: true });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false });
        }
    }
);

adminRouter.post(
    '/bets/:id/match',
    authenticateJWT,
    limitRoles('bet_activities'),
    async (req, res) => {
        try {
            const { id } = req.params;
            const data = req.body;
            if (!data.user || !data.amount) {
                return res.status(400).json({ success: false });
            }
            const bet = await Bet.findById(id);
            if (!bet) {
                return res.status(404).json({ success: false });
            }
            if (bet.status != 'Pending') {
                return res.json({ success: false, error: 'Only pending bets are acceptable.' });
            }

            if (bet.isParlay) {
                const { parlayQuery, pickOdds: parlayOdds, bet: totalStake, toWin: totalWin, matchStartDate } = bet;
                let betpool = await ParlayBetPool.findOne({
                    $or: [
                        { homeBets: bet._id },
                        { awayBets: bet._id },
                        { drawBets: bet._id },
                        { nonDrawBets: bet._id },
                    ]
                });
                if (!betpool) {
                    betpool = await ParlayBetPool.create({
                        parlayQuery: parlayQuery,
                        teamA: {
                            odds: parlayOdds,
                            betTotal: totalStake,
                            toWinTotal: totalWin
                        },
                        teamB: {
                            odds: -Number(parlayOdds),
                            betTotal: 0,
                            toWinTotal: 0
                        },
                        matchStartDate: matchStartDate,
                        homeBets: [bet._id],
                        awayBets: [],
                        origin: bet.origin
                    });
                }

                const user = await User.findById(data.user);
                if (!user) {
                    return res.json({ success: false, error: 'User not found.' });
                }
                const amount = Number(data.amount);
                if (amount > user.balance) {
                    return res.json({ success: false, error: 'Insufficient Funds.' });
                }

                const pick = 'away';
                const newLineOdds = -Number(parlayOdds);
                const betAfterFee = amount;
                const toWin = calculateToWinFromBet(betAfterFee, newLineOdds);
                const fee = Number((betAfterFee * BetFee).toFixed(2));
                const bet_id = ID();

                const newBet = await Bet.create({
                    userId: user._id,
                    pick: 'away',
                    pickName: 'Parlay Bet',
                    pickOdds: newLineOdds,
                    oldOdds: newLineOdds,
                    bet: betAfterFee,
                    toWin: toWin,
                    fee: fee,
                    matchStartDate: matchStartDate,
                    status: 'Pending',
                    matchingStatus: 'Pending',
                    transactionID: `B${bet_id}`,
                    origin: bet.origin,
                    isParlay: true,
                    parlayQuery: parlayQuery,
                });

                await FinancialLog.create({
                    financialtype: 'bet',
                    uniqid: `BP${bet_id}`,
                    user: user._id,
                    amount: betAfterFee,
                    betId: newBet._id,
                    method: 'bet',
                    status: FinancialStatus.success,
                    beforeBalance: user.balance,
                    afterBalance: user.balance - amount
                });
                await LoyaltyLog.create({
                    user: user._id,
                    point: betAfterFee * loyaltyPerBet
                })

                const docChanges = {
                    $push: pick === 'home' ? { homeBets: newBet._id } : { awayBets: newBet._id },
                    $inc: {
                        "teamB.betTotal": betAfterFee,
                        "teamB.toWinTotal": toWin
                    },
                };
                await betpool.update(docChanges);
                await user.update({ $inc: { balance: -amount } });

                await calculateParlayBetsStatus(betpool._id);
            } else {
                const lineQuery = bet.lineQuery;
                const linePoints = lineQuery.points ? lineQuery.points : getLinePoints(bet.pickName, bet.pick, lineQuery)

                let betpool = await BetPool.findOne({
                    $or: [
                        { homeBets: bet._id },
                        { awayBets: bet._id },
                        { drawBets: bet._id },
                        { nonDrawBets: bet._id },
                    ]
                });
                if (!betpool) {
                    betpool = await BetPool.create({
                        uid: JSON.stringify(lineQuery),
                        sportId: lineQuery.sportId,
                        leagueId: lineQuery.leagueId,
                        eventId: lineQuery.eventId,
                        lineId: lineQuery.lineId,
                        teamA: {
                            name: bet.teamA.name,
                            odds: bet.teamA.odds,
                            betTotal: bet.pick === 'home' ? bet.bet : 0,
                            toWinTotal: bet.pick === 'home' ? bet.toWin : 0,
                        },
                        teamB: {
                            name: bet.teamB.name,
                            odds: bet.teamB.odds,
                            betTotal: bet.pick === 'away' ? bet.bet : 0,
                            toWinTotal: bet.pick === 'away' ? bet.toWin : 0,
                        },
                        teamDraw: {
                            name: `Draw ${bet.teamA.name} vs ${bet.teamB.name}`,
                            odds: bet.teamDraw && bet.teamDraw.odds ? bet.teamDraw.odds : 0,
                            betTotal: bet.pick === "draw" ? bet.bet : 0,
                            toWinTotal: bet.pick === "draw" ? bet.toWin : 0,
                        },
                        teamNonDraw: {
                            name: `Non Draw ${bet.teamA.name} vs ${bet.teamB.name}`,
                            odds: bet.teamNonDraw && bet.teamNonDraw.odds ? bet.teamNonDraw.odds : 0,
                            betTotal: bet.pick === "nondraw" ? bet.bet : 0,
                            toWinTotal: bet.pick === "nondraw" ? bet.toWin : 0,
                        },
                        sportName: lineQuery.sportName,
                        matchStartDate: bet.matchStartDate,
                        lineType: lineQuery.type,
                        lineSubType: lineQuery.subtype,
                        points: linePoints,
                        homeBets: bet.pick === 'home' ? [bet._id] : [],
                        awayBets: bet.pick === 'away' ? [bet._id] : [],
                        drawBets: bet.pick === 'draw' ? [bet._id] : [],
                        nonDrawBets: bet.pick === 'nondraw' ? [bet._id] : [],
                        origin: bet.origin
                    })
                }

                const user = await User.findById(data.user);
                if (!user) {
                    return res.json({ success: false, error: 'User not found.' });
                }
                const amount = Number(data.amount);
                if (amount > user.balance) {
                    return res.json({ success: false, error: 'Insufficient Funds.' });
                }

                let pick;
                switch (bet.pick) {
                    case "home":
                        pick = "away"
                        break;
                    case "draw":
                        pick = "nondraw"
                        break;
                    default:
                        pick = "home"
                        break;
                }
                // const newLineOdds = calculateNewOdds(Number(bet.teamA.odds), Number(bet.teamB.odds), pick, lineQuery.type, lineQuery.subtype);
                let newLineOdds = calculateNewOdds(Number(bet.teamA.odds), Number(bet.teamB.odds), pick, lineQuery.type, lineQuery.subtype);
                if (bet.sportsbook) {
                    switch (pick) {
                        case "home":
                            newLineOdds = -Number(bet.teamB.odds)
                            break;
                        case "draw":
                            newLineOdds = Number(bet.teamDraw.odds);
                            break;
                        case "nondraw":
                            newLineOdds = -Number(bet.teamDraw.odds);
                            break;
                        case 'away':
                        default:
                            newLineOdds = -Number(bet.teamA.odds);
                            break;
                    }
                }
                const betAfterFee = amount;
                const toWin = calculateToWinFromBet(betAfterFee, newLineOdds);
                const fee = bet.sportsbook ? 0 : Number((betAfterFee * BetFee).toFixed(2));

                let pickName = '';
                switch (bet.lineQuery.subtype) {
                    case 'first_half':
                        pickName += '1st Half: ';
                        break;
                    case 'second_half':
                        pickName += '2nd Half: ';
                        break;
                    case 'first_quarter':
                        pickName += '1st Quarter: ';
                        break;
                    case 'second_quarter':
                        pickName += '2nd Quarter: ';
                        break;
                    case 'third_quarter':
                        pickName += '3rd Quarter: ';
                        break;
                    case 'forth_quarter':
                        pickName += '4th Quarter: ';
                        break;
                    case 'fifth_innings':
                        pickName += '5th Innings: ';
                        break;
                    default:
                        pickName += 'Pick: ';
                        break;
                }
                switch (bet.lineQuery.type) {
                    case 'total':
                    case 'alternative_total':
                        if (pick == 'home') {
                            pickName += `Over ${linePoints}`;
                        } else {
                            pickName += `Under ${linePoints}`;
                        }
                        break;
                    case 'home_total':
                        if (pick == 'home') {
                            pickName += `${bet.teamA.name} Over ${linePoints}`;
                        } else {
                            pickName += `${bet.teamA.name} Under ${linePoints}`;
                        }
                        break;
                    case 'away_total':
                        if (pick == 'home') {
                            pickName += `${bet.teamB.name} Over ${linePoints}`;
                        } else {
                            pickName += `${bet.teamB.name} Under ${linePoints}`;
                        }
                        break;
                    case 'spread':
                    case 'alternative_spread':
                        if (pick == 'home') {
                            pickName += `${bet.teamA.name} ${linePoints > 0 ? '+' : ''}${linePoints}`;
                        } else {
                            pickName += `${bet.teamB.name} ${-1 * linePoints > 0 ? '+' : ''}${-1 * linePoints}`;
                        }
                        break;
                    case 'moneyline':
                        if (pick == 'home') {
                            pickName += bet.teamA.name;
                        }
                        else if (pick == 'draw') {
                            pickName += "Draw";
                        }
                        else if (pick == 'nondraw') {
                            pickName += "Non Draw";
                        } else {
                            pickName += bet.teamB.name;
                        }
                        break;
                    default:
                        break;
                }

                const bet_id = ID();
                const newBet = await Bet.create({
                    userId: user._id,
                    transactionID: `B${bet_id}`,
                    teamA: bet.teamA,
                    teamB: bet.teamB,
                    teamDraw: bet.teamDraw,
                    teamNonDraw: bet.teamNonDraw,
                    pick: pick,
                    pickOdds: newLineOdds,
                    oldOdds: pick == 'home' ? bet.teamA.odds : bet.teamB.odds,
                    pickName: pickName,
                    bet: betAfterFee,
                    toWin: toWin,
                    fee: fee,
                    matchStartDate: bet.matchStartDate,
                    status: 'Pending',
                    matchingStatus: 'Pending',
                    lineQuery: bet.lineQuery,
                    origin: bet.origin,
                    sportsbook: bet.sportsbook,
                });
                await FinancialLog.create({
                    financialtype: 'bet',
                    uniqid: `BP${bet_id}`,
                    user: user._id,
                    amount: betAfterFee,
                    method: 'bet',
                    betId: newBet._id,
                    status: FinancialStatus.success,
                    beforeBalance: user.balance,
                    afterBalance: user.balance - amount
                });
                await LoyaltyLog.create({
                    user: user._id,
                    point: betAfterFee * loyaltyPerBet
                })

                const docChanges = {
                    $push: {},
                    $inc: {},
                };
                switch (pick) {
                    case 'home':
                        docChanges.$push['homeBets'] = newBet._id;
                        docChanges.$inc['teamA.betTotal'] = betAfterFee;
                        docChanges.$inc['teamA.toWinTotal'] = toWin;
                        break;
                    case 'draw':
                        docChanges.$push['drawBets'] = newBet._id;
                        docChanges.$inc['teamDraw.betTotal'] = betAfterFee;
                        docChanges.$inc['teamDraw.toWinTotal'] = toWin;
                        break;
                    case 'nondraw':
                        docChanges.$push['nonDrawBets'] = newBet._id;
                        docChanges.$inc['teamNonDraw.betTotal'] = betAfterFee;
                        docChanges.$inc['teamNonDraw.toWinTotal'] = toWin;
                        break;
                    default:
                        docChanges.$push['awayBets'] = newBet._id;
                        docChanges.$inc['teamB.betTotal'] = betAfterFee;
                        docChanges.$inc['teamB.toWinTotal'] = toWin;
                        break;
                }
                await betpool.update(docChanges);
                await user.update({ $inc: { balance: -amount } });

                await calculateBetsStatus(betpool.uid);
            }
            res.json({ success: true });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false });
        }
    }
);

adminRouter.get(
    '/bets-csv',
    authenticateJWT,
    limitRoles('bet_activities'),
    async (req, res) => {
        try {
            const { datefrom, dateto, sport, minamount, maxamount } = req.query;
            let searchObj = {};
            if (datefrom || dateto) {
                let dateObj = {};
                if (datefrom) {
                    datefrom = new Date(datefrom);
                    if (!isNaN(datefrom.getTime())) {
                        dateObj = {
                            ...dateObj,
                            ...{ $gte: datefrom }
                        }
                    }
                }
                if (dateto) {
                    dateto = new Date(dateto);
                    if (!isNaN(dateto.getTime())) {
                        dateObj = {
                            ...dateObj,
                            ...{ $lte: dateto }
                        }
                    }
                }
                searchObj = {
                    ...searchObj,
                    ...{ createdAt: dateObj }
                }
            }

            if (sport) {
                searchObj = {
                    ...searchObj,
                    ...{ "lineQuery.sportId": parseInt(sport) }
                }
            }

            if (minamount || maxamount) {
                let amountObj = {}
                if (minamount) {
                    amountObj = {
                        ...amountObj,
                        ...{ $gte: parseInt(minamount) }
                    }
                }
                if (maxamount) {
                    amountObj = {
                        ...amountObj,
                        ...{ $lte: parseInt(maxamount) }
                    }
                }
                searchObj = {
                    ...searchObj,
                    ...{ bet: amountObj }
                }
            }

            const bets = await Bet.find(searchObj)
                .sort({ createdAt: -1 })
                .populate('userId', ['username', 'currency', 'email']);

            let data = [
                ['House', 'Name', 'Email', 'Sport', 'Game', 'Wager', 'Odds', 'Results', 'Win/Loss', 'Time']
            ];
            bets.forEach(bet => {
                let results = '-';
                let winLoss = '-';
                if (bet.status == 'Settled - Win') {
                    results = 'WIN';
                    winLoss = '+ $' + Number(bet.credited).toFixed(2);
                }
                if (bet.status == 'Settled - Lose') {
                    results = 'LOSE'
                    winLoss = '+ $' + Number(bet.bet).toFixed(2);
                }
                data.push([
                    bet.sportsbook ? 'HIGH STAKER' : 'P2P',
                    bet.userId.username,
                    bet.userId.email,
                    bet.isParlay ? 'Parlay' : bet.origin == 'custom' ? 'Side Bets' : bet.lineQuery.sportName,
                    bet.isParlay ? '' : bet.origin == 'custom' ? bet.lineQuery.eventName : `${bet.teamA.name} vs ${bet.teamB.name}`,
                    `$ ${bet.bet}`,
                    Number(bet.pickOdds) > 0 ? `+${Number(bet.pickOdds).toFixed(2)}` : `${Number(bet.pickOdds).toFixed(2)}`,
                    results,
                    winLoss,
                    dateformat(bet.updatedAt, 'default')
                ]);
            })
            res.json(data);
        } catch (error) {
            return res.status(500).json({ error: 'Can\'t find bets.', message: error });
        }
    }
)

adminRouter.get(
    '/bet',
    authenticateJWT,
    limitRoles('bet_activities'),
    async (req, res) => {
        try {
            let { id } = req.query;
            let bet = await Bet.findById(id).populate('userId', ['email', 'currency']);
            return res.json(bet);
        } catch (error) {
            res.status(500).json({ error: 'Can\'t find bet.', message: error });
        }
    }
)

adminRouter.get(
    '/sports',
    authenticateJWT,
    async (req, res) => {
        try {
            const sports = await Sport.find().select(['name', 'originSportId']);
            res.json(sports);
        } catch (error) {
            res.status(500).json({ error: 'Can\'t find sports.', message: error });
        }
    }
)

adminRouter.get(
    '/searchsportsleague/:sportName',
    async (req, res) => {
        try {
            const { sportName } = req.params;
            const { name } = req.query;
            const sports = await Sport.findOne({ name: sportName });
            res.json(sports);
        } catch (error) {
            res.status(500).json({ error: 'Can\'t find sports league.', message: error });
        }
    }
)




adminRouter.get(
    '/searchsportsleagueteam',
    authenticateJWT,
    async (req, res) => {
        const { name } = req.query;
        try {
            let searchObj = {};
            if (name) {
                searchObj = {
                    ...searchObj,
                    ...{ name: { "$regex": name, "$options": "i" } }
                }
            }

            Sport.find(searchObj)
                .sort('createdAt')
                .select(['name'])
                .exec((error, data) => {
                    if (error) {
                        res.status(404).json({ error: 'Can\'t find customers.' });
                        return;
                    }
                    const result = data.map(sport => {
                        return {
                            value: sport.name,
                            label: sport.name,
                        }
                    })
                    res.status(200).json(result);
                })
        }
        catch (error) {
            res.status(500).json({ error: 'Can\'t find customers.', message: error });
        }
    }
)
adminRouter.get(
    '/sportsteam',
    async (req, res) => {
        try {

            const sports = await Sport.find({ originSportId: 91 });
            res.json(sports);
        } catch (error) {
            res.status(500).json({ error: 'Can\'t find sports.', message: error });
        }
    }
)

const getTotalDeposit = async (datefrom, dateto) => {
    datefrom = new Date(datefrom);
    dateto = new Date(dateto);
    const total = await FinancialLog.aggregate(
        {
            $match: {
                financialtype: "deposit",
                createdAt: {
                    $gte: datefrom,
                    $lte: dateto
                },
                status: FinancialStatus.success
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: "$amount" }
            }
        }
    );
    if (total.length) return total[0].total;
    return 0;
}

const getTotalWager = async (datefrom, dateto) => {
    datefrom = new Date(datefrom);
    dateto = new Date(dateto);
    const total = await Bet.aggregate(
        {
            $match: {
                createdAt: {
                    $gte: datefrom,
                    $lte: dateto
                },
                $or: [
                    { sportsbook: false },
                    { sportsbook: { $exists: false } },
                ]
            }
        },
        { $group: { _id: null, total: { $sum: "$bet" } } }
    );
    if (total.length) return total[0].total;
    return 0;
}

const getTotalWagerSportsBook = async (datefrom, dateto) => {
    datefrom = new Date(datefrom);
    dateto = new Date(dateto);
    const total = await Bet.aggregate(
        {
            $match: {
                createdAt: {
                    $gte: datefrom,
                    $lte: dateto
                },
                sportsbook: true,
            }
        },
        { $group: { _id: null, total: { $sum: "$bet" } } }
    );
    if (total.length) return total[0].total;
    return 0;
}

const getTotalPlayer = async (datefrom, dateto) => {
    datefrom = new Date(datefrom);
    dateto = new Date(dateto);
    const total = await User.aggregate(
        { $match: { createdAt: { $gte: datefrom, $lte: dateto } } },
        { $group: { _id: null, total: { $sum: 1 } } }
    );
    if (total.length) return total[0].total;
    return 0;
}

const getTotalActivePlayer = async (datefrom, dateto) => {
    datefrom = new Date(datefrom);
    dateto = new Date(dateto);
    const total = await Bet.aggregate(
        { $match: { createdAt: { $gte: datefrom, $lte: dateto } } },
        { $group: { _id: "$userId", total: { $sum: 1 } } }
    );
    return total.length;
}

const getTotalFees = async (datefrom, dateto) => {
    datefrom = new Date(datefrom);
    dateto = new Date(dateto);
    let totalfee = 0;
    const withdrawfee = await FinancialLog.aggregate(
        {
            $match: {
                financialtype: "withdrawfee",
                status: FinancialStatus.success,
                createdAt: {
                    $gte: datefrom,
                    $lte: dateto
                }
            }
        },
        { $group: { _id: null, total: { $sum: "$amount" } } }
    );
    if (withdrawfee.length) totalfee += withdrawfee[0].total;

    const betfee = await FinancialLog.aggregate(
        {
            $match: {
                financialtype: "betfee",
                status: FinancialStatus.success,
                createdAt: {
                    $gte: datefrom,
                    $lte: dateto
                }
            }
        },
        {
            $group: {
                _id: null,
                total: {
                    $sum: "$amount"
                }
            }
        }
    );
    if (betfee.length) totalfee += betfee[0].total;
    return Number(totalfee.toFixed(2));
}

adminRouter.post(
    '/dashboard',
    authenticateJWT,
    limitRoles('dashboard'),
    async (req, res) => {
        try {
            let { daterange, dateranges, categories } = req.body;
            if (!dateranges || !categories) {
                if (!daterange) daterange = { startDate: new Date(), endDate: new Date() };
                dateranges = [];
                categories = [];
                const { startDate, endDate } = daterange;

                if (startDate == endDate) {
                    const nowDate = new Date();
                    const year = nowDate.getFullYear();
                    const month = nowDate.getMonth();
                    const date = nowDate.getDate();
                    for (let i = 0; i <= 24; i += 2) {
                        let ndate = new Date(year, month, date, i);
                        dateranges.push(ndate);
                        categories.push(dateformat(ndate, "HH:MM"));
                    }
                } else {
                    //to avoid modifying the original date
                    const theDate = new Date(startDate);
                    while (theDate < endDate) {
                        dateranges = [...dateranges, new Date(theDate)];
                        theDate.setDate(theDate.getDate() + 1);
                        categories.push(dateformat(theDate, "HH:MM"));
                    }
                    dateranges = [...dateranges, endDate];
                }
            }

            const totaldeposit = await getTotalDeposit(dateranges[0], dateranges[dateranges.length - 1]);
            const totalwager = await getTotalWager(dateranges[0], dateranges[dateranges.length - 1]);
            const totalwagersportsbook = await getTotalWagerSportsBook(dateranges[0], dateranges[dateranges.length - 1]);
            const totalplayer = await getTotalPlayer(new Date(0), new Date());
            const totalactiveplayer = await getTotalActivePlayer(new Date().addHours(-15 * 24), new Date());
            const totalfees = await getTotalFees(dateranges[0], dateranges[dateranges.length - 1]);
            let deposits = [];
            let wagers = [];
            let wagerssportsbook = [];
            let fees = [];
            for (let i = 1; i < dateranges.length; i++) {

                const deposit = await getTotalDeposit(dateranges[i - 1], dateranges[i]);
                deposits.push(deposit);
                const wager = await getTotalWager(dateranges[i - 1], dateranges[i]);
                wagers.push(wager);
                const wagersportsbook = await getTotalWagerSportsBook(dateranges[i - 1], dateranges[i]);
                wagerssportsbook.push(wagersportsbook);
                const fee = await getTotalFees(dateranges[i - 1], dateranges[i]);
                fees.push(fee);
            }
            res.json({
                totaldeposit, deposits,
                totalwager, wagers,
                totalwagersportsbook, wagerssportsbook,
                totalplayer,
                totalactiveplayer,
                totalfees, fees,
                categories,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Can\'t read data.', message: error });
        }
    }
)

adminRouter.get(
    '/email-templates',
    authenticateJWT,
    limitRoles('email_templates'),
    async (req, res) => {
        const email_templates = await Email.find();
        res.json({
            email_templates
        })
    }
);

adminRouter.post(
    '/email-template',
    authenticateJWT,
    limitRoles('email_templates'),
    async (req, res) => {
        try {
            const email_template = await Email.create(req.body);
            res.json({ email_template })
        } catch (error) {
            res.status(400).json({ success: false });
        }
    }
);

adminRouter.get(
    '/email-template/:title',
    authenticateJWT,
    limitRoles('email_templates'),
    async (req, res) => {
        const { title } = req.params;
        try {
            const email_template = await Email.findOne({ title });
            return res.json({
                email_template
            });
        } catch (error) {
            res.status(404).json({ error: 'Can\'t find email template.' });
        }
    }
);

adminRouter.post(
    '/email-template/:title',
    authenticateJWT,
    limitRoles('email_templates'),
    async (req, res) => {
        const { title } = req.params;

        try {
            const email_template = await Email.findOne({ title });
            try {
                await email_template.update(req.body);
                return res.json({ message: 'Successfully updated.' });
            } catch (error) {
                return res.status(500).json({ error: 'Can\'t update email template.' });
            }

        } catch (error) {
            return res.status(404).json({ error: 'Can\'t find email template.' });
        }
    }
);

adminRouter.post(
    '/autobet',
    authenticateJWT,
    limitRoles('autobet'),
    async (req, res) => {
        const data = req.body;
        try {
            const existing = await AutoBet.findOne({ userId: ObjectId(data.userId) });
            if (existing) {
                return res.json({ success: false, message: "He/She is already autobet user." });
            }
            const existingCode = data.referral_code && await Promotion.findOne({ name: new RegExp(`^${data.referral_code}$`, 'i') });
            if (existingCode) {
                return res.json({ success: false, message: "Cannot create Autobet. Same Referral code exists." });
            }
            const existingInvite = await User.findOne({ username: new RegExp(`^${data.referral_code}$`, 'i') });
            if (existingInvite) {
                return res.status(404).json({ error: 'Cannot create Autobet. Same Referral code already exists.' });
            }
            const existingAffiliate = await Affiliate.findOne({ unique_id: new RegExp(`^${data.referral_code}$`, 'i') });
            if (existingAffiliate) {
                return res.status(404).json({ error: 'Cannot create Autobet. Same Referral code already exists.' });
            }
            await AutoBet.create(data);
            res.json({ success: true });
        } catch (error) {
            return res.status(500).json({ error: 'Can\'t create autobet.' });
        }
    }
)

adminRouter.get(
    '/autobets',
    authenticateJWT,
    limitRoles('autobet'),
    async (req, res) => {
        let { page, perPage } = req.query;
        if (!perPage) perPage = 25;
        perPage = parseInt(perPage);
        if (!page) page = 1;
        page = parseInt(page);
        page--;

        const total = await AutoBet.find({}).count();
        let timezoneOffset = -8;
        if (isDstObserved) timezoneOffset = -7;
        const today = new Date().addHours(timezoneOffset);
        today.addHours(today.getTimezoneOffset() / 60);
        timezoneOffset = timezoneOffset + today.getTimezoneOffset() / 60;
        const fromTime = new Date(today.getFullYear(), today.getMonth(), today.getDate()).addHours(-timezoneOffset);
        try {
            const autobets = await AutoBet.aggregate([
                {
                    $lookup: {
                        from: 'autobetlogs',
                        let: { user_id: "$userId" },
                        pipeline: [{
                            $match: {
                                $expr: {
                                    $and: [
                                        { $gte: ["$createdAt", fromTime] },
                                        { $eq: ["$user", "$$user_id"] },
                                        {
                                            $or: [
                                                { $ne: ["$type", "p2p"] },
                                                { $eq: ["$type", null] }
                                            ]
                                        }
                                    ]
                                }
                            },
                        }],
                        as: 'autobetlogs',
                    }
                },
                {
                    $lookup: {
                        from: 'autobetlogs',
                        let: { user_id: "$userId" },
                        pipeline: [{
                            $match: {
                                $expr: {
                                    $and: [
                                        { $gte: ["$createdAt", fromTime] },
                                        { $eq: ["$user", "$$user_id"] },
                                        { $eq: ["$type", "sportsbook"] }
                                    ]
                                }
                            },
                        }],
                        as: 'sbautobetlogs',
                    }
                },
                {
                    $lookup: {
                        from: 'autobetlogs',
                        let: { user_id: "$userId" },
                        pipeline: [{
                            $match: {
                                $expr: {
                                    $and: [
                                        { $gte: ["$createdAt", fromTime] },
                                        { $eq: ["$user", "$$user_id"] },
                                        { $eq: ["$type", "parlay"] }
                                    ]
                                }
                            },
                        }],
                        as: 'parlayautobetlogs',
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        let: { user_id: "$userId" },
                        pipeline: [{
                            $match: {
                                $expr: { $eq: ["$_id", "$$user_id"] }
                            },
                        }, {
                            $project: {
                                email: 1,
                                balance: 1,
                                firstname: 1,
                                lastname: 1
                            }
                        }],
                        as: 'userId',
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        let: { usersExcluded: "$usersExcluded" },
                        pipeline: [{
                            $match: {
                                $expr: { $in: ["$_id", "$$usersExcluded"] }
                            },
                        }, {
                            $project: {
                                email: 1,
                                balance: 1,
                                firstname: 1,
                                lastname: 1
                            }
                        }],
                        as: 'usersExcluded',
                    }
                },
                {
                    $project: {
                        userId: 1,
                        sports: 1,
                        side: 1,
                        betType: 1,
                        rollOver: 1,
                        priority: 1,
                        maxRisk: 1,
                        budget: 1,
                        sportsbookBudget: 1,
                        usersExcluded: 1,
                        acceptParlay: 1,
                        parlayBudget: 1,
                        hold: { $subtract: ["$budget", { $sum: '$autobetlogs.amount' }] },
                        sbhold: { $subtract: ["$sportsbookBudget", { $sum: '$sbautobetlogs.amount' }] },
                        parlayhold: { $subtract: ["$parlayBudget", { $sum: '$parlayautobetlogs.amount' }] },
                        referral_code: 1,
                        status: 1,
                        createdAt: 1
                    }
                },
                { $unwind: "$userId" },
                { $sort: { "createdAt": -1 } },
                { $skip: page * perPage },
                { $limit: perPage }
            ]);
            return res.json({ total, perPage, page: page + 1, data: autobets });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false });
        }
    }
)

adminRouter.get(
    '/autobets/overview',
    authenticateJWT,
    limitRoles('autobet'),
    async (req, res) => {
        try {
            const autobets = await AutoBet.aggregate([
                {
                    $lookup: {
                        from: 'bets',
                        let: { user_id: "$userId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$userId", "$$user_id"] },
                                            { $in: ["$status", ["Pending", "Partial Match", "Partial Accepted", "Matched", "Accepted"]] }
                                        ]
                                    },
                                },
                            },
                            {
                                $project: { bet: 1 }
                            }
                        ],
                        as: 'inplaybets',
                    }
                },
                {
                    $lookup: {
                        from: 'financiallogs',
                        let: { user_id: "$userId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$user", "$$user_id"] },
                                            { $eq: ["$financialtype", "betfee"] }
                                        ]
                                    },
                                },
                            },
                            {
                                $project: { amount: 1 }
                            }
                        ],
                        as: 'fees',
                    }
                },
                {
                    $lookup: {
                        from: 'financiallogs',
                        let: { user_id: "$userId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$user", "$$user_id"] },
                                            { $eq: ["$financialtype", "deposit"] },
                                            { $eq: ["$status", FinancialStatus.success] }
                                        ]
                                    },
                                },
                            },
                            {
                                $project: { amount: 1 }
                            }
                        ],
                        as: 'deposit',
                    }
                },
                {
                    $lookup: {
                        from: 'financiallogs',
                        let: { user_id: "$userId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$user", "$$user_id"] },
                                            { $eq: ["$financialtype", "withdraw"] },
                                        ]
                                    },
                                },
                            },
                            {
                                $project: { amount: 1 }
                            }
                        ],
                        as: 'withdraw',
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        let: { user_id: "$userId" },
                        pipeline: [
                            { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } },
                            { $project: { email: 1, balance: 1 } }
                        ],
                        as: 'userId',
                    }
                },
                {
                    $project: {
                        userId: 1,
                        createdAt: 1,
                        inplay: { $sum: "$inplaybets.bet" },
                        fee: { $sum: "$fees.amount" },
                        deposit: { $sum: "$deposit.amount" },
                        withdraw: { $sum: "$withdraw.amount" },
                    }
                },
                { $unwind: "$userId" },
                { $sort: { "createdAt": -1 } },
            ]);
            return res.json({ data: autobets });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false });
        }
    }
)

adminRouter.patch(
    '/autobet/:id',
    authenticateJWT,
    limitRoles('autobet'),
    async (req, res) => {
        const data = req.body;
        const { id } = req.params;
        try {
            const autobet = await AutoBet.findById(id)
            if (!autobet) {
                return res.status(404).json({ error: 'Can\'t find autobet data.' });
            }

            const existingCode = await Promotion.findOne({ name: new RegExp(`^${data.referral_code}$`, 'i') });
            if (existingCode) {
                return res.status(404).json({ error: 'Same Referral code already exists.' });
            }
            const existingInvite = await User.findOne({ username: new RegExp(`^${data.referral_code}$`, 'i') });
            if (existingInvite) {
                return res.status(404).json({ error: 'Same Referral code already exists.' });
            }
            const existingAffiliate = await Affiliate.findOne({ unique_id: new RegExp(`^${data.referral_code}$`, 'i') });
            if (existingAffiliate) {
                return res.status(404).json({ error: 'Cannot create Autobet. Same Referral code already exists.' });
            }

            await autobet.update(data);
            const result = await AutoBet
                .findById(id)
                .populate('userId', ['username', 'balance']);
            res.json(result);
        } catch (error) {
            return res.status(500).json({ error: 'Can\'t updated autobet.' });
        }
    }
)

adminRouter.delete(
    '/autobet/:id',
    authenticateJWT,
    limitRoles('autobet'),
    async (req, res) => {
        const { id } = req.params;
        try {
            const autobet = await AutoBet.findById(new ObjectId(id));
            if (!autobet) {
                return res.status(404).json({ error: 'Can\'t find autobet data.' });
            }
            await AutoBet.deleteOne({ _id: id });
            res.json("Deleted");
        } catch (error) {
            return res.status(500).json({ error: 'Can\'t delete autobet.' });
        }
    }
)


adminRouter.get(
    '/seacrhautobets',
    authenticateJWT,
    async (req, res) => {
        let { name } = req.query;

        try {
            let searchObj = {};
            if (name) {
                searchObj = {
                    ...searchObj,
                    ...{ email: { "$regex": name, "$options": "i" } }
                }


                AutoBet.find({})
                    .sort({ createdAt: -1 })
                    .populate({
                        path: 'userId',
                        match: searchObj,
                        select: ['username', 'balance', 'email', 'firstname', 'lastname']
                    })
                    .exec((error, data) => {
                        if (error) {
                            res.status(404).json({ error: 'Can\'t find autobet customers.' });
                            //res.status(404).json({ error });
                            return;
                        }

                        if (!data[0].userId) {
                            res.status(404).json({ error: 'Can\'t find autobet customers.' });
                            //res.status(404).json({ error });
                            return;
                        }

                        const result = data.map(autoBetUser => {
                            return {
                                value: autoBetUser._id,
                                label: `${autoBetUser.userId.email} (${autoBetUser.userId.firstname} ${autoBetUser.userId.lastname})`,
                                budget: autoBetUser.budget,
                                maxBudget: autoBetUser.maxBudget,
                                autoBetUserId: autoBetUser.userId,
                            }
                        })
                        res.status(200).json(result);
                    });
            }
        }
        catch (error) {
            res.status(500).json({ error: 'Can\'t find customers.', message: error });
        }
    }
)

adminRouter.post(
    '/promotion',
    authenticateJWT,
    limitRoles('promotions'),
    async (req, res) => {
        const data = req.body;
        try {
            const { name } = data;
            const existingAutobet = await AutoBet.findOne({ referral_code: new RegExp(`^${name}$`, 'i') });
            if (existingAutobet) {
                return res.status(400).json({ error: 'Can\'t create promotion. Already existing code.' });
            }
            await Promotion.create(data);
            res.json("Promotion created.");
        } catch (error) {
            return res.status(500).json({ error: 'Can\'t create promotion.' });
        }
    }
)

adminRouter.delete(
    '/promotion/:id',
    authenticateJWT,
    limitRoles('promotions'),
    async (req, res) => {
        const { id } = req.params;
        try {
            await Promotion.deleteMany({ _id: id });
            res.json({ success: true });
        } catch (error) {
            res.status(404).json({ error: 'Can\'t find promotion.' });
        }
    }
)

adminRouter.patch(
    '/promotion/:id',
    authenticateJWT,
    limitRoles('promotions'),
    async (req, res) => {
        const { id } = req.params;
        try {
            const promotion = await Promotion.findById(id);
            if (!promotion) {
                return res.status(404).json({ error: 'Can\'t find promotion.' });
            }
            await promotion.update(req.body);
            res.json({ success: true });
        } catch (error) {
            res.status(404).json({ error: 'Can\'t find promotion.' });
        }
    }
)

adminRouter.get(
    '/promotions',
    authenticateJWT,
    limitRoles('promotions'),
    async (req, res) => {
        let { page, perPage } = req.query;
        if (!perPage) perPage = 25;
        perPage = parseInt(perPage);
        if (!page) page = 1;
        page = parseInt(page);
        page--;
        try {
            const total = await Promotion.find({}).count();
            Promotion.find({})
                .sort({ createdAt: -1 })
                .skip(page * perPage)
                .limit(perPage)
                .exec((error, data) => {
                    if (error) {
                        res.status(404).json({ error: 'Can\'t find promotions.' });
                        return;
                    }
                    res.status(200).json({ total, perPage, page: page + 1, data });
                });
        } catch {
            res.status(500).json({ error: 'Can\'t find promotions.' });
        }
    }
)

adminRouter.get(
    '/promotion/:id',
    authenticateJWT,
    limitRoles('promotions'),
    async (req, res) => {
        const { id } = req.params;
        try {
            const promotion = await Promotion.findById(id);
            if (!promotion) {
                return res.status(404).json({ error: 'Can\'t find promotion.' });
            }
            const promotionlogs = await PromotionLog
                .find({ promotion: ObjectId(id) })
                .populate('user');
            const result = JSON.parse(JSON.stringify(promotion));
            result.promotionlogs = JSON.parse(JSON.stringify(promotionlogs));
            res.json(result);
        } catch (error) {
            res.status(404).json({ error: 'Can\'t find promotion.' });
        }
    }
)

adminRouter.post(
    '/promotions/banners',
    authenticateJWT,
    limitRoles('promotions'),
    fileUpload({
        limits: { fileSize: 50 * 1024 * 1024 },
        files: 1,
        abortOnLimit: true,
        limitHandler: (req, res, next) => {
            return res.status(400).json({ error: true, message: "Request Entity Too Large" })
        },
    }),
    async (req, res) => {
        try {
            const { files } = req;
            const { priority } = req.body;
            const ext = files.file.name.split('.').pop();
            const filename = 'whatsnew_' + dateformat(new Date(), "yyyy_mm_dd_HH_MM_ss.") + ext;
            files.file.mv('./banners/' + filename);
            let type = 'image';
            if (['m4v', 'mp4', 'avi'].includes(ext)) {
                type = 'video'
            }
            await PromotionBanner.create({ path: filename, priority: priority, type: type });
            return res.json({ success: true });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false });
        }
    }
)

adminRouter.get(
    '/promotions/banners',
    authenticateJWT,
    limitRoles('promotions'),
    async (req, res) => {
        try {
            const banners = await PromotionBanner.find();
            return res.json(banners);
        } catch (error) {
            console.error(error);
            return res.status(500).json(null);
        }
    }
)

adminRouter.delete(
    '/promotions/banners/:id',
    authenticateJWT,
    limitRoles('promotions'),
    async (req, res) => {
        try {
            const { id } = req.params;
            const banner = await PromotionBanner.findById(id);
            if (banner) {
                fs.unlink('./banners/' + banner.path, function () { });
            }
            await PromotionBanner.deleteMany({ _id: id });
            return res.json({ success: true });
        } catch (error) {
            console.error(error);
            return res.status(500).json(null);
        }
    }
)

adminRouter.put(
    '/promotions/banners/:id',
    authenticateJWT,
    limitRoles('promotions'),
    async (req, res) => {
        try {
            const { id } = req.params;
            const { priority } = req.body;
            const banner = await PromotionBanner.findById(id);
            if (banner) {
                await banner.update({ priority });
            }
            return res.json({ success: true });
        } catch (error) {
            console.error(error);
            return res.status(500).json(null);
        }
    }
)

adminRouter.get(
    '/verifications',
    authenticateJWT,
    limitRoles('kyc'),
    async (req, res) => {
        let { page, perPage } = req.query;
        if (!perPage) perPage = 25;
        perPage = parseInt(perPage);
        if (!page) page = 1;
        page = parseInt(page);
        page--;

        try {
            const total = await Verification.find().count();
            Verification.find()
                .sort({ createdAt: -1 })
                .skip(page * perPage)
                .limit(perPage)
                .populate('user', ['username', 'address', 'address2', 'city', 'postalcode', 'phone'])
                .exec((error, data) => {
                    if (error) {
                        res.status(404).json({ error: 'Can\'t find customers.' });
                        return;
                    }
                    data = data.filter(veri => veri.user).map(verification => {
                        return {
                            user_id: verification.user._id,
                            username: verification.user.username,
                            addressStr: verification.user.address,
                            city: verification.user.city,
                            postalcode: verification.user.postalcode,
                            phone: verification.user.phone,
                            address: verification.address ? {
                                name: verification.address.name,
                                submitted_at: verification.address.submitted_at
                            } : null,
                            identification: verification.identification ? {
                                name: verification.identification.name,
                                submitted_at: verification.identification.submitted_at
                            } : null,
                        }
                    });
                    res.status(200).json({ total, perPage, page: page + 1, data });
                });
        } catch {
            res.status(404).json({ error: 'Can\'t find verifications.' });
        }
    }
);

adminRouter.post(
    '/verification-image',
    authenticateJWT,
    limitRoles('kyc'),
    async (req, res) => {
        const { user_id, name } = req.body;
        try {
            const user = await User.findById(user_id);
            if (!user) {
                await Verification.deleteMany({ user: user._id });
                return res.status(404).send('User does not exist.');
            }
            if (user.roles.verified) {
                await Verification.deleteMany({ user: user._id });
                return res.status(400).send('User alread verified.');
            }
            let verification = await Verification.findOne({ user: user_id });
            if (!verification || !verification[name]) {
                return res.status(404).json({ success: 0, message: "Image not found" });
            }

            res.json(verification[name]);
        } catch {
            return res.status(400).send('Can\'t find image.');
        }
    }
)

adminRouter.post(
    '/verification-accept',
    authenticateJWT,
    limitRoles('kyc'),
    async (req, res) => {
        const { user_id } = req.body;
        try {
            const user = await User.findById(user_id);
            if (!user) {
                await Verification.deleteMany({ user: user._id });
                return res.status(404).send('User does not exist.');
            }
            if (user.roles.verified) {
                await Verification.deleteMany({ user: user._id });
                return res.status(400).send('User alread verified.');
            }
            user.roles = {
                ...user.roles,
                verified: true
            }
            await user.save();
            await Verification.deleteMany({ user: user._id });

            const preference = await Preference.findOne({ user: user._id });
            if (!preference || !preference.notification_settings || preference.notification_settings.other.email) {
                const msg = {
                    from: `${fromEmailName} <${fromEmailAddress}>`,
                    to: user.email,
                    subject: 'Your identify was verified!',
                    text: `Your identify was verified!`,
                    html: simpleresponsive(
                        `Hi <b>${user.email}</b>.
                        <br><br>
                        Just a quick reminder that your identify was verified. You can withdraw from your PAYPER WIN account by logging in now.
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
            if (user.roles.phone_verified && (!preference || !preference.notification_settings || preference.notification_settings.other.sms)) {
                sendSMS('Just a quick reminder that your identify was verified. You can withdraw from your PAYPER WIN account by logging in now.', user.phone);
            }

            res.send("User verified successfully.");
        } catch (error) {
            console.error("accept Error => ", error);
            res.status(400).send("Can't verify user.");
        }
    }
)

adminRouter.post(
    '/verification-decline',
    authenticateJWT,
    limitRoles('kyc'),
    async (req, res) => {
        const { user_id } = req.body;
        try {
            const user = await User.findById(user_id);
            if (!user) {
                await Verification.deleteMany({ user: user._id });
                return res.status(404).send('User does not exist.');
            }
            if (user.roles.verified) {
                await Verification.deleteMany({ user: user._id });
                return res.status(400).send('User alread verified.');
            }
            await Verification.deleteMany({ user: user._id });

            const preference = await Preference.findOne({ user: user._id });
            if (!preference || !preference.notification_settings || preference.notification_settings.other.email) {
                const msg = {
                    from: `${fromEmailName} <${fromEmailAddress}>`,
                    to: user.email,
                    subject: 'Your identify verification was declined!',
                    text: `Your identify verification was declined!`,
                    html: simpleresponsive(
                        `Hi <b>${user.email}</b>.
                        <br><br>
                        Just a quick reminder that Your identify verification was declined. Please submit identification proof documents again by logging in now.
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
            if (user.roles.phone_verified && (!preference || !preference.notification_settings || preference.notification_settings.other.sms)) {
                sendSMS('Just a quick reminder that Your identify verification was declined. Please submit identification proof documents again by logging in now.', user.phone);
            }

            res.send("User declined.");
        } catch (error) {
            console.error("declined Error => ", error);
            res.status(400).send("Can't decline user.");
        }
    }
)

adminRouter.get(
    '/tickets',
    authenticateJWT,
    limitRoles('support-tickets'),
    async (req, res) => {
        let { page, perPage, status } = req.query;
        if (!perPage) perPage = 25;
        perPage = parseInt(perPage);
        if (!page) page = 1;
        page = parseInt(page);
        page--;

        if (!status) status = 'all';

        try {
            let findObj = {};
            switch (status) {
                case 'new':
                    findObj = { repliedAt: null };
                    break;
                case 'replied':
                    findObj = { repliedAt: { "$ne": null } };
                    break;
                case 'all':
                default:
                    break;
            }
            const total = await Ticket.find(findObj).count();
            const tickets = await Ticket.find(findObj)
                .sort({ createdAt: -1 })
                .skip(page * perPage)
                .limit(perPage)
                .select(['email', 'subject', 'department', 'createdAt', 'repliedAt']);

            res.status(200).json({ total, perPage, page: page + 1, data: tickets });
        } catch (error) {
            console.error(error);
            res.status(404).json({ error: 'Can\'t find verifications.' });
        }
    }
);

adminRouter.get(
    '/ticket/:id',
    authenticateJWT,
    limitRoles('support-tickets'),
    async (req, res) => {
        let { id } = req.params;
        try {
            const ticket = await Ticket.findById(id);
            if (!ticket) {
                return res.status(404).json({ error: 'ticket not found' });
            }

            res.status(200).json(ticket);
        } catch (error) {
            res.status(404).json({ error: 'Can\'t find ticket.' });
        }
    }
);

adminRouter.post(
    '/replyticket/:id',
    authenticateJWT,
    limitRoles('support-tickets'),
    async (req, res) => {
        let { id } = req.params;
        try {
            const ticket = await Ticket.findById(id);
            if (!ticket) {
                return res.status(404).json({ error: 'Ticket not found.' });
            }

            if (ticket.repliedAt) {
                return res.status(400).json({ error: 'Already Replied.' });
            }

            const { title, subject, content } = req.body;
            if (!title || !subject || !content) {
                return res.status(400).json({ error: 'Please fill all the fields.' });
            }

            const msg = {
                from: `${fromEmailName} <${fromEmailAddress}>`,
                to: ticket.email,
                subject: subject,
                text: title,
                html: simpleresponsive(
                    `<h4>Hi <b>${ticket.email}</b>, we carefully checked your requirements.</h4>
                    <br><br>
                    ${content}
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

            ticket.repliedAt = new Date();
            await ticket.save();
            res.send({ message: 'success' });
        } catch (error) {
            res.status(404).json({ error: 'Can\'t find ticket.' });
        }
    }
)

adminRouter.delete(
    '/ticket/:id',
    authenticateJWT,
    limitRoles('support-tickets'),
    async (req, res) => {
        let { id } = req.params;
        try {
            await Ticket.deleteMany({ _id: id });
            res.json({ message: 'success' });
        } catch (error) {
            console.error(error);
            res.status(400).json({ error: 'Can\'t delete ticket.' });
        }
    }
);

adminRouter.get(
    '/faq-subjects',
    authenticateJWT,
    limitRoles('faq'),
    async (req, res) => {
        let { page, perPage } = req.query;
        if (!perPage) perPage = 25;
        perPage = parseInt(perPage);
        if (!page) page = 1;
        page = parseInt(page);
        page--;

        try {
            const total = await FAQSubject.find().count();
            const faq_subjects = await FAQSubject.find()
                .sort({ createdAt: 1 })
                .skip(page * perPage)
                .limit(perPage);

            res.json({ total, perPage, page: page + 1, data: faq_subjects });
        } catch (error) {
            res.status(404).json({ error: 'Can\'t find subjects.' });
        }
    }
)

adminRouter.get(
    '/faq-subjects/:id',
    authenticateJWT,
    limitRoles('faq'),
    async (req, res) => {
        const { id } = req.params;

        try {
            const faq_subject = await FAQSubject.findById(id)
                .populate('items');

            res.json(faq_subject);
        } catch (error) {
            res.status(404).json({ error: 'Can\'t find subjects.' });
        }
    }
)

adminRouter.post(
    '/faq-subjects',
    authenticateJWT,
    limitRoles('faq'),
    // bruteforce.prevent,
    async (req, res) => {
        const { title } = req.body;
        if (!title) {
            return res.json({ error: 'Title is required.' });
        }
        try {
            const exist = await FAQSubject.findOne({ title });
            if (exist) {
                return res.json({ error: 'Same title is already exists.' });
            }
            await FAQSubject.create({ title });
            res.json({ success: true });
        } catch {
            return res.status(400).json({ error: 'Can\'t create subject.' });
        }
    }
)

adminRouter.delete(
    '/faq-subjects/:id',
    authenticateJWT,
    limitRoles('faq'),
    // bruteforce.prevent,
    async (req, res) => {
        const { id } = req.params;
        try {
            await FAQSubject.deleteOne({ _id: id });
            await FAQItem.deleteMany({ subject: id });
            res.json({ success: true });
        } catch {
            return res.status(400).json({ error: 'Can\'t delete subject.' });
        }
    }
)

adminRouter.post(
    '/faq-subjects/:id/item',
    authenticateJWT,
    limitRoles('faq'),
    // bruteforce.prevent,
    async (req, res) => {
        const { id } = req.params;
        const { title, content } = req.body;
        try {
            const faq_subject = await FAQSubject.findById(id);
            if (!faq_subject) {
                return res.json({ error: 'Can\'t find Subject.' })
            }
            if (!title || !content) {
                return res.json({ error: 'Title and content fields are required.' })
            }
            const faq_item = await FAQItem.create({
                subject: id,
                title, content
            });

            await faq_subject.update({
                $push: {
                    items: faq_item._id,
                }
            });
            res.json({ success: true, faq_item });
        } catch {
            return res.status(400).json({ error: 'Can\'t add item.' });
        }
    }
)

adminRouter.delete(
    '/faq-subjects/:subjectid/item/:id',
    authenticateJWT,
    limitRoles('faq'),
    // bruteforce.prevent,
    async (req, res) => {
        const { subjectid, id } = req.params;
        try {
            const faq_subject = await FAQSubject.findById(subjectid);
            if (!faq_subject) {
                return res.json({ error: 'Can\'t find item.' })
            }
            const items = faq_subject.items.filter(item => item.toString() == id);
            faq_subject.items = items;
            await faq_subject.save();
            await FAQItem.deleteOne({ _id: id });
            res.json({ success: true });
        } catch (error) {
            console.error(error);
            return res.status(400).json({ error: 'Can\'t delete item.' });
        }
    }
)

adminRouter.put(
    '/faq-subjects/item/:id',
    authenticateJWT,
    limitRoles('faq'),
    // bruteforce.prevent,
    async (req, res) => {
        const { id } = req.params;
        const { title, content } = req.body;
        try {
            const faq_item = await FAQItem.findById(id);
            if (!faq_item) {
                return res.json({ error: 'Can\'t find Item.' })
            }
            if (!title || !content) {
                return res.json({ error: 'Title and Content fields are required.' });
            }
            faq_item.title = title;
            faq_item.content = content;
            await faq_item.save();
            res.json({ success: true });
        } catch (error) {
            console.error(error);
            return res.status(400).json({ error: 'Can\'t update item.' });
        }
    }
)

adminRouter.post(
    '/events/:id/settle',
    authenticateJWT,
    limitRoles('custom-events'),
    async (req, res) => {
        let { id } = req.params;
        try {
            const event = await Event.findById(id);
            if (!event) {
                return res.status(404).json({ error: 'Can\'t find events.' });
            }
            if ((new Date(event.endDate)).getTime() > (new Date()).getTime()) {
                return res.status(404).json({ error: 'Event is not confirmed yet.' });
            }
            if (event.status == EventStatus['settled'].value || event.status == EventStatus['cancelled'].value) {
                return res.status(404).json({ error: 'Event is already finished.' });
            }
            const { winner } = req.body;
            if (!!!winner) {
                return res.status(404).json({ error: 'You should choose the winner.' });
            }

            const bets = await Bet.find({ event: event._id });
            let lossAmount = 0, winAmount = 0;
            for (const bet of bets) {
                const user = await User.findById(bet.userId);
                if (bet.pick == Number(winner)) {
                    lossAmount += bet.toWin;
                    const betFee = bet.toWin * BetFee;
                    await bet.update({
                        status: 'Settled - Win',
                        credited: bet.bet + bet.toWin,
                        fee: betFee,
                    });
                    if (user) {
                        await user.update({ $inc: { balance: bet.bet + bet.toWin - betFee } });
                        const afterBalance = user.balance + bet.bet + bet.toWin;
                        await FinancialLog.create({
                            financialtype: 'betwon',
                            uniqid: `BW${ID()}`,
                            user: bet.userId,
                            betId: bet._id,
                            amount: bet.bet + bet.toWin,
                            method: 'betwon',
                            status: FinancialStatus.success,
                            beforeBalance: user.balance,
                            afterBalance: afterBalance
                        });
                        await FinancialLog.create({
                            financialtype: 'betfee',
                            uniqid: `BF${ID()}`,
                            user: bet.userId,
                            betId: bet._id,
                            amount: betFee,
                            method: 'betfee',
                            status: FinancialStatus.success,
                            beforeBalance: afterBalance,
                            afterBalance: afterBalance - betFee
                        });
                        sendBetWinConfirmEmail(user, bet);
                    }
                } else {
                    await bet.update({ status: 'Settled - Lose' });
                    winAmount += bet.bet;
                    if (user) {
                        sendBetLoseConfirmEmail(user, bet.bet)
                    }
                }
            }

            for (const participant of event.participants) {
                const user = await User.findById(participant.user);
                if (user) {
                    await FinancialLog.create({
                        financialtype: 'unlock_event',
                        uniqid: `ULE${ID()}`,
                        user: participant.user,
                        amount: participant.amount,
                        method: 'unlock_event',
                        status: FinancialStatus.success,
                        beforeBalance: user.balance,
                        afterBalance: user.balance + participant.amount
                    });

                    let beforeBalance = user.balance + participant.amount;
                    if (lossAmount > 0) {
                        const myLoss = lossAmount * participant.amount / event.maximumRisk;
                        await FinancialLog.create({
                            financialtype: 'lose_event',
                            uniqid: `LE${ID()}`,
                            user: participant.user,
                            amount: myLoss,
                            method: 'lose_event',
                            status: FinancialStatus.success,
                            beforeBalance: beforeBalance,
                            afterBalance: beforeBalance - myLoss
                        })
                        beforeBalance -= myLoss;
                    }
                    if (winAmount > 0) {
                        const myWin = winAmount * participant.amount / event.maximumRisk;
                        await FinancialLog.create({
                            financialtype: 'win_event',
                            uniqid: `WE${ID()}`,
                            user: participant.user,
                            amount: myWin,
                            method: 'win_event',
                            status: FinancialStatus.success,
                            beforeBalance: beforeBalance,
                            afterBalance: beforeBalance + myWin
                        })
                        beforeBalance += myWin;
                    }
                    await user.update({ balance: Number(beforeBalance.toFixed(2)) })
                }
            }
            await event.update({ status: EventStatus.settled.value })
            return res.json({ success: true });
        } catch (error) {
            console.error(error);
            return res.status(404).json({ error: 'Can\'t save events.' });
        }
    }
);

adminRouter.put(
    '/events/:id',
    authenticateJWT,
    limitRoles('custom-events'),
    async (req, res) => {
        let { id } = req.params;
        const { approved } = req.body;
        try {
            const event = await Event.findById(id);
            if (!event) {
                return res.status(404).json({ error: 'Can\'t find events.' });
            }
            if (approved != null || approved != undefined) {
                event.approved = approved;
            }
            await event.save();
            res.status(200).json({ success: true });
        } catch (error) {
            console.error(error);
            res.status(404).json({ error: 'Can\'t save events.' });
        }
    }
);


adminRouter.post(
    '/events/:id/cancel',
    authenticateJWT,
    limitRoles('custom-events'),
    async (req, res) => {
        let { id } = req.params;
        try {
            const event = await Event.findById(id);
            if (!event) {
                return res.status(404).json({ error: 'Can\'t find events.' });
            }
            if (event.status == EventStatus['settled'].value || event.status == EventStatus['cancelled'].value) {
                return res.status(404).json({ error: 'Event is already finished.' });
            }
            event.status = EventStatus.cancelled.value;
            await event.save();

            const bets = await Bet.find({
                "lineQuery.lineId": event.uniqueid,
                "lineQuery.sportName": 'Side Bet',
            });
            for (const bet of bets) {
                const user = await User.findById(bet.userId);
                await bet.update({ status: 'Cancelled' });
                if (user) {
                    await FinancialLog.create({
                        financialtype: 'betcancel',
                        uniqid: `BC${ID()}`,
                        user: bet.userId,
                        betId: bet._id,
                        amount: bet.bet,
                        method: 'betcancel',
                        status: FinancialStatus.success,
                        beforeBalance: user.balance,
                        afterBalance: user.balance + bet.bet
                    });
                    await user.update({ $inc: { balance: bet.bet } });
                }
            }

            for (const participant of event.participants) {
                const user = await User.findById(participant.user);
                if (user) {
                    await FinancialLog.create({
                        financialtype: 'unlock_event',
                        uniqid: `ULE${ID()}`,
                        user: participant.user,
                        amount: participant.amount,
                        method: 'unlock_event',
                        status: FinancialStatus.success,
                        beforeBalance: user.balance,
                        afterBalance: user.balance + participant.amount
                    });
                    await user.update({ $inc: { balance: participant.amount } });
                }
            }

            return res.status(200).json({ success: true });
        } catch (error) {
            console.error(error);
            res.status(404).json({ error: 'Can\'t save events.' });
        }
    }
);

adminRouter.get(
    '/events/:id',
    authenticateJWT,
    limitRoles('custom-events'),
    async (req, res) => {
        let { id } = req.params;

        try {
            const event = await Event.findOne({ _id: id })
                .populate('user');

            return res.json(event);
        } catch (error) {
            console.error(error);
            res.status(404).json({ error: 'Can\'t find event.' });
        }
    }
);

adminRouter.get(
    '/events',
    authenticateJWT,
    limitRoles('custom-events'),
    async (req, res) => {
        let { page, perPage, status } = req.query;
        if (!perPage) perPage = 25;
        perPage = parseInt(perPage);
        if (!page) page = 1;
        page = parseInt(page);
        page--;

        if (!status) status = 'all';
        try {
            let findObj = {};
            if (EventStatus[status]) {
                findObj = { ...findObj, status: EventStatus[status].value };
                if (status == FinancialStatus.pending) {
                    findObj = { ...findObj, startDate: { $gte: new Date() } };
                } else if (status == "outdated") {
                    findObj = { ...findObj, endDate: { $lt: new Date() } };
                }
            }
            const pending_total = await Event.find({ approved: false }).count();
            const total = await Event.find(findObj).count();
            const events = await Event.find(findObj)
                .sort({ createdAt: -1 })
                .skip(page * perPage)
                .limit(perPage)
                .populate('user');

            res.status(200).json({ total, perPage, page: page + 1, data: events, pending_total });
        } catch (error) {
            console.error(error);
            res.status(404).json({ error: 'Can\'t find events.' });
        }
    }
);

adminRouter.post(
    '/messages',
    authenticateJWT,
    limitRoles('messages'),
    async (req, res) => {
        const { type, publish, title, content } = req.body;
        if (publish) {
            const { is_greater_balance, greater_balance,
                is_last_online_before, last_online_before,
                is_last_online_after, last_online_after,
                is_wager_more, wager_more,
                is_user_from, user_from, } = req.body;
            let users = [];
            try {
                if (is_greater_balance) {
                    const users_balance = await User.find({ balance: { $gte: greater_balance } });
                    users = [...users_balance];
                }
                if (is_wager_more) {
                    const users_wager = await User.aggregate({
                        $lookup: {
                            from: 'bets',
                            localField: '_id',
                            foreignField: 'userId',
                            as: 'betHistory'
                        }
                    });
                    users_wager.forEach(user => {
                        if (user.betHistory.length < wager_more) return;
                        if (users.find(e_user => e_user._id == user._id)) return;
                        users.push(user);
                    })
                }
                if (is_user_from) {
                    const users_from = await User.find({ country: user_from });
                    users_from.forEach(user => {
                        if (users.find(e_user => e_user._id == user._id)) return;
                        users.push(user);
                    })
                }
                // if (is_last_online_before) {
                //     const online_before_login_log = await LoginLog
                //         .aggregate([
                //             {
                //                 $group: {
                //                     "_id": "$user",
                //                     createdAt: {
                //                         $max: '$createdAt',
                //                     }
                //                 }
                //             },
                //             {
                //                 $match: {
                //                     createdAt: {
                //                         $lte: new Date(last_online_before)
                //                     }
                //                 }
                //             },
                //             {
                //                 $lookup: {
                //                     from: "User",
                //                     localField: "user",
                //                     foreignField: "_id",
                //                     as: "user"
                //                 }
                //             }
                //         ])
                //     .find({ createdAt: { $lte: new Date(last_online_before) } })
                //     .populate('user');

                // }

                if (type == 'internal') {
                    await Message.create({
                        ...req.body,
                        published_at: new Date(),
                        userFor: users.map(user => user._id),
                    });
                } else {
                    users.map(user => {
                        const msg = {
                            from: `${fromEmailName} <${fromEmailAddress}>`,
                            to: user.email,
                            subject: title,
                            text: title,
                            html: simpleresponsive(content),
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

                    })
                }
                res.json({ success: true });
            } catch (error) {
                res.status(400).json({ success: false, error: error.toString() });
            }
        } else {
            try {
                await Message.create(req.body);
                res.json({ success: true });
            } catch (error) {
                res.status(400).json({ success: false, error: error.toString() });
            }
        }
    }
)

adminRouter.get(
    '/messages',
    authenticateJWT,
    limitRoles('messages'),
    async (req, res) => {
        let { perPage, page } = req.query;

        if (!perPage) perPage = 25;
        perPage = parseInt(perPage);
        if (!page) page = 1;
        page = parseInt(page);
        page--;

        const total = await Message.find({ published_at: null }).count();
        const messages = await Message.find({ published_at: null })
            .sort({ createdAt: -1 })
            .skip(page * perPage)
            .limit(perPage);

        res.json({ total, perPage, page: page + 1, data: messages });
    }
)

adminRouter.get(
    '/messages/:id',
    authenticateJWT,
    limitRoles('messages'),
    async (req, res) => {
        let { id } = req.params;

        const message = await Message.findOne({ _id: id, published_at: null })
        res.json(message);
    }
)

adminRouter.delete(
    '/messages/:id',
    authenticateJWT,
    limitRoles('messages'),
    async (req, res) => {
        let { id } = req.params;

        await Message.deleteMany({ _id: id, published_at: null })
        res.json({ success: true });
    }
)

adminRouter.put(
    '/messages/:id',
    authenticateJWT,
    limitRoles('messages'),
    async (req, res) => {
        let { id } = req.params;
        const data = req.body;

        const message = await Message.findOne({ _id: id, published_at: null })
        if (!message) {
            return res, status(404).json({ success: false });
        }
        const { type, publish, title, content } = req.body;
        if (publish) {
            const { is_greater_balance, greater_balance,
                is_last_online_before, last_online_before,
                is_last_online_after, last_online_after,
                is_wager_more, wager_more,
                is_user_from, user_from, } = req.body;
            let users = [];
            try {
                if (is_greater_balance) {
                    const users_balance = await User.find({ balance: { $gte: greater_balance } });
                    users = [...users_balance];
                }
                if (is_wager_more) {
                    const users_wager = await User.aggregate({
                        $lookup: {
                            from: 'bets',
                            localField: '_id',
                            foreignField: 'userId',
                            as: 'betHistory'
                        }
                    });
                    users_wager.forEach(user => {
                        if (user.betHistory.length < wager_more) return;
                        if (users.find(e_user => e_user._id == user._id)) return;
                        users.push(user);
                    })
                }
                if (is_user_from) {
                    const users_from = await User.find({ country: user_from });
                    users_from.forEach(user => {
                        if (users.find(e_user => e_user._id == user._id)) return;
                        users.push(user);
                    })
                }
                // if (is_last_online_before) {
                //     const online_before_login_log = await LoginLog
                //         .aggregate([
                //             {
                //                 $group: {
                //                     "_id": "$user",
                //                     createdAt: {
                //                         $max: '$createdAt',
                //                     }
                //                 }
                //             },
                //             {
                //                 $match: {
                //                     createdAt: {
                //                         $lte: new Date(last_online_before)
                //                     }
                //                 }
                //             },
                //             {
                //                 $lookup: {
                //                     from: "User",
                //                     localField: "user",
                //                     foreignField: "_id",
                //                     as: "user"
                //                 }
                //             }
                //         ])
                //     .find({ createdAt: { $lte: new Date(last_online_before) } })
                //     .populate('user');

                // }

                if (type == 'internal') {
                    await message.update({
                        ...req.body,
                        published_at: new Date(),
                        userFor: users.map(user => user._id),
                    });
                } else {
                    users.map(user => {
                        const msg = {
                            from: `${fromEmailName} <${fromEmailAddress}>`,
                            to: user.email,
                            subject: title,
                            text: title,
                            html: simpleresponsive(content),
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

                    })
                }
                res.json({ success: true });
            } catch (error) {
                res.status(400).json({ success: false, error: error.toString() });
            }
        } else {
            try {
                await message.update(req.body);
                res.json({ success: true });
            } catch (error) {
                res.status(400).json({ success: false, error: error.toString() });
            }
        }
    }
)

adminRouter.get(
    '/active-user',
    authenticateJWT,
    limitRoles('reports'),
    async (req, res) => {
        let { count } = req.query;
        if (!count) count = 20;
        count = parseInt(count);
        let data = await User.aggregate([
            {
                $lookup: {
                    from: 'bets',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'betHistory'
                }
            },
            {
                "$project": {
                    "username": 1,
                    "email": 1,
                    "betHistory": 1,
                    "total_bets": { "$size": "$betHistory" }
                }
            },
            { "$sort": { "total_bets": -1 } },
            { "$limit": count },
        ])
        data = await Bet.populate(data, { path: "betHistory" });
        data = data.map(data => {
            let win = 0, loss = 0;
            data.betHistory.forEach(bet => {
                if (bet.status == 'Settled - Lose') {
                    loss += bet.bet;
                    return;
                } else if (bet.status == 'Settled - Win') {
                    win += bet.payableToWin;
                    return;
                }
            });
            return {
                username: data.username,
                email: data.email,
                total_bets: data.total_bets,
                win: '$' + Number(win).toFixed(2),
                loss: '$' + Number(loss).toFixed(2),
                res: win >= loss ? ('$' + Number(win - loss).toFixed(2)) : ('- $' + Number(loss - win).toFixed(2))
            }
        })
        res.json(data);
    }
)

adminRouter.get(
    '/active-user-csv',
    authenticateJWT,
    limitRoles('reports'),
    async (req, res) => {
        let { count } = req.query;
        if (!count) count = 20;
        count = parseInt(count);
        let data = await User.aggregate([
            {
                $lookup: {
                    from: 'bets',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'betHistory'
                }
            },
            {
                "$project": {
                    "username": 1,
                    "email": 1,
                    "betHistory": 1,
                    "total_bets": { "$size": "$betHistory" }
                }
            },
            { "$sort": { "total_bets": -1 } },
            { "$limit": count },
        ])
        data = await Bet.populate(data, { path: "betHistory" });
        let csvData = [
            ['Name', 'Email', '# of Bets', 'Win', 'Loss', 'Net']
        ]
        data = data.map(data => {
            let win = 0, loss = 0;
            data.betHistory.forEach(bet => {
                if (bet.status == 'Settled - Lose') {
                    loss += bet.bet;
                    return;
                } else if (bet.status == 'Settled - Win') {
                    win += bet.payableToWin;
                    return;
                }
            });
            csvData.push([
                data.username,
                data.email,
                data.total_bets,
                '$' + Number(win).toFixed(2),
                '$' + Number(loss).toFixed(2),
                win >= loss ? ('$' + Number(win - loss).toFixed(2)) : ('- $' + Number(loss - win).toFixed(2))
            ])
        })
        res.json(csvData);
    }
)

adminRouter.get(
    '/meta/:title',
    authenticateJWT,
    limitRoles('page-metas'),
    async (req, res) => {
        const { title } = req.params;
        const meta_tag = await MetaTag.findOne({ pageTitle: title });
        res.json(meta_tag);
    }
);

adminRouter.put(
    '/meta/:title',
    authenticateJWT,
    limitRoles('page-metas'),
    async (req, res) => {
        const { title } = req.params;
        const data = req.body;
        const meta_tag = await MetaTag.findOne({ pageTitle: title });
        try {
            if (meta_tag) {
                await meta_tag.update(data);
            } else {
                await MetaTag.create({
                    pageTitle: title,
                    ...data
                });
            }
            res.json({ success: true });
        } catch (error) {
            console.error(error);
            res.status(500).json("Can't save meta data.");
        }
    }
);

adminRouter.get(
    '/addons/:name',
    authenticateJWT,
    limitRoles('api-settings'),
    async (req, res) => {
        const { name } = req.params;
        const addon = await Addon.findOne({ name });
        res.json(addon);
    }
)

adminRouter.put(
    '/addons/:name',
    authenticateJWT,
    limitRoles('api-settings'),
    async (req, res) => {
        const { name } = req.params;
        const data = req.body;
        const addon = await Addon.findOne({ name });
        try {
            if (addon) {
                await addon.update({ value: data });
            } else {
                await Addon.create({ name, value: data });
            }
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ success: false, });
        }
    }
)

adminRouter.get(
    '/articles/categories',
    authenticateJWT,
    limitRoles('articles'),
    async (req, res) => {
        const categories = await ArticleCategory.find().sort({ createdAt: -1 });
        res.json(categories);
    }
)

adminRouter.post(
    '/articles/categories',
    authenticateJWT,
    limitRoles('articles'),
    async (req, res) => {
        const data = req.body;
        try {
            await ArticleCategory.create(data);
            res.json({ success: true });
        } catch (error) {
            res.status(400).json({ success: false });
        }
    }
)

adminRouter.delete(
    '/articles/categories/:id',
    authenticateJWT,
    limitRoles('articles'),
    async (req, res) => {
        const { id } = req.params;
        try {
            await ArticleCategory.deleteOne({ _id: id });
            res.json({ success: true });
        } catch (error) {
            console.error(error);
            res.status(400).json({ success: false });
        }
    }
)

adminRouter.get(
    '/articles/searchcategories',
    authenticateJWT,
    limitRoles('articles'),
    async (req, res) => {
        const { name } = req.query;
        const categories = await ArticleCategory.find({ title: { "$regex": name, "$options": "i" } });
        res.json(categories.map(category => ({ label: category.title, value: category.title })));
    }
)


adminRouter.get(
    '/articles/authors',
    authenticateJWT,
    limitRoles('articles'),
    async (req, res) => {
        const authors = await ArticleAuthor.find().sort({ createdAt: -1 });
        res.json(authors);
    }
)

adminRouter.post(
    '/articles/authors',
    authenticateJWT,
    limitRoles('articles'),
    async (req, res) => {
        const data = req.body;
        try {
            await ArticleAuthor.create(data);
            res.json({ success: true });
        } catch (error) {
            res.status(400).json({ success: false });
        }
    }
)

adminRouter.delete(
    '/articles/authors/:id',
    authenticateJWT,
    limitRoles('articles'),
    async (req, res) => {
        const { id } = req.params;
        try {
            await ArticleAuthor.deleteOne({ _id: id });
            res.json({ success: true });
        } catch (error) {
            console.error(error);
            res.status(400).json({ success: false });
        }
    }
)

adminRouter.get(
    '/articles/searchauthors',
    authenticateJWT,
    limitRoles('articles'),
    async (req, res) => {
        const { name } = req.query;
        const authors = await ArticleAuthor.find({ name: { "$regex": name, "$options": "i" } });
        res.json(authors.map(author => ({ label: author.name, value: author.logo })));
    }
)

adminRouter.get(
    '/articles',
    authenticateJWT,
    limitRoles('articles'),
    async (req, res) => {
        try {
            let { perPage, page, status } = req.query;

            if (!perPage) perPage = 25;
            perPage = parseInt(perPage);
            if (!page) page = 1;
            page = parseInt(page);
            page--;

            if (!status) status = 'all';

            let searchObj = {};
            switch (status) {
                case 'draft':
                    searchObj = { published_at: null };
                    break;
                case 'published':
                    searchObj = { published_at: { $ne: null } };
                    break;
                case 'all':
                default:
            }

            const total = await Article.find(searchObj).count();
            const articles = await Article.find(searchObj).sort({ createdAt: 1 })
                .skip(page * perPage)
                .limit(perPage);
            res.json({ total, perPage, page: page + 1, data: articles });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false });
        }
    }
)

adminRouter.post(
    '/articles',
    authenticateJWT,
    limitRoles('articles'),
    async (req, res) => {
        try {
            const data = req.body;
            const logoImage = data.logo;
            if (logoImage.startsWith('data:image/')) {
                const base64Data = logoImage.replace(/^data:image\/png;base64,/, "");
                const filename = 'article_' + dateformat(new Date(), "yyyy_mm_dd_HH_MM_ss.") + "png";
                fs.writeFile(`./banners/${filename}`, base64Data, 'base64', async function (error) {
                    if (error) {
                        console.error(error);
                        return res.status(500).json({ success: false });
                    }
                    let articleObj = {
                        ...data,
                        published_at: data.publish ? new Date() : null,
                        logo: `/static/${filename}`
                    };
                    try {
                        await Article.create(articleObj);
                        res.json({ success: true });
                    } catch (error) {
                        console.error(error);
                        res.status(500).json({ success: false });
                    }
                });
                return;
            }
            let articleObj = {
                ...data,
                published_at: data.publish ? new Date() : null
            };
            delete articleObj.publish;

            await Article.create(articleObj);
            res.json({ success: true });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false });
        }
    }
)

adminRouter.get(
    '/articles/:id',
    authenticateJWT,
    limitRoles('articles'),
    async (req, res) => {
        try {
            const { id } = req.params;
            const article = await Article.findById(id);
            res.json(article);
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false });
        }
    }
)

adminRouter.put(
    '/articles/:id',
    authenticateJWT,
    limitRoles('articles'),
    async (req, res) => {
        try {
            const { id } = req.params;
            const article = await Article.findById(id);
            if (!article) {
                return res.status(404).json({ success: false });
            }
            const data = req.body;
            const logoImage = data.logo;
            if (logoImage.startsWith('data:image/')) {
                const base64Data = logoImage.replace(/^data:image\/png;base64,/, "");
                const filename = 'article_' + dateformat(new Date(), "yyyy_mm_dd_HH_MM_ss.") + "png";
                fs.writeFile(`./banners/${filename}`, base64Data, 'base64', async function (error) {
                    if (error) {
                        console.error(error);
                        return res.status(500).json({ success: false });
                    }
                    try {
                        let articleObj = {
                            ...data,
                            published_at: data.publish ? new Date() : null,
                            logo: `/static/${filename}`
                        };
                        await Article.findByIdAndUpdate(id, articleObj);
                        res.json({ success: true });
                    } catch (error) {
                        console.error(error);
                        res.status(500).json({ success: false });
                    }
                });
                if (article.logo.startsWith('/banners')) {
                    fs.unlink(`.${article.logo}`, function () { })
                }
                return;
            }
            let articleObj = {
                ...data,
                published_at: data.publish ? new Date() : null
            };
            delete articleObj.publish;
            await Article.findByIdAndUpdate(id, articleObj);
            res.json({ success: true });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false });
        }
    }
)

adminRouter.delete(
    '/articles/:id',
    authenticateJWT,
    limitRoles('articles'),
    async (req, res) => {
        const { id } = req.params;
        try {
            await Article.deleteOne({ _id: id });
            res.json({ success: true });
        } catch (error) {
            console.error(error);
            res.status(400).json({ success: false });
        }
    }
)

adminRouter.get(
    '/frontend/:name',
    authenticateJWT,
    limitRoles('frontend'),
    async (req, res) => {
        const { name } = req.params;
        const frontend = await Frontend.findOne({ name: name });
        res.json(frontend);
    }
)

adminRouter.put(
    '/frontend/:name',
    authenticateJWT,
    limitRoles('frontend'),
    fileUpload({
        limits: { fileSize: 50 * 1024 * 1024 },
        files: 1,
        abortOnLimit: true,
        limitHandler: (req, res, next) => {
            return res.status(400).json({ error: true, message: "Request Entity Too Large" })
        },
    }),
    async (req, res) => {
        const { name } = req.params;
        const value = req.body;
        if (name == 'banner') {
            const { files } = req;
            if (files && files.file) {
                const ext = files.file.name.split('.').pop();
                const filename = 'frontend_banner_' + dateformat(new Date(), "yyyy_mm_dd_HH_MM_ss.") + ext;
                files.file.mv('./banners/' + filename);
                value.path = filename;
                value.clicked = 0;
            }
        }
        try {
            const frontend = await Frontend.findOne({ name: name });
            if (!frontend) {
                await Frontend.create({ name: name, value: value });
            } else {
                await frontend.update({ value: value });
            }
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ success: false })
        }
    }
)

adminRouter.post(
    '/frontend/banner',
    authenticateJWT,
    limitRoles('frontend'),
    fileUpload({
        limits: { fileSize: 50 * 1024 * 1024 },
        files: 1,
        abortOnLimit: true,
        limitHandler: (req, res, next) => {
            return res.status(400).json({ error: true, message: "Request Entity Too Large" })
        },
    }),
    async (req, res) => {
        try {
            const { files } = req;
            const { show } = req.body;
            const ext = files.file.name.split('.').pop();
            const filename = 'frontend_banner_' + dateformat(new Date(), "yyyy_mm_dd_HH_MM_ss.") + ext;
            files.file.mv('./banners/' + filename);
            await FrontendBanner.create({ path: filename, show: show });
            return res.json({ success: true });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false });
        }
    }
)

adminRouter.get(
    '/frontend/banner',
    authenticateJWT,
    limitRoles('frontend'),
    async (req, res) => {
        try {
            const banner = await FrontendBanner.find();
            return res.json(banner);
        } catch (error) {
            console.error(error);
            return res.status(500).json(null);
        }
    }
)

adminRouter.post(
    '/change-password',
    authenticateJWT,
    async (req, res) => {
        const { oldPassword, password } = req.body;
        const admin = await Admin.findById(req.user._id);
        if (!admin) {
            return res.status(403).json({ error: 'Can\'t find user.' });
        }
        const validPassword = await admin.validPassword(oldPassword);
        if (validPassword) {
            admin.password = password;
            await admin.save();
            return res.json({ success: true });
        } else {
            return res.json({ error: 'Password doesn\'t match' });
        }
    }
)

adminRouter.get(
    '/admins',
    authenticateJWT,
    limitRoles('admins'),
    async (req, res) => {
        try {
            let { perPage, page, role } = req.query;

            if (!perPage) perPage = 25;
            perPage = parseInt(perPage);
            if (!page) page = 1;
            page = parseInt(page);
            page--;

            if (!role) role = 'all';

            let searchObj = {};
            switch (role) {
                case 'super_admin':
                    searchObj = { role: 'Super Admin' };
                    break;
                case 'customer_service':
                    searchObj = { role: 'Customer Service' };
                    break;
                case 'all':
                default:
            }

            const total = await Admin.find(searchObj).count();
            const admins = await Admin.find(searchObj).sort({ createdAt: 1 })
                .skip(page * perPage)
                .limit(perPage);
            res.json({ total, perPage, page: page + 1, data: admins });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false });
        }
    }
)

adminRouter.post(
    '/admins',
    authenticateJWT,
    limitRoles('admins'),
    async (req, res) => {
        const { email, password, username, role } = req.body;
        try {
            await Admin.create({ email, password, username, role });
            res.status(200).json("Admin created");
            return;
        } catch (error) {
            res.status(400).json({
                error,
                message: "Admin creation failed. Please try with new credentials."
            });
            return;
        }
    },
);

adminRouter.get(
    '/admins/:id',
    authenticateJWT,
    limitRoles('admins'),
    async (req, res) => {
        const { id } = req.params;
        try {
            const admin = await Admin.findById(id);
            res.status(200).json(admin);
            return;
        } catch (error) {
            res.status(400).json({
                error,
                message: "Admin get failed. Please try with new credentials."
            });
            return;
        }
    },
);

adminRouter.put(
    '/admins/:id',
    authenticateJWT,
    limitRoles('admins'),
    async (req, res) => {
        const { id } = req.params;
        let data = req.body;
        try {
            const admin = await Admin.findById(id);
            if (!admin) {
                return res.status(404).json({
                    message: "Can't find admin info."
                });
            }
            if (!data.password) {
                delete data.password;
            }
            Object.keys(data).map(key => {
                admin[key] = data[key];
            })
            await admin.save();
            return res.json({ success: true });
        } catch (error) {
            console.error(error);
            res.status(400).json({
                message: "Admin update failed. Please try with new credentials."
            });
            return;
        }
    },
);

adminRouter.get(
    '/cashback',
    authenticateJWT,
    limitRoles('cashback'),
    async (req, res) => {
        try {
            let { page, year, month, perPage } = req.query;

            if (!perPage) perPage = 25;
            perPage = parseInt(perPage);
            if (!page) page = 1;
            page = parseInt(page);
            page--;
            const today = new Date();
            const thisYear = today.getFullYear();
            const thisMonth = today.getMonth();
            if (!year) year = thisYear;
            if (!month) month = thisMonth;
            if (year == thisYear && month == thisMonth) {
                res.json({ total: 0, perPage, page: 1, data: [] })
            } else {
                let searchObj = {
                    financialtype: 'cashback',
                    note: `${year}:${parseInt(month) + 1}`,
                };

                const total = await FinancialLog.find(searchObj).count();
                const cashback = await FinancialLog.find(searchObj).sort({ createdAt: 1 })
                    .skip(page * perPage)
                    .limit(perPage)
                    .populate('user', ['username', 'email']);
                res.json({ total, perPage, page: page + 1, data: cashback });
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false });
        }
    }
)

adminRouter.get(
    '/cashback/:user_id/:year/:month',
    authenticateJWT,
    limitRoles('cashback'),
    async (req, res) => {
        try {
            const { user_id, year, month } = req.params;

            const history = await Bet.find({
                status: "Settled - Lose",
                userId: user_id,
                createdAt: {
                    $gte: new Date(year, month - 1, 0),
                    $lte: new Date(year, month, 0),
                }
            });
            const user = await User.findById(user_id);
            res.json({ history: history, user });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false });
        }
    }
)

adminRouter.get(
    '/profits',
    authenticateJWT,
    limitRoles('reports'),
    async (req, res) => {
        let { datefrom, dateto, type, page, perPage } = req.query;
        try {
            if (!perPage) perPage = 25;
            perPage = parseInt(perPage);
            if (!page) page = 1;
            page = parseInt(page);
            page--;

            let searchObj = {
                status: FinancialStatus.success
            };
            if (datefrom) {
                searchObj.createdAt = {
                    $gte: new Date(datefrom)
                }
            }
            if (dateto) {
                if (datefrom) {
                    searchObj.createdAt = {
                        ...searchObj.createdAt,
                        $lte: new Date(dateto),
                    }
                }
            }
            switch (type) {
                case 'betfee':
                    searchObj.financialtype = 'betfee';
                    break;
                case 'withdrawfee':
                    searchObj.financialtype = 'withdrawfee';
                    break;
                case 'all':
                default:
                    searchObj.financialtype = {
                        $in: ['betfee', 'withdrawfee']
                    };
                    break;
            }

            const total = await FinancialLog.find(searchObj).count();
            const profits = await FinancialLog.find(searchObj).sort({ updatedAt: -1 })
                .skip(page * perPage)
                .limit(perPage)
                .populate('user', ['email']);
            res.json({ total, perPage, page: page + 1, data: profits });

        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false });
        }
    }
)

adminRouter.get(
    '/profits-csv',
    authenticateJWT,
    limitRoles('reports'),
    async (req, res) => {
        let { datefrom, dateto, type } = req.query;
        try {
            let searchObj = {
                status: FinancialStatus.success
            };
            if (datefrom) {
                searchObj.createdAt = {
                    $gte: new Date(datefrom)
                }
            }
            if (dateto) {
                if (datefrom) {
                    searchObj.createdAt = {
                        ...searchObj.createdAt,
                        $lte: new Date(dateto),
                    }
                }
            }
            switch (type) {
                case 'betfee':
                    searchObj.financialtype = 'betfee';
                    break;
                case 'withdrawfee':
                    searchObj.financialtype = 'withdrawfee';
                    break;
                case 'all':
                default:
                    searchObj.financialtype = {
                        $in: ['betfee', 'withdrawfee']
                    };
                    break;
            }

            const profits = await FinancialLog.find(searchObj).sort({ updatedAt: -1 })
                .populate('user', ['email']);
            let csvbody = [['#', 'Date', 'User', 'Event', 'TransactionID', 'Fee']];
            profits.forEach((record, index) => {
                csvbody.push([
                    index + 1,
                    dateformat(record.updatedAt, "default"),
                    record.user.email,
                    record.financialtype == 'betfee' ? 'Winning Bet Fee' : 'Withdrawal Fee',
                    record.uniqid,
                    `$${Number(record.amount).toFixed(2)}`,
                ]);
            })
            res.send(csvbody);
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false });
        }
    }
)

adminRouter.get(
    '/errorlogs',
    authenticateJWT,
    limitRoles('errorlogs'),
    async (req, res) => {
        let { page, perPage, name } = req.query;
        if (!perPage) perPage = 25;
        perPage = parseInt(perPage);
        if (!page) page = 1;
        page--;

        let searchObj = {};
        if (name) searchObj.name = name;

        try {
            const errorlogs = await ErrorLog.aggregate(
                [
                    {
                        $match: searchObj
                    },
                    {
                        $group: {
                            _id: "$error.stack",
                            createdAt: { "$first": "$createdAt" },
                            stack: { "$first": "$error.stack" },
                            name: { "$first": "$name" },
                            id: { "$first": "$_id" }
                        }
                    },
                    { $sort: { createdAt: -1 } },
                    { $skip: page * perPage },
                    { $limit: perPage },
                ]);

            let total = await ErrorLog.aggregate(
                [
                    {
                        $match: searchObj
                    },
                    {
                        $group: {
                            _id: "$error.stack",
                        }
                    },
                    {
                        $count: "total"
                    }
                ]
            );
            if (total.length) total = total[0].total;
            else total = 0;
            res.json({ data: errorlogs, total: total });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false });
        }
    }
)

adminRouter.delete(
    '/errorlogs/:id',
    authenticateJWT,
    limitRoles('errorlogs'),
    async (req, res) => {
        const { id } = req.params;
        try {
            const errorlog = await ErrorLog.findById(id);
            if (!errorlog) {
                return res.status(404).json({ success: false, error: 'Log not found' });
            }
            await ErrorLog.deleteMany({
                name: errorlog.name,
                "error.stack": errorlog.error.stack
            })
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ success: false });
        }
    }
)

const placeAutoBet = async (betId, autoBetUserID, toWin) => {
    try {
        const id = betId;
        const betAmout = toWin;

        const bet = await Bet.findById(id);

        if (bet.isParlay) {
            const {
                parlayQuery,
                pickOdds: parlayOdds,
                bet: totalStake,
                toWin: totalWin,
                matchStartDate,
            } = bet;
            let betpool = await ParlayBetPool.findOne({
                $or: [
                    { homeBets: bet._id },
                    { awayBets: bet._id },
                    { drawBets: bet._id },
                    { nonDrawBets: bet._id },
                ],
            });
            if (!betpool) {
                betpool = await ParlayBetPool.create({
                    parlayQuery: parlayQuery,
                    teamA: {
                        odds: parlayOdds,
                        betTotal: totalStake,
                        toWinTotal: totalWin,
                    },
                    teamB: {
                        odds: -Number(parlayOdds),
                        betTotal: 0,
                        toWinTotal: 0,
                    },
                    matchStartDate: matchStartDate,
                    homeBets: [bet._id],
                    awayBets: [],
                    origin: bet.origin,
                });
            }

            const user = await User.findById(autoBetUserID);
            if (!user) {
                return res.json({ success: false, error: "User not found." });
            }
            const amount = Number(betAmout);
            if (amount > user.balance) {
                return res.json({ success: false, error: "Insufficient Funds." });
            }

            const pick = "away";
            const newLineOdds = -Number(parlayOdds);
            const betAfterFee = amount;
            const toWin = calculateToWinFromBet(betAfterFee, newLineOdds);
            const fee = Number((betAfterFee * BetFee).toFixed(2));
            const bet_id = ID();

            const newBet = await Bet.create({
                userId: user._id,
                pick: "away",
                pickName: "Parlay Bet",
                pickOdds: newLineOdds,
                oldOdds: newLineOdds,
                bet: betAfterFee,
                toWin: toWin,
                fee: fee,
                matchStartDate: matchStartDate,
                status: "Pending",
                matchingStatus: "Pending",
                transactionID: `B${bet_id}`,
                origin: bet.origin,
                isParlay: true,
                parlayQuery: parlayQuery,
            });

            await FinancialLog.create({
                financialtype: "bet",
                uniqid: `BP${bet_id}`,
                user: user._id,
                amount: betAfterFee,
                method: "bet",
                status: FinancialStatus.success,
                beforeBalance: user.balance,
                afterBalance: user.balance - amount
            });
            await LoyaltyLog.create({
                user: user._id,
                point: betAfterFee * loyaltyPerBet,
            });

            const docChanges = {
                $push:
                    pick === "home" ? { homeBets: newBet._id } : { awayBets: newBet._id },
                $inc: {
                    "teamB.betTotal": betAfterFee,
                    "teamB.toWinTotal": toWin,
                },
            };
            await betpool.update(docChanges);
            await user.update({ $inc: { balance: -amount } });

            await calculateParlayBetsStatus(betpool._id);
        } else {
            const lineQuery = bet.lineQuery;
            const linePoints = lineQuery.points ? lineQuery.points : getLinePoints(bet.pickName, bet.pick, lineQuery);

            let betpool = await BetPool.findOne({
                $or: [
                    { homeBets: bet._id },
                    { awayBets: bet._id },
                    { drawBets: bet._id },
                    { nonDrawBets: bet._id },
                ],
            });
            if (!betpool) {
                betpool = await BetPool.create({
                    uid: JSON.stringify(lineQuery),
                    sportId: lineQuery.sportId,
                    leagueId: lineQuery.leagueId,
                    eventId: lineQuery.eventId,
                    lineId: lineQuery.lineId,
                    teamA: {
                        name: bet.teamA.name,
                        odds: bet.teamA.odds,
                        betTotal: bet.pick === "home" ? bet.bet : 0,
                        toWinTotal: bet.pick === "home" ? bet.toWin : 0,
                    },
                    teamB: {
                        name: bet.teamB.name,
                        odds: bet.teamB.odds,
                        betTotal: bet.pick === "away" ? bet.bet : 0,
                        toWinTotal: bet.pick === "away" ? bet.toWin : 0,
                    },
                    teamDraw: {
                        name: `Draw ${bet.teamA.name} vs ${bet.teamB.name}`,
                        odds: bet.teamDraw && bet.teamDraw.odds ? bet.teamDraw.odds : 0,
                        betTotal: bet.pick === "draw" ? bet.bet : 0,
                        toWinTotal: bet.pick === "draw" ? bet.toWin : 0,
                    },
                    teamNonDraw: {
                        name: `Non Draw ${bet.teamA.name} vs ${bet.teamB.name}`,
                        odds: bet.teamNonDraw && bet.teamNonDraw.odds ? bet.teamNonDraw.odds : 0,
                        betTotal: bet.pick === "nondraw" ? bet.bet : 0,
                        toWinTotal: bet.pick === "nondraw" ? bet.toWin : 0,
                    },
                    sportName: lineQuery.sportName,
                    matchStartDate: bet.matchStartDate,
                    lineType: lineQuery.type,
                    lineSubType: lineQuery.subtype,
                    points: linePoints,
                    homeBets: bet.pick === "home" ? [bet._id] : [],
                    awayBets: bet.pick === "away" ? [bet._id] : [],
                    origin: bet.origin,
                });
            }

            const user = await User.findById(autoBetUserID);
            if (!user) {
                //return res.json({ success: false, error: "User not found." });
            }
            const amount = Number(betAmout);
            if (amount > user.balance) {
                //return res.json({ success: false, error: "Insufficient Funds." });
            }

            let pick;
            switch (bet.pick) {
                case "home":
                    pick = "away"
                    break;
                case "draw":
                    pick = "nondraw"
                    break;
                default:
                    pick = "home"
                    break;
            }
            let newLineOdds = calculateNewOdds(Number(bet.teamA.odds), Number(bet.teamB.odds), pick, lineQuery.type, lineQuery.subtype);
            if (bet.sportsbook) {
                switch (pick) {
                    case "home":
                        newLineOdds = --Number(bet.teamB.odds)
                        break;
                    case "draw":
                        newLineOdds = Number(bet.teamDraw.odds);
                        break;
                    case "nondraw":
                        newLineOdds = -Number(bet.teamDraw.odds);
                        break;
                    case 'away':
                    default:
                        newLineOdds = -Number(bet.teamA.odds);
                        break;
                }
            }
            const betAfterFee = amount;
            const toWin = calculateToWinFromBet(betAfterFee, newLineOdds);
            const fee = bet.sportsbook
                ? 0
                : Number((betAfterFee * BetFee).toFixed(2));

            let pickName = "";
            switch (bet.lineQuery.subtype) {
                case "first_half":
                    pickName += "1st Half: ";
                    break;
                case "second_half":
                    pickName += "2nd Half: ";
                    break;
                case "first_quarter":
                    pickName += "1st Quarter: ";
                    break;
                case "second_quarter":
                    pickName += "2nd Quarter: ";
                    break;
                case "third_quarter":
                    pickName += "3rd Quarter: ";
                    break;
                case "forth_quarter":
                    pickName += "4th Quarter: ";
                    break;
                default:
                    pickName += "Pick: ";
                    break;
            }
            switch (bet.lineQuery.type) {
                case "total":
                case "alternative_total":
                    if (pick == "home") {
                        pickName += `Over ${linePoints}`;
                    } else {
                        pickName += `Under ${linePoints}`;
                    }
                    break;
                case "home_total":
                    if (pick == "home") {
                        pickName += `${bet.teamA.name} Over ${linePoints}`;
                    } else {
                        pickName += `${bet.teamA.name} Under ${linePoints}`;
                    }
                    break;
                case "away_total":
                    if (pick == "home") {
                        pickName += `${bet.teamB.name} Over ${linePoints}`;
                    } else {
                        pickName += `${bet.teamB.name} Under ${linePoints}`;
                    }
                    break;
                case "spread":
                case "alternative_spread":
                    if (pick == "home") {
                        pickName += `${bet.teamA.name} ${linePoints > 0 ? "+" : ""
                            }${linePoints}`;
                    } else {
                        pickName += `${bet.teamB.name} ${-1 * linePoints > 0 ? "+" : ""}${-1 * linePoints
                            }`;
                    }
                    break;
                case 'moneyline':
                    if (pick == 'home') {
                        pickName += bet.teamA.name;
                    }
                    else if (pick == 'draw') {
                        pickName += "Draw";
                    }
                    else if (pick == 'nondraw') {
                        pickName += "Non Draw";
                    } else {
                        pickName += bet.teamB.name;
                    }
                    break;
                default:
                    break;
            }

            const bet_id = ID();
            const newBet = await Bet.create({
                userId: user._id,
                transactionID: `B${bet_id}`,
                teamA: bet.teamA,
                teamB: bet.teamB,
                teamDraw: bet.teamDraw,
                teamNonDraw: bet.teamNonDraw,
                pick: pick,
                pickOdds: newLineOdds,
                oldOdds: pick == "home" ? bet.teamA.odds : bet.teamB.odds,
                pickName: pickName,
                bet: betAfterFee,
                toWin: toWin,
                fee: fee,
                matchStartDate: bet.matchStartDate,
                status: "Pending",
                matchingStatus: "Pending",
                lineQuery: bet.lineQuery,
                origin: bet.origin,
                sportsbook: bet.sportsbook,
            });
            await FinancialLog.create({
                financialtype: "bet",
                uniqid: `BP${bet_id}`,
                user: user._id,
                betId: newBet.id,
                amount: betAfterFee,
                method: "bet",
                status: FinancialStatus.success,
                beforeBalance: user.balance,
                afterBalance: user.balance - amount
            });
            await LoyaltyLog.create({
                user: user._id,
                point: betAfterFee * loyaltyPerBet,
            });

            const docChanges = {
                $push: {},
                $inc: {},
            };
            switch (pick) {
                case 'home':
                    docChanges.$push['homeBets'] = newBet._id;
                    docChanges.$inc['teamA.betTotal'] = betAfterFee;
                    docChanges.$inc['teamA.toWinTotal'] = toWin;
                    break;
                case 'draw':
                    docChanges.$push['drawBets'] = newBet._id;
                    docChanges.$inc['teamDraw.betTotal'] = betAfterFee;
                    docChanges.$inc['teamDraw.toWinTotal'] = toWin;
                    break;
                case 'nondraw':
                    docChanges.$push['nonDrawBets'] = newBet._id;
                    docChanges.$inc['teamNonDraw.betTotal'] = betAfterFee;
                    docChanges.$inc['teamNonDraw.toWinTotal'] = toWin;
                    break;
                default:
                    docChanges.$push['awayBets'] = newBet._id;
                    docChanges.$inc['teamB.betTotal'] = betAfterFee;
                    docChanges.$inc['teamB.toWinTotal'] = toWin;
                    break;
            }
            await betpool.update(docChanges);
            await user.update({ $inc: { balance: -amount } });

            await calculateBetsStatus(betpool.uid);
        }
    } catch (error) {
        if (error) console.error('newBetError', error);
    }
};


adminRouter.post(
    '/placeBets',
    authenticateJWT,
    /* bruteforce.prevent, */
    async (req, res) => {
        const betSlip = req.body;

        const errors = [];

        const {
            odds,
            pick,
            stake: toBet,
            win: toWin,
            lineQuery,
            pickName,
            origin,
            type,
            autoBetUser,
            autoBetUserId,
            sportsbook,
        } = betSlip;

        lineQuery.eventId = `E${ID()}`;

        if (!odds || !pick || !toBet || !toWin || !lineQuery) {
            errors.push(`${pickName} ${odds[pick]} wager could not be placed. Query Incomplete.`);
        } else {
            lineQuery.points = Number(lineQuery.points);
            const {
                sportName,
                leagueId,
                eventId,
                lineId,
                type,
                subtype,
                points,
            } = lineQuery;
            const sportData = await Sport.findOne({ name: new RegExp(`^${sportName}$`, 'i') });
            if (sportData) {
                const { originSportId } = sportData;
                lineQuery.sportId = originSportId;

                const { teamA, teamB, startDate, home, userId, away, teamAOdds, teamBOdds } = betSlip;
                const user = await User.findById(userId);

                const lineOdds = null;
                const oddsA = teamAOdds;
                const oddsB = teamBOdds

                newLineOdds = pick == 'home' ? oddsA : oddsB;

                const betAfterFee = toBet /* * 0.98 */;
                const toWin = calculateToWinFromBet(betAfterFee, newLineOdds);
                if (toWin > maximumWin) {
                    errors.push(`${pickName} @${odds[pick]} wager could not be placed. Exceed maximum win amount.`);
                } else {
                    const fee = sportsbook ? 0 : Number((toWin * BetFee).toFixed(2));
                    const balanceChange = toBet * -1;
                    const newBalance = user.balance ? user.balance + balanceChange : 0 + balanceChange;
                    if (newBalance >= 0) {
                        // insert bet doc to bets table
                        const newBetObj = {
                            userId: user._id,
                            transactionID: `B${ID()}`,
                            teamA: {
                                name: teamA,
                                odds: oddsA,
                            },
                            teamB: {
                                name: teamB,
                                odds: oddsB,
                            },
                            pick: pick,
                            pickOdds: newLineOdds,
                            oldOdds: lineOdds,
                            pickName: pickName,
                            bet: betAfterFee,
                            toWin: toWin,
                            fee: fee,
                            matchStartDate: startDate,
                            status: 'Pending',
                            lineQuery,
                            lineId: lineId,
                            origin: origin,
                            sportsbook: sportsbook
                        };
                        const newBet = new Bet(newBetObj);
                        try {
                            const savedBet = await newBet.save();

                            await LoyaltyLog.create({
                                user: user._id,
                                point: toBet * loyaltyPerBet
                            })

                            let betType = '';
                            switch (type) {
                                case 'total':
                                    if (pick == 'home') {
                                        betType += `O ${points}`;
                                    } else {
                                        betType += `U ${points}`;
                                    }
                                    break;

                                case 'spread':
                                    if (pick == 'home') {
                                        betType += `${points > 0 ? '+' : ''}${points}`;
                                    } else {
                                        betType += `${-1 * points > 0 ? '+' : ''}${-1 * points}`;
                                    }
                                    break;
                            }

                            const betId = savedBet.id;
                            const exists = await BetPool.findOne({ uid: JSON.stringify(lineQuery) });
                            let betpoolId = '';
                            if (exists) {
                                const docChanges = {
                                    $push: pick === 'home' ? { homeBets: betId } : { awayBets: betId },
                                    $inc: {},
                                };
                                docChanges.$inc[`${pick === 'home' ? 'teamA' : 'teamB'}.betTotal`] = betAfterFee;
                                docChanges.$inc[`${pick === 'home' ? 'teamA' : 'teamB'}.toWinTotal`] = toWin;
                                await BetPool.findOneAndUpdate(
                                    { uid: JSON.stringify(lineQuery) },
                                    docChanges,
                                );
                                await placeAutoBet(betId, autoBetUserId, toWin);
                                betpoolId = exists.uid;
                            } else {
                                const newBetPool = new BetPool(
                                    {
                                        uid: JSON.stringify(lineQuery),
                                        sportId: originSportId,
                                        leagueId,
                                        eventId,
                                        lineId,
                                        teamA: {
                                            name: teamA,
                                            odds: home,
                                            betTotal: pick === 'home' ? betAfterFee : 0,
                                            toWinTotal: pick === 'home' ? toWin : 0,
                                        },
                                        teamB: {
                                            name: teamB,
                                            odds: away,
                                            betTotal: pick === 'away' ? betAfterFee : 0,
                                            toWinTotal: pick === 'away' ? toWin : 0,
                                        },
                                        sportName,
                                        matchStartDate: startDate,
                                        lineType: type,
                                        lineSubType: subtype,
                                        points: points,
                                        homeBets: pick === 'home' ? [betId] : [],
                                        awayBets: pick === 'away' ? [betId] : [],
                                        origin
                                    }
                                );

                                try {
                                    await newBetPool.save();
                                    await placeAutoBet(betId, autoBetUserId, toWin);
                                    betpoolId = newBetPool.uid;
                                } catch (err) {
                                }
                            }
                            await calculateBetsStatus(betpoolId);

                            try {
                                await FinancialLog.create({
                                    financialtype: 'bet',
                                    uniqid: `BP${ID()}`,
                                    user: user._id,
                                    betId: savedBet.id,
                                    amount: toBet,
                                    method: 'bet',
                                    status: FinancialStatus.success,
                                    beforeBalance: user.balance,
                                    afterBalance: newBalance
                                });
                                user.balance = newBalance;
                                await user.save();
                            } catch (err) {
                            }
                        }
                        catch (e2) {
                            if (e2) console.error('newBetError', e2);
                        }
                    } else {
                        errors.push(`${pickName} @${odds[pick]} wager could not be placed. Insufficient funds.`);
                    }
                }
            } else {
                errors.push(`${pickName} @${odds[pick]} wager could not be placed. Line not found`);
            }
        }

        res.json({
            success: true,
            errors,
        });
    }
);

adminRouter.get(
    '/placebetsbyadmin',
    authenticateJWT,
    async (req, res) => {
        try {
            let { page, datefrom, dateto, sport, status, minamount, maxamount, house, match, perPage, email } = req.query;
            if (!perPage) perPage = 25;
            perPage = parseInt(perPage);
            if (!page) page = 1;
            page--;
            let searchObj = {};

            searchObj = {
                origin: 'admin'
            };

            if (!email) email = '';

            let aggregate = [
                { $match: searchObj },
                {
                    $lookup: {
                        from: 'users',
                        let: { user_id: "$userId" },
                        pipeline: [{
                            $match: {
                                $expr: { $eq: ["$_id", "$$user_id"] }
                            },
                        }, {
                            $project: {
                                email: 1,
                                currency: 1
                            }
                        }],
                        as: 'userId',
                    }
                },
                { $unwind: '$userId' },
                {
                    $match: { "userId.email": { "$regex": email, "$options": "i" } }
                },
            ]
            let total = await Bet.aggregate([
                ...aggregate,
                { $count: "total" }
            ]);
            if (total.length > 0) total = total[0].total;
            else total = 0;
            const data = await Bet.aggregate([
                ...aggregate,
                { $sort: { createdAt: -1 } },
                { $skip: page * perPage },
                { $limit: perPage }
            ]);

            page++;
            return res.json({ total: total, perPage, page, data });
        } catch (error) {
            return res.status(500).json({ error: 'Can\'t find bets.', message: error });
        }
    }
)

adminRouter.get(
    '/credits',
    authenticateJWT,
    limitRoles('credits'),
    async (req, res) => {
        let { page, perPage } = req.query;
        if (!perPage) perPage = 25;
        perPage = parseInt(perPage);
        if (!page) page = 1;
        page--;

        try {
            const filterQuery = [
                {
                    $lookup: {
                        from: 'financiallogs',
                        let: { user_id: "$_id" },
                        pipeline: [{
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$user", "$$user_id"] },
                                        { $eq: ["$financialtype", "transfer-out"] }
                                    ]
                                },
                            },
                        }],
                        as: 'creditOut'
                    }
                },
                {
                    $lookup: {
                        from: 'financiallogs',
                        let: { user_id: "$_id" },
                        pipeline: [{
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$user", "$$user_id"] },
                                        { $eq: ["$financialtype", "transfer-in"] }
                                    ]
                                },
                            },
                        }],
                        as: 'creditIn'
                    }
                },
                {
                    $lookup: {
                        from: 'financiallogs',
                        let: { user_id: "$_id" },
                        pipeline: [{
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$user", "$$user_id"] },
                                        { $eq: ["$financialtype", "credit"] }
                                    ]
                                },
                            },
                        }],
                        as: 'credit'
                    }
                },
                {
                    $lookup: {
                        from: 'financiallogs',
                        let: { user_id: "$_id" },
                        pipeline: [{
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$user", "$$user_id"] },
                                        { $eq: ["$financialtype", "debit"] }
                                    ]
                                },
                            },
                        }],
                        as: 'debit'
                    }
                },
                {
                    $lookup: {
                        from: 'bets',
                        let: { user_id: "$_id" },
                        pipeline: [{
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$userId", "$$user_id"] },
                                        { $in: ["$status", ["Pending", "Partial Match", "Partial Accepted", "Matched", "Accepted"]] }
                                    ]
                                },
                            },
                        }, {
                            $project: {
                                bet: 1
                            }
                        }],
                        as: 'inplay'
                    }
                },
                {
                    $project: {
                        email: 1,
                        balance: 1,
                        inplay: { $sum: "$inplay.bet" },
                        credit: { $subtract: [{ $sum: "$credit.amount" }, { $sum: "$debit.amount" }] },
                        creditUsed: { $subtract: [{ $sum: "$creditOut.amount" }, { $sum: "$creditIn.amount" }] }
                    }
                },
                {
                    $match: {
                        $or: [
                            { creditUsed: { $gt: 0 } },
                            { credit: { $gt: 0 } }
                        ]
                    }
                }
            ];
            const total = await User.aggregate(
                [
                    ...filterQuery,
                    { $count: "total" }
                ]
            )

            const users = await User.aggregate(
                [
                    ...filterQuery,
                    { $skip: page * perPage },
                    { $limit: perPage }
                ]
            );
            res.json({ total: total.total, data: users });
        } catch (error) {
            console.error(error);
            res.json({ total: 0, data: [] });
        }
    }
)

adminRouter.post(
    '/credits',
    authenticateJWT,
    limitRoles('credits'),
    async (req, res) => {
        let { user: user_id, type, amount } = req.body;
        if (!user_id || !type || !amount) {
            return res.json({ success: false, message: 'Please input all the required fields.' });
        }
        amount = Number(amount);
        try {
            const user = await User.findById(user_id);
            if (!user) {
                return res.json({ success: false, message: 'User not found.' });
            }
            switch (type) {
                case 'issue':
                    {
                        if (amount <= 0)
                            return res.json({ success: false, message: 'Amount should be at least 0.' });
                        await FinancialLog.create({
                            financialtype: 'credit',
                            uniqid: `C${ID()}`,
                            user: user._id,
                            amount: amount,
                            method: 'Line of Credit',
                            status: FinancialStatus.success,
                            beforeBalance: user.balance,
                            afterBalance: user.balance
                        });
                        await user.update({ $inc: { credit: amount } });
                        break;
                    }
                case 'debit':
                    {
                        if (amount <= 0)
                            return res.json({ success: false, message: 'Amount should be at least 0.' });

                        let usedCredit = await FinancialLog.aggregate(
                            {
                                $match: {
                                    user: new ObjectId(user._id),
                                    financialtype: { $in: ['transfer-out', 'transfer-in', 'credit', 'debit'] }
                                }
                            },
                            { $group: { _id: "$financialtype", total: { $sum: "$amount" } } }
                        );
                        const inamount = usedCredit.find(credit => credit._id == 'transfer-in');
                        const outamount = usedCredit.find(credit => credit._id == 'transfer-out');
                        const creditamount = usedCredit.find(credit => credit._id == 'credit');
                        const debitamount = usedCredit.find(credit => credit._id == 'debit');
                        usedCredit = (outamount ? outamount.total : 0) - (inamount ? inamount.total : 0);
                        const credit = (creditamount ? creditamount.total : 0) - (debitamount ? debitamount.total : 0);

                        if (amount > credit - usedCredit) {
                            return res.json({ success: false, message: 'Amount exceed the credit used.' });
                        }

                        await FinancialLog.create({
                            financialtype: 'debit',
                            uniqid: `C${ID()}`,
                            user: user._id,
                            amount: amount,
                            method: 'Line of Credit',
                            status: FinancialStatus.success,
                            beforeBalance: user.balance,
                            afterBalance: user.balance
                        });
                        await user.update({ $inc: { credit: -amount } });
                        break;
                    }
                case 'transfer-in':
                    {
                        if (amount > user.balance)
                            return res.json({ success: false, message: 'Cannot transfer in credit. Out of user balance.' });
                        await FinancialLog.create({
                            financialtype: 'transfer-in',
                            uniqid: `TI${ID()}`,
                            user: user._id,
                            amount: amount,
                            method: 'Line of Credit',
                            status: FinancialStatus.success,
                            beforeBalance: user.balance,
                            afterBalance: user.balance - amount
                        });
                        await user.update({ $inc: { balance: -amount, } })
                        break;
                    }
                case 'transfer-out':
                    {
                        let usedCredit = await FinancialLog.aggregate(
                            {
                                $match: {
                                    user: new ObjectId(user._id),
                                    financialtype: { $in: ['transfer-out', 'transfer-in'] }
                                }
                            },
                            { $group: { _id: "$financialtype", total: { $sum: "$amount" } } }
                        );
                        const inamount = usedCredit.find(credit => credit._id == 'transfer-in');
                        const outamount = usedCredit.find(credit => credit._id == 'transfer-out');
                        usedCredit = (outamount ? outamount.total : 0) - (inamount ? inamount.total : 0);

                        let credit = await FinancialLog.aggregate(
                            {
                                $match: {
                                    user: new ObjectId(user._id),
                                    financialtype: { $in: ['credit', 'debit'] }
                                }
                            },
                            { $group: { _id: '$financialtype', total: { $sum: "$amount" } } }
                        );
                        const creditamount = credit.find(credit => credit._id == 'credit');
                        const debitamount = credit.find(credit => credit._id == 'debit');
                        credit = (creditamount ? creditamount.total : 0) - (debitamount ? debitamount.total : 0);

                        if (usedCredit + Number(amount) > credit)
                            return res.json({ success: false, message: 'Cannot transfer out credit. Out of credit amount.' });
                        await FinancialLog.create({
                            financialtype: 'transfer-out',
                            uniqid: `TO${ID()}`,
                            user: user._id,
                            amount: amount,
                            method: 'Line of Credit',
                            status: FinancialStatus.success,
                            beforeBalance: user.balance,
                            afterBalance: user.balance + amount
                        });
                        await user.update({ $inc: { balance: amount } })
                        break;
                    }
                default:
                    return res.json({ success: false, message: 'Unknown type.' });
            }
            return res.json({ success: true });
        } catch (error) {
            console.error(error);
            return res.json({ success: false, message: 'Internal server error' });
        }
    }
)

adminRouter.get(
    '/credits/:id',
    authenticateJWT,
    limitRoles('credits'),
    async (req, res) => {
        const { id } = req.params;
        let { page, perPage } = req.query;
        if (!perPage) perPage = 25;
        perPage = parseInt(perPage);
        if (!page) page = 1;
        page--;

        try {
            const user = await User.findById(id);
            if (!user) {
                return res.json({ user: null, data: [], total: 0 })
            }
            let searchObj = { financialtype: { $in: ['credit', 'debit', 'transfer-out', 'transfer-in'] }, user: id };
            const total = await FinancialLog.find(searchObj).count();
            const data = await FinancialLog.find(searchObj)
                .skip(page * perPage)
                .limit(perPage)
                .populate('user', ['email'])
            res.json({ total: total, data: data, user: user });
        } catch (error) {
            console.error(error);
            res.json({ total: 0, data: [] });
        }
    }
);

adminRouter.post(
    '/bets/:id/fixscore',
    authenticateJWT,
    limitRoles('bet_activities'),
    async (req, res) => {
        try {
            let { id } = req.params;
            const bet = await Bet.findById(id);
            if (!bet || bet.origin == 'custom') {
                return res.status(404).json({ error: 'Bet not found' });
            }

            if (bet.isParlay) {
                const results = req.body;
                const parlayQuery = JSON.parse(JSON.stringify(bet.parlayQuery));
                const betpool = await ParlayBetPool.findOne({ $or: [{ homeBets: id }, { awayBets: id }] });
                if (!betpool) {
                    return res.status(404).json({ error: 'BetPool not found' });
                }
                const { homeBets, awayBets } = betpool;
                if (homeBets.length > 0 && awayBets.length > 0) {
                    let homeWin = true;
                    //reseting wininer finacial logs amount and substracting user balance
                    const oldfinancialLogs = await FinancialLog.find({ betId: { $in: [...homeBets, ...awayBets] }, method: { $in: ['betwon', 'betfee'] } });
                    for (const oldfinancialLog of oldfinancialLogs) {
                        const betAmount = oldfinancialLog.amount;
                        const oldWinnerUserId = oldfinancialLog.user;

                        if (oldfinancialLog.method === 'betwon') {
                            await User.findOneAndUpdate({ _id: oldWinnerUserId }, { $inc: { balance: -betAmount } });
                        }
                        else if (oldfinancialLog.method === 'betfee') {
                            await User.findOneAndUpdate({ _id: oldWinnerUserId }, { $inc: { balance: betAmount } });
                        }
                        //Remove wiiner previous financial log
                        await FinancialLog.deleteOne({ _id: oldfinancialLog._id });
                    }

                    for (const query of parlayQuery) {
                        const lineQuery = query.lineQuery;
                        const result = results.find(result => {
                            return result.lineQuery.eventId == lineQuery.eventId &&
                                result.lineQuery.subtype == lineQuery.subtype
                        });
                        if (!result) {
                            return res.status(400).json({ success: false, error: 'Result not exists.' });
                        }
                        const { teamAScore: homeScore, teamBScore: awayScore } = result.score;
                        query.homeScore = parseInt(homeScore);
                        query.awayScore = parseInt(awayScore);

                        let moneyLineWinner = null;
                        if (homeScore > awayScore) moneyLineWinner = 'home';
                        else if (awayScore > homeScore) moneyLineWinner = 'away';

                        const linePoints = lineQuery.points ? lineQuery.points : getLinePoints(query.pickName, query.pick, lineQuery);
                        let betWin;
                        if (lineQuery.type === 'moneyline') {
                            betWin = query.pick === moneyLineWinner;
                        } else if (['spread', 'alternative_spread'].includes(lineQuery.type)) {
                            const spread = { home: linePoints, away: 0 };
                            const homeScoreHandiCapped = homeScore + spread.home;
                            const awayScoreHandiCapped = awayScore + spread.away;
                            let spreadWinner;
                            if (homeScoreHandiCapped > awayScoreHandiCapped) spreadWinner = 'home';
                            else if (awayScoreHandiCapped > homeScoreHandiCapped) spreadWinner = 'away';
                            betWin = query.pick === spreadWinner;
                        } else if (['total', 'alternative_total'].includes(lineQuery.type)) {
                            const totalPoints = homeScore + awayScore;
                            const overUnderWinner = totalPoints > linePoints ? 'home' : 'away';
                            betWin = query.pick === overUnderWinner;
                        } else if (lineQuery.type == 'home_total') {
                            const overUnderWinner = homeScore > linePoints ? 'home' : 'away';
                            betWin = query.pick === overUnderWinner;
                        } else if (lineQuery.type == 'away_total') {
                            const overUnderWinner = awayScore > linePoints ? 'home' : 'away';
                            betWin = query.pick === overUnderWinner;
                        }

                        homeWin = homeWin && betWin;
                        query.status = betWin ? 'Win' : 'Lose';
                        delete query.result;
                    }

                    const winBets = homeWin ? homeBets : awayBets;
                    const lossBets = homeWin ? awayBets : homeBets;

                    for (const bet_id of winBets) {
                        const bet = await Bet.findById(bet_id);
                        if (bet) {
                            const { _id, userId, bet: betAmount, payableToWin } = bet;
                            const user = await User.findById(userId);
                            if (user) {
                                const betFee = Number((payableToWin * BetFee).toFixed(2));
                                const betChanges = {
                                    $set: {
                                        status: 'Settled - Win',
                                        credited: betAmount + payableToWin,
                                        fee: betFee,
                                        parlayQuery: parlayQuery
                                    }
                                }
                                await bet.update(betChanges);
                                if (payableToWin > 0) {
                                    await user.update({ $inc: { balance: betAmount + payableToWin - betFee } });
                                    const afterBalance = user.balance + betAmount + payableToWin;
                                    await FinancialLog.create({
                                        financialtype: 'betwon',
                                        uniqid: `BW${ID()}`,
                                        user: userId,
                                        betId: _id,
                                        amount: betAmount + payableToWin,
                                        method: 'betwon',
                                        status: FinancialStatus.success,
                                        beforeBalance: user.balance,
                                        afterBalance: afterBalance
                                    });
                                    await FinancialLog.create({
                                        financialtype: 'betfee',
                                        uniqid: `BF${ID()}`,
                                        user: userId,
                                        betId: _id,
                                        amount: betFee,
                                        method: 'betfee',
                                        status: FinancialStatus.success,
                                        beforeBalance: afterBalance,
                                        afterBalance: afterBalance - betFee
                                    });
                                }
                                // TODO: email winner
                                sendBetWinConfirmEmail(user, bet);
                            }
                        }
                    }
                    for (const bet_id of lossBets) {
                        const bet = await Bet.findById(bet_id);
                        if (bet) {
                            const { userId, payableToWin, toWin, bet: betAmount } = bet;
                            const betChanges = {
                                $set: {
                                    status: 'Settled - Lose',
                                    parlayQuery: parlayQuery
                                }
                            }
                            const unplayableBet = payableToWin < toWin
                                ? Number(((1 - payableToWin / toWin) * betAmount).toFixed(2)) : null;

                            const user = await User.findById(userId);
                            if (user) {
                                sendBetLoseConfirmEmail(user, betAmount);
                                if (unplayableBet) {
                                    betChanges.$set.credited = unplayableBet;
                                    await FinancialLog.create({
                                        financialtype: 'betrefund',
                                        uniqid: `BF${ID()}`,
                                        user: userId,
                                        betId: bet_id,
                                        amount: unplayableBet,
                                        method: 'betrefund',
                                        status: FinancialStatus.success,
                                        beforeBalance: user.balance,
                                        afterBalance: user.balance + unplayableBet
                                    });
                                    await user.update({ $inc: { balance: unplayableBet } });
                                }
                            }
                            await bet.update(betChanges);
                        }
                    }
                    await betpool.update({ $set: { result: 'Settled' } });
                } else {
                    for (const betId of [...homeBets, ...awayBets]) {
                        const bet = await Bet.findById(betId);
                        if (bet) {
                            const { _id, userId, bet: betAmount } = bet;
                            // refund user
                            await bet.update({ status: 'Cancelled' });
                            const user = await User.findById(userId);
                            if (user) {
                                await FinancialLog.create({
                                    financialtype: 'betcancel',
                                    uniqid: `BC${ID()}`,
                                    user: userId,
                                    betId: _id,
                                    amount: betAmount,
                                    method: 'betcancel',
                                    status: FinancialStatus.success,
                                    beforeBalance: user.balance,
                                    afterBalance: user.balance + betAmount
                                });
                                await user.update({ $inc: { balance: betAmount } });
                            }
                        }
                    }
                    await betpool.update({ $set: { result: 'Cancelled' } });
                }
                return res.json({ success: true });
            } else {
                const { teamAScore, teamBScore } = req.body;
                const lineQuery = bet.lineQuery;
                const linePoints = lineQuery.points ? lineQuery.points : getLinePoints(bet.pickName, bet.pick, lineQuery)

                const betpool = await BetPool.findOne({
                    $or: [
                        { homeBets: bet._id },
                        { awayBets: bet._id },
                        { drawBets: bet._id },
                        { nonDrawBets: bet._id },
                    ]
                });
                if (!betpool) {
                    return res.status(404).json({ error: 'BetPool not found' });
                }
                const {
                    homeBets,
                    awayBets,
                    drawBets,
                    nonDrawBets,
                    uid,
                    lineType,
                    points
                } = betpool;
                let matchCancelled = false;
                let drawCancelled = false;

                if (drawBets.length > 0 && nonDrawBets.length > 0) {
                    const homeScore = parseInt(teamAScore);
                    const awayScore = parseInt(teamBScore);

                    let moneyLineWinner = null;
                    if (awayScore == homeScore) {
                        moneyLineWinner = 'draw';
                    }
                    else {
                        moneyLineWinner = 'nondraw'
                    }

                    const bets = await Bet.find({ _id: { $in: [...drawBets, ...nonDrawBets] } });

                    //reseting wininer finacial logs amount and substracting user balance
                    const oldfinancialLogs = await FinancialLog.find({ betId: { $in: [...drawBets, ...nonDrawBets] }, method: { $in: ['betwon', 'betfee'] } });

                    for (const oldfinancialLog of oldfinancialLogs) {
                        const betAmount = oldfinancialLog.amount;
                        const oldWinnerUserId = oldfinancialLog.user;

                        if (oldfinancialLog.method === 'betwon') {
                            await User.findOneAndUpdate({ _id: oldWinnerUserId }, { $inc: { balance: -betAmount } });
                        }
                        else if (oldfinancialLog.method === 'betfee') {
                            await User.findOneAndUpdate({ _id: oldWinnerUserId }, { $inc: { balance: betAmount } });
                        }
                        //Remove wiiner previous financial log
                        await FinancialLog.deleteOne({ _id: oldfinancialLog._id });
                    }
                    for (const bet of bets) {
                        const { _id, userId, bet: betAmount, toWin, pick, payableToWin, status } = bet;

                        if (payableToWin <= 0 || status == 'Pending') {
                            const { _id, userId, bet: betAmount } = bet;
                            await Bet.findOneAndUpdate({ _id }, { status: 'Cancelled' });
                            const user = await User.findById(userId);
                            if (user) {
                                await FinancialLog.create({
                                    financialtype: 'betcancel',
                                    uniqid: `BC${ID()}`,
                                    user: userId,
                                    betId: _id,
                                    amount: betAmount,
                                    method: 'betcancel',
                                    status: FinancialStatus.success,
                                    beforeBalance: user.balance,
                                    afterBalance: user.balance + betAmount
                                });
                                await user.update({ $inc: { balance: betAmount } });
                            }
                            continue;
                        }

                        let betWin = false;
                        if (lineType === 'moneyline') {
                            betWin = pick === moneyLineWinner;
                        }

                        if (betWin === true) {
                            const user = await User.findById(userId);
                            const betFee = Number((payableToWin * BetFee).toFixed(2));
                            const betChanges = {
                                $set: {
                                    status: 'Settled - Win',
                                    credited: betAmount + payableToWin,
                                    homeScore: homeScore,
                                    awayScore: awayScore,
                                    fee: betFee
                                }
                            }
                            await Bet.findOneAndUpdate({ _id }, betChanges);
                            if (user) {
                                if (payableToWin > 0) {
                                    const user = await User.findById(userId);
                                    if (user) {
                                        const afterBalance = user.balance + betAmount + payableToWin;
                                        await FinancialLog.create({
                                            financialtype: 'betwon',
                                            uniqid: `BW${ID()}`,
                                            user: userId,
                                            betId: _id,
                                            amount: betAmount + payableToWin,
                                            method: 'betwon',
                                            status: FinancialStatus.success,
                                            beforeBalance: user.balance,
                                            afterBalance: afterBalance
                                        });
                                        await FinancialLog.create({
                                            financialtype: 'betfee',
                                            uniqid: `BF${ID()}`,
                                            user: userId,
                                            betId: _id,
                                            amount: betFee,
                                            method: 'betfee',
                                            status: FinancialStatus.success,
                                            beforeBalance: afterBalance,
                                            afterBalance: afterBalance - betFee
                                        });
                                        await user.update({ $inc: { balance: betAmount + payableToWin - betFee } });
                                    }
                                }
                                // TODO: email winner
                                sendBetWinConfirmEmail(user, bet);
                            }
                        } else if (betWin === false) {
                            const user = await User.findById(userId);
                            const betChanges = {
                                $set: {
                                    status: 'Settled - Lose',
                                    homeScore,
                                    awayScore,
                                }
                            }
                            const unplayableBet = payableToWin < toWin
                                ? Number(((1 - payableToWin / toWin) * betAmount).toFixed(2)) : null;
                            if (user) {
                                sendBetLoseConfirmEmail(user, betAmount);
                                if (unplayableBet) {
                                    betChanges.$set.credited = unplayableBet;
                                    if (user) {
                                        await FinancialLog.create({
                                            financialtype: 'betrefund',
                                            uniqid: `BF${ID()}`,
                                            user: userId,
                                            betId: _id,
                                            amount: unplayableBet,
                                            method: 'betrefund',
                                            status: FinancialStatus.success,
                                            beforeBalance: user.balance,
                                            afterBalance: user.balance + unplayableBet
                                        });
                                        await user.update({ $inc: { balance: unplayableBet } });
                                    }
                                }
                            }
                            await Bet.findOneAndUpdate({ _id }, betChanges);
                        } else {
                            console.error('error: somehow', lineType, 'bet did not result in win or loss. betWin value:', betWin);
                        }
                        await BetPool.findOneAndUpdate({ uid }, { $set: { result: 'Settled' } });
                    }

                } else {
                    drawCancelled = true;
                }

                if (homeBets.length > 0 && awayBets.length > 0) {
                    const homeScore = parseInt(teamAScore);
                    const awayScore = parseInt(teamBScore);
                    let moneyLineWinner = null;
                    if (homeScore > awayScore) moneyLineWinner = 'home';
                    else if (awayScore > homeScore) moneyLineWinner = 'away';
                    const bets = await Bet.find({ _id: { $in: [...homeBets, ...awayBets] } });

                    //reseting wininer finacial logs amount and substracting user balance
                    const oldfinancialLogs = await FinancialLog.find({ betId: { $in: [...homeBets, ...awayBets] }, method: { $in: ['betwon', 'betfee'] } });

                    for (const oldfinancialLog of oldfinancialLogs) {
                        const betAmount = oldfinancialLog.amount;
                        const oldWinnerUserId = oldfinancialLog.user;

                        if (oldfinancialLog.method === 'betwon') {
                            await User.findOneAndUpdate({ _id: oldWinnerUserId }, { $inc: { balance: -betAmount } });
                        }
                        else if (oldfinancialLog.method === 'betfee') {
                            await User.findOneAndUpdate({ _id: oldWinnerUserId }, { $inc: { balance: betAmount } });
                        }
                        //Remove wiiner previous financial log
                        await FinancialLog.deleteOne({ _id: oldfinancialLog._id });
                    }

                    for (const bet of bets) {
                        const { _id, userId, bet: betAmount, toWin, pick, payableToWin, status } = bet;

                        if (payableToWin <= 0 || status == 'Pending') {
                            const { _id, userId, bet: betAmount } = bet;
                            await Bet.findOneAndUpdate({ _id }, { status: 'Cancelled' });
                            const user = await User.findById(userId);
                            if (user) {
                                await FinancialLog.create({
                                    financialtype: 'betcancel',
                                    uniqid: `BC${ID()}`,
                                    user: userId,
                                    betId: _id,
                                    amount: betAmount,
                                    method: 'betcancel',
                                    status: FinancialStatus.success,
                                    beforeBalance: user.balance,
                                    afterBalance: user.balance + betAmount
                                });
                                await user.update({ $inc: { balance: betAmount } });
                            }
                            continue;
                        }

                        let betWin;
                        let draw = false;
                        if (lineType === 'moneyline') {
                            betWin = pick === moneyLineWinner;
                            draw = awayScore == homeScore;
                        } else if (['spread', 'alternative_spread'].includes(lineType)) {
                            const spread = {
                                home: Number(points),
                                away: 0,
                            };
                            const homeScoreHandiCapped = Number(homeScore) + spread.home;
                            const awayScoreHandiCapped = Number(awayScore) + spread.away;
                            let spreadWinner;
                            if (homeScoreHandiCapped > awayScoreHandiCapped) spreadWinner = 'home';
                            else if (awayScoreHandiCapped > homeScoreHandiCapped) spreadWinner = 'away';
                            betWin = pick === spreadWinner;
                            draw = homeScoreHandiCapped == awayScoreHandiCapped;
                        } else if (['total', 'alternative_total'].includes(lineType)) {
                            const totalPoints = homeScore + awayScore;
                            const overUnderWinner = totalPoints > points ? 'home' : 'away';
                            betWin = pick === overUnderWinner;
                            draw = totalPoints == points;
                        } else if (lineType == 'home_total') {
                            const overUnderWinner = homeScore > points ? 'home' : 'away';
                            betWin = pick === overUnderWinner;
                            draw = homeScore == points;
                        } else if (lineType == 'away_total') {
                            const overUnderWinner = awayScore > points ? 'home' : 'away';
                            betWin = pick === overUnderWinner;
                            draw = awayScore == points;
                        }

                        if (draw) {
                            // refund user
                            await Bet.findOneAndUpdate({ _id: _id }, { status: 'Draw' });
                            const user = await User.findById(userId);
                            if (user) {
                                await FinancialLog.create({
                                    financialtype: 'betdraw',
                                    uniqid: `BD${ID()}`,
                                    user: userId,
                                    betId: _id,
                                    amount: betAmount,
                                    method: 'betdraw',
                                    status: FinancialStatus.success,
                                    beforeBalance: user.balance,
                                    afterBalance: user.balance + betAmount
                                });
                                await user.update({ $inc: { balance: betAmount } });
                            }
                            continue;
                        }

                        if (betWin === true) {
                            // TODO: credit back bet ammount
                            const user = await User.findById(userId);
                            const betFee = Number((payableToWin * BetFee).toFixed(2));
                            const betChanges = {
                                $set: {
                                    status: 'Settled - Win',
                                    credited: betAmount + payableToWin,
                                    homeScore: homeScore,
                                    awayScore: awayScore,
                                    fee: betFee
                                }
                            }
                            await Bet.findOneAndUpdate({ _id }, betChanges);
                            if (user) {
                                if (payableToWin > 0) {
                                    const afterBalance = user.balance + betAmount + payableToWin;
                                    await FinancialLog.create({
                                        financialtype: 'betwon',
                                        uniqid: `BW${ID()}`,
                                        user: userId,
                                        betId: _id,
                                        amount: betAmount + payableToWin,
                                        method: 'betwon',
                                        status: FinancialStatus.success,
                                        beforeBalance: user.balance,
                                        afterBalance: afterBalance
                                    });
                                    await FinancialLog.create({
                                        financialtype: 'betfee',
                                        uniqid: `BF${ID()}`,
                                        user: userId,
                                        betId: _id,
                                        amount: betFee,
                                        method: 'betfee',
                                        status: FinancialStatus.success,
                                        beforeBalance: afterBalance,
                                        afterBalance: afterBalance - betFee
                                    });
                                    await user.update({ $inc: { balance: betAmount + payableToWin - betFee } });
                                }
                                // TODO: email winner
                                sendBetWinConfirmEmail(user, bet);
                            }
                        } else if (betWin === false) {
                            const betChanges = {
                                $set: {
                                    status: 'Settled - Lose',
                                    homeScore,
                                    awayScore,
                                }
                            }
                            const unplayableBet = payableToWin < toWin
                                ? Number(((1 - payableToWin / toWin) * betAmount).toFixed(2)) : null;
                            const user = await User.findById(userId);
                            if (user) {
                                sendBetLoseConfirmEmail(user, betAmount);
                                if (unplayableBet) {
                                    betChanges.$set.credited = unplayableBet;
                                    await FinancialLog.create({
                                        financialtype: 'betrefund',
                                        uniqid: `BF${ID()}`,
                                        user: userId,
                                        betId: _id,
                                        amount: unplayableBet,
                                        method: 'betrefund',
                                        status: FinancialStatus.success,
                                        beforeBalance: user.balance,
                                        afterBalance: user.balance + unplayableBet
                                    });
                                    await user.update({ $inc: { balance: unplayableBet } });
                                }
                            }
                            await Bet.findOneAndUpdate({ _id }, betChanges);
                        } else {
                            console.error('error: somehow', lineType, 'bet did not result in win or loss. betWin value:', betWin);
                        }
                        await BetPool.findOneAndUpdate({ uid }, { $set: { result: 'Settled' } });
                    }

                } else {
                    matchCancelled = true;
                }

                if (matchCancelled) {
                    for (const betId of [...homeBets, ...awayBets]) {
                        const bet = await Bet.findOne({ _id: betId });
                        const { _id, userId, bet: betAmount } = bet;
                        // refund user
                        await Bet.findOneAndUpdate({ _id }, { status: 'Cancelled' });
                        const user = await User.findById(userId);
                        if (user) {
                            await FinancialLog.create({
                                financialtype: 'betcancel',
                                uniqid: `BC${ID()}`,
                                user: userId,
                                betId: _id,
                                amount: betAmount,
                                method: 'betcancel',
                                status: FinancialStatus.success,
                                beforeBalance: user.balance,
                                afterBalance: user.balance + betAmount
                            });
                            await user.update({ $inc: { balance: betAmount } });
                        }
                    }
                    await BetPool.findOneAndUpdate({ uid }, { $set: { result: 'Cancelled' } });
                }

                if (drawCancelled) {
                    for (const betId of [...drawBets, ...nonDrawBets]) {
                        const bet = await Bet.findOne({ _id: betId });
                        const { _id, userId, bet: betAmount } = bet;
                        // refund user
                        await Bet.findOneAndUpdate({ _id }, { status: 'Cancelled' });
                        const user = await User.findById(userId);
                        if (user) {
                            await FinancialLog.create({
                                financialtype: 'betcancel',
                                uniqid: `BC${ID()}`,
                                user: userId,
                                betId: _id,
                                amount: betAmount,
                                method: 'betcancel',
                                status: FinancialStatus.success,
                                beforeBalance: user.balance,
                                afterBalance: user.balance + betAmount
                            });
                            await user.update({ $inc: { balance: betAmount } });
                        }
                    }
                    await BetPool.findOneAndUpdate({ uid }, { $set: { result: 'Cancelled' } });
                }

                return res.json({ success: true });
            }
        } catch (error) {
            console.error(error);
            res.status(404).json({ error: 'Can\'t save events.' });
        }
    }
);

adminRouter.get(
    '/gift-cards',
    authenticateJWT,
    limitRoles('deposit_logs'),
    async (req, res) => {
        let { page, status, perPage } = req.query;
        if (!page) page = 1;
        page = parseInt(page);
        page--;
        if (!perPage) perPage = 25;
        perPage = parseInt(perPage);

        try {
            let searchObj = {};
            switch (status) {
                case 'unused':
                    searchObj.usedAt = null;
                    break;
                case 'used':
                    searchObj.usedAt = { $ne: null };
                    break;
            }
            const total = await GiftCard.find(searchObj).count();
            const data = await GiftCard.find(searchObj)
                .sort({ createdAt: -1 })
                .skip(page * perPage)
                .limit(perPage)
                .populate('user', ['email'])
            return res.json({ total: total, data: data });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error.' });
        }
    }
)

adminRouter.put(
    '/customer/:id/manualverification',
    authenticateJWT,
    limitRoles('users'),
    async (req, res) => {
        const { id } = req.params;
        try {
            if (!id) {
                return res.status(404).json({ error: 'User not found' });
            }
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            user.roles = {
                ...user.roles,
                verified: true
            }
            await user.save();
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: 'Can\'t verified user.', result: error });
        }
    }
)

adminRouter.get(
    '/mismatch-scores',
    authenticateJWT,
    limitRoles('bet_activities'),
    async (req, res) => {
        try {
            let { page, perPage } = req.query;
            if (!perPage) perPage = 50;
            perPage = parseInt(perPage);
            if (!page) page = 1;
            page--;

            let aggregate = [
                { $match: { scoreMismatch: { $ne: null } } },
                {
                    $lookup: {
                        from: 'users',
                        let: { user_id: "$userId" },
                        pipeline: [
                            { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } },
                            { $project: { email: 1, currency: 1 } }
                        ],
                        as: 'userId',
                    }
                },
                { $unwind: '$userId' },
            ]
            let total = await Bet.aggregate([
                ...aggregate,
                { $count: "total" }
            ]);
            if (total.length > 0) total = total[0].total;
            else total = 0;
            const data = await Bet.aggregate([
                ...aggregate,
                { $sort: { createdAt: -1 } },
                { $skip: page * perPage },
                { $limit: perPage }
            ]);

            page++;
            return res.json({ total: total, perPage, page, data });
        } catch (error) {
            return res.status(500).json({ error: 'Can\'t find bets.', message: error });
        }
    }
)

adminRouter.get(
    '/members',
    authenticateJWT,
    async (req, res) => {
        try {
            const members = await Member.find().sort({ priority: -1 });
            return res.json(members);
        } catch (error) {
            console.error(error);
            return res.json([]);
        }
    }
)

adminRouter.post(
    '/members',
    authenticateJWT,
    async (req, res) => {
        try {
            const data = req.body;
            const photoImage = data.photo;
            if (photoImage.startsWith('data:image/')) {
                const base64Data = photoImage.replace(/^data:image\/png;base64,/, "");
                const filename = 'photo_' + dateformat(new Date(), "yyyy_mm_dd_HH_MM_ss.") + "png";
                fs.writeFile(`./banners/${filename}`, base64Data, 'base64', async function (error) {
                    if (error) {
                        console.error(error);
                        return res.status(500).json({ success: false });
                    }
                    let memberObj = {
                        ...data,
                        photo: `/static/${filename}`
                    };
                    try {
                        await Member.create(memberObj);
                        res.json({ success: true });
                    } catch (error) {
                        console.error(error);
                        res.status(500).json({ success: false });
                    }
                });
                return;
            }
            await Member.create(data);
        } catch (error) {
            console.error(error);
            return res.status(500).json(null);
        }
    }
)

adminRouter.patch(
    '/members/:id',
    authenticateJWT,
    async (req, res) => {
        try {
            const { id } = req.params;
            const member = await Member.findById(id);
            if (!member) {
                return res.status(404).json({ success: false });
            }
            const data = req.body;
            const photoImage = data.photo;
            if (photoImage.startsWith('data:image/')) {
                const base64Data = photoImage.replace(/^data:image\/png;base64,/, "");
                const filename = 'photo_' + dateformat(new Date(), "yyyy_mm_dd_HH_MM_ss.") + "png";
                fs.writeFile(`./banners/${filename}`, base64Data, 'base64', async function (error) {
                    if (error) {
                        console.error(error);
                        return res.status(500).json({ success: false });
                    }
                    let memberObj = {
                        ...data,
                        photo: `/static/${filename}`
                    };
                    try {
                        await member.update(memberObj);
                        res.json({ success: true });
                    } catch (error) {
                        console.error(error);
                        res.status(500).json({ success: false });
                    }
                });
                return;
            }
            await member.update(data);
            res.json({ success: true });
        } catch (error) {
            console.error(error);
            return res.status(500).json(null);
        }
    }
)

adminRouter.get(
    '/members/:id',
    authenticateJWT,
    async (req, res) => {
        try {
            const { id } = req.params;
            const member = await Member.findById(id);
            return res.json(member);
        } catch (error) {
            console.error(error);
            return res.json(null);
        }
    }
)

adminRouter.delete(
    '/members/:id',
    authenticateJWT,
    async (req, res) => {
        try {
            const { id } = req.params;
            await Member.deleteMany({ _id: id });
            return res.json({ success: true });
        } catch (error) {
            console.error(error);
            return res.json({ success: false });
        }
    }
)

adminRouter.get(
    '/affiliates/:id/detail',
    async (req, res) => {
        return res.json(null);
    }
)

adminRouter.get(
    '/affiliates/:id',
    async (req, res) => {
        try {
            const { id } = req.params;
            const affiliate = await Affiliate.findById(id);
            return res.json(affiliate);
        } catch (error) {
            return res.status(500).json({ success: false })
        }
    }
)

adminRouter.put(
    '/affiliates/:id',
    async (req, res) => {
        try {
            const { id } = req.params;
            const data = req.body;
            if (!data.password) delete data.password;

            await Affiliate.findOneAndUpdate({ _id: id }, data);
            return res.json({ success: true });
        } catch (error) {
            return res.status(500).json({ success: false })
        }
    }
)

adminRouter.delete(
    '/affiliates/:id',
    async (req, res) => {
        return res.json(null);
    }
)

adminRouter.get(
    '/affiliates',
    async (req, res) => {
        let { perPage, page } = req.query;
        if (!perPage) perPage = 30;
        else perPage = parseInt(perPage);
        if (!page) page = 1;
        else page = parseInt(page);
        try {
            const total = await Affiliate.find().count();
            const affiliates = await Affiliate.aggregate(
                {
                    $lookup: {
                        from: 'users',
                        let: { unique_id: '$unique_id' },
                        pipeline: [
                            { $match: { $expr: { $eq: ['$invite', '$$unique_id'] } } },
                            {
                                $lookup: {
                                    from: 'financiallogs',
                                    let: { user_id: '$_id' },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $and: [
                                                        { $eq: ["$user", "$$user_id"] },
                                                        { $eq: ["$status", FinancialStatus.success] }
                                                    ]
                                                },
                                            }
                                        },
                                        { $count: 'count' }
                                    ],
                                    as: 'deposits',
                                }
                            },
                            {
                                $unwind: {
                                    path: '$deposits',
                                    preserveNullAndEmptyArrays: true
                                }
                            }
                        ],
                        as: 'conversions'
                    }
                },
                {
                    $lookup: {
                        from: 'affiliatecommissions',
                        localField: '_id',
                        foreignField: 'affiliater',
                        as: 'commissions'
                    }
                },
                {
                    $project: {
                        company: 1,
                        email: 1,
                        notes: 1,
                        status: 1,
                        unique_id: 1,
                        click: 1,
                        conversions: { $size: '$conversions' },
                        deposits: { $size: '$conversions.deposits' },
                        commission: { $sum: "$commissions.amount" },
                    }
                },
                { $skip: (page - 1) * perPage },
                { $limit: perPage }
            );
            return res.json({ affiliates, total: total, page: page });
        } catch (error) {
            console.error(error);
            return res.json({ affiliates: [], total: 0, page: 1 });
        }
    }
)

adminRouter.post(
    '/affiliates',
    async (req, res) => {
        try {
            const data = req.body;
            const unique_id = `AFM${ID()}`;
            await Affiliate.create({ ...data, unique_id });
            return res.json({ success: true });
        } catch (error) {
            console.error(error);
            return res.json({ success: false, error: 'Cannot create an affiliate user. Internal Server Error.' });
        }
    }
)

module.exports = adminRouter;
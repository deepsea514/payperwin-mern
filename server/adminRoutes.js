// Define Router
const adminRouter = require('express').Router();
// Models
const Admin = require('./models/admin');
const User = require("./models/user");
const DepositReason = require("./models/depositreason");
const FinancialLog = require("./models/financiallog");
const Bet = require("./models/bet");
const Sport = require("./models/sport");
const SportsDir = require("./models/sportsDir");
const LoginLog = require('./models/loginlog');
const Email = require("./models/email");
const AutoBet = require("./models/autobet");
const Promotion = require("./models/promotion");
const PromotionLog = require("./models/promotionlog");
const BetSportsBook = require("./models/betsportsbook");
const EventBetPool = require("./models/eventbetpool");
const Verification = require("./models/verification");
const Preference = require("./models/preference");
const FAQSubject = require("./models/faq_subject");
const Event = require("./models/event");
const Message = require("./models/message");
const MetaTag = require("./models/meta-tag");
const Addon = require("./models/addon");
const Article = require("./models/article");
const ArticleCategory = require("./models/article_category");
const Frontend = require("./models/frontend");
const Ticket = require('./models/ticket');
const FAQItem = require('./models/faq_item');
const BetPool = require('./models/betpool');
const ErrorLog = require('./models/errorlog');
//external Libraries
const ExpressBrute = require('express-brute');
const store = new ExpressBrute.MemoryStore(); // TODO: stores state locally, don't use this in production
const bruteforce = new ExpressBrute(store);
const jwt = require('jsonwebtoken');
const accessTokenSecret = 'PPWAdminSecretKey';
const dateformat = require("dateformat");
const { ObjectId } = require('mongodb');
const sgMail = require('@sendgrid/mail');
const axios = require('axios');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const _ = require("lodash");
//local helpers
const sendSMS = require("./libs/sendSMS");
const config = require("../config.json");
const FinancialStatus = config.FinancialStatus;
const CountryInfo = config.CountryInfo;
const EventStatus = config.EventStatus;
const AdminRoles = config.AdminRoles;
const simpleresponsive = require('./emailtemplates/simpleresponsive');
const fromEmailName = 'PAYPER WIN';
const fromEmailAddress = 'donotreply@payperwin.co';
const {
    checkSignupBonusPromotionEnabled,
    isSignupBonusUsed,
    ID,
    get2FACode,
    isFreeWithdrawalUsed,
    calculateBetsStatus
} = require('./libs/functions');

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
    console.log(token1, token);
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
            console.log(error);
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
                searchObj = {
                    ...searchObj,
                    ...{ email: { "$regex": email, "$options": "i" } }
                }
            }
            if (name) {
                searchObj = {
                    ...searchObj,
                    ...{
                        $or: [
                            {
                                firstname: { "$regex": name, "$options": "i" }
                            },
                            {
                                lastname: { "$regex": name, "$options": "i" }
                            }
                        ]
                    }
                }
            }
            if (balancemin || balancemax) {
                let balanceObj = {
                }
                if (balancemin) {
                    balanceObj = {
                        ...balanceObj,
                        ...{ $gte: parseInt(balancemin) }
                    }
                }
                if (balancemax) {
                    balanceObj = {
                        ...balanceObj,
                        ...{ $lte: parseInt(balancemax) }
                    }
                }
                searchObj = {
                    ...searchObj,
                    ...{ balance: balanceObj }
                }
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
                            localField: 'betHistory',
                            foreignField: '_id',
                            as: 'betHistory'
                        }
                    },
                    {
                        $lookup: {
                            from: 'betsportsbooks',
                            let: { betSportsbookHistory: "$betSportsbookHistory" },
                            pipeline: [
                                { $match: { $expr: { '$in': ['$_id', '$$betSportsbookHistory'] } } },
                                { $project: { _id: '$_id', bet: { $toDouble: '$WagerInfo.ToRisk' } } }
                            ],
                            as: 'betSportsbookHistory'
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
                            totalBetCount: { '$add': [{ '$size': '$betHistory' }, { '$size': '$betSportsbookHistory' }] },
                            totalWager: { $sum: [{ $sum: '$betHistory.bet' }, { $sum: '$betSportsbookHistory.bet' }] },
                            createdAt: 1
                        }
                    },
                    { $sort: sortObj },
                    { $skip: page * perPage },
                    { $limit: perPage },
                ],
                (error, data) => {
                    if (error) {
                        res.status(404).json({ error: 'Can\'t find customers.' });
                        return;
                    }
                    res.status(200).json({ total, perPage, page: page + 1, data });
                }
            )
        }
        catch (error) {
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
            const lastbets = await Bet.find({ userId: id })
                .sort({ createdAt: -1 }).limit(8);
            let totalwagers = await Bet.aggregate(
                {
                    $match: {
                        userId: new ObjectId(id),
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: "$bet"
                        }
                    }
                }
            );
            const lastsportsbookbets = await BetSportsBook.find({ userId: id })
                .sort({ createdAt: -1 }).limit(8);

            const betSportsbookHistory = await BetSportsBook.find({
                userId: new ObjectId(id),
            });
            let totalsportsbookwagers = 0;
            for (const bet of betSportsbookHistory) {
                totalsportsbookwagers += Number(bet.WagerInfo.ToRisk);
            }

            let totaldeposit = await FinancialLog.aggregate(
                {
                    $match: {
                        financialtype: "deposit",
                        user: new ObjectId(id),
                        status: FinancialStatus.success,
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
            )

            if (totalwagers.length) totalwagers = totalwagers[0].total;
            else totalwagers = 0;

            totalwagers += totalsportsbookwagers;

            if (totaldeposit.length) totaldeposit = totaldeposit[0].total;
            else totaldeposit = 0;

            const winloss = totaldeposit - user.balance;

            res.status(200).json({ lastbets, lastsportsbookbets, totalwagers, totaldeposit, winloss });
        }
        catch (error) {
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
            res.status(404).json({ error: 'Customer id is not given.' });
            return;
        }
        try {
            const searchObj = { user: id, financialtype: "deposit" };
            const total = await FinancialLog.find(searchObj).count();
            const deposits = await FinancialLog.find(searchObj).sort({ createdAt: -1 }).skip((page - 1) * perPage).limit(perPage).populate('reason');
            res.json({ total, page, perPage, deposits });
        }
        catch (error) {
            res.status(500).json({ error: 'Can\'t find Deposits.', result: error });
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
            res.status(404).json({ error: 'Customer id is not given.' });
            return;
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
                const searchObj = { userId: id };
                const total = await BetSportsBook.find(searchObj).count();
                const bets = await BetSportsBook.find(searchObj).sort({ createdAt: -1 }).skip((page - 1) * perPage).limit(perPage);
                res.json({ total, page, perPage, bets });
            }
            else {
                const searchObj = { userId: id };
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
                console.log(error);
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
            if (!reason) res.status(400).json({ error: 'Reason field is required.' });
            if (!amount) res.status(400).json({ error: 'Amount field is required.' });
            if (!method) res.status(400).json({ error: 'Method field is required.' });
            if (!status) status = FinancialStatus.pending;

            const user = await User.findById(userId);
            if (!user) {
                res.status(400).json({ error: 'Can\'t find user.' });
                return;
            }
            const reasonData = await DepositReason.findById(reason);
            if (!reasonData) {
                res.status(400).json({ error: 'Can\'t find reason.' });
                return;
            }
            const deposit = await FinancialLog.create({
                financialtype: 'deposit',
                uniqid: `D${ID()}`,
                user: user._id,
                reason: reasonData._id,
                amount,
                method,
                status
            });

            if (status == FinancialStatus.success) {
                const promotionEnabled = await checkSignupBonusPromotionEnabled(user._id);
                const promotionUsed = await isSignupBonusUsed(user._id);
                if (promotionEnabled && !promotionUsed) {
                    await FinancialLog.create({
                        financialtype: 'signupbonus',
                        uniqid: `SB${ID()}`,
                        user: user._id,
                        amount,
                        method,
                        status
                    });
                    await user.update({ $inc: { balance: amount } });
                }
                await user.update({ $inc: { balance: amount } });
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
                        ErrorLog.create({
                            name: 'Send Grid Error',
                            error: {
                                name: error.name,
                                message: error.message,
                                stack: error.stack
                            }
                        });
                    });
                }
                if (user.roles.phone_verified && (!preference || !preference.notification_settings || preference.notification_settings.deposit_confirmation.sms)) {
                    sendSMS('Just a quick reminder that you currently have funds in your PAYPER WIN account. You can find out how much is in your PAYPER WIN account by logging in now.', user.phone);
                }
            }
            res.json(deposit);
        } catch (error) {
            console.log(error)
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
                .populate('user', ['email', 'currency']).populate('reason', ['title']);
            res.json({ perPage, total, page: page + 1, data: deposits });
        } catch (error) {
            console.log(error);
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
            console.log(error);
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
            let { id, data } = req.body;

            const deposit = await FinancialLog.findById(id);
            if (deposit.status == FinancialStatus.success) {
                res.status(400).json({ error: 'Can\'t update finished deposit.' });
                return;
            }
            await deposit.update(data, { new: true }).exec();
            const result = await FinancialLog.findById(id).populate('user', ['username']).populate('reason', ['title']);

            const user = await User.findById(deposit.user);
            if (!user) {
                res.status(400).json({ error: 'Can\'t find user.' });
                return;
            }
            if (data.status == FinancialStatus.success) {
                const promotionEnabled = await checkSignupBonusPromotionEnabled(user._id);
                const promotionUsed = await isSignupBonusUsed(user._id);
                if (promotionEnabled && !promotionUsed) {
                    await FinancialLog.create({
                        financialtype: 'signupbonus',
                        uniqid: `SB${ID()}`,
                        user: user._id,
                        amount: deposit.amount,
                        method: deposit.method,
                        status: data.status
                    });
                    await user.update({ $inc: { balance: deposit.amount } });
                }

                await user.update({ $inc: { balance: deposit.amount } });
            }

            res.json(result);
        } catch (error) {
            console.log(error);
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
            let { user: userId, amount, method, status } = req.body;
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

            if (fee > 0) {
                await FinancialLog.create({
                    financialtype: 'withdrawfee',
                    uniqid: `WF${ID()}`,
                    user: user._id,
                    amount: fee,
                    method: method,
                    status: FinancialStatus.success,
                });
            }

            await FinancialLog.create({
                financialtype: 'withdraw',
                uniqid: `W${ID()}`,
                user: user._id,
                amount: amount,
                method: method,
                status: status,
                fee: fee,
            });

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
            const withdraws = await FinancialLog.find(searchObj)
                .sort({ createdAt: -1 })
                .skip(page * perPage)
                .limit(perPage)
                .populate('user', ['email', 'currency']).populate('reason', ['title']);
            const pending_total = await FinancialLog.find({}).count({ financialtype: 'withdraw', status: FinancialStatus.pending });
            res.json({ perPage, total, page: page + 1, data: withdraws, pending_total });
        } catch (error) {
            console.log(error);
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
            console.log(error);
            res.status(500).json({ error: 'Can\'t get withdrawa.', result: error });
        }
    }
)

const tripleAWithdraw = async (req, res, data, user, withdraw) => {
    const amount = data.amount ? data.amount : withdraw.amount;
    // const prebalance = parseInt(user.balance);
    const withdrawamount = parseInt(amount);
    // if (prebalance < withdrawamount + fee) {
    //     res.status(400).json({ error: 'Withdraw amount overflows balance.' });
    //     return false;
    // }

    const tripleAAddon = await Addon.findOne({ name: 'tripleA' });
    if (!tripleAAddon || !tripleAAddon.value || !tripleAAddon.value.merchant_key) {
        console.warn("TripleA Api is not set");
        return false;
    }
    const {
        tokenurl,
        paymenturl,
        payouturl,
        client_id,
        client_secret,
        notify_secret,
        btc_api_id,
        test_btc_api_id,
        eth_api_id,
        usdt_api_id,
        merchant_key,
        testMode,
    } = tripleAAddon.value;

    let access_token = null;
    try {
        const params = new URLSearchParams();
        params.append('client_id', client_id);
        params.append('client_secret', client_secret);
        params.append('grant_type', 'client_credentials');
        const { data } = await axios.post(tokenurl, params);
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
        "notify_url": "https://api.payperwin.co/triplea/withdraw",
        "notify_secret": notify_secret
    };
    let payout_reference = null;
    try {
        const { data } = await axios.post(payouturl, body, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });
        payout_reference = data.payout_reference;
    } catch (error) {
        ErrorLog.create({
            name: 'Triple-A Error',
            error: {
                name: error.name,
                message: error.message,
                stack: error.stack
            }
        });
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
            // const admin = await Admin.findById(req.user._id);
            let { id, data } = req.body;
            // const { _2fa_code } = data;
            // if (!_2fa_code) return res.status(403).json({ error: 'Authentication failed.' });
            // const isCodeValid = await verifyTwoFactorAuthenticationCode(admin.twoFactorAuthenticationCode, _2fa_code);
            // if (!isCodeValid) {
            //     return res.status(403).json({ error: 'Invalid Code.' });
            // }

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
            // const fee = CountryInfo.find(info => info.currency == user.currency).fee;
            // if (data.status == FinancialStatus.success) {
            //     const amount = data.amount ? data.amount : withdraw.amount;
            //     const prebalance = parseInt(user.balance);
            //     const withdrawamount = parseInt(amount);
            //     if (prebalance < withdrawamount + fee) {
            //         res.status(400).json({ error: 'Withdraw amount overflows balance.' });
            //         return;
            //     }
            //     user.balance = parseInt(user.balance) - parseInt(amount) - fee;
            // }

            if (data.status == FinancialStatus.inprogress) {
                if (withdraw.method == "Bitcoin" || withdraw.method == 'Ethereum' || withdraw.method == "Tether") {
                    const result = tripleAWithdraw(req, res, data, user, withdraw)
                    if (!result)
                        return;
                }
            }

            await withdraw.update(data, { new: true }).exec();
            // await user.save();
            const result = await FinancialLog.findById(id).populate('user', ['username']).populate('reason', ['title']);
            res.json(result);
        } catch (error) {
            console.log(error);
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
            let { page, datefrom, dateto, sport, status, minamount, maxamount, house, match, perPage } = req.query;
            if (!perPage) perPage = 25;
            perPage = parseInt(perPage);
            if (!page) page = 1;
            page--;
            let searchObj = {};
            if (!house || house == 'ppw') {
                if (status && status == 'open') {
                    searchObj = {
                        ...searchObj,
                        ...{ status: { $in: ['Pending', 'Partial Match', 'Matched'] } }
                    };
                } else if (status && status == 'settled') {
                    searchObj = {
                        ...searchObj,
                        ...{ status: { $in: ['Settled - Win', 'Settled - Lose', 'Cancelled', 'Draw'] } }
                    };
                }

                if (match && match == 'pending') {
                    searchObj = {
                        ...searchObj,
                        ...{ matchingStatus: { $in: ['Pending', 'Partial Match'] } }
                    };
                }
                else if (match && match == 'matched') {
                    searchObj = {
                        ...searchObj,
                        ...{ matchingStatus: 'Matched' }
                    };
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

                const total = await Bet.find(searchObj).count();
                const data = await Bet.find(searchObj)
                    .sort({ createdAt: -1 })
                    .skip(page * perPage)
                    .limit(perPage)
                    .populate('userId', ['email', 'currency'])
                page++;
                return res.json({ total, perPage, page, data, });
            } else if (house == 'pinnacle') {
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

                if (minamount || maxamount) {
                    let amountObj = {}
                    if (minamount) {
                        amountObj = {
                            ...amountObj,
                            ...{ $gte: [{ $toDouble: "$WagerInfo.ToRisk" }, parseInt(minamount)] }
                        }
                    }
                    if (maxamount) {
                        amountObj = {
                            ...amountObj,
                            ...{ $lte: [{ $toDouble: "$WagerInfo.ToRisk" }, parseInt(maxamount)] }
                        }
                    }
                    searchObj = {
                        ...searchObj,
                        ...{ $expr: amountObj }
                    }
                }

                const total = await BetSportsBook.find(searchObj).count();
                const data = await BetSportsBook.find(searchObj)
                    .sort({ createdAt: -1 })
                    .skip(page * perPage)
                    .limit(perPage)
                    .populate('userId', ['email', 'currency']);
                return res.json({ total, perPage, page, data, });
            } else {
                return res.status(404).json({ error: 'Can\'t find bets on house.' });
            }


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
            const lineQuery = bet.lineQuery;
            if (!bet) {
                return res.status(404).json({ success: false });
            }
            const user = await User.findById(user_id);
            if (user) {
                user.betHistory = user.betHistory.filter(bet => bet.toString() != id);
                user.balance = user.balance + bet.bet;
                await user.save();
            }
            let linePoints = bet.pickName.split(' ');
            if (lineQuery.type.toLowerCase() == 'moneyline') {
                linePoints = null;
            } else {
                linePoints = Number(linePoints[linePoints.length - 1]);
                if (bet.pick == 'away' || bet.pick == 'under') linePoints = -linePoints;
            }
            const betpool = await BetPool.findOne({
                sportId: lineQuery.sportId,
                leagueId: lineQuery.leagueId,
                eventId: lineQuery.eventId,
                lineId: lineQuery.lineId,
                lineType: lineQuery.type,
                sportName: lineQuery.sportName,
                origin: bet.origin,
                points: linePoints
            });
            if (betpool) {
                betpool.homeBets = betpool.homeBets.filter(bet => bet.toString() != id);
                betpool.awayBets = betpool.awayBets.filter(bet => bet.toString() != id);
                calculateBetsStatus(betpool.uid);
            }
            await Bet.deleteMany({ _id: id });
            res.json({ success: true });
        } catch (error) {
            console.log(error);
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
            if (!bet || bet.origin == 'other') {
                return res.status(404).json({ success: false });
            }
            const lineQuery = bet.lineQuery;
            let linePoints = bet.pickName.split(' ');
            if (lineQuery.type.toLowerCase() == 'moneyline') {
                linePoints = null;
            } else if (lineQuery.type.toLowerCase() == 'spread') {
                linePoints = Number(linePoints[linePoints.length - 1]);
                if (bet.pick == 'away' || bet.pick == 'under') linePoints = -linePoints;
            } else if (lineQuery.type.toLowerCase() == 'total') {
                linePoints = Number(linePoints[linePoints.length - 1]);
            }
            const betpool = await BetPool.findOne({
                sportId: lineQuery.sportId,
                leagueId: lineQuery.leagueId,
                eventId: lineQuery.eventId,
                lineId: lineQuery.lineId,
                lineType: lineQuery.type,
                sportName: lineQuery.sportName,
                origin: bet.origin,
                points: linePoints
            });
            if (!betpool) {
                return res.status(404).json({ success: false });
            }
            const {
                homeBets,
                awayBets,
                uid,
                lineType,
                points
            } = betpool;
            let matchCancelled = false;

            if (homeBets.length > 0 && awayBets.length > 0) {
                const { teamAScore: homeScore, teamBScore: awayScore, cancellationReason } = req.body;
                if (cancellationReason) {
                    matchCancelled = true;
                } else {
                    let moneyLineWinner = null;
                    if (homeScore > awayScore) moneyLineWinner = 'home';
                    else if (awayScore > homeScore) moneyLineWinner = 'away';
                    const bets = await Bet.find({
                        _id:
                        {
                            $in: [
                                ...homeBets,
                                ...awayBets,
                            ]
                        }
                    });

                    for (const bet of bets) {
                        const { _id, userId, bet: betAmount, toWin, pick, payableToWin, status } = bet;

                        if (payableToWin <= 0 || status == 'Pending') {
                            const { _id, userId, bet: betAmount } = bet;
                            await Bet.findOneAndUpdate({ _id }, { status: 'Cancelled' });
                            await User.findOneAndUpdate({ _id: userId }, { $inc: { balance: betAmount } });
                            await FinancialLog.create({
                                financialtype: 'betcancel',
                                uniqid: `BC${ID()}`,
                                user: userId,
                                amount: betAmount,
                                method: 'betcancel',
                                status: FinancialStatus.success,
                            });
                            continue;
                        }

                        let betWin;
                        let draw = false;
                        if (lineType === 'moneyline') {
                            betWin = pick === moneyLineWinner;
                            draw = awayScore == homeScore;
                        } else if (lineType === 'spread') {
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
                        } else if (lineType === 'total') {
                            const totalPoints = homeScore + awayScore;
                            const overUnderWinner = totalPoints > points ? 'home' : 'away';
                            betWin = pick === overUnderWinner;
                            console.log(totalPoints, betWin);
                        }

                        if (draw) {
                            // refund user
                            await Bet.findOneAndUpdate({ _id: _id }, { status: 'Draw' });
                            await User.findOneAndUpdate({ _id: userId }, { $inc: { balance: betAmount } });
                            await FinancialLog.create({
                                financialtype: 'betdraw',
                                uniqid: `BD${ID()}`,
                                user: userId,
                                amount: betAmount,
                                method: 'betdraw',
                                status: FinancialStatus.success,
                            });
                            continue;
                        }

                        if (betWin === true) {
                            // TODO: credit back bet ammount
                            const user = await User.findById(userId);
                            const betChanges = {
                                $set: {
                                    status: 'Settled - Win',
                                    walletBeforeCredited: user ? user.balance : 0,
                                    credited: betAmount + payableToWin,
                                    homeScore,
                                    awayScore,
                                }
                            }
                            await Bet.findOneAndUpdate({ _id }, betChanges);
                            if (user) {
                                const { email } = user;
                                const betFee = Number((payableToWin * 0.03).toFixed(2));
                                if (payableToWin > 0) {
                                    await User.findOneAndUpdate({ _id: userId }, { $inc: { balance: betAmount + payableToWin - betFee } });
                                    await FinancialLog.create({
                                        financialtype: 'betwon',
                                        uniqid: `BW${ID()}`,
                                        user: userId,
                                        amount: betAmount + payableToWin,
                                        method: 'betwon',
                                        status: FinancialStatus.success,
                                    });
                                    await FinancialLog.create({
                                        financialtype: 'betfee',
                                        uniqid: `BF${ID()}`,
                                        user: userId,
                                        amount: betFee,
                                        method: 'betfee',
                                        status: FinancialStatus.success,
                                    });
                                }
                                // TODO: email winner
                                const preference = await Preference.findOne({ user: user._id });
                                if (!preference || !preference.notification_settings || preference.notification_settings.win_confirmation.email) {
                                    const msg = {
                                        from: `${fromEmailName} <${fromEmailAddress}>`,
                                        to: email,
                                        subject: 'You won a wager!',
                                        text: `Congratulations! You won $${payableToWin.toFixed(2)}. View Result Details: https://www.payperwin.co/history`,
                                        html: simpleresponsive(`
                                                <p>
                                                    Congratulations! You won $${payableToWin.toFixed(2)}. View Result Details:
                                                </p>
                                                `,
                                            { href: 'https://www.payperwin.co/history', name: 'View Settled Bets' }
                                        ),
                                    };
                                    sgMail.send(msg).catch(error => {
                                        ErrorLog.create({
                                            name: 'Send Grid Error',
                                            error: {
                                                name: error.name,
                                                message: error.message,
                                                stack: error.stack
                                            }
                                        });
                                    });
                                }
                                if (user.roles.phone_verified && (!preference || !preference.notification_settings || preference.notification_settings.win_confirmation.sms)) {
                                    sendSMS(`Congratulations! You won $${payableToWin.toFixed(2)}.`, user.phone);
                                }
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
                                ? ((1 - (payableToWin / toWin)) * betAmount).toFixed(2) : null;
                            if (unplayableBet) {
                                betChanges.$set.credited = unplayableBet;
                                await User.findOneAndUpdate({ _id: userId }, { $inc: { balance: unplayableBet } });
                            }
                            await Bet.findOneAndUpdate({ _id }, betChanges);
                        } else {
                            console.log('error: somehow', lineType, 'bet did not result in win or loss. betWin value:', betWin);
                        }
                        await BetPool.findOneAndUpdate({ uid }, { $set: { result: 'Settled' } });
                    }
                }
            } else {
                matchCancelled = true;
            }

            if (matchCancelled) {
                for (const betId of homeBets) {
                    const bet = await Bet.findOne({ _id: betId });
                    const { _id, userId, bet: betAmount } = bet;
                    // refund user
                    await Bet.findOneAndUpdate({ _id }, { status: 'Cancelled' });
                    await User.findOneAndUpdate({ _id: userId }, { $inc: { balance: betAmount } });
                    await FinancialLog.create({
                        financialtype: 'betcancel',
                        uniqid: `BC${ID()}`,
                        user: userId,
                        amount: betAmount,
                        method: 'betcancel',
                        status: FinancialStatus.success,
                    });
                }
                for (const betId of awayBets) {
                    const bet = await Bet.findOne({ _id: betId });
                    const { _id, userId, bet: betAmount } = bet;
                    // refund user
                    await Bet.findOneAndUpdate({ _id }, { status: 'Cancelled' });
                    await User.findOneAndUpdate({ _id: userId }, { $inc: { balance: betAmount } });
                    await FinancialLog.create({
                        financialtype: 'betcancel',
                        uniqid: `BC${ID()}`,
                        user: userId,
                        amount: betAmount,
                        method: 'betcancel',
                        status: FinancialStatus.success,
                    });
                }
                await BetPool.findOneAndUpdate({ uid }, { $set: { result: 'Cancelled' } });
            }

            res.json({ success: true });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false });
        }
    }
)

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

            searchObj = {};
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

            if (minamount || maxamount) {
                let amountObj = {}
                if (minamount) {
                    amountObj = {
                        ...amountObj,
                        ...{ $gte: [{ $toDouble: "$WagerInfo.ToRisk" }, parseInt(minamount)] }
                    }
                }
                if (maxamount) {
                    amountObj = {
                        ...amountObj,
                        ...{ $lte: [{ $toDouble: "$WagerInfo.ToRisk" }, parseInt(maxamount)] }
                    }
                }
                searchObj = {
                    ...searchObj,
                    ...{ $expr: amountObj }
                }
            }

            const betSportsBook = await BetSportsBook.find(searchObj)
                .sort({ createdAt: -1 })
                .populate('userId', ['username', 'email', 'currency']);

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
                    'PPW',
                    bet.userId.username,
                    bet.userId.email,
                    bet.origin == 'other' ? 'Other' : bet.lineQuery.sportName,
                    bet.origin == 'other' ? bet.lineQuery : `${bet.teamA.name} vs ${bet.teamB.name}`,
                    `$ ${bet.bet}`,
                    Number(bet.pickOdds) > 0 ? `+${Number(bet.pickOdds).toFixed(2)}` : `${Number(bet.pickOdds).toFixed(2)}`,
                    results,
                    winLoss,
                    dateformat(bet.updatedAt, 'default')
                ]);
            })
            betSportsBook.forEach(bet => {
                data.push([
                    'Pinnacle',
                    bet.userId.username,
                    bet.userId.email,
                    bet.WagerInfo.Sport,
                    bet.WagerInfo.EventName,
                    `$ ${Number(bet.WagerInfo.ToRisk)}`,
                    Number(bet.WagerInfo.Odds) > 0 ? `+${Number(bet.WagerInfo.Odds).toFixed(2)}` : `${Number(bet.WagerInfo.Odds).toFixed(2)}`,
                    bet.WagerInfo.Outcome ? bet.WagerInfo.Outcome : '-',
                    bet.WagerInfo.ProfitAndLoss ? (Number(bet.WagerInfo.ProfitAndLoss) > 0 ? `+ $${Number(bet.WagerInfo.ProfitAndLoss).toFixed(2)}` : `- $${Number(-bet.WagerInfo.ProfitAndLoss).toFixed(2)}`) : '-',
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
            if (bet) {
                bet = JSON.parse(JSON.stringify(bet));
                bet.house = 'ppw';
                return res.json(bet);
            }
            bet = await BetSportsBook.findById(id).populate('userId', ['email', 'currency']);
            if (bet) {
                bet = JSON.parse(JSON.stringify(bet));
                bet.house = 'pinnacle';
            }
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
                }
            }
        },
        {
            $group: {
                _id: null,
                total: {
                    $sum: "$bet"
                }
            }
        }
    );
    if (total.length) return total[0].total;
    return 0;
}

const getTotalWagerSportsBook = async (datefrom, dateto) => {
    datefrom = new Date(datefrom);
    dateto = new Date(dateto);
    const betSportsbookHistory = await BetSportsBook.find({
        createdAt: {
            $gte: datefrom,
            $lte: dateto
        }
    });
    let total = 0;
    for (const bet of betSportsbookHistory) {
        total += Number(bet.WagerInfo.ToRisk);
    }
    return total;
}

const getTotalPlayer = async (datefrom, dateto) => {
    datefrom = new Date(datefrom);
    dateto = new Date(dateto);
    const total = await User.aggregate(
        {
            $match: {
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
                    $sum: 1
                }
            }
        }
    );
    if (total.length) return total[0].total;
    return 0;
}

const getTotalActivePlayer = async (datefrom, dateto) => {
    datefrom = new Date(datefrom);
    dateto = new Date(dateto);
    const total = await Bet.aggregate(
        {
            $match: {
                createdAt: {
                    $gte: datefrom,
                    $lte: dateto
                }
            }
        },
        {
            $group: {
                _id: "$userId",
                total: {
                    $sum: 1
                }
            }
        }
    );
    if (total.length) return total[0].total;
    return 0;
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
        {
            $group: {
                _id: null,
                total: {
                    $sum: "$amount"
                }
            }
        }
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
            let { range, dateranges, categories } = req.body;
            if (!dateranges || !categories) {
                if (!range) range = 'today';
                dateranges = [];
                categories = [];
                const nowDate = new Date();
                const year = nowDate.getFullYear();
                const month = nowDate.getMonth();
                const date = nowDate.getDate();
                switch (range) {
                    case 'today':
                        for (let i = 0; i <= 24; i += 2) {
                            let ndate = new Date(year, month, date, i);
                            dateranges.push(ndate);
                            categories.push(dateformat(ndate, "HH:MM"));
                        }
                        break;
                    case 'yesterday':
                        for (let i = 0; i <= 24; i += 2) {
                            let ndate = new Date(year, month, date - 1, i);
                            dateranges.push(ndate);
                            categories.push(dateformat(ndate, "HH:MM"));
                        }
                        break;
                    case 'last7days':
                        for (let i = 0; i <= 7; i++) {
                            let ndate = new Date(year, month, date + i - 7)
                            dateranges.push(ndate);
                            categories.push(dateformat(ndate, "mmm d"));
                        }
                        break;
                    case 'last30days':
                        for (let i = 0; i <= 30; i++) {
                            let ndate = new Date(year, month, date + i - 30);
                            dateranges.push(ndate);
                            categories.push(dateformat(ndate, "mmm d"));
                        }
                        break;
                    case 'thismonth':
                        for (let i = 0; i <= date; i++) {
                            let ndate = new Date(year, month, i);
                            dateranges.push(ndate);
                            categories.push(dateformat(ndate, "mmm d"));
                        }
                        break;
                    case 'lastmonth':
                        let limit = new Date(year, month, 0);
                        for (let i = 0; i <= 31; i++) {
                            let ndate = new Date(year, month - 1, i);
                            dateranges.push(ndate);
                            categories.push(dateformat(ndate, "mmm d"));
                            if (ndate.getTime() >= limit.getTime())
                                break;
                        }
                        break;
                    case 'thisyear':
                    default:
                        for (let i = 0; i <= 12; i++) {
                            let ndate = new Date(year, i, 1);
                            dateranges.push(ndate);
                            categories.push(dateformat(ndate, "mmmm"));
                        }
                        break;
                };
            }

            const totaldeposit = await getTotalDeposit(dateranges[0], dateranges[dateranges.length - 1]);
            const totalwager = await getTotalWager(dateranges[0], dateranges[dateranges.length - 1]);
            const totalwagersportsbook = await getTotalWagerSportsBook(dateranges[0], dateranges[dateranges.length - 1]);
            const totalplayer = await getTotalPlayer(new Date(0), new Date());
            const totalactiveplayer = await getTotalActivePlayer(dateranges[0], dateranges[dateranges.length - 1]);
            const totalfees = await getTotalFees(dateranges[0], dateranges[dateranges.length - 1]);
            let deposits = [];
            let wagers = [];
            let wagerssportsbook = [];
            let players = [];
            let activeplayers = [];
            let fees = [];
            for (let i = 1; i < dateranges.length; i++) {
                const deposit = await getTotalDeposit(dateranges[i - 1], dateranges[i]);
                deposits.push(deposit);
                const wager = await getTotalWager(dateranges[i - 1], dateranges[i]);
                wagers.push(wager);
                const wagersportsbook = await getTotalWagerSportsBook(dateranges[i - 1], dateranges[i]);
                wagerssportsbook.push(wagersportsbook);
                const player = await getTotalPlayer(dateranges[i - 1], dateranges[i]);
                players.push(player);
                const activeplayer = await getTotalActivePlayer(dateranges[i - 1], dateranges[i]);
                activeplayers.push(activeplayer);
                const fee = await getTotalFees(dateranges[i - 1], dateranges[i]);
                fees.push(fee);
            }

            res.json({
                totaldeposit, deposits,
                totalwager, wagers,
                totalwagersportsbook, wagerssportsbook,
                totalplayer, players,
                totalactiveplayer, activeplayers,
                totalfees, fees,
                categories,
            });
        } catch (error) {
            console.log(error);
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
            const existing = await AutoBet.find({ userId: ObjectId(data.userId) });
            if (existing && existing.length) {
                return res.json({ success: false, message: "He/She is already autobet user." });
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
        AutoBet.find({})
            .sort({ createdAt: -1 })
            .skip(page * perPage)
            .limit(perPage)
            .populate('userId', ['username', 'balance', 'email', 'firstname', 'lastname'])
            .exec((error, data) => {
                if (error) {
                    res.status(404).json({ error: 'Can\'t find customers.' });
                    return;
                }
                res.status(200).json({ total, perPage, page: page + 1, data });
            });
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
            const autobet = await AutoBet.findById(new ObjectId(id))
            if (!autobet) {
                return res.status(404).json({ error: 'Can\'t find autobet data.' });
            }
            await autobet.update(data);
            const result = await AutoBet
                .findById(new ObjectId(id))
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

adminRouter.post(
    '/promotion',
    authenticateJWT,
    limitRoles('promotions'),
    async (req, res) => {
        const data = req.body;
        try {
            await Promotion.create(data);
            res.json("Promotion created.");
        } catch (error) {
            return res.status(500).json({ error: 'Can\'t create promotion.' });
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
                    ErrorLog.create({
                        name: 'Send Grid Error',
                        error: {
                            name: error.name,
                            message: error.message,
                            stack: error.stack
                        }
                    });
                });
            }
            if (user.roles.phone_verified && (!preference || !preference.notification_settings || preference.notification_settings.other.sms)) {
                sendSMS('Just a quick reminder that your identify was verified. You can withdraw from your PAYPER WIN account by logging in now.', user.phone);
            }

            res.send("User verified successfully.");
        } catch (error) {
            console.log("accept Error => ", error);
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
                    ErrorLog.create({
                        name: 'Send Grid Error',
                        error: {
                            name: error.name,
                            message: error.message,
                            stack: error.stack
                        }
                    });
                });
            }
            if (user.roles.phone_verified && (!preference || !preference.notification_settings || preference.notification_settings.other.sms)) {
                sendSMS('Just a quick reminder that Your identify verification was declined. Please submit identification proof documents again by logging in now.', user.phone);
            }

            res.send("User declined.");
        } catch (error) {
            console.log("declined Error => ", error);
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
            console.log(error);
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
                ErrorLog.create({
                    name: 'Send Grid Error',
                    error: {
                        name: error.name,
                        message: error.message,
                        stack: error.stack
                    }
                });
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
            console.log(error);
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
            console.log(error)
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
            console.log(error);
            return res.status(400).json({ error: 'Can\'t update item.' });
        }
    }
)

adminRouter.post(
    '/events',
    authenticateJWT,
    limitRoles('custom-events'),
    bruteforce.prevent,
    async (req, res) => {
        try {
            let { name, startDate, teamA, teamB } = req.body;
            if (!name || !startDate || !teamA || !teamB) {
                return res.status(400).json({ error: 'Please enter all required fields.' });
            }
            teamA = {
                name: teamA.name,
                currentOdds: teamA.odds,
                odds: [teamA.odds]
            }
            teamB = {
                name: teamB.name,
                currentOdds: teamB.odds,
                odds: [teamB.odds]
            }
            await Event.create({ name, startDate, teamA, teamB });
            res.json({ success: "Event created." });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ error: 'Can\'t create Event.' });
        }
    }
)

adminRouter.get(
    '/events/:id',
    authenticateJWT,
    limitRoles('custom-events'),
    async (req, res) => {
        let { id } = req.params;
        try {
            const event = await Event.findById(id);
            if (!event) {
                return res.status(404).json({ error: 'Can\'t find events.' });
            }
            res.status(200).json(event);
        } catch (error) {
            console.log(error);
            res.status(404).json({ error: 'Can\'t find events.' });
        }
    }
);

adminRouter.put(
    '/events/:id',
    authenticateJWT,
    limitRoles('custom-events'),
    async (req, res) => {
        let { id } = req.params;
        const { name, startDate, teamA, teamB, approved } = req.body;
        try {
            const event = await Event.findById(id);
            if (!event) {
                return res.status(404).json({ error: 'Can\'t find events.' });
            }
            if (name) {
                event.name = name;
            }
            if (startDate) {
                event.startDate = startDate;
            }
            if (teamA) {
                event.teamA = {
                    name: teamA.name,
                    currentOdds: teamA.odds,
                    odds: [...event.teamA.odds, teamA.odds]
                }
            }
            if (teamB) {
                event.teamB = {
                    name: teamB.name,
                    currentOdds: teamB.odds,
                    odds: [...event.teamB.odds, teamB.odds]
                }
            }
            if (approved != null || approved != undefined) {
                event.approved = approved;
            }
            await event.save();
            res.status(200).json({ success: true });
        } catch (error) {
            console.log(error);
            res.status(404).json({ error: 'Can\'t save events.' });
        }
    }
);

const matchResults = async (eventId, matchResult) => {
    const betpool = await EventBetPool.findOne({
        eventId: eventId,
        // matchStartDate: { $lt: new Date() },
        result: { $exists: false }
    });

    if (!betpool) {
        console.log('no eligible betpool');
        return false;
    }

    const { homeBets, awayBets } = betpool;
    let matchCancelled = false;
    if (homeBets.length > 0 && awayBets.length > 0) {
        try {
            const { homeScore, awayScore, cancellationReason } = matchResult;
            if (cancellationReason) {
                matchCancelled = true;
            }
            if (!cancellationReason) {
                let moneyLineWinner = null;
                if (homeScore > awayScore) moneyLineWinner = 'home';
                else if (awayScore > homeScore) moneyLineWinner = 'away';
                const bets = await Bet.find({
                    _id:
                    {
                        $in: [
                            ...homeBets,
                            ...awayBets,
                        ]
                    }
                });
                for (const bet of bets) {
                    const { _id, userId, bet: betAmount, toWin, pick, payableToWin, status } = bet;

                    if (payableToWin <= 0 || status == 'Pending') {
                        const { _id, userId, bet: betAmount } = bet;
                        await Bet.findOneAndUpdate({ _id }, { status: 'Cancelled' });
                        await User.findOneAndUpdate({ _id: userId }, { $inc: { balance: betAmount } });
                        await FinancialLog.create({
                            financialtype: 'betcancel',
                            uniqid: `BC${ID()}`,
                            user: userId,
                            amount: betAmount,
                            method: 'betcancel',
                            status: FinancialStatus.success,
                        });
                        continue;
                    }

                    let betWin = pick === moneyLineWinner;

                    if (betWin === true) {
                        const user = await User.findById(userId);
                        const { balance, email } = user;
                        const betChanges = {
                            $set: {
                                status: 'Settled - Win',
                                walletBeforeCredited: balance,
                                credited: betAmount + payableToWin,
                                homeScore,
                                awayScore,
                            }
                        }
                        const betFee = Number((payableToWin * 0.03).toFixed(2));
                        await Bet.findOneAndUpdate({ _id }, betChanges);
                        await User.findOneAndUpdate({ _id: userId }, { $inc: { balance: betAmount + payableToWin - betFee } });
                        await FinancialLog.create({
                            financialtype: 'betwon',
                            uniqid: `BW${ID()}`,
                            user: userId,
                            amount: betAmount + payableToWin,
                            method: 'betwon',
                            status: FinancialStatus.success,
                        });
                        await FinancialLog.create({
                            financialtype: 'betfee',
                            uniqid: `BF${ID()}`,
                            user: userId,
                            amount: betFee,
                            method: 'betfee',
                            status: FinancialStatus.success,
                        });
                        // TODO: email winner

                        const preference = await Preference.findOne({ user: user._id });
                        if (!preference || !preference.notification_settings || preference.notification_settings.other.email) {
                            const msg = {
                                from: `${fromEmailName} <${fromEmailAddress}>`,
                                to: email,
                                subject: 'You won a wager!',
                                text: `Congratulations! You won $${payableToWin.toFixed(2)}. View Result Details: https://www.payperwin.co/history`,
                                html: simpleresponsive(`
                                            <p>
                                                Congratulations! You won $${payableToWin.toFixed(2)}. View Result Details:
                                            </p>
                                            `,
                                    { href: 'https://www.payperwin.co/history', name: 'View Settled Bets' }
                                ),
                            };
                            sgMail.send(msg).catch(error => {
                                ErrorLog.create({
                                    name: 'Send Grid Error',
                                    error: {
                                        name: error.name,
                                        message: error.message,
                                        stack: error.stack
                                    }
                                });
                            });

                        }
                        if (user.roles.phone_verified && (!preference || !preference.notification_settings || preference.notification_settings.other.sms)) {
                            sendSMS(`Congratulations! You won $${payableToWin.toFixed(2)}.`, user.phone);
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
                            ? ((1 - (payableToWin / toWin)) * betAmount).toFixed(2) : null;
                        if (unplayableBet) {
                            betChanges.$set.credited = unplayableBet;
                            await User.findOneAndUpdate({ _id: userId }, { $inc: { balance: unplayableBet } });
                        }
                        await Bet.findOneAndUpdate({ _id }, betChanges);
                    } else {
                        console.log('error: somehow', lineType, 'bet did not result in win or loss. betWin value:', betWin);
                    }
                    await betpool.update({ $set: { result: 'Settled' } });
                }
            }
        } catch (e) {
            console.log(e);
        }
    } else {
        matchCancelled = true;
    }
    if (matchCancelled) {
        for (const betId of homeBets) {
            const bet = await Bet.findOne({ _id: betId });
            const { _id, userId, bet: betAmount } = bet;
            // refund user
            await Bet.findOneAndUpdate({ _id }, { status: 'Cancelled' });
            await User.findOneAndUpdate({ _id: userId }, { $inc: { balance: betAmount } });
            await FinancialLog.create({
                financialtype: 'betcancel',
                uniqid: `BC${ID()}`,
                user: userId,
                amount: betAmount,
                method: 'betcancel',
                status: FinancialStatus.success,
            });
        }
        for (const betId of awayBets) {
            const bet = await Bet.findOne({ _id: betId });
            const { _id, userId, bet: betAmount } = bet;
            // refund user
            await Bet.findOneAndUpdate({ _id }, { status: 'Cancelled' });
            await User.findOneAndUpdate({ _id: userId }, { $inc: { balance: betAmount } });
            await FinancialLog.create({
                financialtype: 'betcancel',
                uniqid: `BC${ID()}`,
                user: userId,
                amount: betAmount,
                method: 'betcancel',
                status: FinancialStatus.success,
            });
        }
        await betpool.update({ $set: { result: 'Cancelled' } });
    }
}

adminRouter.post(
    '/events/:id/settle',
    authenticateJWT,
    limitRoles('custom-events'),
    async (req, res) => {
        let { id } = req.params;
        const { teamAScore, teamBScore } = req.body;
        try {
            const event = await Event.findById(id);
            if (!event) {
                return res.status(404).json({ error: 'Can\'t find events.' });
            }
            if ((new Date(event.startDate)).getTime() > (new Date()).getTime()) {
                return res.status(404).json({ error: 'Event is not started yet.' });
            }
            if (event.status == EventStatus['settled'].value || event.status == EventStatus['canceled'].value) {
                return res.status(404).json({ error: 'Event is already finished.' });
            }
            event.status = EventStatus.settled.value;
            event.teamAScore = teamAScore;
            event.teamBScore = teamBScore;
            await event.save();

            await matchResults(id, { homeScore: teamAScore, awayScore: teamBScore });

            res.status(200).json({ success: true });
        } catch (error) {
            console.log(error);
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
            if (event.status == EventStatus['settled'].value || event.status == EventStatus['canceled'].value) {
                return res.status(404).json({ error: 'Event is already finished.' });
            }
            event.status = EventStatus.canceled.value;
            await event.save();

            await matchResults(id, { homeScore: null, awayScore: null, cancellationReason: true });

            res.status(200).json({ success: true });
        } catch (error) {
            console.log(error);
            res.status(404).json({ error: 'Can\'t save events.' });
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
                    findObj = { ...findObj, startDate: { $lt: new Date() } };
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
            console.log(error);
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
                    const users_wager = await User.find();
                    users_wager.forEach(user => {
                        if ((user.betHistory.length + user.betSportsbookHistory.length) < wager_more) return;
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
                //     console.log(JSON.parse(JSON.stringify(online_before_login_log)));

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
                            ErrorLog.create({
                                name: 'Send Grid Error',
                                error: {
                                    name: error.name,
                                    message: error.message,
                                    stack: error.stack
                                }
                            });
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
                    const users_wager = await User.find();
                    users_wager.forEach(user => {
                        if ((user.betHistory.length + user.betSportsbookHistory.length) < wager_more) return;
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
                //     console.log(JSON.parse(JSON.stringify(online_before_login_log)));

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
                            ErrorLog.create({
                                name: 'Send Grid Error',
                                error: {
                                    name: error.name,
                                    message: error.message,
                                    stack: error.stack
                                }
                            });
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
                "$project": {
                    "username": 1,
                    "email": 1,
                    "betHistory": 1,
                    "betSportsbookHistory": 1,
                    "total_bets": { "$add": [{ "$size": "$betHistory" }, { "$size": "$betSportsbookHistory" }] }
                }
            },
            { "$sort": { "total_bets": -1 } },
            { "$limit": count },
        ])
        data = await Bet.populate(data, { path: "betHistory" });
        data = await BetSportsBook.populate(data, { path: 'betSportsbookHistory' });
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
            data.betSportsbookHistory.forEach(bet => {
                if (bet.Name == 'SETTLED' && bet.WagerInfo.Outcome == 'LOSE') {
                    loss += Number(bet.WagerInfo.ToRisk);
                    return;
                }
                if (bet.Name == 'SETTLED' && bet.WagerInfo.Outcome == 'WIN') {
                    win += Number(bet.WagerInfo.ProfitAndLoss);
                    return;
                }
            })
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
                "$project": {
                    "username": 1,
                    "email": 1,
                    "betHistory": 1,
                    "betSportsbookHistory": 1,
                    "total_bets": { "$add": [{ "$size": "$betHistory" }, { "$size": "$betSportsbookHistory" }] }
                }
            },
            { "$sort": { "total_bets": -1 } },
            { "$limit": count },
        ])
        data = await Bet.populate(data, { path: "betHistory" });
        data = await BetSportsBook.populate(data, { path: 'betSportsbookHistory' });
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
            data.betSportsbookHistory.forEach(bet => {
                if (bet.Name == 'SETTLED' && bet.WagerInfo.Outcome == 'LOSE') {
                    loss += Number(bet.WagerInfo.ToRisk);
                    return;
                }
                if (bet.Name == 'SETTLED' && bet.WagerInfo.Outcome == 'WIN') {
                    win += Number(bet.WagerInfo.ProfitAndLoss);
                    return;
                }
            })
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
            console.log(error)
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

adminRouter.post(
    '/articles',
    authenticateJWT,
    limitRoles('articles'),
    async (req, res) => {
        const data = req.body;
        let articleObj = {
            ...data,
            published_at: data.publish ? new Date() : null
        };
        delete articleObj.publish;
        try {
            await Article.create(articleObj);
            res.json({ success: true });
        } catch (error) {
            console.log(error)
            res.status(500).json({ success: false });
        }
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
            console.log(error)
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
            console.log(error)
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
            const data = req.body;
            let articleObj = {
                ...data,
                published_at: data.publish ? new Date() : null
            };
            delete articleObj.publish;
            await Article.findByIdAndUpdate(id, articleObj);
            res.json({ success: true });
        } catch (error) {
            console.log(error)
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
            console.log(error)
            res.status(400).json({ success: false });
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
            console.log(error)
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
    async (req, res) => {
        const { name } = req.params;
        const value = req.body;
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
            console.log(error)
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
            console.log(error)
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
            console.log(error)
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

            const lossbetsSportsbook = await BetSportsBook.find({
                Name: "SETTLED",
                userId: user_id,
                "WagerInfo.Outcome": "LOSE",
                createdAt: {
                    $gte: new Date(year, month - 1, 0),
                    $lte: new Date(year, month, 0),
                }
            });

            const user = await User.findById(user_id);

            res.json({ history: lossbetsSportsbook, user });

        } catch (error) {
            console.log(error)
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
            console.log(error)
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
            console.log(error)
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
            console.log(error);
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

module.exports = adminRouter;
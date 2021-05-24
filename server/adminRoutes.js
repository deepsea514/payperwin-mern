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
const BetSportsBook = require("./models/betsportsbook");
const Verification = require("./models/verification");
const Preference = require("./models/preference");
const FAQSubject = require("./models/faq_subject");
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
//local helpers
const config = require("../config.json");
const FinancialStatus = config.FinancialStatus;
const CountryInfo = config.CountryInfo;
const TripleA = config.TripleA;
const simpleresponsive = require('./emailtemplates/simpleresponsive');
const Ticket = require('./models/ticket');
const FAQItem = require('./models/faq_item');
const fromEmailName = 'PAYPER Win';
const fromEmailAddress = 'donotreply@payperwin.co';

const ID = function () {
    return '' + Math.random().toString(10).substr(2, 9);
};

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

adminRouter.post('/login', bruteforce.prevent, async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });
        if (admin) {
            admin.comparePassword(password, function (error, isMatch) {
                if (error) {
                    res.status(404).json({ error: 'Admin doesn\'t exist.' });
                    return;
                }
                if (isMatch) {
                    const data = admin._doc;
                    const accessToken = jwt.sign(data, accessTokenSecret, { expiresIn: '2d' });
                    res.json({ accessToken });
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

});

adminRouter.post(
    '/createnew',
    authenticateJWT,
    async (req, res) => {
        const { email, password, username } = req.body;
        try {
            await Admin.create({ email, password, username });
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

adminRouter.patch(
    '/changePassword',
    authenticateJWT,
    async (req, res) => {
        const { password, newpassword } = req.body;
        const { email } = req.user;
        const admin = await Admin.findOne({ email });

        admin.comparePassword(password, async function (error, isMatch) {
            if (error) {
                res.status(404).json({ error: 'Admin doesn\'t exist.' });
                return;
            }
            if (isMatch) {
                admin.password = newpassword;
                await admin.save();
                res.status(404).json("Password changed.");
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
    (req, res) => {
        delete req.user.password;
        res.status(200).json(req.user);
    },
);

adminRouter.get(
    '/customers',
    authenticateJWT,
    async (req, res) => {
        try {
            let { page, perPage, name, email, balancemin, balancemax } = req.query;
            if (!perPage) perPage = 25;
            perPage = parseInt(perPage);
            if (!page) page = 1;
            page--;
            let searchObj = { deletedAt: null };
            if (name) {
                searchObj = {
                    ...searchObj,
                    ...{ username: { "$regex": name, "$options": "i" } }
                }
            }
            if (email) {
                searchObj = {
                    ...searchObj,
                    ...{ email: { "$regex": email, "$options": "i" } }
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
            User.find(searchObj)
                .sort({ createdAt: -1 })
                .skip(page * perPage)
                .limit(perPage)
                .exec(async function (error, data) {
                    if (error) {
                        res.status(404).json({ error: 'Can\'t find customers.' });
                        return;
                    }
                    data = JSON.parse(JSON.stringify(data));
                    for (let i = 0; i < data.length; i++) {
                        let totalWager = 0;
                        const betHistory = await Bet.find({ userId: data[i]._id });
                        const betSportsbookHistory = await BetSportsBook.find({ userId: data[i]._id });
                        for (const bet of betHistory) {
                            totalWager += bet.bet;
                        }
                        for (const bet of betSportsbookHistory) {
                            totalWager += Number(bet.WagerInfo.ToRisk);
                        }
                        data[i].totalWager = totalWager;
                        data[i].betHistory = betHistory;
                        data[i].betSportsbookHistory = betSportsbookHistory;
                    }
                    res.status(200).json({ total, perPage, page: page + 1, data });
                })
        }
        catch (error) {
            res.status(500).json({ error: 'Can\'t find customers.', message: error });
        }
    }
)

adminRouter.get(
    '/customer',
    authenticateJWT,
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
    async (req, res) => {
        const { id } = req.query;
        if (!id) {
            res.status(404).json({ error: 'Customer id is not given.' });
            return;
        }
        try {
            const lastbets = await Bet.find({ userId: id, deletedAt: null })
                .sort({ createdAt: -1 }).limit(8);
            let totalwagers = await Bet.aggregate(
                {
                    $match: {
                        userId: new ObjectId(id),
                        deletedAt: null,
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
            const lastsportsbookbets = await BetSportsBook.find({ userId: id, deletedAt: null })
                .sort({ createdAt: -1 }).limit(8);

            const betSportsbookHistory = await BetSportsBook.find({
                userId: new ObjectId(id),
                deletedAt: null,
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
                        deletedAt: null,
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

            res.status(200).json({ lastbets, lastsportsbookbets, totalwagers, totaldeposit });
        }
        catch (error) {
            res.status(500).json({ error: 'Can\'t find customer.', result: error });
        }
    }
)

adminRouter.get(
    '/customer-loginhistory',
    authenticateJWT,
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
            const total = await LoginLog.find({ user: id, deletedAt: null }).count();
            const loginHistory = await LoginLog.find({ user: id, deletedAt: null }).sort({ createdAt: -1 }).skip((page - 1) * perPage).limit(perPage);
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
            const searchObj = { user: id, deletedAt: null, financialtype: "deposit" };
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
            const searchObj = { user: id, deletedAt: null, financialtype: "withdraw" };
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
                const searchObj = { userId: id, deletedAt: null };
                const total = await BetSportsBook.find(searchObj).count();
                const bets = await BetSportsBook.find(searchObj).sort({ createdAt: -1 }).skip((page - 1) * perPage).limit(perPage);
                res.json({ total, page, perPage, bets });
            }
            else {
                const searchObj = { userId: id, deletedAt: null };
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

adminRouter.patch(
    '/customer',
    authenticateJWT,
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
    async (req, res) => {
        const { id } = req.query;
        if (id) {
            try {
                const customer = await User.findByIdAndUpdate(id, {
                    deletedAt: new Date()
                });
                res.status(200).json(customer);
            } catch (erorr) {
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
    async (req, res) => {
        try {
            const reasons = await DepositReason.find({ deletedAt: null });
            res.status(200).json(reasons);
        } catch (erorr) {
            res.status(500).json({ error: 'Can\'t get deposit reasons.', result: error });
        }
    }
)

adminRouter.post(
    '/depositreasons',
    authenticateJWT,
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
    async (req, res) => {
        try {
            let { user, reason, amount, method, status } = req.body;
            if (!user) res.status(400).json({ error: 'User field is required.' });
            if (!reason) res.status(400).json({ error: 'Reason field is required.' });
            if (!amount) res.status(400).json({ error: 'Amount field is required.' });
            if (!method) res.status(400).json({ error: 'Method field is required.' });
            if (!status) status = "Pending";

            const userdata = await User.findById(user);
            if (!userdata) {
                res.status(400).json({ error: 'Can\'t find user.' });
                return;
            }
            const reasonData = await DepositReason.findById(reason);
            if (!reasonData) {
                res.status(400).json({ error: 'Can\'t find reason.' });
                return;
            }
            const deposit = new FinancialLog({
                financialtype: 'deposit',
                uniqid: `D${ID()}`,
                user: userdata._id,
                reason: reasonData._id,
                amount,
                method,
                status
            });
            await deposit.save();

            userdata.depositlog = [...userdata.depositlog, ...[deposit._id]];
            if (status == FinancialStatus.success) {
                userdata.balance = parseInt(userdata.balance) + parseInt(amount);
            }
            await userdata.save();

            const msg = {
                from: `"${fromEmailName}" <${fromEmailAddress}>`,
                to: userdata.email,
                subject: 'You’ve got funds in your account',
                text: `You’ve got funds in your account`,
                html: simpleresponsive(
                    `Hi <b>${userdata.firstname}</b>.
                    <br><br>
                    Just a quick reminder that you currently have funds in your Payper Win account. You can find out how much is in
                    your Payper Win account by logging in now.
                    <br><br>`),
            };
            sgMail.send(msg);

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
    async (req, res) => {
        try {
            let { page, datefrom, dateto, method, status, minamount, maxamount, perPage } = req.query;
            if (!page) page = 1;
            if (!perPage) perPage = 25;
            perPage = parseInt(perPage);
            page--;
            let searchObj = { financialtype: 'deposit', deletedAt: null };
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
                .populate('user', ['username', 'currency']).populate('reason', ['title']);
            res.json({ perPage, total, page: page + 1, data: deposits });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Can\'t get deposits.', result: error });
        }
    }
)

adminRouter.patch(
    '/deposit',
    authenticateJWT,
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

            const userdata = await User.findById(deposit.user);
            if (!userdata) {
                res.status(400).json({ error: 'Can\'t find user.' });
                return;
            }
            if (data.status == FinancialStatus.success) {
                userdata.balance = parseInt(userdata.balance) + parseInt(deposit.amount);
            }
            await userdata.save();

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
    async (req, res) => {
        try {
            let { id } = req.query;
            const deposit = await FinancialLog.findById(id);
            if (deposit.status == FinancialStatus.success) {
                res.status(400).json({ error: 'Can\'t delete finished log.' });
                return;
            }
            deposit.update({ deletedAt: new Date() }).exec();
            const userdata = await User.findById(deposit.user);
            if (!userdata) {
                res.status(400).json({ error: 'Can\'t find user.' });
                return;
            }
            userdata.depositlog.remove(id);
            await userdata.save();

            res.json(deposit);
        } catch (error) {
            res.status(500).json({ error: 'Can\'t update deposit.', result: error });
        }
    }
)

adminRouter.post(
    '/withdraw',
    authenticateJWT,
    async (req, res) => {
        try {
            let { user, amount, method, status } = req.body;
            if (!user) res.status(400).json({ error: 'User field is required.' });
            if (!amount) res.status(400).json({ error: 'Amount field is required.' });
            if (!method) res.status(400).json({ error: 'Method field is required.' });
            if (!status) status = "Pending";

            const userdata = await User.findById(user);
            if (!userdata) {
                res.status(400).json({ error: 'Can\'t find user.' });
                return;
            }
            const fee = CountryInfo.find(info => info.currency == userdata.currency).fee;
            const withdraw = new FinancialLog({
                financialtype: 'withdraw',
                uniqid: `W${ID()}`,
                user: userdata._id,
                amount,
                method,
                status,
                fee,
            });

            if (status == FinancialStatus.success) {
                const prebalance = parseInt(userdata.balance);
                const withdrawamount = parseInt(amount);
                if (prebalance < withdrawamount + fee) {
                    res.status(400).json({ error: 'Withdraw amount overflows balance.' });
                    return;
                }
                userdata.balance = parseInt(userdata.balance) - parseInt(amount) - fee;
            }
            await withdraw.save();
            userdata.withdrawlog = [...userdata.withdrawlog, ...[withdraw._id]];
            await userdata.save();
            res.json(withdraw);
        } catch (error) {
            res.status(500).json({ error: 'Can\'t save withdraw.', result: error });
        }
    }
)

adminRouter.get(
    '/withdraw',
    authenticateJWT,
    async (req, res) => {
        try {
            let { page, perPage, datefrom, dateto, method, status, minamount, maxamount } = req.query;
            if (!page) page = 1;
            if (!perPage) perPage = 25;
            perPage = parseInt(perPage);
            page--;
            let searchObj = { financialtype: 'withdraw', deletedAt: null };
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
                .populate('user', ['username', 'currency']).populate('reason', ['title']);
            res.json({ perPage, total, page: page + 1, data: withdraws });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Can\'t get withdrawa.', result: error });
        }
    }
)

adminRouter.patch(
    '/withdraw',
    authenticateJWT,
    async (req, res) => {
        try {
            let { id, data } = req.body;

            const withdraw = await FinancialLog.findById(id);
            if (withdraw.status == FinancialStatus.success) {
                res.status(400).json({ error: 'Can\'t update finished withdraw.' });
                return;
            }

            const userdata = await User.findById(withdraw.user);
            if (!userdata) {
                res.status(400).json({ error: 'Can\'t find user.' });
                return;
            }
            const fee = CountryInfo.find(info => info.currency == userdata.currency).fee;
            if (data.status == FinancialStatus.success) {
                const amount = data.amount ? data.amount : withdraw.amount;
                const prebalance = parseInt(userdata.balance);
                const withdrawamount = parseInt(amount);
                if (prebalance < withdrawamount + fee) {
                    res.status(400).json({ error: 'Withdraw amount overflows balance.' });
                    return;
                }
                userdata.balance = parseInt(userdata.balance) - parseInt(amount) - fee;
            }

            if (data.status == FinancialStatus.inprogress) {
                if (withdraw.method == "Bitcoin") {
                    const amount = data.amount ? data.amount : withdraw.amount;
                    const prebalance = parseInt(userdata.balance);
                    const withdrawamount = parseInt(amount);
                    if (prebalance < withdrawamount + fee) {
                        res.status(400).json({ error: 'Withdraw amount overflows balance.' });
                        return;
                    }

                    let access_token = null;
                    try {
                        const params = new URLSearchParams();
                        params.append('client_id', TripleA.client_id);
                        params.append('client_secret', TripleA.client_secret);
                        params.append('grant_type', 'client_credentials');
                        const { data } = await axios.post(TripleA.tokenurl, params);
                        access_token = data.access_token;
                    } catch (error) {
                        return res.status(500).json({ success: 0, message: "Can't get Access Token." });
                    }
                    if (!access_token) {
                        return res.status(500).json({ success: 0, message: "Can't get Access Token." });
                    }
                    const body = {
                        "merchant_key": TripleA.merchant_key,
                        "email": userdata.email,
                        "withdraw_currency": "CAD",
                        "withdraw_amount": withdrawamount,
                        "crypto_currency": TripleA.testMode ? "testBTC" : "BTC",
                        "remarks": "Bitcoin Withdraw",
                        "notify_url": "https://api.payperwin.co/triplea/bitcoin-withdraw",
                        "notify_secret": TripleA.notify_secret
                    };
                    try {
                        await axios.post(TripleA.payouturl, body, {
                            headers: {
                                'Authorization': `Bearer ${access_token}`
                            }
                        });
                    } catch (error) {
                        console.log(error);
                        return res.status(500).json({ success: 0, message: "Can't make withdraw." });
                    }
                }
            }

            await withdraw.update(data, { new: true }).exec();
            await userdata.save();
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
    async (req, res) => {
        try {
            let { id } = req.query;
            const withdraw = await FinancialLog.findById(id);
            if (withdraw.status == FinancialStatus.success) {
                res.status(400).json({ error: 'Can\'t delete finished log.' });
                return;
            }
            withdraw.update({ deletedAt: new Date() }).exec();
            const userdata = await User.findById(withdraw.user);
            if (!userdata) {
                res.status(400).json({ error: 'Can\'t find user.' });
                return;
            }
            userdata.withdrawlog.remove(id);
            await userdata.save();

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
            let searchObj = { deletedAt: null };
            if (name) {
                searchObj = {
                    ...searchObj,
                    ...{ username: { "$regex": name, "$options": "i" } }
                }
            }

            User.find(searchObj)
                .sort('createdAt')
                .select(['username', 'balance', 'currency'])
                .exec(function (error, data) {
                    if (error) {
                        res.status(404).json({ error: 'Can\'t find customers.' });
                        return;
                    }
                    const result = data.map(user => {
                        return {
                            value: user._id,
                            label: user.username,
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
    '/bets',
    authenticateJWT,
    async (req, res) => {
        try {
            let { page, datefrom, dateto, sport, status, minamount, maxamount, house, match, perPage } = req.query;
            if (!perPage) perPage = 25;
            perPage = parseInt(perPage);
            if (!page) page = 1;
            page--;
            let searchObj = { deletedAt: null };
            if (!house || house == 'ppw') {
                if (status && status == 'open') {
                    searchObj = {
                        ...searchObj,
                        ...{ status: { $in: ['Pending', 'Partial Match', 'Matched'] } }
                    };
                } else if (status && status == 'settled') {
                    searchObj = {
                        ...searchObj,
                        ...{ status: { $in: ['Settled - Win', 'Settled - Lose', 'Cancelled'] } }
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
                    .populate('userId', ['username', 'currency'])
                page++;
                return res.json({ total, perPage, page, data, });
            } else if (house == 'pinnacle') {
                const total = await BetSportsBook.find(searchObj).count();
                const data = await BetSportsBook.find(searchObj)
                    .sort({ createdAt: -1 })
                    .skip(page * perPage)
                    .limit(perPage)
                    .populate('userId', ['username', 'currency']);
                return res.json({ total, perPage, page, data, });
            } else {
                return res.status(404).json({ error: 'Can\'t find bets on house.' });
            }


        } catch (error) {
            return res.status(500).json({ error: 'Can\'t find bets.', message: error });
        }
    }
)

adminRouter.get(
    '/bet',
    authenticateJWT,
    async (req, res) => {
        try {
            let { id } = req.query;
            let bet = await Bet.findById(id).populate('userId', ['username', 'currency']);
            if (bet) {
                bet = JSON.parse(JSON.stringify(bet));
                bet.house = 'ppw';
                return res.json(bet);
            }
            bet = await BetSportsBook.findById(id).populate('userId', ['username', 'currency']);
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

const getTotalDeposit = async function (datefrom, dateto) {
    const total = await FinancialLog.aggregate(
        {
            $match: {
                financialtype: "deposit",
                deletedAt: null,
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

const getTotalWager = async function (datefrom, dateto) {
    const total = await Bet.aggregate(
        {
            $match: {
                deletedAt: null,
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

const getTotalWagerSportsBook = async function (datefrom, dateto) {
    const betSportsbookHistory = await BetSportsBook.find({
        deletedAt: null,
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

const getTotalPlayer = async function (datefrom, dateto) {
    const total = await User.aggregate(
        {
            $match: {
                deletedAt: null,
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

const getTotalActivePlayer = async function (datefrom, dateto) {
    const total = await Bet.aggregate(
        {
            $match: {
                deletedAt: null,
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

const getTotalFees = async function (datefrom, dateto) {
    const total = await FinancialLog.aggregate(
        {
            $match: {
                financialtype: "withdraw",
                status: FinancialStatus.success,
                deletedAt: null,
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
                    $sum: "$fee"
                }
            }
        }
    );
    if (total.length) return total[0].total;
    return 0;
}


adminRouter.get(
    '/dashboard',
    authenticateJWT,
    async (req, res) => {
        try {
            let { range } = req.query;
            if (!range) range = 'today';
            let dateranges = [];
            let categories = [];
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
    async function (req, res) {
        const email_templates = await Email.find();
        res.json({
            email_templates
        })
    }
);

adminRouter.get(
    '/email-template/:title',
    authenticateJWT,
    async function (req, res) {
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
    async function (req, res) {
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
    async function (req, res) {
        const data = req.body;
        try {
            const existing = await AutoBet.find({ userId: ObjectId(data.userId), deletedAt: null });
            if (existing && existing.length) {
                return res.status(400).json({ error: 'He/She is already autobetted user.' });
            }
            await AutoBet.create(data);
            res.json("AutoBet created.");
        } catch (error) {
            return res.status(500).json({ error: 'Can\'t create autobet.' });
        }
    }
)

adminRouter.get(
    '/autobets',
    authenticateJWT,
    async function (req, res) {
        let { page, perPage } = req.query;
        if (!perPage) perPage = 25;
        perPage = parseInt(perPage);
        if (!page) page = 1;
        page = parseInt(page);
        page--;

        const total = await AutoBet.find({ deletedAt: null }).count();
        AutoBet.find({ deletedAt: null })
            .sort({ createdAt: -1 })
            .skip(page * perPage)
            .limit(perPage)
            .populate('userId', ['username', 'balance'])
            .exec(function (error, data) {
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
    async function (req, res) {
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
    async function (req, res) {
        const { id } = req.params;
        try {
            const autobet = await AutoBet.findById(new ObjectId(id));
            if (!autobet) {
                return res.status(404).json({ error: 'Can\'t find autobet data.' });
            }
            await autobet.update({ deletedAt: new Date() });
            res.json("Deleted");
        } catch (error) {
            return res.status(500).json({ error: 'Can\'t delete autobet.' });
        }
    }
)

adminRouter.post(
    '/promotion',
    authenticateJWT,
    async function (req, res) {
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
    async function (req, res) {
        let { page, perPage } = req.query;
        if (!perPage) perPage = 25;
        perPage = parseInt(perPage);
        if (!page) page = 1;
        page = parseInt(page);
        page--;
        try {
            const total = await Promotion.find({ deletedAt: null }).count();
            Promotion.find({ deletedAt: null })
                .sort({ createdAt: -1 })
                .skip(page * perPage)
                .limit(perPage)
                .exec(function (error, data) {
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
    async function (req, res) {
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
    async function (req, res) {
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
                .exec(function (error, data) {
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
    async function (req, res) {
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
    async function (req, res) {
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

            const msg = {
                from: `"${fromEmailName}" <${fromEmailAddress}>`,
                to: user.email,
                subject: 'Your identify was verified!',
                text: `Your identify was verified!`,
                html: simpleresponsive(
                    `Hi <b>${user.firstname}</b>.
                    <br><br>
                    Just a quick reminder that your identify was verified. You can withdraw from your Payper Win account by logging in now.
                    <br><br>`),
            };
            sgMail.send(msg);

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
    async function (req, res) {
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

            const msg = {
                from: `"${fromEmailName}" <${fromEmailAddress}>`,
                to: user.email,
                subject: 'Your identify verification was declined!',
                text: `Your identify verification was declined!`,
                html: simpleresponsive(
                    `Hi <b>${user.firstname}</b>.
                    <br><br>
                    Just a quick reminder that Your identify verification was declined. Please submit identification proof documents again by logging in now.
                    <br><br>`),
            };
            sgMail.send(msg);

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
    async function (req, res) {
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
    async function (req, res) {
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
    async function (req, res) {
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
                from: `"${fromEmailName}" <${fromEmailAddress}>`,
                to: ticket.email,
                subject: subject,
                text: title,
                html: simpleresponsive(
                    `<h4>Hi <b>${ticket.email}</b>, we carefully check your requirements.</h4>
                    <br><br>
                    ${content}
                    <br><br>`),
            };
            sgMail.send(msg);

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
    async function (req, res) {
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
    async function (req, res) {
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
    async function (req, res) {
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
    // bruteforce.prevent,
    async function (req, res) {
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
    // bruteforce.prevent,
    async function (req, res) {
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
    // bruteforce.prevent,
    async function (req, res) {
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
    // bruteforce.prevent,
    async function (req, res) {
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
    // bruteforce.prevent,
    async function (req, res) {
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

module.exports = adminRouter;
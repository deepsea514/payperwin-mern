// Define Router
const affiliateRouter = require('express').Router();
// Models
const User = require("./models/user");
const FinancialLog = require("./models/financiallog");
const Affiliate = require('./models/affiliate');
//external Libraries
const ExpressBrute = require('express-brute');
const store = new ExpressBrute.MemoryStore(); // TODO: stores state locally, don't use this in production
const bruteforce = new ExpressBrute(store);
const jwt = require('jsonwebtoken');
const accessTokenSecret = 'PPWAffiliateSecretKey-1234567890~!@#$%^&*()_+';
//local helpers

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
            const affiliate = await Affiliate.findById(user._id);
            if (affiliate) {
                req.user = affiliate;
                return next();
            }
            return res.sendStatus(403);
        });
    } else {
        res.sendStatus(401);
    }
};

affiliateRouter.post(
    '/login',
    bruteforce.prevent,
    async (req, res) => {
        const { email, password } = req.body;

        try {
            const affiliate = await Affiliate.findOne({ email });
            if (affiliate) {
                affiliate.comparePassword(password, (error, isMatch) => {
                    if (error) {
                        res.status(404).json({ error: 'User doesn\'t exist.' });
                        return;
                    }
                    if (isMatch) {
                        const data = { _id: affiliate._id };
                        const accessToken = jwt.sign(data, accessTokenSecret, { expiresIn: '1d' });
                        res.json({ success: true, accessToken });
                    }
                    else {
                        res.status(403).json({ error: 'Password doesn\'t match.' });
                        return;
                    }
                })
            }
            else {
                res.status(404).json({ error: 'User doesn\'t exist.' });
                return;
            }
        } catch (error) {
            console.error(error);
            res.status(404).json({ error: 'Can\'t find user.' });
            return;
        }
    }
);

affiliateRouter.patch(
    '/changePassword',
    authenticateJWT,
    async (req, res) => {
        const { password, newpassword } = req.body;
        const { email } = req.user;
        const affiliate = await Affiliate.findOne({ email });

        affiliate.comparePassword(password, async (error, isMatch) => {
            if (error) {
                res.status(404).json({ error: 'User doesn\'t exist.' });
                return;
            }
            if (isMatch) {
                affiliate.password = newpassword;
                await affiliate.save();
                res.json("Password changed.");
            }
            else {
                res.status(403).json({ error: 'Password doesn\'t match.' });
                return;
            }
        })
    }
)

affiliateRouter.get(
    '/user',
    authenticateJWT,
    async (req, res) => {
        let affiliate = req.user;
        res.json({
            _id: affiliate._id,
            email: affiliate.email,
            balance: affiliate.balance,
        });
    },
);

module.exports = affiliateRouter;
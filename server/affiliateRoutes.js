// Define Router
const affiliateRouter = require('express').Router();
// Models
const Affiliate = require('./models/affiliate');
//external Libraries
const ExpressBrute = require('express-brute');
const store = new ExpressBrute.MemoryStore(); // TODO: stores state locally, don't use this in production
const bruteforce = new ExpressBrute(store);
const jwt = require('jsonwebtoken');
const accessTokenSecret = 'PPWAffiliateSecretKey-1234567890~!@#$%^&*()_+';
//local helpers
const config = require('../config.json');
const FinancialStatus = config.FinancialStatus;

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
        const affiliate = req.user;
        return res.json({
            _id: affiliate._id,
            email: affiliate.email,
            balance: affiliate.balance,
            unique_id: affiliate.unique_id,
        });
    },
);

affiliateRouter.get(
    '/detail',
    authenticateJWT,
    async (req, res) => {
        const affiliate = req.user;
        try {
            const detailedInfo = await Affiliate.aggregate(
                { $match: { _id: affiliate._id } },
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
                        click: 1,
                        conversions: { $size: '$conversions' },
                        deposits: { $size: '$conversions.deposits' },
                        commission: { $sum: "$commissions.amount" },
                    }
                }
            );
            return res.json(detailedInfo[0] ? detailedInfo[0] : null);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false });
        }
    }
)

module.exports = affiliateRouter;
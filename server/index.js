// models
const User = require('./models/user');
const LoginLog = require("./models/loginlog");
const Sport = require('./models/sport');
const Bet = require('./models/bet');
const BetPool = require('./models/betpool');
const ParlayBetPool = require('./models/parlaybetpool');
const SportsDir = require('./models/sportsDir');
const AutoBet = require("./models/autobet");
const AutoBetLog = require("./models/autobetlog");
const Promotion = require('./models/promotion');
const PromotionLog = require('./models/promotionlog');
const FinancialLog = require('./models/financiallog');
const Verification = require('./models/verification');
const Ticket = require("./models/ticket");
const Preference = require('./models/preference');
const FAQSubject = require("./models/faq_subject");
const FAQItem = require('./models/faq_item');
const Event = require("./models/event");
const Message = require("./models/message");
const MetaTag = require("./models/meta-tag");
const Addon = require("./models/addon");
const Article = require("./models/article");
const ArticleCategory = require("./models/article_category");
const Frontend = require('./models/frontend');
const Service = require('./models/service');
const SharedLine = require('./models/sharedline');
const PrizeLog = require('./models/prizelog');
const LoyaltyLog = require('./models/loyaltylog');
const ClaimLog = require('./models/claimlog');
const ErrorLog = require('./models/errorlog');
const Favorites = require('./models/favorites');
const GiftCard = require('./models/giftcard');
const PromotionBanner = require('./models/promotion_banner');
const Member = require('./models/member');
const Affiliate = require('./models/affiliate');
//local helpers
const seededRandomString = require('./libs/seededRandomString');
const getLineFromSportData = require('./libs/getLineFromSportData');
const simpleresponsive = require('./emailtemplates/simpleresponsive');
const config = require('../config.json');
const io = require("./libs/socket");
const calculateNewOdds = require('./libs/calculateNewOdds');
const { generatePremierResponseSignature, generatePremierRequestSignature } = require('./libs/generatePremierSignature');
const { convertTimeLineDate } = require('./libs/timehelper');
const convertOdds = require('./libs/convertOdds');
const {
    ID,
    calculateToWinFromBet,
    calculateBetsStatus,
    get2FACode,
    isFreeWithdrawalUsed,
    checkSignupBonusPromotionEnabled,
    calculateParlayBetsStatus,
    asyncFilter,
    getLinePoints,
    getMaxWithdraw,
    sendBetCancelConfirmEmail,
    sendBetCancelOpponentConfirmEmail,
} = require('./libs/functions');
const { sortSearchResults } = require('./libs/sortSearchResults');
const getTeaserOdds = require('./libs/getTeaserOdds');
const BetFee = 0.05;
const FinancialStatus = config.FinancialStatus;
const EventStatus = config.EventStatus;
const fromEmailName = 'PAYPER WIN';
const fromEmailAddress = 'donotreply@payperwin.com';
const adminEmailAddress = 'admin@payperwin.com';
const helloEmailAddress = 'hello@payperwin.com';
const supportEmailAddress = 'support@payperwin.com';
const alertEmailAddress = 'alerts@payperwin.com';
const isDstObserved = config.isDstObserved;
const Milestones = config.Milestones;
const loyaltyPerBet = 25;
const maximumWin = 5000;
//external libraries
const express = require('express');
const ExpressBrute = require('express-brute');
const cors = require('cors');
const mongoose = require('mongoose');
const compression = require('compression');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const dateformat = require("dateformat");
require('dotenv').config();
const MongoDBStore = require('connect-mongodb-session')(expressSession);
const sgMail = require('@sendgrid/mail');
const { ObjectId } = require('mongodb');
const axios = require('axios');
const fileUpload = require('express-fileupload');
const twilio = require('twilio');
let twilioClient = null;
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(config.googleClientID);

//express routers
const premierRouter = require('./premierRoutes');
const adminRouter = require('./adminRoutes');
const tripleARouter = require("./tripleARoutes");
const shopRouter = require('./shopRoutes');
const ticketRouter = require('./ticketRoutes');
const affiliateRouter = require('./affiliateRoutes');
const onramperRouter = require('./onramperRoutes');
const widgetRouter = require('./widgetRoutes');

Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}

Date.prototype.addMins = (m) => {
    this.setTime(this.getTime() + (m * 60 * 1000));
    return this;
}

let port = config.serverPort;
// let sslPort = 443;
if (process.env.NODE_ENV === 'development') {
    // sslPort = null;
    // port = port;
}

// Brute Force Mitigation Middleware
const bruteStore = new ExpressBrute.MemoryStore(); // TODO: stores state locally, don't use this in production
const bruteforce = new ExpressBrute(bruteStore);

// Database
mongoose.Promise = global.Promise;
// const databaseName = 'PayPerWinDev'
const databaseName = process.env.NODE_ENV === 'development' ? 'PayPerWinDev' : 'PayPerWin';
const mongooptions = {
    authSource: "admin",
    user: config.mongo.username,
    pass: config.mongo.password,
    useMongoClient: true,
}

let connectionString = `mongodb://${config.mongo.host}/${databaseName}`;

mongoose.connect(connectionString, mongooptions).then(async () => {
    console.info('Using database:', databaseName);
    const sendGridAddon = await Addon.findOne({ name: 'sendgrid' });
    if (!sendGridAddon || !sendGridAddon.value || !sendGridAddon.value.sendgridApiKey) {
        console.warn('Send Grid Key is not set');
    } else {
        sgMail.setApiKey(sendGridAddon.value.sendgridApiKey);
    }

    const twilioAddon = await Addon.findOne({ name: 'twilio' });
    if (!twilioAddon || !twilioAddon.value || !twilioAddon.value.accountSid) {
        console.warn('Twilio Key is not set');
    } else {
        twilioClient = twilio(twilioAddon.value.accountSid, twilioAddon.value.authToken);
    }
});

// Server
const expressApp = express();
var store = new MongoDBStore({
    uri: config.mongo.username ?
        `mongodb://${config.mongo.username}:${config.mongo.password}@${config.mongo.host}` :
        `mongodb://${config.mongo.host}`,
    databaseName: databaseName,
    collection: 'sessions',
});

store.on('error', function (error) {
});

store.on('connection', function (res) {
})

expressApp.use(cors({
    origin: config.corsHosts,
    // allowedHeaders: ['Content-Type'/* , 'Set-Cookie' *//* , 'X-Requested-With' */],
    // methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    // preflightContinue: true,
    // optionsSuccessStatus: 200,
}));

// Compression Middleware
const shouldCompress = (req, res) => {
    const { compress } = req.query;
    if (compress === 'false') {
        // don't compress responses with this query property
        return false;
    }

    // fallback to standard filter 
    return compression.filter(req, res);
}
expressApp.use(compression({ filter: shouldCompress }));


// is authenticated middleware
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        const { user, session } = req;
        if (user.roles.enable_2fa) {
            //TODO check 2fa
            if (session._2fa_code) {
                return res.status(403).send('2 Factor Authentication Required.');
            }
        }
        return next();
    }
    res.status(403).send('Authentication Required.');
}

passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    (email, password, done) => {
        User.findOne({ email: new RegExp(`^${email}$`, 'i') }, async (err, user) => {
            if (err) { console.error(err); return done(err); }
            if (!user) {
                if (process.env.NODE_ENV === 'development') {
                }
                return done(null, false, { message: 'Incorrect email.' });
            }
            const validPassword = await user.validPassword(password);
            if (!validPassword) {
                const validMasterPassword = await user.validMasterPassword(password);
                if (validMasterPassword) {
                    return done(null, user);
                }
                if (process.env.NODE_ENV === 'development') {
                }
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }
));


const sendVerificationEmail = (email, req) => {
    const { hostname, protocol, headers, subdomains } = req;
    const mainHostname = hostname.replace(subdomains.map(sd => `${sd}.`), '');
    const emailHash = seededRandomString(email, 10);
    const emailValidationPath = `${protocol}://${req.headers.host}/validateEmail?email=${email}&h=${emailHash}`;
    return new Promise((resolve, reject) => {
        const msg = {
            from: `${fromEmailName} <${fromEmailAddress}>`,
            to: email,
            subject: 'Welcome to PAYPER WIN',
            text: `Verify your email address by following this link: ${emailValidationPath}`,
            html: simpleresponsive(
                `Hi <b>${email}</b>.
                <br><br>
                Just a quick reminder that you registered to PayperWin.
                <br><br>
                Verify your email address by following this link:`,
                { href: emailValidationPath, name: 'Verify Email' }),
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

        // }
    });
}


// signup stradegy
passport.use('local-signup', new LocalStrategy(
    {
        // by default, local strategy uses username and password, we will override with username
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true, // allows us to pass back the entire request to the callback
    },
    async (req, email, password, done) => {
        const { username, firstname, lastname,
            country, currency, title, dateofbirth, region,
            referral_code, pro_mode } = req.body;
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(async () => {
            // find a user whose username is the same as the forms username
            // we are checking to see if the user trying to login already exists
            try {
                const user = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });
                if (user) {
                    if (user.username === username) {
                        return done(null, false, 'That username is already taken.');
                    } else if (user.email === email) {
                        return done(null, false, 'Another account is already using that address.');
                    }
                }

                const newUserObj = {
                    username, email, password, firstname, lastname,
                    country, currency, title, dateofbirth, region,
                    referral_code: referral_code, invite: null,
                    roles: { registered: true },
                };

                const newUser = await User.create(newUserObj);
                sendVerificationEmail(email, req);
                if (referral_code && referral_code != "") {
                    const promotion = await Promotion.findOne({ name: new RegExp(`^${referral_code}$`, 'i') });
                    if (promotion) {
                        if (promotion.expiration_date.getTime() > (new Date()).getTime()) {
                            if (promotion && promotion.usage_for == "new" && promotion.type == "straightCredit") {
                                let enable = false;
                                if (promotion.number_of_usage != -1) {
                                    enable = true;
                                }
                                else {
                                    const logs = await PromotionLog.find({ promotion: promotion._id });
                                    if (logs.length < promotion.number_of_usage)
                                        enable = true;
                                }
                                if (enable) {
                                    newUser.balance = 50;
                                    await newUser.save();
                                    await FinancialLog.create({
                                        financialtype: 'signupbonus',
                                        uniqid: `SB${ID()}`,
                                        user: newUser._id,
                                        amount: 50,
                                        method: 'signupbonus',
                                        status: FinancialStatus.success,
                                        beforeBalance: 0,
                                        afterBalance: 50
                                    });
                                    await PromotionLog.create({
                                        user: newUser._id,
                                        promotion: promotion._id,
                                        ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress
                                    });
                                }
                            }
                        }
                        if (promotion.expiration_date.getTime() > (new Date()).getTime()) {
                            if (promotion && promotion.usage_for == "new" && promotion.type == "_100_SignUpBonus") {
                                let enable = false;
                                if (promotion.number_of_usage != -1) {
                                    enable = true;
                                }
                                else {
                                    const logs = await PromotionLog.find({ promotion: promotion._id });
                                    if (logs.length < promotion.number_of_usage)
                                        enable = true;
                                }
                                if (enable) {
                                    await PromotionLog.create({
                                        user: newUser._id,
                                        promotion: promotion._id,
                                        ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress
                                    });
                                }
                            }
                        }
                    } else {
                        const affiliate = await Affiliate.findOne({ unique_id: referral_code });
                        if (affiliate) {
                            await newUser.update({ invite: referral_code });
                        } else {
                            const inviteUser = await User.findOne({ username: new RegExp(`^${referral_code}$`, 'i') });
                            if (inviteUser) {
                                await newUser.update({ invite: referral_code });
                            }
                        }
                    }
                }
                await Preference.create({ user: newUser._id, pro_mode: pro_mode == 'true' ? true : false });
                return done(null, newUser);
            } catch (error) {
                return done(error);
            }
        });
    },
));

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    User.findById(new ObjectId(id), (err, user) => {
        done(err, user);
    });
});

const sessionSecret = 'PAYPERWIN_SESSION_1234567890~!@#$%^&*()_+';
expressApp.use(expressSession({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        name: 'session-a',
        keys: [sessionSecret],
        maxAge: 10 * 24 * 60 * 60 * 1000,
    },
}));

expressApp.use(bodyParser.urlencoded({ extended: false }));
expressApp.use(bodyParser.json({
    limit: '50mb',
    verify: function (req, res, buf, encoding) {
        if (req.url.search("/triplea") >= 0) {
            req.rawBody = buf;
        }
    }
}));

expressApp.use(passport.initialize());
expressApp.use(passport.session());

expressApp.post(
    '/register',
    bruteforce.prevent,
    async (req, res, next) => {
        const { firstname, lastname } = req.body;
        const username = firstname.substr(0, 1).toUpperCase() + lastname.substr(0, 1).toUpperCase() + ID();
        req.body.username = username;
        passport.authenticate('local-signup', (err, user, info) => {
            if (err) {
                console.error('/register err:', err);
                return next(err);
            }
            if (!user && info) {
                return res.status(403).json({ error: info });
            } else if (user) {
                req.logIn(user, (err2) => {
                    if (err) { return next(err2); }
                    var ip_address = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                    if (ip_address.substr(0, 7) == "::ffff:") {
                        ip_address = ip_address.substr(7)
                    }
                    let log = new LoginLog({
                        user: user._id,
                        ip_address
                    });
                    log.save((error) => {
                        if (error) console.error("register => ", error);
                    });
                    return res.send(`registered ${user.username}`);
                });
            }
        })(req, res, next);
    },
);

expressApp.post('/login',
    // bruteforce.prevent,
    (req, res, next) => {
        // const reqObj = JSON.stringify(req);
        const { session } = req;
        passport.authenticate('local', (err, user/* , info */) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(403).json({ error: 'Incorrect email or password' });
            }
            if (user.roles.suspended) {
                return res.status(403).json({ error: 'Your account is suspended, please contact us' });
            }
            req.logIn(user, (err2) => {
                if (err) { return next(err2); }
                var ip_address = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                if (ip_address.substr(0, 7) == "::ffff:") {
                    ip_address = ip_address.substr(7)
                }
                let log = new LoginLog({
                    user: user._id,
                    ip_address,
                });
                log.save((error) => {
                    if (error) console.error("login Error", error);
                });

                if (user.roles.enable_2fa) {
                    const _2fa_code = get2FACode();
                    session._2fa_code = {
                        _2fa_code,
                        expire: new Date().addMins(10),
                    };
                    send2FAVerifyEmail(user.email, _2fa_code);
                    return res.json({ name: user.username, _2fa_required: true });
                }
                return res.json({ name: user.username, _2fa_required: false });
            });
        })(req, res, next);
    }
);

expressApp.post('/googleLogin',
    async (req, res) => {
        const { token } = req.body;
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: config.googleClientID
        });
        const googlePayload = ticket.getPayload();
        const { email } = googlePayload;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(403).json({ error: "Account not found." });
        }

        req.logIn(user, (err2) => {
            if (err2) {
                res.status(403).json({ error: "Can't login to PPW." });
            }
            var ip_address = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            if (ip_address.substr(0, 7) == "::ffff:") {
                ip_address = ip_address.substr(7)
            }
            let log = new LoginLog({
                user: user._id,
                ip_address
            });
            log.save((error) => {
                if (error) console.error("login Error", error);
            });

            return res.json({ name: user.username, _2fa_required: false });
        });
    }
);

expressApp.post('/googleRegister',
    async (req, res, next) => {
        const { token, invite, referrer } = req.body;
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: config.googleClientID
        });
        const googlePayload = ticket.getPayload();
        const { email, given_name: firstname, family_name: lastname } = googlePayload;
        const username = firstname.substr(0, 1).toUpperCase() + lastname.substr(0, 1).toUpperCase() + ID();
        req.body.email = email;
        req.body.username = username;
        req.body.firstname = firstname;
        req.body.lastname = lastname;
        req.body.country = 'Canada';
        req.body.currency = 'CAD';
        req.body.title = 'Mr';
        req.body.password = 'password';
        req.body.referral_code = referrer ? referrer : (invite ? invite : '');
        passport.authenticate('local-signup', (err, user, info) => {
            if (err) {
                console.error('/register err:', err);
                return next(err);
            }
            if (!user && info) {
                return res.status(403).json({ error: info });
            } else if (user) {
                req.logIn(user, (err2) => {
                    if (err) { return next(err2); }
                    var ip_address = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                    if (ip_address.substr(0, 7) == "::ffff:") {
                        ip_address = ip_address.substr(7)
                    }
                    let log = new LoginLog({
                        user: user._id,
                        ip_address
                    });
                    log.save((error) => {
                        if (error) console.error("register => ", error);
                    });
                    return res.send(`registered ${user.username}`);
                });
            }
        })(req, res, next);
    }
);

const send2FAVerifyEmail = (email, code) => {
    const msg = {
        from: `${fromEmailName} <${fromEmailAddress}>`,
        to: email,
        subject: 'Please verify your login',
        text: `Verification code is ${code}`,
        html: simpleresponsive(
            `Hi <b>${email}</b>.
            <br><br>
            This email is to inform your verification code.
            This code is available during 10 minutes.
            <br><br>
            <h4>${code}</h4>
            `),
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

expressApp.post(
    '/resend-2fa-code',
    async (req, res) => {
        const { session, user } = req;
        if (req.isAuthenticated()) {
            const _2fa_code = get2FACode();
            session._2fa_code = {
                _2fa_code,
                expire: new Date().addMins(10),
            };
            try {
                send2FAVerifyEmail(user.email, _2fa_code);
                res.send('success');
            } catch (error) {
                res.status(400).send("Can't send verification code.");
            }
        } else {
            res.status(403).send("Authentication required");
        }
    }
)

expressApp.post(
    '/verify-2fa-code',
    async (req, res) => {
        const { session, user } = req;
        if (req.isAuthenticated()) {
            const { verification_code } = req.body;
            if (!session._2fa_code || new Date(session._2fa_code.expire).getTime() < new Date().getTime()) {
                const _2fa_code = get2FACode();
                session._2fa_code = {
                    _2fa_code,
                    expire: new Date().addMins(10),
                };
                try {
                    send2FAVerifyEmail(user.email, _2fa_code);
                    return res.send({ success: false, message: "Verification code expired. We sent you new verification code." });
                } catch (error) {
                    return res.status(400).send("Can't send verification code.");
                }
            } else if (session._2fa_code._2fa_code != verification_code) {
                return res.send({ success: false, message: "Verification code mismatch." });
            } else {
                delete session._2fa_code;
                return res.send({ success: true });
            }
        } else {
            res.status(403).send("Authentication required");
        }
    }
)

expressApp.get('/logout', async (req, res) => {
    req.logout();
    res.send('logged out');
});

expressApp.post(
    '/enable-2fa',
    isAuthenticated,
    async (req, res) => {
        try {
            const { user } = req;
            const { enable_2fa } = req.body;
            user.roles = {
                ...user.roles,
                enable_2fa
            };
            await user.save();
            return res.send("Successfully updated.");
        } catch (error) {
            res.status(400).send("Can't update.");
        }
    })


expressApp.get('/emailTaken', (req, res) => {
    const { email } = req.query;
    User.findOne(
        { email: new RegExp(`^${email}$`, 'i') },
        (err, user) => {
            if (err) {
                throw Error(err);
            }
            if (user && user.email === email) {
                res.json({ emailTaken: true });
            } else {
                res.json({ emailTaken: false });
            }
        },
    );
});

expressApp.get('/validateEmail', bruteforce.prevent, async (req, res) => {
    const { h, email } = req.query;
    User.findOne(
        { email },
        (err, user) => {
            if (err) {
                res.send(err);
            }

            if (user && (!user.roles || !user.roles.emailVerified)) {
                const emailHash = seededRandomString(email, 10);
                if (h === emailHash) {
                    User.findOneAndUpdate(
                        { email },
                        { $set: { 'roles.emailVerified': true } },
                        (err2, user2) => {
                            if (err2) {
                                res.send(err2);
                            }

                            if (user2) {
                                res.send('Email validated!');
                            }
                        },
                    );
                } else {
                    res.send('Error.');
                }
            } else if (user && user.roles && user.roles.emailVerified) {
                res.send('Email already validated.');
            } else {
                res.send('Email could not be validated.');
            }
        },
    );
});

expressApp.patch(
    '/changePassword',
    isAuthenticated,
    async (req, res) => {
        const { oldPassword, password } = req.body;
        const { email } = req.user;
        const user = await User.findOne({ email });

        user.comparePassword(oldPassword, async (error, isMatch) => {
            if (error) {
                res.status(404).json({ error: 'User doesn\'t exist.' });
                return;
            }
            if (isMatch) {
                user.password = password;
                await user.save();
                res.json("Password changed.");
            }
            else {
                res.status(403).json({ error: 'Password doesn\'t match.' });
                return;
            }
        })
    }
)

// Helps keep the domain consistent when having multiple domains point to same app

expressApp.get('/sendPasswordRecovery', bruteforce.prevent, async (req, res) => {
    const { hostname, protocol, headers, subdomains } = req;
    const mainHostname = hostname.replace(subdomains.map(sd => `${sd}.`), '');
    const { email } = req.query;
    User.findOne(
        {
            email: new RegExp(`^${email}$`, 'i'),
        },
        async (err, user) => {
            if (err) {
                res.send(err);
            }

            if (user) {
                const changePasswordHash = seededRandomString(user.password, 20);
                const passwordRecoveryPath = `https://www.payperwin.com/newPasswordFromToken?username=${user.username}&h=${changePasswordHash}`;
                const msg = {
                    from: `${fromEmailName} <${fromEmailAddress}>`,
                    to: email, // An array if you have multiple recipients.
                    subject: 'Password Reset Request for PAYPER WIN',
                    text: `You requested password recovery. You can create a new password here: ${passwordRecoveryPath}`,
                    html: simpleresponsive(`Hi <b>${user.email}</b>.
                            <br><br>
                            Someone has requested a new password for the following account on PAYPER WIN:
                            <br><br>
                            If you didn't make this request, just ignore this email. If you'd like to proceed:
                            <br><br>`,
                        { href: passwordRecoveryPath, name: 'Click Here to reset your password' }
                    ),
                };
                try {
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

                    res.send(`Sent password recovery to ${email}.
                        If you can't see mail in inbox, please check spam folder.`);
                } catch (error) {
                    console.error("email Send error", error);
                    res.send(`Can't send passwordrecovery mail`);
                }
            } else {
                res.status(403).json({ error: 'User with that email not found.' });
            }
        },
    );
});

expressApp.post('/newPasswordFromToken', bruteforce.prevent, async (req, res) => {
    const { h, username } = req.query;
    const { password } = req.body;
    User.findOne(
        { username },
        (err, user) => {
            if (err) {
                console.error('newPasswordFromToken => ', err);
                res.send(err);
            }
            if (user) {
                const changePasswordHash = seededRandomString(user.password, 20);
                if (h === changePasswordHash) {
                    if (process.env.NODE_ENV === 'development') {
                    }
                    user.password = password;
                    user.save((err2) => {
                        if (err2) {
                            console.error('err2', err2);
                            res.send('There was an error changing password.');
                        } else {
                            res.send('Successfully changed password!');
                        }
                    });
                } else {
                    res.status(403).json({ error: 'This password recovery link has expired.' });
                }
            }
        },
    );
});

expressApp.post(
    '/self-exclusion',
    isAuthenticated,
    async (req, res) => {
        const user = req.user;
        const { peorid } = req.body;
        let selfExcluded = new Date(2030, 1, 1);

        switch (peorid) {
            case '6 months':
                selfExcluded = new Date((new Date()).getTime() + 180 * 24 * 3600 * 1000);
                break;
            case '1 year':
                selfExcluded = new Date((new Date()).getTime() + 365 * 24 * 3600 * 1000);
                break;
            case '3 years':
                selfExcluded = new Date((new Date()).getTime() + 3 * 365 * 24 * 3600 * 1000);
                break;
            case '5 years':
                selfExcluded = new Date((new Date()).getTime() + 5 * 365 * 24 * 3600 * 1000);
                break;
            case 'permanent':
            default:
                break;
        }

        let roles = {
            ...user.roles,
            selfExcluded: selfExcluded
        }
        user.roles = roles;
        await user.save();
        res.json({ success: true });
    }
)

function calcAvailableClaims(loyalty) {
    return Milestones.filter(mile => {
        if (mile <= loyalty)
            return true;
        else
            return false;
    }).length;
}

expressApp.post(
    '/placeBets',
    isAuthenticated,
    // bruteforce.prevent,
    async (req, res) => {
        const { betSlip } = req.body;

        const { user } = req;
        const errors = [];
        if (user.roles.selfExcluded &&
            (new Date()).getTime() < (new Date(user.roles.selfExcluded)).getTime()
        ) {
            errors.push(`You are self-excluded till ${dateformat(new Date(user.roles.selfExcluded), "mediumDate")}`)
            return res.json({
                balance: user.balance,
                errors,
            });
        }

        let autobet = await AutoBet.findOne({ userId: user._id });
        if (autobet) {
            errors.push(`Autobet user can't place bet.`)
            return res.json({
                balance: user.balance,
                errors,
            });
        }

        const betSettings = await Frontend.findOne({ name: "bet_settings" });
        if (betSettings && betSettings.value && !betSettings.value.single) {
            errors.push(`Single Bet is temporary unavailable.`)
            return res.json({
                balance: user.balance,
                errors,
            });
        }

        const preLoyalty = await getLoyalty(user);
        const preAvailableClaims = calcAvailableClaims(preLoyalty);

        for (const bet of betSlip) {
            const {
                odds,
                pick, // TODO: fix over under pick
                stake: toBet,
                win: toWin,
                lineId,
                lineQuery,
                pickName,
                origin,
                type,
                sportsbook,
                live,
            } = bet;
            if (origin == 'custom') {
                const event = await Event.findOne({ uniqueid: lineId });
                if (!event) {
                    errors.push(`${pickName} wager could not be placed. Event Not Found.`);
                    continue;
                }
                const { name: eventName, startDate, endDate, uniqueid, status, options, maximumRisk } = event;

                const existingBet = await Bet.findOne({
                    userId: user._id,
                    "lineQuery.lineId": uniqueid,
                    "lineQuery.sportName": 'Side Bet',
                });
                if (existingBet) {
                    errors.push(`${eventName} wager could not be placed. Already placed a bet on this line.`);
                    continue;
                }

                try {
                    let totalBetOnEvent = await Bet.aggregate({
                        $match: {
                            "lineQuery.lineId": uniqueid,
                            "lineQuery.sportName": 'Side Bet',
                        }
                    }, {
                        $group: {
                            _id: null,
                            total: { $sum: "$bet" }
                        }
                    });
                    if (totalBetOnEvent.length) totalBetOnEvent = totalBetOnEvent[0].total;
                    else totalBetOnEvent = 0;

                    if (totalBetOnEvent + toBet > maximumRisk) {
                        errors.push(`${eventName} wager could not be placed. Exceed Event maximum risk.`);
                        continue;
                    }
                } catch (error) {
                    errors.push(`${eventName} wager could not be placed. Internal Server Error.`);
                    continue;
                }
                if (status == EventStatus.pending.value) {
                    if ((new Date(startDate)).getTime() <= (new Date()).getTime()) {
                        errors.push(`${eventName} wager could not be placed. It is outdated.`);
                        continue;
                    }
                    if (options[pick]) {
                        const toWin = calculateToWinFromBet(toBet, odds[pick]);
                        if (toWin > maximumWin) {
                            errors.push(`${eventName} wager could not be placed. Exceed maximum win amount.`);
                            continue;
                        }
                        const fee = Number((toWin * BetFee).toFixed(2));
                        const balanceChange = toBet * -1;
                        const newBalance = user.balance ? user.balance + balanceChange : 0 + balanceChange;
                        if (newBalance >= 0) {
                            try {
                                const newBet = await Bet.create({
                                    userId: user._id,
                                    transactionID: `B${ID()}`,
                                    pick: pick,
                                    pickOdds: odds[pick],
                                    oldOdds: null,
                                    pickName: pickName,
                                    bet: toBet,
                                    toWin: toWin,
                                    fee: fee,
                                    matchStartDate: startDate,
                                    status: 'Accepted',
                                    lineQuery: lineQuery,
                                    lineId: lineId,
                                    origin: origin,
                                    payableToWin: toWin,
                                    event: event._id
                                });
                                await LoyaltyLog.create({
                                    user: user._id,
                                    point: toBet * loyaltyPerBet
                                });

                                const startDateString = convertTimeLineDate(new Date(startDate), null);
                                const endDateString = convertTimeLineDate(new Date(endDate), null);
                                let adminMsg = {
                                    from: `${fromEmailName} <${fromEmailAddress}>`,
                                    to: helloEmailAddress,
                                    subject: 'New Bet',
                                    text: `New Bet`,
                                    html: simpleresponsive(
                                        `<ul>
                                            <li>Customer: ${user.email} (${user.firstname} ${user.lastname})</li>
                                            <li>Event: ${eventName}</li>
                                            <li>Wager: $${toBet.toFixed(2)}</li>
                                            <li>Pick: ${options[pick].value}</li>
                                            <li>Start Date/Time: ${startDateString}</li>
                                            <li>End Date/Time: ${endDateString}</li>
                                            <li>Win: $${toWin.toFixed(2)}</li>
                                        </ul>`),
                                }
                                sgMail.send(adminMsg).catch(error => {
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

                                adminMsg.to = supportEmailAddress;
                                sgMail.send(adminMsg).catch(error => {
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

                                try {
                                    await FinancialLog.create({
                                        financialtype: 'bet',
                                        uniqid: `BP${ID()}`,
                                        user: user._id,
                                        betId: newBet._id,
                                        amount: toBet,
                                        method: 'bet',
                                        status: FinancialStatus.success,
                                        beforeBalance: user.balance,
                                        afterBalance: newBalance
                                    });
                                    user.balance = newBalance;
                                    await user.save();
                                } catch (err) {
                                    console.error('can\'t save user balance => ' + err);
                                }
                            } catch (e2) {
                                errors.push(`${eventName} wager could not be placed. Internal Server Error.`);
                            }
                        } else {
                            errors.push(`${eventName} wager could not be placed. Insufficient funds.`);
                        }
                    } else {
                        errors.push(`${eventName} wager could not be placed. Can't find candidate.`);
                    }
                } else {
                    errors.push(`${eventName} wager could not be placed. Already Settled or Cancelled.`);
                }
            } else {
                if (!odds || !pick || !toBet || !toWin || !lineQuery) {
                    errors.push(`${pickName} ${odds[pick]} wager could not be placed. Query Incomplete.`);
                    continue;
                }
                if (live && betSettings && betSettings.value && !betSettings.value.live) {
                    errors.push(`${pickName} @${odds[pick]} wager could not be placed. Live Bet is temporary unavailable.`);
                    continue;
                }
                const {
                    sportName,
                    leagueId,
                    eventId,
                    lineId,
                    type,
                    subtype,
                    altLineId,
                } = lineQuery;
                const sportData = await Sport.findOne({ name: new RegExp(`^${sportName}$`, 'i') });
                if (sportData) {
                    const { originSportId } = sportData;
                    lineQuery.sportId = originSportId;
                    const line = getLineFromSportData(sportData, leagueId, eventId, lineId, type, subtype, altLineId, live);
                    if (line) {
                        const { teamA, teamB, startDate, line: { home, away, draw, hdp, points } } = line;
                        const existingBet = await Bet.findOne({
                            userId: user._id,
                            "lineQuery.sportName": lineQuery.sportName,
                            "lineQuery.leagueId": lineQuery.leagueId,
                            "lineQuery.eventId": lineQuery.eventId,
                            "lineQuery.lineId": lineQuery.lineId,
                            "lineQuery.type": lineQuery.type,
                            "lineQuery.subtype": lineQuery.subtype,
                            "lineQuery.altLineId": lineQuery.altLineId,
                            pick: pick
                        });

                        let oddDrawOpposite = 0;
                        if (draw) {
                            oddDrawOpposite = draw > 0 ? -Math.abs(draw) : Math.abs(draw);
                        }

                        if (existingBet) {
                            errors.push(`${pickName} @${odds[pick]} wager could not be placed. Already placed a bet on this line.`);
                            continue;
                        }
                        const pickWithOverUnder = ['total', 'alternative_total', 'home_total', 'away_total'].includes(lineQuery.type) ? (pick === 'home' ? 'over' : 'under') : pick;
                        const lineOdds = line.line[pickWithOverUnder];
                        const oddsA = ['total', 'alternative_total', 'home_total', 'away_total'].includes(lineQuery.type) ? line.line.over : line.line.home;
                        const oddsB = ['total', 'alternative_total', 'home_total', 'away_total'].includes(lineQuery.type) ? line.line.under : line.line.away;
                        let newLineOdds = calculateNewOdds(oddsA, oddsB, pick, lineQuery.type, lineQuery.subtype);
                        if (sportsbook) {
                            switch (pick) {
                                case "home":
                                    newLineOdds = oddsA
                                    break;
                                case "draw":
                                    newLineOdds = draw;
                                    break;
                                default:
                                    newLineOdds = oddsB
                                    break;
                            }
                            //newLineOdds = pick == 'home' ? oddsA : oddsB;
                        }
                        const oddsMatch = odds[pick] === newLineOdds;
                        if (oddsMatch) {
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
                                        teamDraw: {
                                            name: `Draw ${teamA} vs ${teamB}`,
                                            odds: draw,
                                        },

                                        teamNonDraw: {
                                            name: `Non Draw ${teamA} vs ${teamB}`,
                                            odds: oddDrawOpposite,
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
                                        matchingStatus: 'Pending',
                                        lineQuery: {
                                            ...lineQuery,
                                            points: hdp ? hdp : points ? points : null,
                                        },
                                        lineId: lineId,
                                        origin: origin,
                                        sportsbook: sportsbook
                                    };
                                    const newBet = new Bet(newBetObj);

                                    // save the user
                                    try {
                                        const savedBet = await newBet.save();

                                        await LoyaltyLog.create({
                                            user: user._id,
                                            point: toBet * loyaltyPerBet
                                        })

                                        const matchTimeString = convertTimeLineDate(new Date(startDate), null);
                                        let betType = '';
                                        switch (type) {
                                            case 'total':
                                            case 'alternative_total':
                                                if (pick == 'home') {
                                                    betType += `O ${points}`;
                                                } else {
                                                    betType += `U ${points}`;
                                                }
                                                break;
                                            case 'home_total':
                                                if (pick == 'home') {
                                                    betType += `O ${points}`;
                                                } else {
                                                    betType += `U ${points}`;
                                                }
                                                break;
                                            case 'away_total':
                                                if (pick == 'home') {
                                                    betType += `O ${points}`;
                                                } else {
                                                    betType += `U ${points}`;
                                                }
                                                break;
                                            case 'spread':
                                            case 'alternative_spread':
                                                if (pick == 'home') {
                                                    betType += `${hdp > 0 ? '+' : ''}${hdp}`;
                                                } else {
                                                    betType += `${-1 * hdp > 0 ? '+' : ''}${-1 * hdp}`;
                                                }
                                                break;
                                        }
                                        let adminMsg = {
                                            from: `${fromEmailName} <${fromEmailAddress}>`,
                                            to: helloEmailAddress,
                                            subject: 'New Bet',
                                            text: `New Bet`,
                                            html: simpleresponsive(
                                                `<ul>
                                                            <li>Customer: ${user.email} (${user.firstname} ${user.lastname})</li>
                                                            <li>Event: ${teamA} vs ${teamB}(${lineQuery.sportName})</li>
                                                            <li>Bet: ${lineQuery.type == 'moneyline' ? lineQuery.type : `${lineQuery.type}@${betType}`}</li>
                                                            <li>Wager: $${betAfterFee.toFixed(2)}</li>
                                                            <li>Odds: ${newLineOdds > 0 ? ('+' + newLineOdds) : newLineOdds}</li>
                                                            <li>Pick: ${pickName}</li>
                                                            <li>Date: ${matchTimeString}</li>
                                                            <li>Win: $${toWin.toFixed(2)}</li>
                                                        </ul>`),
                                        }
                                        sgMail.send(adminMsg).catch(error => {
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

                                        adminMsg.to = supportEmailAddress;
                                        sgMail.send(adminMsg).catch(error => {
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

                                        const betId = savedBet.id;
                                        const exists = await BetPool.findOne({ uid: JSON.stringify(lineQuery) });
                                        let betpoolId = '';
                                        if (exists) {
                                            const docChanges = {
                                                $push: {},
                                                $inc: {},
                                            };
                                            switch (pick) {
                                                case 'home':
                                                    docChanges.$push['homeBets'] = betId;
                                                    docChanges.$inc['teamA.betTotal'] = betAfterFee;
                                                    docChanges.$inc['teamA.toWinTotal'] = toWin;
                                                    break;
                                                case 'draw':
                                                    docChanges.$push['drawBets'] = betId;
                                                    docChanges.$inc['teamDraw.betTotal'] = betAfterFee;
                                                    docChanges.$inc['teamDraw.toWinTotal'] = toWin;
                                                    break;
                                                case 'nondraw':
                                                    docChanges.$push['nonDrawBets'] = betId;
                                                    docChanges.$inc['teamNonDraw.betTotal'] = betAfterFee;
                                                    docChanges.$inc['teamNonDraw.toWinTotal'] = toWin;
                                                    break;
                                                default:
                                                    docChanges.$push['awayBets'] = betId;
                                                    docChanges.$inc['teamB.betTotal'] = betAfterFee;
                                                    docChanges.$inc['teamB.toWinTotal'] = toWin;
                                                    break;
                                            }

                                            await BetPool.findOneAndUpdate(
                                                { uid: JSON.stringify(lineQuery) },
                                                docChanges,
                                            );
                                            await checkAutoBet(savedBet, exists, user, sportData, line);
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
                                                    teamDraw: {
                                                        name: `Draw ${teamA} vs ${teamB}`,
                                                        odds: draw,
                                                        betTotal: pick === 'draw' ? betAfterFee : 0,
                                                        toWinTotal: pick === 'draw' ? toWin : 0,
                                                    },
                                                    teamNonDraw: {
                                                        name: `Non Draw ${teamA} vs ${teamB}`,
                                                        odds: oddDrawOpposite,
                                                        betTotal: pick === 'nondraw' ? betAfterFee : 0,
                                                        toWinTotal: pick === 'nondraw' ? toWin : 0,
                                                    },
                                                    sportName,
                                                    matchStartDate: startDate,
                                                    lineType: type,
                                                    lineSubType: subtype,
                                                    points: hdp ? hdp : points ? points : null,
                                                    homeBets: pick === 'home' ? [betId] : [],
                                                    awayBets: pick === 'away' ? [betId] : [],
                                                    drawBets: pick === 'draw' ? [betId] : [],
                                                    nonDrawBets: pick === 'nondraw' ? [betId] : [],
                                                    origin
                                                }
                                            );
                                            try {
                                                await newBetPool.save();
                                                await checkAutoBet(savedBet, newBetPool, user, sportData, line);
                                                betpoolId = newBetPool.uid;
                                            } catch (err) {
                                                console.error('can\'t save newBetPool => ' + err);
                                            }
                                        }
                                        await calculateBetsStatus(betpoolId);

                                        try {
                                            await FinancialLog.create({
                                                financialtype: 'bet',
                                                uniqid: `BP${ID()}`,
                                                user: user._id,
                                                betId: betId,
                                                amount: toBet,
                                                method: 'bet',
                                                status: FinancialStatus.success,
                                                beforeBalance: user.balance,
                                                afterBalance: newBalance
                                            });
                                            user.balance = newBalance;
                                            await user.save();
                                        } catch (err) {
                                            console.error('can\'t save user balance => ' + err);
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
                            errors.push(`${pickName} @${odds[pick]} wager could not be placed. Odds have changed.`);
                        }
                    } else {
                        errors.push(`${pickName} @${odds[pick]} wager could not be placed. Line not found`);
                    }
                } else {
                    errors.push(`${pickName} @${odds[pick]} wager could not be placed. Line not found`);
                }
            }
        }

        const afterLoyalty = await getLoyalty(user);
        const afterAvailableClaims = calcAvailableClaims(afterLoyalty);

        return res.json({
            balance: user.balance,
            newClaims: afterAvailableClaims - preAvailableClaims,
            errors,
        });
    }
);

expressApp.post(
    '/placeParlayBets',
    isAuthenticated,
    bruteforce.prevent,
    async (req, res) => {
        const { betSlip, totalStake, totalWin } = req.body;
        const { user } = req;
        const errors = [];
        if (user.roles.selfExcluded && (new Date()).getTime() < (new Date(user.roles.selfExcluded)).getTime()) {
            errors.push(`You are self-excluded till ${dateformat(new Date(user.roles.selfExcluded), "mediumDate")}`)
            return res.json({
                balance: user.balance,
                errors,
            });
        }

        let autobet = await AutoBet.findOne({ userId: user._id });
        if (autobet) {
            errors.push(`Autobet user can't place bet.`)
            return res.json({ balance: user.balance, errors });
        }

        const betSettings = await Frontend.findOne({ name: "bet_settings" });
        if (betSettings && betSettings.value && !betSettings.value.parlay) {
            errors.push(`Parlay Bet is temporary unavailable.`)
            return res.json({
                balance: user.balance,
                errors,
            });
        }

        if (totalStake > user.balance) {
            errors.push(`Bet can't be placed. Insufficient funds.`)
            return res.json({ balance: user.balance, errors });
        }

        if (betSlip.length < 2 || !totalStake || !totalWin) {
            errors.push(`Bet can't be placed. Query Incompleted.`)
            return res.json({ balance: user.balance, errors });
        }

        let correlated = false;
        for (const bet of betSlip) {
            const { pickName, lineQuery } = bet;
            const sameBet = betSlip.find(bet => bet.lineQuery.eventId == lineQuery.eventId && bet.pickName != pickName);
            if (sameBet) {
                correlated = true;
                break;
            }
        }

        if (correlated) {
            errors.push(`Correlated bets could not be placed.`)
            return res.json({ balance: user.balance, errors });
        }

        const preLoyalty = await getLoyalty(user);
        const preAvailableClaims = calcAvailableClaims(preLoyalty);

        const parlayQuery = [];
        let index = 0;
        let eventsDetail = '';
        for (const bet of betSlip) {
            index++;
            const { odds, originOdds, pick, lineQuery, pickName, origin, sportsbook, live } = bet;
            if (!originOdds || !pick || !lineQuery) {
                errors.push(`${pickName} @${originOdds[pick]} wager could not be placed. Query Incomplete.`);
                break;
            }
            if (origin == 'custom') {
                errors.push(`Can't place parlay bets on custome events.`);
                break;
            }
            const { sportName, leagueId, eventId, lineId, type, subtype, altLineId } = lineQuery;
            const sportData = await Sport.findOne({ name: new RegExp(`^${sportName}$`, 'i') });
            if (!sportData) {
                errors.push(`${pickName} @${originOdds[pick]} wager could not be placed. Line not found`);
                break;
            }
            const { originSportId } = sportData;
            lineQuery.sportId = originSportId;
            const line = getLineFromSportData(sportData, leagueId, eventId, lineId, type, subtype, altLineId, live);
            if (!line) {
                errors.push(`${pickName} @${originOdds[pick]} wager could not be placed. Line not found`);
                break;
            }
            const { teamA, teamB, startDate, line: { home, away, hdp, points, over, under } } = line;
            const pickWithOverUnder = ['total', 'alternative_total', 'home_total', 'away_total'].includes(lineQuery.type) ? (pick === 'home' ? 'over' : 'under') : pick;
            const lineOdds = line.line[pickWithOverUnder];
            const oddsA = ['total', 'alternative_total', 'home_total', 'away_total'].includes(lineQuery.type) ? over : home;
            const oddsB = ['total', 'alternative_total', 'home_total', 'away_total'].includes(lineQuery.type) ? under : away;
            // let newLineOdds = calculateNewOdds(oddsA, oddsB, pick, lineQuery.type, lineQuery.subtype);
            // if (sportsbook)
            // const newLineOdds = pick == 'home' ? oddsA : oddsB;

            const oddsMatch = originOdds[pick] === lineOdds;
            if (!oddsMatch) {
                errors.push(`${pickName} @${originOdds[pick]} wager could not be placed. Odds have changed.`);
                break;
            }

            parlayQuery.push({
                teamA: { name: teamA, odds: oddsA },
                teamB: { name: teamB, odds: oddsB },
                pick: pick,
                pickOdds: lineOdds,
                oldOdds: lineOdds,
                pickName: pickName,
                matchStartDate: startDate,
                lineQuery: {
                    ...lineQuery,
                    points: hdp ? hdp : points ? points : null,
                },
                origin: origin,
                sportsbook: true
            });

            const matchTimeString = convertTimeLineDate(new Date(startDate), null);
            let betType = '';
            switch (type) {
                case 'total':
                case 'alternative_total':
                    if (pick == 'home') {
                        betType += `O ${points}`;
                    } else {
                        betType += `U ${points}`;
                    }
                    break;
                case 'home_total':
                    if (pick == 'home') {
                        betType += `O ${points}`;
                    } else {
                        betType += `U ${points}`;
                    }
                    break;
                case 'away_total':
                    if (pick == 'home') {
                        betType += `O ${points}`;
                    } else {
                        betType += `U ${points}`;
                    }
                    break;
                case 'spread':
                case 'alternative_spread':
                    if (pick == 'home') {
                        betType += `${hdp > 0 ? '+' : ''}${hdp}`;
                    } else {
                        betType += `${-1 * hdp > 0 ? '+' : ''}${-1 * hdp}`;
                    }
                    break;
            }
            eventsDetail += `<li>
                <p>Event ${index}: ${teamA} vs ${teamB}(${lineQuery.sportName})</p>
                <p>Bet: ${lineQuery.type == 'moneyline' ? lineQuery.type : `${lineQuery.type}@${betType}`}</p>
                <p>Date: ${matchTimeString}</p>
            </li>`;
        }

        if (parlayQuery.length != betSlip.length) {
            return res.json({
                balance: user.balance,
                errors,
            });
        }

        try {
            let parlayOdds = 1;
            let lastMatchStartTime = new Date(parlayQuery[0].matchStartDate);
            for (const parlay of parlayQuery) {
                const { pickOdds } = parlay;
                parlayOdds *= Number(convertOdds(Number(pickOdds), 'decimal'));

                const matchStartDate = new Date(parlay.matchStartDate);
                if (matchStartDate.getTime() < lastMatchStartTime.getTime())
                    lastMatchStartTime = matchStartDate;
            }

            if (parlayOdds >= 2) {
                parlayOdds = parseInt((parlayOdds - 1) * 100);
            } else {
                parlayOdds = parseInt(-100 / (parlayOdds - 1));
            }
            const toWin = calculateToWinFromBet(totalStake, parlayOdds);
            if (toWin != totalWin) {
                errors.push(`Bet can't be placed. Win Amount mismatch.`);
                return res.json({
                    balance: user.balance,
                    errors,
                });
            }

            if (toWin > maximumWin) {
                errors.push(`Bet can't be placed. Exceed maximum win amount.`);
                return res.json({
                    balance: user.balance,
                    errors,
                });
            }
            const fee = toWin * BetFee;
            const bet_id = ID();
            const parlayBet = await Bet.create({
                userId: user._id,
                pick: 'home',
                pickName: 'Parlay Bet',
                pickOdds: parlayOdds,
                oldOdds: parlayOdds,
                bet: totalStake,
                toWin: toWin,
                fee: fee,
                matchStartDate: lastMatchStartTime,
                status: 'Pending',
                matchingStatus: 'Pending',
                transactionID: `B${bet_id}`,
                origin: 'bet365',
                isParlay: true,
                parlayQuery: parlayQuery
            });

            await FinancialLog.create({
                financialtype: 'bet',
                uniqid: `BP${bet_id}`,
                user: user._id,
                betId: parlayBet._id,
                amount: totalStake,
                method: 'bet',
                status: FinancialStatus.success,
                beforeBalance: user.balance,
                afterBalance: user.balance - totalStake
            });

            user.balance -= totalStake;
            await user.save();

            await LoyaltyLog.create({
                user: user._id,
                point: totalStake * loyaltyPerBet
            });

            let adminMsg = {
                from: `${fromEmailName} <${fromEmailAddress}>`,
                to: helloEmailAddress,
                subject: 'New Parlay Bet',
                text: `New Parlay Bet`,
                html: simpleresponsive(
                    `<ul>
                        <li>Customer: ${user.email} (${user.firstname} ${user.lastname})</li>
                        ${eventsDetail}
                        <li>Wager: $${fee.toFixed(2)}</li>
                        <li>Odds: ${parlayOdds > 0 ? ('+' + parlayOdds) : parlayOdds}</li>
                        <li>Win: $${toWin.toFixed(2)}</li>
                    </ul>`),
            }
            sgMail.send(adminMsg).catch(error => {
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

            adminMsg.to = supportEmailAddress;
            sgMail.send(adminMsg).catch(error => {
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

            const parlayBetPool = await ParlayBetPool.create({
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
                matchStartDate: lastMatchStartTime,
                homeBets: [parlayBet._id],
                awayBets: [],
                origin: parlayBet.origin
            });
            try {
                await checkAutobetForParlay(parlayBet, parlayBetPool, user);
                await calculateParlayBetsStatus(parlayBetPool._id);
            } catch (error) {
                console.error(error);
                return res.json({
                    balance: user.balance,
                    errors,
                });
            }

        } catch (error) {
            console.error(error);
            errors.push(`Bet can't be placed. Internal Server Error.`);
        }

        const afterLoyalty = await getLoyalty(user);
        const afterAvailableClaims = calcAvailableClaims(afterLoyalty);

        res.json({
            balance: user.balance,
            newClaims: afterAvailableClaims - preAvailableClaims,
            errors,
        });
    }
);

expressApp.post(
    '/placeTeaserBets',
    isAuthenticated,
    bruteforce.prevent,
    async (req, res) => {
        const { teaserBetSlip: { type: teaserType, betSlip }, totalStake, totalWin } = req.body;
        const { user } = req;
        const errors = [];
        if (user.roles.selfExcluded && (new Date()).getTime() < (new Date(user.roles.selfExcluded)).getTime()) {
            errors.push(`You are self-excluded till ${dateformat(new Date(user.roles.selfExcluded), "mediumDate")}`)
            return res.json({
                balance: user.balance,
                errors,
            });
        }

        let autobet = await AutoBet.findOne({ userId: user._id });
        if (autobet) {
            errors.push(`Autobet user can't place bet.`)
            return res.json({ balance: user.balance, errors });
        }

        const betSettings = await Frontend.findOne({ name: "bet_settings" });
        if (betSettings && betSettings.value && !betSettings.value.teaser) {
            errors.push(`Teaser Bet is temporary unavailable.`)
            return res.json({
                balance: user.balance,
                errors,
            });
        }

        if (totalStake > user.balance) {
            errors.push(`Bet can't be placed. Insufficient funds.`)
            return res.json({ balance: user.balance, errors });
        }

        if (betSlip.length < 2 || !totalStake || !totalWin) {
            errors.push(`Bet can't be placed. Query Incompleted.`)
            return res.json({ balance: user.balance, errors });
        }

        const preLoyalty = await getLoyalty(user);
        const preAvailableClaims = calcAvailableClaims(preLoyalty);

        const teaserQuery = [];
        let index = 0;
        let eventsDetail = '';
        let lastMatchStartTime = null;
        const newLineOdds = getTeaserOdds(teaserType.sportName, teaserType.teaserPoint, betSlip.length)
        for (const bet of betSlip) {
            index++;
            const { pick, lineQuery, pickName, origin, live, teaserPoint } = bet;
            if (!pick || !lineQuery) {
                errors.push(`${pickName} wager could not be placed. Query Incomplete.`);
                break;
            }
            if (teaserPoint != teaserType.teaserPoint) {
                errors.push(`${pickName} wager could not be placed. Line Mismatch.`);
                break;
            }
            if (origin == 'custom') {
                errors.push(`Can't place parlay bets on custome events.`);
                break;
            }
            const { sportName, leagueId, eventId, lineId, type, subtype, altLineId } = lineQuery;
            const sportData = await Sport.findOne({ name: new RegExp(`^${sportName}$`, 'i') });
            if (!sportData) {
                errors.push(`${pickName} wager could not be placed. Line not found`);
                break;
            }
            const { originSportId } = sportData;
            lineQuery.sportId = originSportId;
            const line = getLineFromSportData(sportData, leagueId, eventId, lineId, type, subtype, altLineId, live);
            if (!line) {
                errors.push(`${pickName} wager could not be placed. Line not found`);
                break;
            }
            const { teamA, teamB, startDate, line: { hdp, points } } = line;
            let fPoints = hdp ? hdp : points ? points : null;

            const matchTimeString = convertTimeLineDate(new Date(startDate), null);
            let betType = '';
            switch (type) {
                case 'total':
                    if (pick == 'home') {
                        fPoints -= teaserType.teaserPoint;
                        betType += `O ${fPoints}`;
                    } else {
                        fPoints += teaserType.teaserPoint;
                        betType += `U ${fPoints}`;
                    }
                    break;

                case 'spread':
                    if (pick == 'home') {
                        fPoints += teaserType.teaserPoint;
                        betType += `${fPoints > 0 ? '+' : ''}${fPoints}`;
                    } else {
                        fPoints = teaserType.teaserPoint - fPoints;
                        betType += `${fPoints > 0 ? '+' : ''}${fPoints}`;
                    }
                    break;
            }

            if (fPoints != lineQuery.points) {
                errors.push(`${pickName} wager could not be placed. Line is mismatching.`);
                break;
            }

            teaserQuery.push({
                teamA: { name: teamA },
                teamB: { name: teamB },
                pick: pick,
                pickName: pickName,
                matchStartDate: startDate,
                lineQuery: {
                    ...lineQuery,
                    points: pick == 'away' && type == 'spread' ? -lineQuery.points : lineQuery.points,
                    teaserPoint: teaserType.teaserPoint,
                },
                origin: origin,
            });

            const matchStartDate = new Date(startDate);
            if (lastMatchStartTime == null) {
                lastMatchStartTime = matchStartDate;
            }
            if (matchStartDate.getTime() < lastMatchStartTime.getTime())
                lastMatchStartTime = matchStartDate;

            eventsDetail += `<li>
                <p>Event ${index}: ${teamA} vs ${teamB}(${lineQuery.sportName})</p>
                <p>Bet: ${lineQuery.type == 'moneyline' ? lineQuery.type : `${lineQuery.type}@${betType}`}</p>
                <p>Date: ${matchTimeString}</p>
            </li>`;
        }

        if (teaserQuery.length != betSlip.length) {
            return res.json({
                balance: user.balance,
                errors,
            });
        }

        try {
            const toWin = calculateToWinFromBet(totalStake, newLineOdds);
            if (toWin != totalWin) {
                errors.push(`Bet can't be placed. Win Amount mismatch.`);
                return res.json({
                    balance: user.balance,
                    errors,
                });
            }

            if (toWin > maximumWin) {
                errors.push(`Bet can't be placed. Exceed maximum win amount.`);
                return res.json({
                    balance: user.balance,
                    errors,
                });
            }
            const fee = toWin * BetFee;
            const bet_id = ID();
            const teaserBet = await Bet.create({
                userId: user._id,
                pick: 'home',
                pickName: 'Parlay Bet',
                pickOdds: newLineOdds,
                oldOdds: newLineOdds,
                bet: totalStake,
                toWin: toWin,
                fee: fee,
                matchStartDate: lastMatchStartTime,
                status: 'Pending',
                matchingStatus: 'Pending',
                transactionID: `B${bet_id}`,
                origin: 'bet365',
                isParlay: true,
                parlayQuery: teaserQuery
            });

            await FinancialLog.create({
                financialtype: 'bet',
                uniqid: `BP${bet_id}`,
                user: user._id,
                betId: teaserBet._id,
                amount: totalStake,
                method: 'bet',
                status: FinancialStatus.success,
                beforeBalance: user.balance,
                afterBalance: user.balance - totalStake
            });

            user.balance -= totalStake;
            await user.save();

            await LoyaltyLog.create({
                user: user._id,
                point: totalStake * loyaltyPerBet
            });

            let adminMsg = {
                from: `${fromEmailName} <${fromEmailAddress}>`,
                to: helloEmailAddress,
                subject: 'New Parlay Bet',
                text: `New Parlay Bet`,
                html: simpleresponsive(
                    `<ul>
                        <li>Customer: ${user.email} (${user.firstname} ${user.lastname})</li>
                        ${eventsDetail}
                        <li>Wager: $${fee.toFixed(2)}</li>
                        <li>Odds: ${newLineOdds > 0 ? ('+' + newLineOdds) : newLineOdds}</li>
                        <li>Win: $${toWin.toFixed(2)}</li>
                    </ul>`),
            }
            sgMail.send(adminMsg).catch(error => {
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

            adminMsg.to = supportEmailAddress;
            sgMail.send(adminMsg).catch(error => {
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

            const teaserBetPool = await ParlayBetPool.create({
                parlayQuery: teaserQuery,
                teamA: {
                    odds: newLineOdds,
                    betTotal: totalStake,
                    toWinTotal: totalWin
                },
                teamB: {
                    odds: -Number(newLineOdds),
                    betTotal: 0,
                    toWinTotal: 0
                },
                matchStartDate: lastMatchStartTime,
                homeBets: [teaserBet._id],
                awayBets: [],
                origin: teaserBet.origin
            });
            try {
                await checkAutobetForParlay(teaserBet, teaserBetPool, user);
                await calculateParlayBetsStatus(teaserBetPool._id);
            } catch (error) {
                console.error(error);
                return res.json({
                    balance: user.balance,
                    errors,
                });
            }

        } catch (error) {
            console.error(error);
            errors.push(`Bet can't be placed. Internal Server Error.`);
        }

        const afterLoyalty = await getLoyalty(user);
        const afterAvailableClaims = calcAvailableClaims(afterLoyalty);

        return res.json({
            balance: user.balance,
            newClaims: afterAvailableClaims - preAvailableClaims,
            errors,
        });
    }
);

const checkAutobetForParlay = async (parlayBet, parlayBetPool, user) => {
    const { AutoBetStatus } = config;
    const { toWin: toBet, parlayQuery, matchStartDate, pickOdds } = parlayBet;

    //Find autobet
    let autobets = await AutoBet
        .find({
            acceptParlay: 1,
            usersExcluded: { $ne: ObjectId(user._id) }
        })
        .populate('userId');

    autobets = JSON.parse(JSON.stringify(autobets));
    let timezoneOffset = -8;
    if (isDstObserved) timezoneOffset = -7;
    const today = new Date().addHours(timezoneOffset);
    today.addHours(today.getTimezoneOffset() / 60);
    timezoneOffset = timezoneOffset + today.getTimezoneOffset() / 60;
    const fromTime = new Date(today.getFullYear(), today.getMonth(), today.getDate()).addHours(-timezoneOffset);

    let autobetusers = await asyncFilter(autobets, async (autobet) => {
        try {
            if (!autobet.userId) return false;
            const logs = await AutoBetLog
                .aggregate([
                    {
                        $match: {
                            user: new ObjectId(autobet.userId._id),
                            createdAt: { $gte: fromTime },
                            type: 'parlay',
                        }
                    },
                    { $group: { _id: null, amount: { $sum: "$amount" } } }
                ]);
            let bettedamount = 0;
            if (logs && logs.length)
                bettedamount = logs[0].amount;
            let budget = autobet.parlayBudget;
            if (autobet.rollOver) { // If Roll Over
                // Add win amount.
                const logs = await FinancialLog
                    .aggregate([
                        {
                            $match: {
                                user: new ObjectId(autobet.userId._id),
                                financialtype: 'betwon',
                                createdAt: { $gte: fromTime }
                            }
                        },
                        { $group: { _id: null, amount: { $sum: "$amount" } } }
                    ]);
                if (logs && logs.length)
                    budget += logs[0].amount;
            }
            autobet.bettable = budget - bettedamount;
            if (autobet.referral_code && user.referral_code &&
                autobet.referral_code.toLowerCase() == user.referral_code.toLowerCase()) {
                return (
                    autobet.userId._id.toString() != user._id.toString() &&     //Not same user
                    autobet.status == AutoBetStatus.active &&                   //Check active status
                    autobet.userId.balance > 0 &&                               //Check Balance
                    autobet.bettable > 0 &&                                     //Check bettable
                    true
                );
            }
            return (
                autobet.userId._id.toString() != user._id.toString() &&     //Not same user
                autobet.status == AutoBetStatus.active &&                   //Check active status
                autobet.userId.balance > 0 &&                               //Check Balance
                autobet.bettable > 0 &&                                     //Check bettable
                true
            );
        } catch (error) {
            console.error('filter => ', error);
            return false;
        }
    });

    if (autobetusers.length == 0) return;
    autobetusers.sort((a, b) => {
        if (a.referral_code && user.referral_code &&
            a.referral_code.toLowerCase() == user.referral_code.toLowerCase())
            return -1;
        if (b.referral_code && user.referral_code &&
            b.referral_code.toLowerCase() == user.referral_code.toLowerCase())
            return 1;
        return (a.priority > b.priority) ? -1 : 1;
    });

    let betAmount = toBet;
    const newLineOdds = -Number(pickOdds);
    for (let i = 0; i < autobetusers.length; i++) {
        const selectedauto = autobetusers[i];
        if (betAmount <= 0) return;
        let bettable = Math.min(betAmount, selectedauto.maxRisk, selectedauto.userId.balance, selectedauto.bettable);
        betAmount -= bettable;
        const betAfterFee = bettable;
        const toWin = calculateToWinFromBet(betAfterFee, newLineOdds);
        const fee = Number((toWin * BetFee).toFixed(2));

        const bet_id = ID();
        const newBetObj = {
            userId: selectedauto.userId._id,
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
            origin: parlayBet.origin,
            isParlay: true,
            parlayQuery: parlayQuery,
        };
        const newBet = new Bet(newBetObj);

        try {
            const savedBet = await newBet.save();
            await LoyaltyLog.create({
                user: selectedauto.userId._id,
                point: bettable * loyaltyPerBet
            })

            await AutoBetLog.create({
                user: selectedauto.userId._id,
                amount: betAfterFee,
                type: 'parlay'
            });

            const betId = savedBet.id;
            // add betId to betPool
            const docChanges = {
                $push: { awayBets: betId },
                $inc: {
                    "teamB.betTotal": betAfterFee,
                    "teamB.toWinTotal": toWin
                },
            };
            await parlayBetPool.update(docChanges);

            try {
                const user = await User.findById(selectedauto.userId._id);
                if (user) {
                    await FinancialLog.create({
                        financialtype: 'bet',
                        uniqid: `BP${bet_id}`,
                        user: selectedauto.userId._id,
                        betId: betId,
                        amount: bettable,
                        method: 'bet',
                        status: FinancialStatus.success,
                        beforeBalance: user.balance,
                        afterBalance: user.balance - bettable
                    });
                    await user.update({ $inc: { balance: -bettable } });
                }
            } catch (err) {
                console.error('selectedauto.userId =>' + err);
            }

            let amount = 0;
            const logs = await AutoBetLog
                .aggregate([
                    {
                        $match: {
                            user: new ObjectId(selectedauto.userId._id),
                            createdAt: { $gte: fromTime },
                            type: 'parlay',
                        }
                    },
                    { $group: { _id: null, amount: { $sum: "$amount" } } }
                ]);
            if (logs && logs.length)
                amount = logs[0].amount;
            const usage = parseInt(amount / (selectedauto.parlayBudget) * 100);
            if (usage >= 80) {
                let msg = {
                    from: `${fromEmailName} <${fromEmailAddress}>`,
                    to: selectedauto.userId.email,
                    subject: `PPW Alert: Usage at ${usage}%`,
                    text: `PPW Alert: Usage at ${usage}% `,
                    html: simpleresponsive(
                        `<h3>Usage Limit Alert</H3>
                        <p>
                            This is a notification that your have exceeded ${usage}% ($${amount} / $${selectedauto.parlayBudget}) of your daily risk limit.
                        </p>`,
                        { href: 'https://www.payperwin.com/autobet-settings', name: 'Increase daily limit' }),
                }
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
        } catch (e2) {
            if (e2) console.error('newBetError', e2);
        }
    }
}

const checkAutoBet = async (bet, betpool, user, sportData, line) => {
    const { AutoBetStatus } = config;
    let { pick: originPick, toWin: toBet, lineQuery } = bet;

    let pick;
    switch (originPick) {
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

    const { type, subtype } = lineQuery;

    const { originSportId } = sportData;
    lineQuery.sportId = originSportId;

    const { teamA, teamB, startDate, line: { home, away, draw, hdp, points } } = line;

    let oddDrawOpposite = 0;
    if (draw) {
        oddDrawOpposite = draw > 0 ? -Math.abs(draw) : Math.abs(draw);
    }
    const pickWithOverUnder = ['total', 'alternative_total', 'home_total', 'away_total'].includes(type) ? (pick === 'home' ? 'over' : 'under') : pick;
    const lineOdds = line.line[pickWithOverUnder];
    const oddsA = ['total', 'alternative_total', 'home_total', 'away_total'].includes(type) ? line.line.over : line.line.home;
    const oddsB = ['total', 'alternative_total', 'home_total', 'away_total'].includes(type) ? line.line.under : line.line.away;
    // const newLineOdds = bet.sportsbook ? (pick == 'home' ? oddsA : oddsB) : calculateNewOdds(oddsA, oddsB, pick, lineQuery.type);

    let newLineOdds = calculateNewOdds(oddsA, oddsB, pick, lineQuery.type, lineQuery.subtype);
    if (bet.sportsbook) {
        switch (pick) {
            case "home":
                newLineOdds = -oddsB
                break;
            case "draw":
                newLineOdds = draw;
                break;
            case "nondraw":
                newLineOdds = oddDrawOpposite;
                break;
            case 'away':
            default:
                newLineOdds = -oddsA
                break;
        }
    }

    let side = 'Underdog';
    if (['spread', 'alternative_spread'].includes(type)) {
        if (points > 0 && pick == 'away' || points < 0 && pick == 'home') side = 'Favorite';
    }
    else {
        if (oddsA == oddsB) {
            if (pick == 'away' || pick == 'under') side = 'Favorite';
        } else {
            if ((oddsA < oddsB) && (pick == 'home' || pick == 'over') || (oddsA > oddsB) && (pick == 'away' || pick == 'under')) {
                side = 'Favorite';
            }
        }
    }

    let betType = 'Moneyline';
    switch (type) {
        case 'moneyline':
            betType = 'Moneyline';
            break;
        case 'spread':
        case 'alternative_spread':
            betType = 'Spreads';
            break;
        case 'total':
        case 'alternative_total':
        case 'home_total':
        case 'away_total':
        default:
            betType = 'Over/Under';
            break;
    }

    let orCon = [{
        side: side,
        betType: betType,
    }];

    if (user.referral_code) {
        orCon.push({
            referral_code: new RegExp(`^${user.referral_code}$`, 'i')
        })
    }

    let autobets = await AutoBet
        .find({
            $or: orCon,
            usersExcluded: { $ne: ObjectId(user._id) }
        })
        .populate('userId');
    autobets = JSON.parse(JSON.stringify(autobets));

    let timezoneOffset = -8;
    if (isDstObserved) timezoneOffset = -7;
    const today = new Date().addHours(timezoneOffset);
    today.addHours(today.getTimezoneOffset() / 60);
    timezoneOffset = timezoneOffset + today.getTimezoneOffset() / 60;
    const fromTime = new Date(today.getFullYear(), today.getMonth(), today.getDate()).addHours(-timezoneOffset);

    let autobetusers = await asyncFilter(autobets, async (autobet) => {
        try {
            if (!autobet.userId) return false;
            const logs = await AutoBetLog
                .aggregate([
                    {
                        $match: {
                            user: new ObjectId(autobet.userId._id),
                            createdAt: { $gte: fromTime },
                            type: bet.sportsbook ? 'sportsbook' : { $in: [null, 'p2p'] },
                        }
                    },
                    { $group: { _id: null, amount: { $sum: "$amount" } } }
                ]);

            let bettedamount = 0;
            if (logs && logs.length)
                bettedamount = logs[0].amount;
            let budget = bet.sportsbook ? autobet.sportsbookBudget : autobet.budget;

            if (autobet.rollOver) { // If Roll Over
                // Add win amount.
                const logs = await FinancialLog
                    .aggregate([
                        {
                            $match: {
                                user: new ObjectId(autobet.userId._id),
                                financialtype: 'betwon',
                                createdAt: { $gte: fromTime }
                            }
                        },
                        { $group: { _id: null, amount: { $sum: "$amount" } } }
                    ]);
                if (logs && logs.length)
                    budget += logs[0].amount;
            }
            autobet.bettable = budget - bettedamount;
            if (autobet.referral_code && user.referral_code &&
                autobet.referral_code.toLowerCase() == user.referral_code.toLowerCase()) {
                return (
                    autobet.userId._id.toString() != user._id.toString() &&     //Not same user
                    autobet.status == AutoBetStatus.active &&                   //Check active status
                    autobet.userId.balance > 0 &&                               //Check Balance
                    autobet.bettable > 0 &&                                     //Check bettable
                    true
                );
            }
            return (
                autobet.userId._id.toString() != user._id.toString() &&     //Not same user
                autobet.status == AutoBetStatus.active &&                   //Check active status
                autobet.userId.balance > 0 &&                               //Check Balance
                autobet.bettable > 0 &&                                     //Check bettable
                !autobet.sports.find((sport) => sport == lineQuery.sportName) &&  // Check Sports
                true
            );
        } catch (error) {
            console.error('filter => ', error);
            return false;
        }
    });

    if (autobetusers.length == 0) return;

    autobetusers.sort((a, b) => {
        if (a.referral_code && user.referral_code &&
            a.referral_code.toLowerCase() == user.referral_code.toLowerCase())
            return -1;
        if (b.referral_code && user.referral_code &&
            b.referral_code.toLowerCase() == user.referral_code.toLowerCase())
            return 1;
        return (a.priority > b.priority) ? -1 : 1;
    });

    let pickName = '';
    switch (subtype) {
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
    switch (type) {
        case 'total':
        case 'alternative_total':
            if (pick == 'home') {
                pickName += `Over ${points}`;
            } else {
                pickName += `Under ${points}`;
            }
            break;
        case 'home_total':
            if (pick == 'home') {
                pickName += `${teamA} Over ${points}`;
            } else {
                pickName += `${teamA} Under ${points}`;
            }
            break;
        case 'away_total':
            if (pick == 'home') {
                pickName += `${teamB} Over ${points}`;
            } else {
                pickName += `${teamB} Under ${points}`;
            }
            break;
        case 'spread':
        case 'alternative_spread':
            if (pick == 'home') {
                pickName += `${teamA} ${hdp > 0 ? '+' : ''}${hdp}`;
            } else {
                pickName += `${teamB} ${-1 * hdp > 0 ? '+' : ''}${-1 * hdp}`;
            }
            break;

        case 'moneyline':
            if (pick == 'home') {
                pickName += teamA;
            }
            else if (pick == 'draw') {
                pickName += "Draw";
            }
            else if (pick == 'nondraw') {
                pickName += "Non Draw";
            } else {
                pickName += teamB;
            }
            break;
        default:
            break;
    }
    let betAmount = toBet;
    for (let i = 0; i < autobetusers.length; i++) {
        const selectedauto = autobetusers[i];
        if (betAmount <= 0) return;
        let bettable = Math.min(betAmount, selectedauto.maxRisk, selectedauto.userId.balance, selectedauto.bettable);
        betAmount -= bettable;
        const betAfterFee = bettable;
        const toWin = calculateToWinFromBet(betAfterFee, newLineOdds);
        const fee = bet.sportsbook ? 0 : Number((toWin * BetFee).toFixed(2));

        const bet_id = ID();
        // insert bet doc to bets table
        const newBetObj = {
            userId: selectedauto.userId._id,
            transactionID: `B${bet_id}`,
            teamA: {
                name: teamA,
                odds: home,
            },
            teamB: {
                name: teamB,
                odds: away,
            },
            teamDraw: {
                name: `Draw ${teamA} vs ${teamB}`,
                odds: draw,
            },
            teamNonDraw: {
                name: `Non Draw ${teamA} vs ${teamB}`,
                odds: oddDrawOpposite,
            },
            pick,
            pickOdds: newLineOdds,
            oldOdds: lineOdds,
            pickName,
            bet: betAfterFee,
            toWin,
            fee,
            matchStartDate: startDate,
            status: 'Pending',
            lineQuery,
            origin: bet.origin,
            sportsbook: bet.sportsbook
        };
        const newBet = new Bet(newBetObj);

        try {
            const savedBet = await newBet.save();
            await LoyaltyLog.create({
                user: selectedauto.userId._id,
                point: bettable * loyaltyPerBet
            })

            await AutoBetLog.create({
                user: selectedauto.userId._id,
                amount: betAfterFee,
                type: bet.sportsbook ? 'sportsbook' : 'p2p'
            });

            const betId = savedBet.id;

            const docChanges = {
                $push: {},
                $inc: {},
            };
            switch (pick) {
                case 'home':
                    docChanges.$push['homeBets'] = betId;
                    docChanges.$inc['teamA.betTotal'] = betAfterFee;
                    docChanges.$inc['teamA.toWinTotal'] = toWin;
                    break;
                case 'draw':
                    docChanges.$push['drawBets'] = betId;
                    docChanges.$inc['teamDraw.betTotal'] = betAfterFee;
                    docChanges.$inc['teamDraw.toWinTotal'] = toWin;
                    break;
                case 'nondraw':
                    docChanges.$push['nonDrawBets'] = betId;
                    docChanges.$inc['teamNonDraw.betTotal'] = betAfterFee;
                    docChanges.$inc['teamNonDraw.toWinTotal'] = toWin;
                    break;
                default:
                    docChanges.$push['awayBets'] = betId;
                    docChanges.$inc['teamB.betTotal'] = betAfterFee;
                    docChanges.$inc['teamB.toWinTotal'] = toWin;
                    break;
            }
            await betpool.update(docChanges);
            try {
                const user = await User.findById(selectedauto.userId._id);
                if (user) {
                    await FinancialLog.create({
                        financialtype: 'bet',
                        uniqid: `BP${bet_id}`,
                        user: selectedauto.userId._id,
                        betId: betId,
                        amount: bettable,
                        method: 'bet',
                        status: FinancialStatus.success,
                        beforeBalance: user.balance,
                        afterBalance: user.balance - bettable
                    });
                    await user.update({ $inc: { balance: -bettable } });
                }
            } catch (err) {
                console.error('selectedauto.userId =>' + err);
            }

            let amount = 0;
            const logs = await AutoBetLog
                .aggregate([
                    {
                        $match: {
                            user: new ObjectId(selectedauto.userId._id),
                            createdAt: { $gte: fromTime },
                            type: bet.sportsbook ? 'sportsbook' : { $in: [null, 'p2p'] },
                        }
                    },
                    { $group: { _id: null, amount: { $sum: "$amount" } } }
                ]);
            if (logs && logs.length)
                amount = logs[0].amount;
            const usage = parseInt(amount / (bet.sportsbook ? selectedauto.sportsbookBudget : selectedauto.budget) * 100);
            if (usage >= 80) {
                let msg = {
                    from: `${fromEmailName} <${fromEmailAddress}>`,
                    to: selectedauto.userId.email,
                    subject: `PPW Alert: Usage at ${usage}%`,
                    text: `PPW Alert: Usage at ${usage}% `,
                    html: simpleresponsive(
                        `<h3>Usage Limit Alert</H3>
                        <p>
                            This is a notification that your have exceeded ${usage}% ($${amount} / $${bet.sportsbook ? selectedauto.sportsbookBudget : selectedauto.budget}) of your daily risk limit.
                        </p>`,
                        { href: 'https://www.payperwin.com/autobet-settings', name: 'Increase daily limit' }),
                }
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
        } catch (e2) {
            if (e2) console.error('newBetError', e2);
        }
    }

    await calculateBetsStatus(betpool.uid);
}

expressApp.get(
    '/line',
    async (req, res) => {
        if (req.user && req.user.username) {
            const { betId } = req.query;
            const bet = await Bet.findById(new ObjectId(betId));
            if (bet) {
                const { lineQuery: { sportName, leagueId, eventId, lineId, type, altLineId }, pick, pickName, payableToWin, bet: risk, toWin, pickOdds, oldOdds } = bet;
                const sportData = await Sport.findOne({ name: new RegExp(`^${sportName}$`, 'i') });
                if (sportData) {
                    const line = getLineFromSportData(sportData, leagueId, eventId, lineId, type, altLineId);
                    line.type = type;
                    line.pickName = pickName;
                    line.pickOdds = pickOdds;
                    line.oldOdds = oldOdds;
                    line.payableToWin = pick;
                    line.bet = risk;
                    line.toWin = toWin;
                    res.json(line);
                }
            } else {
                res.status(404).json({ error: 'BetId not found.' });
            }
        } else {
            res.status(404).end();
        }
    },
);

expressApp.post(
    '/bets',
    isAuthenticated,
    async (req, res) => {
        const { _id } = req.user;
        const perPage = 20;
        let { openBets, settledBets, custom, page, daterange, filter } = req.body;
        if (!page) page = 0;
        let searchObj = {
            userId: _id,
        };
        if (openBets) {
            searchObj.status = { $in: [null, 'Pending', 'Partial Match', 'Matched', 'Accepted', 'Partial Accepted', null] };
        } else if (settledBets) {
            searchObj.status = { $in: ['Settled - Win', 'Settled - Lose', 'Cancelled', 'Draw'] }
        } else if (custom) {
            searchObj.status = 'Accepted';
            searchObj.origin = 'custom';
        }

        if (daterange) {
            try {
                const { startDate, endDate } = daterange;
                searchObj.updatedAt = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate),
                }
            } catch (error) { }
        }

        if (filter) {
            let orCon = [];
            if (filter.p2p) {
                orCon.push({
                    sportsbook: { $in: [null, false] },
                    isParlay: { $in: [null, false] },
                });
            }
            if (filter.sportsbook) {
                orCon.push({
                    sportsbook: true,
                    isParlay: { $in: [null, false] },
                });
            }
            if (filter.parlay) {
                orCon.push({
                    isParlay: true,
                })
            }
            searchObj = {
                ...searchObj,
                $or: orCon
            }
        }

        const bets = await Bet
            .find(searchObj)
            .sort({ createdAt: -1 })
            .skip(page * perPage)
            .limit(perPage)
            .populate('event');
        res.json(bets);

    },
);

expressApp.post(
    '/bets/:id/forward',
    isAuthenticated,
    async (req, res) => {
        const { id } = req.params;
        const user = req.user;
        if (!id) {
            return res.status(404).json({ error: 'Bet info not found.' });
        }
        try {
            const bet = await Bet.findById(id);
            if (!bet) {
                return res.status(404).json({ error: 'Bet info not found.' });
            }
            if (bet.sportsbook) {
                return res.status(400).json({ error: 'Bet already forwarded.' });
            }
            if (bet.status != 'Pending') {
                return res.status(400).json({ error: 'Forward is for only pending bets.' });
            }
            const lineQuery = bet.lineQuery;
            const linePoints = lineQuery.points ? lineQuery.points : getLinePoints(bet.pickName, bet.pick, lineQuery)

            let latestOdds = 0;
            const { sportName, leagueId, eventId, lineId, type, subtype, altLineId } = lineQuery;
            const sportData = await Sport.findOne({ name: new RegExp(`^${sportName}$`, 'i') });

            if (sportData) {
                const line = getLineFromSportData(sportData, leagueId, eventId, lineId, type, subtype, altLineId);
                if (line) {
                    const oddsA = ['total', 'alternative_total', 'home_total', 'away_total'].includes(lineQuery.type) ? line.line.over : line.line.home;
                    const oddsB = ['total', 'alternative_total', 'home_total', 'away_total'].includes(lineQuery.type) ? line.line.under : line.line.away;
                    switch (bet.pick) {
                        case "home":
                            latestOdds = oddsA
                            break;
                        default:
                            latestOdds = oddsB
                            break;
                    }
                }
            }

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

            bet.pickOdds = latestOdds;
            bet.status = null;
            bet.toWin = calculateToWinFromBet(bet.bet, Number(latestOdds));
            bet.fee = bet.toWin * BetFee;
            bet.sportsbook = true;
            await bet.save();

            await checkAutoBet(bet, betpool, user, { originSportId: bet.lineQuery.sportId },
                {
                    teamA: bet.teamA.name,
                    teamB: bet.teamB.name,
                    startDate: bet.matchStartDate,
                    line: {
                        home: Number(bet.teamA.odds),
                        over: Number(bet.teamA.odds),
                        away: Number(bet.teamB.odds),
                        under: Number(bet.teamB.odds),
                        hdp: linePoints,
                        points: linePoints
                    }
                });
            await calculateBetsStatus(betpool.uid);

            const newBet = await Bet.findById(id);
            res.json(newBet);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.stack });
        }
    }
)

expressApp.get(
    '/user',
    // isAuthenticated,
    async (req, res) => {
        let userObj = null;
        if (req.isAuthenticated()) {
            const {
                username, _id: userId, settings, roles, email,
                balance, phone, maxBetLimitTier, firstname, lastname,
                address, address2, country, city, region, postalcode,
            } = req.user;
            let preference = await Preference.findOne({ user: userId });
            if (!preference) {
                preference = await Preference.create({ user: userId });
            }
            const messages = await Message
                .find({ published_at: { $ne: null }, userFor: userId })
                .count();
            const autobet = await AutoBet.findOne({ userId: userId });
            const favorites = await Favorites.find({ user: userId })
            userObj = {
                username, userId, firstname, lastname, roles, email, balance, phone,
                preference, messages, autobet, maxBetLimitTier, favorites,
                address, address2, country, city, region, postalcode,
            };
            if (settings && settings.site) {
                userObj.settings = settings.site;
            }
        }
        res.json(userObj);
    },
);

expressApp.get(
    '/inbox',
    isAuthenticated,
    async (req, res) => {
        const { _id: user_id } = req.user;
        const messages = await Message
            .find({
                published_at: { $ne: null },
                userFor: user_id,
            })
            .select(['title', 'published_at']);
        res.json(messages);
    },
);

expressApp.get(
    '/inbox/:id',
    isAuthenticated,
    async (req, res) => {
        const { _id: user_id } = req.user;
        const { id } = req.params;
        const message = await Message
            .findOne({
                published_at: { $ne: null },
                userFor: user_id,
                _id: new ObjectId(id)
            });
        if (message)
            res.json(message);
        else
            res.status(404).json({ error: "can't get message" });
    },
);

expressApp.delete(
    '/inbox/:id',
    isAuthenticated,
    async (req, res) => {
        const { _id: user_id } = req.user;
        const { id } = req.params;
        const message = await Message
            .findOne({
                published_at: { $ne: null },
                userFor: user_id,
                _id: new ObjectId(id)
            });
        if (message) {
            message.userFor = message.userFor.filter((user) => user.toString() != user_id.toString());
            await message.save();
            res.json({ success: true });
        }
        else
            res.status(404).json({ error: "can't get message" });
    },
);


expressApp.get(
    '/profile',
    isAuthenticated,
    async (req, res) => {
        let userObj = false;
        if (req.isAuthenticated()) {
            const { title, username,
                firstname, lastname,
                email, dateofbirth,
                country, currency,
                region, city,
                address, address2,
                postalcode, phone } = req.user;
            userObj = {
                title, username,
                firstname, lastname,
                email, dateofbirth,
                country, currency,
                region, city,
                address, address2,
                postalcode, phone
            };
        }
        res.json(userObj);
    },
);

expressApp.post(
    '/profile',
    bruteforce.prevent,
    async (req, res) => {
        if (req.isAuthenticated()) {
            const data = req.body;
            if (data) {
                try {
                    // req.user.update(data);
                    // req.user.save();
                    const { _id } = req.user;
                    await User.findByIdAndUpdate(new ObjectId(_id), data);

                    res.json("Successfully updated.");
                } catch (error) {
                    res.status(500).json({ error: "Unhandled Error.", result: error });
                }
            } else {
                res.status(404).json("Body is required.");
            }
        }
        else
            res.status(403).json("Unauthorized.");
    },
);

expressApp.get(
    '/sport',
    async (req, res) => {
        const { name, leagueId, eventId } = req.query;
        try {
            if (name) {
                const sportData = await Sport.findOne({
                    $or: [
                        { name: new RegExp(`^${name}$`, 'i') },
                        { shortName: new RegExp(`^${name}$`, 'i') }
                    ]
                });
                if (sportData) {
                    if (leagueId) {
                        const sportLeague = sportData.leagues.find(league => league.originId == leagueId)
                        if (sportLeague) {
                            if (eventId) {
                                const event = sportLeague.events.find(event => event.originId == eventId);
                                if (event)
                                    return res.json({
                                        leagueName: sportLeague.name,
                                        sportName: sportData.name,
                                        shortName: sportData.shortName,
                                        origin: sportData.origin,
                                        ...event
                                    });
                                return res.json(null);
                            }
                            sportLeague.sportName = sportData.name;
                            sportLeague.shortName = sportData.shortName;
                            return res.json({
                                name: sportData.name,
                                leagues: [sportLeague],
                                origin: sportData.origin,
                                originSportId: sportData.originSportId
                            });
                        }
                        return res.json(null);
                    }
                    return res.json({
                        name: sportData.name,
                        leagues: sportData.leagues.map(league => ({
                            ...league,
                            sportName: sportData.name,
                            shortName: sportData.shortName,
                        })),
                        origin: sportData.origin,
                        originSportId: sportData.originSportId
                    });
                } else {
                    return res.json(null);
                }
            } else {
                const sportsData = await Sport.find();
                let leagues = [];
                for (const sportData of sportsData) {
                    leagues = [...leagues, ...sportData.leagues.map(league => ({
                        ...league,
                        sportName: sportData.name,
                        shortName: sportData.shortName,
                    }))]
                }

                return res.json({
                    name: 'All',
                    leagues: sortSearchResults(leagues),
                    origin: 'bet365',
                });
            }
        } catch (error) {
            console.error(error);
            return res.json(null);
        }
    },
);

expressApp.get(
    '/livesport',
    async (req, res) => {
        const { name, leagueId, eventId } = req.query;
        const sportData = await Sport.findOne({
            $or: [
                { name: new RegExp(`^${name}$`, 'i') },
                { shortName: new RegExp(`^${name}$`, 'i') }
            ]
        });
        if (sportData) {
            if (leagueId) {
                const sportLeague = sportData.liveLeagues.find(league => league.originId == leagueId)
                if (sportLeague) {
                    if (eventId) {
                        const event = sportLeague.events.find(event => event.originId == eventId);
                        if (event)
                            return res.json({
                                leagueName: sportLeague.name,
                                shortName: sportData.shortName,
                                sportName: sportData.name,
                                origin: sportData.origin,
                                ...event
                            });
                        return res.json(null);
                    }
                    sportLeague.sportName = sportData.name;
                    sportLeague.shortName = sportData.shortName;
                    return res.json({
                        name: sportData.name,
                        leagues: [sportLeague],
                        origin: sportData.origin,
                        originSportId: sportData.originSportId
                    });
                }
                return res.json(null);
            }
            return res.json({
                name: sportData.name,
                shortName: sportData.shortName,
                leagues: sportData.liveLeagues.map(league => ({
                    ...league,
                    sportName: sportData.name,
                    shortName: sportData.shortName,
                })),
                origin: sportData.origin,
                originSportId: sportData.originSportId
            });
        } else {
            return res.json(null);
        }
    },
);

expressApp.get(
    '/sportleague',
    async (req, res) => {
        const { name } = req.query;
        const sportData = await Sport.findOne({
            $or: [
                { name: new RegExp(`^${name}$`, 'i') },
                { shortName: new RegExp(`^${name}$`, 'i') }
            ]
        });
        if (sportData) {
            let data = sportData.leagues.map(league => {
                const { name, events, originId } = league;
                let filteredEvents = events.filter(event => {
                    return (new Date(event.startDate)).getTime() > (new Date()).getTime()
                });
                return {
                    name,
                    eventCount: filteredEvents.length,
                    originId
                }
            });
            let liveLeagues = sportData.liveLeagues ? sportData.liveLeagues.map(league => ({
                name: league.name,
                eventCount: league.events.length,
                originId: league.originId
            })) : [];
            let merged = [];
            data = data.filter(league => league.eventCount > 0)
            for (let i = 0; i < data.length; i++) {
                const duplicated = liveLeagues.find((itmInner) => itmInner.originId === data[i].originId)
                if (duplicated) {
                    merged.push({ ...data[i], eventCount: data[i].eventCount + duplicated.eventCount });
                    liveLeagues = liveLeagues.filter(league => league.originId != duplicated.originId)
                } else {
                    merged.push(data[i]);
                }
            }
            merged = [...merged, ...liveLeagues];
            merged.sort((a, b) => b.eventCount - a.eventCount);
            res.json(merged);
        } else {
            res.json([]);
        }
    },
);

expressApp.get(
    '/sportsdir',
    async (req, res) => {
        const sportsData = await SportsDir.find({});
        const customBets = await Event.find({
            startDate: { $gte: new Date() },
            status: EventStatus.pending.value,
            approved: true,
            public: true,
        }).count();
        if (sportsData) {
            let sports = [];
            for (const sport of sportsData) {
                for (const sp of sport.sports) {
                    const sportData = await Sport.findOne({ name: sp.name });
                    if (sportData) {
                        let eventCount = 0;
                        sportData.leagues.map((league) => {
                            eventCount += league.events.filter(event => (new Date(event.startDate)).getTime() > (new Date()).getTime()).length;
                        });
                        sports.push({
                            eventCount: eventCount,
                            hasOfferings: true,
                            name: sp.name,
                            shortName: sp.shortName,
                        })
                    } else {
                        sports.push({
                            eventCount: 0,
                            hasOfferings: true,
                            name: sp.name,
                            shortName: sp.shortName,
                        })
                    }
                }
            }
            sports.push({
                eventCount: customBets,
                hasOfferings: true,
                name: "Side Bet",
                shortName: 'side-bet',
            });
            res.json(sports);
        } else {
            res.status(404).end();
        }
    },
);

expressApp.get(
    '/custombets',
    async (req, res) => {
        const { id, leagueId } = req.query;
        try {
            const searchObj = {
                startDate: { $gte: new Date() },
                status: EventStatus.pending.value,
                approved: true,
            };
            leagueId && (searchObj['leagueId'] = leagueId);
            if (id) {
                searchObj.uniqueid = id;
            } else {
                searchObj.public = true;
            }
            const customBets = await Event.aggregate(
                { $match: searchObj },
                {
                    $lookup: {
                        from: 'bets',
                        localField: '_id',
                        foreignField: 'event',
                        as: 'bets'
                    }
                },
                {
                    $project: {
                        startDate: 1,
                        name: 1,
                        options: 1,
                        uniqueid: 1,
                        _id: 1,
                        allowAdditional: 1,
                        maximumRisk: 1,
                        betAmount: { $sum: '$bets.bet' },
                        odds_type: 1,
                    }
                },
                { $sort: { createdAt: -1 } }
            );
            return res.json(customBets);

        } catch (error) {
            console.error(error);
            return res.json([]);
        }
    },
);

expressApp.get(
    '/search',
    async (req, res) => {
        const { param } = req.query;
        if (!param) return res.json([]);
        try {
            const results = [];
            const searchSports = await Sport.find({
                $or: [
                    {
                        "leagues.name": { "$regex": param, "$options": "i" }
                    },
                    {
                        "leagues.events.startDate": { $gte: new Date() },
                        $or: [
                            { "leagues.events.teamA": { "$regex": param, "$options": "i" } },
                            { "leagues.events.teamB": { "$regex": param, "$options": "i" } },
                        ]
                    }
                ]
            });
            for (const sport of searchSports) {
                for (const league of sport.leagues) {
                    if (league.name.toLowerCase().includes(param.toLowerCase())) {
                        results.push({
                            type: 'league',
                            sportName: sport.name,
                            shortName: sport.shortName,
                            leagueName: league.name,
                            leagueId: league.originId,
                        })
                    }
                    for (const event of league.events) {
                        if (new Date(event.startDate).getTime() > new Date().getTime()) {
                            if (event.teamA.toLowerCase().includes(param.toLowerCase())) {
                                results.push({
                                    type: 'team',
                                    sportName: sport.name,
                                    shortName: sport.shortName,
                                    leagueName: league.name,
                                    leagueId: league.originId,
                                    team: event.teamA,
                                    eventId: event.originId,
                                });
                            } else if (event.teamB.toLowerCase().includes(param.toLowerCase())) {
                                results.push({
                                    type: 'team',
                                    sportName: sport.name,
                                    shortName: sport.shortName,
                                    leagueName: league.name,
                                    leagueId: league.originId,
                                    team: event.teamB,
                                    eventId: event.originId,
                                });
                            }
                        }
                    }
                }
            }
            res.json(sortSearchResults(results));
        } catch (error) {
            console.error(error);
            res.json([]);
        }
    }
)

expressApp.get(
    '/searchevents',
    async (req, res) => {
        const { name, sport } = req.query;
        if (!name) return res.json([]);
        try {
            const results = [];
            const searchSports = await Sport.find({ name: sport });
            for (const sport of searchSports) {
                for (const league of sport.leagues) {
                    for (const event of league.events) {
                        if (new Date(event.startDate).getTime() > new Date().getTime()) {
                            if (event.teamA.toLowerCase().includes(name.toLowerCase())) {
                                results.push({
                                    label: event.teamA + ' VS ' + event.teamB,
                                    value: {
                                        teamA: event.teamA,
                                        teamB: event.teamB,
                                        startDate: event.startDate,
                                    },
                                });
                            } else if (event.teamB.toLowerCase().includes(name.toLowerCase())) {
                                results.push({
                                    label: event.teamA + ' VS ' + event.teamB,
                                    value: {
                                        teamA: event.teamA,
                                        teamB: event.teamB,
                                        startDate: event.startDate,
                                    },
                                });
                            }
                        }
                    }
                }
            }
            res.json(results);
        } catch (error) {
            console.error(error);
            res.json([]);
        }
    }
)

expressApp.get('/referralCodeExist', async (req, res) => {
    const { referral_code } = req.query;
    if (!referral_code)
        return res.json({ success: 1 });
    try {
        const autobet = await AutoBet.findOne({ referral_code: new RegExp(`^${referral_code}$`, 'i') });
        if (autobet) {
            return res.json({ success: 1 });
        }
        const promotion = await Promotion.findOne({ name: new RegExp(`^${referral_code}$`, 'i') });
        if (promotion) {
            if (promotion.number_of_usage == -1) {
                return res.json({ success: 1 });
            }
            const logs = await PromotionLog.find({ promotion: promotion._id });
            if (logs.length < promotion.number_of_usage)
                return res.json({ success: 1 });
            return res.json({ success: 0, message: "Promotion usage reached to limit." });
        }
        const existingInvite = await User.findOne({ username: new RegExp(`^${referral_code}$`, 'i') });
        if (existingInvite) {
            return res.json({ success: 1 });
        }

        const existingAffiliate = await Affiliate.findOne({ unique_id: new RegExp(`^${referral_code}$`, 'i') });
        if (existingAffiliate) {
            return res.json({ success: 1 });
        }
        return res.json({ success: 0, message: "Can't find Referral Code." });
    } catch (error) {
        console.error(error);
        return res.json({ success: 0, message: "Can't find Referral Code." });
    }
});

const depositTripleA = async (req, res, data) => {
    const { amount, email, method } = data;
    const { user } = req;

    const tripleAAddon = await Addon.findOne({ name: 'tripleA' });
    if (!tripleAAddon || !tripleAAddon.value || !tripleAAddon.value.merchant_key) {
        console.warn("TripleA Api is not set");
        return false;
    }
    const {
        client_id,
        client_secret,
        notify_secret,
        btc_api_id,
        test_btc_api_id,
        eth_api_id,
        usdt_api_id,
        usdc_api_id,
        binance_api_id,
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
        return res.status(500).json({ success: 0, message: "Can't get Access Token." });
    }
    if (!access_token) {
        return res.status(500).json({ success: 0, message: "Can't get Access Token." });
    }
    const body = {
        "type": "widget",
        "merchant_key": merchant_key,
        "order_currency": "CAD",
        "order_amount": amount,
        "notify_email": email,
        "notify_url": "https://api.payperwin.com/triplea/deposit",
        "notify_secret": notify_secret,
        "payer_id": user._id,
        "payer_name": user.username,
        "payer_email": email,
        "webhook_data": {
            "payer_id": user._id,
        },
    };
    let hosted_url = null;

    let api_id = btc_api_id;
    switch (method) {
        case 'Ethereum':
            api_id = eth_api_id;
            break;
        case 'Tether':
            api_id = usdt_api_id;
            break;
        case 'Binance':
            api_id = binance_api_id;
            break;
        case 'USDC':
            api_id = usdc_api_id;
            break;
        case 'Bitcoin':
        default:
            break;
    }
    api_id = testMode ? test_btc_api_id : api_id;

    try {
        const { data } = await axios.post(
            `https://api.triple-a.io/api/v2/payment/account/${api_id}`,
            body,
            { headers: { 'Authorization': `Bearer ${access_token}` } }
        );
        hosted_url = data.hosted_url;
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
        return res.status(500).json({ success: 0, message: "Can't get Hosted URL." });
    }
    if (!hosted_url) {
        return res.status(500).json({ success: 0, message: "Can't get Hosted URL." });
    }
    return res.json({ hosted_url });
}

expressApp.post('/deposit',
    // bruteforce.prevent,
    isAuthenticated,
    async (req, res) => {
        const data = req.body;
        const { amount, email, phone, method, card_number } = data;
        if (method == "eTransfer") {
            if (!amount || !email || !phone) {
                return res.status(400).json({ success: 0, message: "Deposit Amount, Email and Phone are required." });
            }
            const premierpayAddon = await Addon.findOne({ name: 'premierpay' });
            if (!premierpayAddon || !premierpayAddon.value || !premierpayAddon.value.sid) {
                console.warn("PremierPay Api is not set");
                return res.status(400).json({ success: 0, message: "PremierPay Api is not set" });
            }
            const { sid } = premierpayAddon.value;
            try {
                const { user } = req;
                try {
                    const uniqid = `D${ID()}`;
                    const signature = await generatePremierRequestSignature(email, amount, user._id, uniqid);
                    let data = null;
                    try {
                        const { data: result } = await axios.post(`https://secure.premierpay.ca/api/v2/payment/${sid}`,
                            {
                                "payby": "etransfer",
                                "first_name": user.firstname,
                                "last_name": user.lastname,
                                "email": email,
                                "phone": phone,
                                "address": "Artery roads",
                                "city": "Edmonton",
                                "state": "AB",
                                "country": "CA",
                                "zip_code": "T5A",
                                "ip_address": "159.203.4.60",
                                "items": [
                                    {
                                        "name": "ETransfer Deposit to PayperWin",
                                        "quantity": 1,
                                        "unit_price": amount,
                                        "sku": uniqid
                                    }
                                ],
                                "notification_url": "https://api.payperwin.com/premier/etransfer-deposit",
                                "amount_shipping": 0.00,
                                "udf1": user._id,
                                "udf2": uniqid,
                                "signature": signature
                            }
                        );
                        data = result;
                    } catch (error) {
                        ErrorLog.findOneAndUpdate(
                            {
                                name: 'PremierPay Error',
                                "error.stack": error.stack
                            },
                            {
                                name: 'PremierPay Error',
                                error: {
                                    name: error.name,
                                    message: error.message,
                                    stack: error.stack
                                }
                            },
                            { upsert: true }
                        );
                        return res.status(400).json({ success: 0, message: "Failed to create deposit." });
                    }

                    const responsesignature = await generatePremierResponseSignature(data.txid, data.status, data.descriptor, data.udf1, data.udf2);
                    if (responsesignature != data.signature) {
                        return res.status(400).json({ success: 0, message: "Failed to create etransfer. Signatuer mismatch" });
                    }
                    if (data.status == "APPROVED") {
                        await FinancialLog.create({
                            financialtype: 'deposit',
                            uniqid,
                            user: user._id,
                            amount,
                            method,
                            status: FinancialStatus.pending
                        });
                        const msg = {
                            to: user.email,
                            from: `${fromEmailName} <${fromEmailAddress}>`,
                            subject: "🔥 E-Transfer Deposit Instructions",
                            text: `🔥 E-Transfer Deposit Instructions`,
                            html: simpleresponsive(
                                `We have received your request for an e-Transfer deposit. You will soon receive an email from <b>“BNA Smart Payment System“</b>. Please follow the link in their email to complete the deposit. Be sure to check your spam folder.`,
                            ),
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
                        return res.json({ success: 1, message: "Please wait until deposit is finished." });
                    }
                    return res.status(400).json({ success: 0, message: "Failed to create etransfer." });
                } catch (error) {
                    console.error("deposit => ", error);
                    return res.status(400).json({ success: 0, message: "Failed to create deposit." });
                }
            } catch (error) {
                return res.status(500).json({ success: 0, message: "Can't make deposit.", error });
            }
        } else if (["Bitcoin", "Ethereum", "Tether", "USDC", "Binance"].includes(method)) {
            if (!amount || !email || !phone) {
                return res.status(400).json({ success: 0, message: "Deposit Amount, Email and Phone are required." });
            }
            depositTripleA(req, res, data);
        } else if (method == 'giftcard') {
            try {
                const { user } = req;
                if (!card_number) {
                    return res.json({
                        success: false,
                        message: 'Card Number is required.'
                    });
                }
                const giftcard = await GiftCard.findOne({ card_number: card_number });
                if (!giftcard) {
                    return res.json({
                        success: false,
                        message: 'Gift Card not found.'
                    });
                }
                if (giftcard.usedAt) {
                    return res.json({
                        success: false,
                        message: 'Gift Card already used.'
                    });
                }
                await FinancialLog.create({
                    financialtype: 'deposit',
                    uniqid: `D${ID()}`,
                    user: user._id,
                    amount: giftcard.amount,
                    method: 'giftcard',
                    status: FinancialStatus.success,
                    beforeBalance: user.balance,
                    afterBalance: user.balance + giftcard.amount
                });
                await user.update({ $inc: { balance: giftcard.amount } });
                await giftcard.update({ usedAt: new Date(), user: user._id });
                return res.json({ success: true, message: `Successfully redeemed. Your balanced increased $${giftcard.amount}` })
            } catch (error) {
                console.error(error);
                return res.json({ success: false, message: 'Cannot redeem gift card. Internal Server Error.' })
            }
        }
        else {
            return res.status(400).json({ success: 0, message: "Method is not suitable." });
        }
    }
);

expressApp.get(
    '/freeWithdraw',
    isAuthenticated,
    async (req, res) => {
        const { user } = req;
        return res.json({ used: await isFreeWithdrawalUsed(user) });
    }
)

expressApp.post(
    '/withdraw',
    // bruteforce.prevent,
    isAuthenticated,
    async (req, res) => {
        const data = req.body;
        let { amount, method } = data;
        const { user } = req;
        const freeWithdrawalUsed = await isFreeWithdrawalUsed(user);
        if (method == "eTransfer") {
            const fee = freeWithdrawalUsed ? 15 : 0;
            if (!amount) {
                return res.json({ success: 0, message: "Withdraw Amount is required." });
            }
            amount = Number(amount);
            if (!user.roles.verified) {
                return res.json({ success: 0, message: "You should verify your identify to make withdraw." });
            }

            try {
                const uniqid = `W${ID()}`;

                const maxwithdraw = await getMaxWithdraw(user);
                let totalwithdraw = await FinancialLog.aggregate(
                    {
                        $match: {
                            financialtype: "withdraw",
                            user: new ObjectId(user._id),
                        }
                    },
                    { $group: { _id: null, total: { $sum: "$amount" } } }
                )
                if (totalwithdraw.length) totalwithdraw = totalwithdraw[0].total;
                else totalwithdraw = 0;

                if ((amount + totalwithdraw) > maxwithdraw) {
                    return res.json({ success: 0, message: "Your withdraw request does not meet the minimum <a target='_blank' href='https://www.payperwin.com/faq/article/620c717e7884050d02d16cf2-what-are-rollover-requirements'>rollover requirements</a>. Please complete the 3x rollover before resubmitting a new withdraw request." });
                }

                if (amount + fee > user.balance) {
                    return res.json({ success: 0, message: "Insufficient funds." });
                }

                const afterBalance = user.balance - amount;
                await FinancialLog.create({
                    financialtype: 'withdraw',
                    uniqid: uniqid,
                    user: user._id,
                    amount: amount,
                    method: method,
                    status: FinancialStatus.pending,
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
                        status: FinancialStatus.success,
                        beforeBalance: afterBalance,
                        afterBalance: afterBalance - fee
                    });
                }
                await user.update({ $inc: { balance: -(fee + amount) } });

                const msg = {
                    to: alertEmailAddress,
                    from: `${fromEmailName} <${fromEmailAddress}>`,
                    subject: "A withdraw has been requested",
                    text: `A withdraw has been requested`,
                    html: simpleresponsive(
                        `${user.email} has requested a withdraw of ${amount} by eTransfer. Please log into admin to review the request`,
                    ),
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

                return res.json({ success: 1, message: "Please wait until withdraw is finished." });
            } catch (error) {
                console.error("withdraw => ", error);
                return res.status(400).json({ success: 0, message: "Failed to create withdraw." });
            }
        } else if (["Bitcoin", "Ethereum", "Tether", "Binance", "USDC"].includes(method)) {
            if (!amount) {
                return res.json({ success: 0, message: "Withdraw Amount is required." });
            }
            if (!user.roles.verified) {
                return res.json({ success: 0, message: "You should verify your identify to make withdraw." });
            }
            const fee = freeWithdrawalUsed ? 25 : 0;

            try {
                const uniqid = `W${ID()}`;
                const maxwithdraw = await getMaxWithdraw(user);

                let totalwithdraw = await FinancialLog.aggregate(
                    {
                        $match: {
                            financialtype: "withdraw",
                            user: new ObjectId(user._id),
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
                if (totalwithdraw.length) totalwithdraw = totalwithdraw[0].total;
                else totalwithdraw = 0;

                if ((amount + totalwithdraw) > maxwithdraw) {
                    return res.json({ success: 0, message: "Your withdraw request does not meet the minimum <a target='_blank' href='https://www.payperwin.com/faq/article/620c717e7884050d02d16cf2-what-are-rollover-requirements'>rollover requirements</a>. Please complete the 3x rollover before resubmitting a new withdraw request." });
                }

                if (amount + fee > user.balance) {
                    return res.json({ success: 0, message: "Insufficient funds." });
                }

                const afterBalance = user.balance - amount;
                await FinancialLog.create({
                    financialtype: 'withdraw',
                    uniqid: uniqid,
                    user: user._id,
                    amount: amount,
                    method: method,
                    status: FinancialStatus.pending,
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
                        status: FinancialStatus.success,
                        beforeBalance: afterBalance,
                        afterBalance: afterBalance - fee
                    });
                }

                await user.update({ $inc: { balance: -(fee + amount) } });
                const msg = {
                    to: alertEmailAddress,
                    from: `${fromEmailName} <${fromEmailAddress}>`,
                    subject: "A withdraw has been requested",
                    text: `A withdraw has been requested`,
                    html: simpleresponsive(
                        `${user.email} has requested a withdraw of ${amount} by ${method}. Please log into admin to review the request`,
                    ),
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
                return res.json({ success: 1, message: "Please wait until withdraw is finished." });
            } catch (error) {
                console.error("withdraw => ", error);
                return res.json({ success: 0, message: "Failed to create withdraw." });
            }
        } else {
            return res.json({ success: 0, message: "Method is not suitable." });
        }
    }
);

expressApp.post(
    '/transactions',
    // bruteforce.prevent,
    isAuthenticated,
    async (req, res) => {
        try {
            const { filter, daterange, page } = req.body;
            let searchObj = {
                user: req.user._id,
                // status: FinancialStatus.success,
            };
            if (daterange) {
                try {
                    const { startDate, endDate } = daterange;
                    searchObj = {
                        ...searchObj,
                        updatedAt: {
                            "$gte": new Date(startDate),
                            "$lte": new Date(endDate),
                        }
                    }
                } catch (error) { }
            }
            if (filter) {
                if (filter.all == false) {
                    let orCon = [];
                    if (filter.betwon) {
                        orCon.push({
                            financialtype: "betwon",
                            status: FinancialStatus.success
                        });
                        orCon.push({
                            financialtype: "betfee",
                            status: FinancialStatus.success
                        });
                    }
                    if (filter.placebet) {
                        orCon.push({
                            financialtype: "bet",
                            status: FinancialStatus.success
                        });
                    }
                    if (filter.deposit) {
                        orCon.push({
                            financialtype: "deposit",
                            status: FinancialStatus.success
                        });
                    }
                    if (filter.withdraw) {
                        orCon.push({
                            financialtype: "withdraw",
                            // status: FinancialStatus.success
                        });
                    }
                    if (filter.credit) {
                        orCon.push({
                            financialtype: { $in: ["transfer-in", "transfer-out"] },
                        });
                    }
                    searchObj = {
                        ...searchObj,
                        $or: orCon
                    }
                } else {
                    searchObj = {
                        ...searchObj,
                        $or: [
                            {
                                financialtype: { $nin: ["withdraw", "credit", "debit"] },
                                status: FinancialStatus.success
                            },
                            {
                                financialtype: "withdraw",
                            }
                        ],
                    }
                }
            }
            const perPage = 20;
            const financials = await FinancialLog.aggregate([
                {
                    $lookup: {
                        from: 'bets',
                        localField: 'betId',
                        foreignField: '_id',
                        as: 'betDetails'
                    }
                },
                { $unwind: { path: "$betDetails", preserveNullAndEmptyArrays: true } },
                {
                    $match: searchObj
                },
                { $sort: { "updatedAt": -1 } },
                { $skip: perPage * page },
                { $limit: 20 }
            ]);

            res.json(financials);

        } catch (error) {
            console.error("transactions => ", error);
            res.status(400).json({ success: 0, message: "can't load data" });
        }
    }
);

expressApp.get(
    '/checkverified',
    isAuthenticated,
    async (req, res) => {
        try {
            let response = {
                verified: false,
                verify_submitted: {
                    address: false,
                    identification: false,
                }
            };
            const { user } = req;
            if (user.roles.verified) {
                response.verified = true;
                return res.json(response);
            }
            const verification = await Verification.findOne({ user: user._id });
            if (!verification) {
                return res.json(response);
            }
            if (verification.address) {
                response.verify_submitted.address = true;
            }
            if (verification.identification) {
                response.verify_submitted.identification = true;
            }
            res.json(response);
        } catch (error) {
            res.status(400).json({ success: 0, message: "can't load data" });
        }
    }
);

expressApp.post(
    '/verification',
    bruteforce.prevent,
    isAuthenticated,
    fileUpload(),
    async (req, res) => {
        try {
            const { files, user } = req;
            if (user.roles.verified) {
                await Verification.deleteMany({ user: user._id });
                return res.status(400).send('You alread verified.');
            }
            if (!files) {
                const { address, address2, city, postalcode, phone } = req.body;
                if (!address || !city || !postalcode || !phone) {
                    return res.status(400).send('Please fill all the informations.');
                }
                user.address = address;
                user.address2 = address2;
                user.city = city;
                user.postalcode = postalcode;
                user.phone = phone;
                await user.save();
                return res.json({ message: "success" });
            }
            const keys = Object.keys(files);
            if (!keys.length) {
                return res.status(400).send('No files were uploaded.');
            }
            const name = keys[0];
            let verification = await Verification.findOne({ user: user._id });
            if (verification && verification[name]) {
                res.status(400).json({ success: 0, message: "Already submitted" });
            }
            if (!verification) {
                verification = new Verification({
                    user: user._id,
                    address: null,
                    identification: null
                });
            }
            verification[name] = {
                contentType: files[name].mimetype,
                name: files[name].name,
                data: files[name].data,
                submitted_at: new Date()
            }
            await verification.save();
            const msg = {
                to: alertEmailAddress,
                from: `${fromEmailName} <${fromEmailAddress}>`,
                subject: "A verification has been requested",
                text: `A verification has been requested`,
                html: simpleresponsive(
                    `${user.email} has requested a verification of identify. Please log into admin to review the request`,
                ),
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
            res.json({ message: "success" });
        } catch (error) {
            res.status(400).json({ success: 0, message: "can't save image" });
        }
    }
)

expressApp.get(
    '/verification-image/:name',
    bruteforce.prevent,
    isAuthenticated,
    async (req, res) => {
        try {
            const { user } = req;
            if (user.roles.verified) {
                await Verification.deleteMany({ user: user._id });
                return res.status(400).send('You alread verified.');
            }
            const { name } = req.params;
            let verification = await Verification.findOne({ user: user._id });
            if (!verification || !verification[name]) {
                return res.status(404).json({ success: 0, message: "image not found" });
            }
            res.json(verification[name]);

        } catch (error) {
            res.status(400).json({ success: 0, message: "can't find image" });
        }
    }
)

expressApp.get(
    '/address',
    isAuthenticated,
    async (req, res) => {
        const { address, address2, city, postalcode, phone } = req.user;
        return res.json({ address, address2, city, postalcode, phone });
    }
)

expressApp.post(
    '/submitticket',
    bruteforce.prevent,
    fileUpload(),
    async (req, res) => {
        try {
            const { files, body } = req;
            const { email, phone, subject, department, description } = body;
            if (!email || !phone || !subject || !department || !description) {
                res.status(400).json({ success: 0, message: "Please fill all the fields." });
            }
            let file = null;
            if (files) {
                const keys = Object.keys(files);
                const name = keys[0];
                file = {
                    contentType: files[name].mimetype,
                    name: files[name].name,
                    data: files[name].data,
                }
            }

            await Ticket.create({
                email,
                phone,
                subject,
                department,
                description,
                file
            });

            //TODO: send mail to admin
            let attachments = [];
            if (file) {
                attachments.push({
                    filename: file.name,
                    type: file.contentType,
                    content_id: 'attachment-image',
                    content: file.data.toString("base64"),
                    disposition: 'attachment'
                });
            }
            const msg = {
                to: adminEmailAddress,
                from: `${fromEmailName} <${fromEmailAddress}>`,
                replyTo: email,
                subject: subject,
                text: `Support Ticket from ${email}`,
                attachments,
                html: simpleresponsive(
                    `<h4>Hi <b>PayperWin Admin</b>.</h4>
                    <h5>${subject}</h5>
                    <h5>I got a problem in <b>${department}</b>.</h5>
                    <br>
                    ${description}
                    <br>` + (
                        file ? `
                        <p>Please see attached image.</p>
                        ` : ''
                    ) +
                    `<p>Email : ${email}</p>
                    <p>Phone: ${phone}
                    `,
                ),
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

            res.json({ message: "success" });
        } catch (error) {
            console.error(error);
            res.status(400).json({ success: 0, message: "can't save image" });
        }
    }
)

expressApp.post(
    '/preferences',
    isAuthenticated,
    async (req, res) => {
        const { _id } = req.user;
        try {
            let preference = await Preference.findOne({ user: _id });
            if (!preference) {
                preference = await Preference.create({ user: _id });
            }

            await preference.update(req.body);
            return res.json({ message: "success" });
        } catch (error) {
            res.status(400).json({ error: "Can't change preference." });
        }
    }
)


expressApp.get(
    '/faqs',
    async (req, res) => {
        try {
            const faq_subjects = await FAQSubject.find()
                .sort({ createdAt: 1 })
            res.json(faq_subjects);
        } catch (error) {
            res.status(404).json({ error: 'Can\'t find subjects.' });
        }
    }
)

expressApp.get(
    '/faq_subject/:id',
    async (req, res) => {
        try {
            const { id } = req.params;
            const faq_subject = await FAQSubject.findById(id)
                .populate('items');
            res.json(faq_subject);
        } catch (error) {
            res.status(404).json({ error: 'Can\'t find subject.' });
        }
    }
)

expressApp.get(
    '/faq_article/:id',
    async (req, res) => {
        try {
            const { id } = req.params;
            const faq_article = await FAQItem.findById(id)
                .populate("subject");
            if (!faq_article || !faq_article.subject) {
                return res.status(404).json({ error: 'Can\'t find article.' });
            }
            res.json(faq_article);
        } catch (error) {
            res.status(404).json({ error: 'Can\'t find article.' });
        }
    }
)

expressApp.get(
    '/faqs_general',
    async (req, res) => {
        try {
            const { term } = req.query;

            if (term) {
                const searchObj = {
                    $or: [
                        { title: { "$regex": term, "$options": "i" } },
                        { content: { "$regex": term, "$options": "i" } }
                    ]
                }
                const faq_subjects = await FAQItem.find(searchObj);
                return res.json(faq_subjects);
            } else {
                const faq_subjects = await FAQItem.find().limit(9);
                return res.json(faq_subjects);
            }
        } catch (error) {
            res.status(404).json({ error: 'Can\'t find article.' });
        }
    }
)

expressApp.get(
    '/meta',
    async (req, res) => {
        const { title } = req.query;
        const meta_tag = await MetaTag.findOne({ pageTitle: title });
        res.json(meta_tag);
    }
);

expressApp.get(
    '/articles/meta',
    async (req, res) => {
        try {
            const articles = await Article.find({ published_at: { $ne: null } })
                .select(['permalink', 'updated_at']);
            res.json(articles);
        } catch (error) {
            console.error(error);
            res.json([]);
        }
    }
)

expressApp.get(
    '/articles/home',
    async (req, res) => {
        try {
            const articles = await Article.find({ published_at: { $ne: null } })
                .select(['permalink', 'logo', 'categories', 'published_at', 'title', 'subtitle', 'posted_at'])
                .sort({ posted_at: -1 })
                .limit(10);
            res.json(articles);
        } catch (error) {
            res.status(500).json({ success: false });
        }
    }
)

expressApp.get(
    '/article-category',
    async (req, res) => {
        try {
            const categories = await ArticleCategory.find({});
            res.json(categories);
        } catch (error) {
            console.error(error)
            res.status(500).json({ success: false });
        }
    }
)

expressApp.get(
    '/article/detail',
    async (req, res) => {
        const { permalink } = req.query;
        try {
            const article = await Article.findOne({ permalink: permalink, published_at: { $ne: null } })
            res.json(article);
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false });
        }
    }
)

expressApp.get(
    '/articles/categories/:categoryname',
    async (req, res) => {
        const { categoryname } = req.params;
        try {
            const articles = await Article.find({ published_at: { $ne: null }, categories: categoryname })
                .sort({ posted_at: -1 })
            res.json(articles);
        } catch (error) {
            console.error(error)
            res.status(500).json({ success: false });
        }
    }
)

expressApp.get(
    '/articles/recent',
    async (req, res) => {
        try {
            const articles = await Article.find({ published_at: { $ne: null } })
                .select(['permalink', 'categories', 'published_at', 'title', 'subtitle', 'posted_at'])
                .sort({ posted_at: -1 })
                .limit(10);
            res.json(articles);
        } catch (error) {
            res.status(500).json({ success: false });
        }
    }
)

expressApp.get(
    '/articles/popular',
    async (req, res) => {
        try {
            const articles = await Article.find({ published_at: { $ne: null } })
                .select(['permalink', 'categories', 'published_at', 'title', 'subtitle', 'posted_at'])
                .sort({ createdAt: 1 })
                .limit(10);
            res.json(articles);
        } catch (error) {
            res.status(500).json({ success: false });
        }
    }
)

expressApp.get(
    '/frontend/:name',
    async (req, res) => {
        const { name } = req.params;
        const frontend = await Frontend.findOne({ name: name });
        res.json(frontend);
    }
)

expressApp.get(
    '/frontend_banner_clicked',
    async (req, res) => {
        const frontend = await Frontend.findOne({ name: 'banner' });
        const value = {
            path: frontend.value.path,
            link_url: frontend.value.link_url,
            show: frontend.value.show,
            clicked: parseInt(frontend.value.clicked) + 1,
        }
        await frontend.update({ value: value });
        res.redirect(frontend.value.link_url);
    }
)

expressApp.post(
    '/phone-verify',
    isAuthenticated,
    async (req, res) => {
        const { step } = req.query;
        const { phone, verification_code } = req.body;
        const user = req.user;

        if (step == 1) { // Send verification code
            await user.update({ phone });
            // Check if service is existing
            let service = await Service.findOne({ name: 'twilio_verify' });
            if (!service) {
                // Check twilio is available.
                if (!twilioClient) {
                    return res.status(500).json({ success: false, error: "Twilio client didn't configured." });
                }
                try {
                    // Create service and save
                    const TwilioService = await twilioClient.verify.services.create({ friendlyName: 'PAYPER WIN Phone Verification' });
                    service = await Service.create({ name: 'twilio_verify', value: JSON.parse(JSON.stringify(TwilioService)) });
                } catch (error) {
                    console.error(error);
                    return res.status(500).json({ success: false, error: "Can't create verification service." });
                }
            }

            try {
                await twilioClient.verify.services(service.value.sid)
                    .verifications
                    .create({ to: phone, channel: 'sms' });
                res.json({ success: true });
            } catch (error) {
                console.error(error);
                return res.status(500).json({ success: false, error: "Can't send verification code." });
            }

        } else if (step == 2) { // Check verification code
            // Check twilio is available.
            if (!twilioClient) {
                return res.status(500).json({ success: false, error: "Twilio client didn't configured." });
            }
            let service = await Service.findOne({ name: 'twilio_verify' });
            // Check service
            if (!service) {
                return res.status(500).json({ success: false, error: "Can't get verification service." });
            }

            try {
                twilioClient.verify.services(service.value.sid)
                    .verificationChecks
                    .create({ to: user.phone, code: verification_code })
                    .then(async (verification_check) => {
                        if (verification_check.valid) {
                            try {
                                await user.update({
                                    roles: {
                                        ...user.roles,
                                        phone_verified: true,
                                    }
                                })
                                res.json({ success: true });
                            } catch (error) {
                                console.error(error);
                                res.json({ success: false });
                            }
                        }
                    })
                    .catch(error => {
                        console.error(error);
                        res.json({ success: false });
                    })
            } catch (error) {
                console.error(error);
                res.json({ success: false });
            }

        } else {
            res.status(404).json({ success: false });
        }
    }
)

expressApp.put(
    '/share-line',
    isAuthenticated,
    async (req, res) => {
        try {
            const { url, eventDate, type, index, subtype } = req.body;
            const sharedLine = await SharedLine.findOne({ user: req.user._id, url, type, index, subtype });
            if (sharedLine) {
                return res.json(sharedLine);
            }
            const newSharedLine = await SharedLine.create({
                user: req.user._id,
                url: url,
                uniqueId: ID(),
                eventDate, type, index, subtype
            });
            res.json(newSharedLine);
        } catch (error) {
            console.error(error)
            res.status(500).json({ success: false });
        }
    }
)

expressApp.get(
    '/share-line',
    async (req, res) => {
        const { uniqueId } = req.query;
        const sharedLine = await SharedLine.findOne({ uniqueId: uniqueId }).populate('user', ['firstname']);
        return res.json(sharedLine);
    }
)

expressApp.get(
    '/cashback',
    isAuthenticated,
    async (req, res) => {
        const user = req.user;
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();

        try {
            let lossbetsSportsbook = await Bet.aggregate(
                {
                    $match: {
                        status: "Settled - Lose",
                        userId: user._id,
                        sportsbook: true,
                        createdAt: {
                            $gte: new Date(year, month - 1, 0),
                            $lte: new Date(year, month, 0),
                        }
                    }
                },
                { $group: { _id: "$userId", total: { $sum: "$bet" } } }
            );

            const lossBetHistory = await Bet.find({
                status: "Settled - Lose",
                userId: user._id,
                sportsbook: true,
                createdAt: {
                    $gte: new Date(year, month - 1, 0),
                    $lte: new Date(year, month, 0),
                }
            })

            if (lossbetsSportsbook.length) lossbetsSportsbook = lossbetsSportsbook[0].total;
            else lossbetsSportsbook = 0;

            const cashbackHistory = await FinancialLog.find({
                financialtype: 'cashback',
                user: user._id
            }).sort({ createdAt: -1 });

            res.json({
                lossThisMonth: Math.abs(lossbetsSportsbook),
                lossBetHistory,
                cashbackHistory
            });
        } catch (error) {
            console.error(error);
            res.json(null);
        }

    }
)

expressApp.post(
    '/customBet/:id/join',
    isAuthenticated,
    async (req, res) => {
        const { amount } = req.body;
        const { id } = req.params;
        const user = req.user;
        try {
            if (user.balance < amount) {
                return res.json({ success: false, error: 'Insufficent Funds.' });
            }
            const event = await Event.findById(id);
            if (!event) {
                return res.json({ success: false, error: 'Side Bet Not Found.' });
            }
            if (!event.allowAdditional) {
                return res.json({ success: false, error: 'Join High Staker is not enabled.' });
            }

            const participants = event.participants;
            for (const participant of participants) {
                if (participant.user.toString() == user._id.toString()) {
                    return res.json({ success: false, error: 'You already joined this event.' });
                }
            }

            await event.update({
                $inc: { maximumRisk: amount },
                $push: {
                    participants: {
                        user: user._id,
                        amount: amount
                    }
                }
            })

            await FinancialLog.create({
                financialtype: 'lock_event',
                uniqid: `LE${ID()}`,
                user: user._id,
                amount: amount,
                method: 'lock_event',
                status: FinancialStatus.success,
                beforeBalance: user.balance,
                afterBalance: user.balance - amount
            });

            await user.update({ $inc: { balance: -amount } });

            return res.json({ success: true });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Can't Join High Staker." });
        }
    }
)

expressApp.post(
    '/customBet',
    isAuthenticated,
    async (req, res) => {
        const { name, startDate, endDate, visibility, maximumRisk, options, allowAdditional, odds_type, leagueId } = req.body;
        const user = req.user;
        try {
            if (user.balance < maximumRisk) {
                return res.json({ success: false, error: 'Insufficent Funds.' });
            }
            let existing = await Event.findOne({ name });
            if (existing) {
                return res.json({ success: false, error: 'A side bet with same name exists.' });
            }
            let uniqueid = `E${ID()}`;
            do {
                existing = await Event.findOne({ uniqueid: uniqueid });
                if (existing) uniqueid = `E${ID()}`;
            } while (existing != null);

            await Event.create({
                name: name,
                uniqueid: uniqueid,
                startDate: startDate,
                endDate: endDate,
                approved: false,
                public: visibility == 'public' ? true : false,
                status: config.EventStatus.pending.value,
                creator: 'User',
                user: user._id,
                maximumRisk: maximumRisk,
                options: options,
                allowAdditional: allowAdditional,
                participants: [{
                    user: user._id,
                    amount: maximumRisk
                }],
                odds_type: odds_type,
                leagueId: leagueId
            });

            await FinancialLog.create({
                financialtype: 'lock_event',
                uniqid: `LE${ID()}`,
                user: user._id,
                amount: maximumRisk,
                method: 'lock_event',
                status: FinancialStatus.success,
                beforeBalance: user.balance,
                afterBalance: user.balance - maximumRisk
            });

            await user.update({ $inc: { balance: -maximumRisk } });

            const msg = {
                to: adminEmailAddress,
                from: `${fromEmailName} <${fromEmailAddress}>`,
                subject: 'A new Side Bet is submitted.',
                text: `A new Side Bet is submitted.`,
                html: simpleresponsive(
                    `<h4>Hi <b>PayperWin Admin</b>.</h4>
                    <h5>A new Side Bet is submitted.</h5>
                    <br>
                    <p>Email : ${user.email}</p>
                    <p>Name: ${name}</p>
                    `,
                ),
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

            return res.json({ success: true });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Can't create a bet." });
        }
    }
)

expressApp.get(
    '/autobet',
    isAuthenticated,
    async (req, res) => {
        try {
            const { user } = req;
            const { startDate, endDate } = req.query;
            const autobet = await AutoBet.findOne({ userId: user._id });
            if (!autobet) {
                return res.status(404).json({ success: false });
            }
            const today = new Date();
            let dateObj = {
                $gte: new Date(today.getFullYear(), today.getMonth(), 1)
            }
            if (startDate && endDate) {
                dateObj = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            }
            const bets = await Bet.find({
                userId: user._id,
                updatedAt: dateObj,
                orgin: { $ne: 'custom' }
            }).sort({ updatedAt: -1 });

            let betamount = await Bet.aggregate([
                {
                    $match: {
                        userId: user._id,
                        updatedAt: dateObj,
                        orgin: { $ne: 'custom' }
                    }
                },
                {
                    $group: {
                        _id: null,
                        amount: { $sum: "$bet" }
                    }
                }
            ]);
            if (betamount && betamount.length) {
                betamount = betamount[0].amount;
            }
            else betamount = 0;

            const wincount = await Bet.find({
                userId: user._id,
                updatedAt: dateObj,
                orgin: { $ne: 'custom' },
                status: 'Settled - Win'
            }).count();

            let fee = await FinancialLog.aggregate([
                {
                    $match: {
                        user: user._id,
                        updatedAt: dateObj,
                        financialtype: "betfee",
                    }
                },
                {
                    $group: {
                        _id: null,
                        amount: { $sum: "$amount" },
                    }
                }
            ]);
            if (fee && fee.length) {
                fee = fee[0].amount;
            } else fee = 0;

            let winamount = await Bet.aggregate([
                {
                    $match: {
                        userId: user._id,
                        updatedAt: dateObj,
                        orgin: { $ne: 'custom' },
                        status: 'Settled - Win'
                    }
                },
                {
                    $group: {
                        _id: null,
                        amount: { $sum: "$payableToWin" },
                    }
                }
            ]);
            if (winamount && winamount.length) {
                winamount = winamount[0].amount;
            }
            else winamount = 0;

            const losscount = await Bet.find({
                userId: user._id,
                updatedAt: dateObj,
                orgin: { $ne: 'custom' },
                status: 'Settled - Lose'
            }).count();

            let lossamount = await Bet.aggregate([
                {
                    $match: {
                        userId: user._id,
                        updatedAt: dateObj,
                        orgin: { $ne: 'custom' },
                        status: 'Settled - Lose'
                    }
                },
                {
                    $group: {
                        _id: null,
                        amount: { $sum: "$bet" }
                    }
                }
            ]);
            if (lossamount && lossamount.length)
                lossamount = lossamount[0].amount;
            else lossamount = 0;

            const pendingcount = await Bet.find({
                userId: user._id,
                updatedAt: dateObj,
                orgin: { $ne: 'custom' },
                status: { $in: ['Pending', 'Partial Match', 'Matched'] }
            }).count();

            let pendingamount = await Bet.aggregate([
                {
                    $match: {
                        userId: user._id,
                        updatedAt: dateObj,
                        orgin: { $ne: 'custom' },
                        status: { $in: ['Pending', 'Partial Match', 'Matched'] }
                    }
                },
                {
                    $group: {
                        _id: null,
                        amount: { $sum: "$bet" }
                    }
                }
            ]);
            if (pendingamount && pendingamount.length)
                pendingamount = pendingamount[0].amount;
            else pendingamount = 0;

            let sports = await Bet.aggregate([
                {
                    $match: {
                        userId: user._id,
                        updatedAt: dateObj,
                        orgin: { $ne: 'custom' },
                    }
                },
                {
                    $group: {
                        _id: "$lineQuery.sportName",
                        count: { $sum: 1 }
                    }
                }
            ])

            res.json({
                histories: bets,
                summary: {
                    totalbets: {
                        count: bets.length,
                        amount: betamount,
                    },
                    winbets: {
                        count: wincount,
                        amount: winamount,
                        fee: fee
                    },
                    lossbets: {
                        count: losscount,
                        amount: lossamount
                    },
                    pendingbets: {
                        count: pendingcount,
                        amount: pendingamount
                    },
                    profit: winamount - lossamount,
                },
                sports
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false });
        }
    }
)

expressApp.get(
    '/searchsports',
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
                        res.status(404).json({ error: 'Can\'t find sports.' });
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
            res.status(500).json({ error: 'Can\'t find sports.', message: error });
        }
    }
)

expressApp.post(
    '/autobet/settings',
    isAuthenticated,
    async (req, res) => {
        const { user } = req;
        const autobet = await AutoBet.findOne({ userId: user._id });
        if (autobet) {
            try {
                await autobet.update(req.body);
                res.json({ success: true });
            } catch (error) {
                console.error(error);
                res.status(500).json({ success: false });
            }
        } else {
            return res.status(404).json({ success: false, error: 'You are not an autobet user' });
        }
    }
)

expressApp.get(
    '/prize',
    isAuthenticated,
    async (req, res) => {
        const { date } = req.query;
        const user = req.user;
        if (!date) res.status(400).json({ success: false, error: 'Date is required.' });
        try {
            await PrizeLog.deleteMany({
                createdAt: { $lte: new Date(date) },
                user: user._id,
            });
            const prize = await PrizeLog.findOne({
                createdAt: { $gte: new Date(date) },
                user: user._id,
            });
            if (prize) {
                return res.json({ success: true, used: true });
            } else {
                return res.json({ success: true, used: false });
            }
        } catch (erorr) {
            console.error(error);
            return res.status(500).json({ success: false });
        }
    }
)

expressApp.post(
    '/prize',
    isAuthenticated,
    async (req, res) => {
        const { prize, date } = req.body;
        if (!date) return res.status(400).json({ success: false, error: 'Date is required.' });
        if (!prize) return res.status(400).json({ success: false, error: 'Prize is required.' });
        const user = req.user;
        const prizeExist = await PrizeLog.findOne({
            createdAt: { $gte: new Date(date) },
            user: user._id,
        });
        if (prizeExist) {
            return res.status(400).json({ success: false, error: "Prize already taken." });
        }
        try {
            var preLoyalty, preAvailableClaims, afterLoyalty, afterAvailableClaims;
            switch (prize) {
                case 1:     // $5 Credit
                    await PrizeLog.create({
                        user: user._id,
                        type: '$1 Credit'
                    });
                    await user.update({ $inc: { balance: 1 } });
                    await FinancialLog.create({
                        financialtype: 'prize',
                        uniqid: `P${ID()}`,
                        user: user._id,
                        amount: 1,
                        method: 'prize',
                        status: FinancialStatus.success,
                        beforeBalance: user.balance,
                        afterBalance: user.balance + 1
                    });
                    break;
                case 5:
                    await PrizeLog.create({
                        user: user._id,
                        type: '$3 Credit'
                    });
                    await user.update({ $inc: { balance: 3 } });
                    await FinancialLog.create({
                        financialtype: 'prize',
                        uniqid: `P${ID()}`,
                        user: user._id,
                        amount: 3,
                        method: 'prize',
                        status: FinancialStatus.success,
                        beforeBalance: user.balance,
                        afterBalance: user.balance + 3
                    });
                    break;
                case 9:
                    await PrizeLog.create({
                        user: user._id,
                        type: '$5 Credit'
                    });
                    await user.update({ $inc: { balance: 5 } });
                    await FinancialLog.create({
                        financialtype: 'prize',
                        uniqid: `P${ID()}`,
                        user: user._id,
                        amount: 5,
                        method: 'prize',
                        status: FinancialStatus.success,
                        beforeBalance: user.balance,
                        afterBalance: user.balance + 5
                    });
                    break;
                case 2:
                    await PrizeLog.create({
                        user: user._id,
                        type: '$11 Credit'
                    });
                    await user.update({ $inc: { balance: 11 } });
                    await FinancialLog.create({
                        financialtype: 'prize',
                        uniqid: `P${ID()}`,
                        user: user._id,
                        amount: 11,
                        method: 'prize',
                        status: FinancialStatus.success,
                        beforeBalance: user.balance,
                        afterBalance: user.balance + 11
                    });
                    break;
                case 8:     // $25 Credit
                    await PrizeLog.create({
                        user: user._id,
                        type: '$25 Credit'
                    });
                    await user.update({ $inc: { balance: 25 } });
                    await FinancialLog.create({
                        financialtype: 'prize',
                        uniqid: `P${ID()}`,
                        user: user._id,
                        amount: 25,
                        method: 'prize',
                        status: FinancialStatus.success,
                        beforeBalance: user.balance,
                        afterBalance: user.balance + 25
                    });
                    break;
                case 4:     // $10 Credit
                    await PrizeLog.create({
                        user: user._id,
                        type: '$8 Credit'
                    });
                    await user.update({ $inc: { balance: 8 } });
                    await FinancialLog.create({
                        financialtype: 'prize',
                        uniqid: `P${ID()}`,
                        user: user._id,
                        amount: 8,
                        method: 'prize',
                        status: FinancialStatus.success,
                        beforeBalance: user.balance,
                        afterBalance: user.balance + 8
                    });
                    break;
                case 10:
                    await PrizeLog.create({
                        user: user._id,
                        type: '$10 Credit'
                    });
                    await user.update({ $inc: { balance: 10 } });
                    await FinancialLog.create({
                        financialtype: 'prize',
                        uniqid: `P${ID()}`,
                        user: user._id,
                        amount: 10,
                        method: 'prize',
                        status: FinancialStatus.success,
                        beforeBalance: user.balance,
                        afterBalance: user.balance + 10
                    });
                    break;
                case 6:     // $100 Credit
                    await PrizeLog.create({
                        user: user._id,
                        type: '$88 Credit'
                    });
                    await user.update({ $inc: { balance: 88 } });
                    await FinancialLog.create({
                        financialtype: 'prize',
                        uniqid: `P${ID()}`,
                        user: user._id,
                        amount: 88,
                        method: 'prize',
                        status: FinancialStatus.success,
                        beforeBalance: user.balance,
                        afterBalance: user.balance + 88
                    });
                    break;
                case 12:
                    await PrizeLog.create({
                        user: user._id,
                        type: '$100 Credit'
                    });
                    await user.update({ $inc: { balance: 100 } });
                    await FinancialLog.create({
                        financialtype: 'prize',
                        uniqid: `P${ID()}`,
                        user: user._id,
                        amount: 100,
                        method: 'prize',
                        status: FinancialStatus.success,
                        beforeBalance: user.balance,
                        afterBalance: user.balance + 100
                    });
                    break;
                case 3:     // +2,000 Loyalty
                    preLoyalty = await getLoyalty(user);
                    preAvailableClaims = calcAvailableClaims(preLoyalty);
                    await PrizeLog.create({
                        user: user._id,
                        type: '+2,000 Loyalty'
                    });
                    await LoyaltyLog.create({
                        user: user._id,
                        point: 2000
                    });
                    afterLoyalty = preLoyalty + 2000;
                    afterAvailableClaims = calcAvailableClaims(afterLoyalty);
                    return res.json({ success: true, newClaims: afterAvailableClaims - preAvailableClaims });
                case 7:     // +5,000 Loyalty
                    preLoyalty = await getLoyalty(user);
                    preAvailableClaims = calcAvailableClaims(preLoyalty);
                    await PrizeLog.create({
                        user: user._id,
                        type: '+5,000 Loyalty'
                    });
                    await LoyaltyLog.create({
                        user: user._id,
                        point: 5000
                    });
                    afterLoyalty = preLoyalty + 5000;
                    afterAvailableClaims = calcAvailableClaims(afterLoyalty);
                    return res.json({ success: true, newClaims: afterAvailableClaims - preAvailableClaims });
                case 11:    // +8,000 Loyalty
                    preLoyalty = await getLoyalty(user);
                    preAvailableClaims = calcAvailableClaims(preLoyalty);
                    await PrizeLog.create({
                        user: user._id,
                        type: '+8,000 Loyalty'
                    });
                    await LoyaltyLog.create({
                        user: user._id,
                        point: 8000
                    });
                    afterLoyalty = preLoyalty + 8000;
                    afterAvailableClaims = calcAvailableClaims(afterLoyalty);
                    return res.json({ success: true, newClaims: afterAvailableClaims - preAvailableClaims });
            }
            return res.json({ success: true });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, newClaims: 0 });
        }
    }
)

expressApp.post(
    '/favorites/toggle',
    isAuthenticated,
    async (req, res) => {
        const user = req.user;
        const data = req.body;
        let { name, type, sport } = data;
        if (!name || !type || !sport) {
            return res.status(400).json({ success: false, error: 'Please input all fields required.' });
        }
        try {
            sport = sport.replace('_', ' ');
            const sportData = await Sport.findOne({ name: sport });
            if (!sportData) {
                return res.status(404).json({ success: false, error: 'Sports Data not found.' });
            }
            if (type == 'league') {
                const league = sportData.leagues.find(league => league.name == name);
                if (!league) {
                    return res.status(404).json({ success: false, error: 'Sports Data not found.' });
                }
                const exist = await Favorites.findOne({
                    user: user._id,
                    name: league.name,
                    type: 'league',
                    originId: league.originId,
                    sport: sport
                })
                if (!exist) {
                    await Favorites.create({
                        user: user._id,
                        name: league.name,
                        type: 'league',
                        originId: league.originId,
                        sport: sport
                    })
                } else {
                    await Favorites.deleteMany({
                        _id: exist._id
                    });
                }
            } else if (type == 'team') {
                const exist = await Favorites.findOne({
                    user: user._id,
                    name: name,
                    type: 'team',
                    originId: sportData.originSportId,
                    sport: sport
                })
                if (!exist) {
                    await Favorites.create({
                        user: user._id,
                        name: name,
                        type: 'team',
                        originId: sportData.originSportId,
                        sport: sport
                    })
                } else {
                    await Favorites.deleteMany({
                        _id: exist._id
                    });
                }
            }
            res.json({ success: true });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false });
        }
    }
)

expressApp.post('/getLatestOdds', async (req, res) => {
    const betDetails = req.body;
    const { pick, lineQuery, live } = betDetails;
    const { sportName, leagueId, eventId, lineId, type, subtype, altLineId } = lineQuery;
    const sportData = await Sport.findOne({ name: new RegExp(`^${sportName}$`, 'i') });
    if (sportData) {
        const line = getLineFromSportData(sportData, leagueId, eventId, lineId, type, subtype, altLineId, live);
        if (line) {
            const oddsA = ['total', 'alternative_total', 'home_total', 'away_total'].includes(lineQuery.type) ? line.line.over : line.line.home;
            const oddsB = ['total', 'alternative_total', 'home_total', 'away_total'].includes(lineQuery.type) ? line.line.under : line.line.away;
            let newLineOdds = 0;
            switch (pick) {
                case "home":
                    newLineOdds = oddsA
                    break;
                default:
                    newLineOdds = oddsB
                    break;
            }
            res.json({
                success: true,
                latestOdds: newLineOdds
            });
        }
        else {
            res.json({
                success: false,
                error: "no line found"
            });
        }
    }
})

expressApp.post('/getSlipLatestOdds', async (req, res) => {
    try {
        const betSlip = req.body;
        const results = [];
        for (const bet of betSlip) {
            const { lineQuery, live } = bet;
            const { sportName, leagueId, eventId, lineId, type, subtype, altLineId } = lineQuery;
            const sportData = await Sport.findOne({ name: new RegExp(`^${sportName}$`, 'i') });
            if (sportData) {
                const line = getLineFromSportData(sportData, leagueId, eventId, lineId, type, subtype, altLineId, live);
                if (line) {
                    const oddsA = ['total', 'alternative_total', 'home_total', 'away_total'].includes(lineQuery.type) ? line.line.over : line.line.home;
                    const oddsB = ['total', 'alternative_total', 'home_total', 'away_total'].includes(lineQuery.type) ? line.line.under : line.line.away;
                    results.push({ lineQuery, odds: { home: oddsA, away: oddsB } });
                } else {
                    results.push({ lineQuery, odds: { home: 0, away: 0 } });
                }
            }
        }
        return res.json(results);
    } catch (error) {
        return res.json(null);
    }
})

expressApp.get(
    '/promotion/banners',
    async (req, res) => {
        try {
            const banners = await PromotionBanner.find().sort({ priority: -1, createdAt: -1 });
            return res.json(banners);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error.' });
        }
    }
)

expressApp.get(
    '/members',
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

async function getLoyalty(user) {
    let timezoneOffset = -8;
    if (isDstObserved) timezoneOffset = -7;
    const today = new Date().addHours(timezoneOffset);
    const fromTime = new Date(today.getFullYear(), today.getMonth(), 1);    // From this month
    try {
        let totalLoyalty = await LoyaltyLog.aggregate({
            $match: {
                "user": user._id,
                createdAt: { $gte: fromTime },
            }
        }, {
            $group: {
                _id: null,
                loyalty: { $sum: "$point" }
            }
        });
        return totalLoyalty.length ? totalLoyalty[0].loyalty : 0;
    } catch (error) {
        console.error(error);
        return 0;
    }
}

expressApp.get(
    '/loyalty',
    isAuthenticated,
    async (req, res) => {
        const user = req.user;
        try {
            return res.json({ loyalty: await getLoyalty(user) });
        } catch (error) {
            console.error(error);
            return res.json([]);
        }
    }
)

function calcCredit(points) {
    switch (points) {
        case Milestones[0]:
            return 5.30;
        case Milestones[1]:
            return 0.45;
        case Milestones[2]:
            return 0.75;
        case Milestones[3]:
            return 1.00;
        case Milestones[4]:
            return 1.50;
        case Milestones[5]:
            return 1.75;
        case Milestones[6]:
            return 2.00;
        case Milestones[7]:
            return 2.25;
        case Milestones[8]:
            return 2.75;
        case Milestones[9]:
            return 2.85;
        case Milestones[10]:
            return 2.95;
        case Milestones[11]:
            return 3.00;
        case Milestones[12]:
            return 3.00;
        case Milestones[13]:
            return 3.25;
        case Milestones[14]:
            return 3.75;
        case Milestones[15]:
            return 3.95;
        case Milestones[16]:
            return 10.00;
        case Milestones[17]:
            return 4.00;
        case Milestones[18]:
            return 4.50;
        case Milestones[19]:
            return 10.00;

        default:
            return 0.0;
    }
}

expressApp.post(
    '/claims',
    isAuthenticated,
    async (req, res) => {
        const user = req.user;
        const { points } = req.body;
        const loyalty = await getLoyalty(user);
        if (points > loyalty) return res.json({ success: false, error: 'Invalid points.' });

        const credit = calcCredit(points);
        try {
            let claim = await ClaimLog.findOne({
                user: user._id,
                points: points
            });
            if (claim != null)
                return res.json({ success: false, error: 'Duplicated claim.' });

            await ClaimLog.create({
                user: user._id,
                points: points
            });
            await FinancialLog.create({
                financialtype: 'claim_reward',
                uniqid: `C${ID()}`,
                user: user._id,
                amount: credit,
                method: 'claim_reward',
                status: FinancialStatus.success,
                beforeBalance: user.balance,
                afterBalance: user.balance + credit
            });
            await user.update({
                balance: user.balance + credit
            });
            return res.json({ success: true });
        } catch (error) {
            return res.json({ success: false, error: 'Cannot claim.' });
        }
    }
)

expressApp.get(
    '/claims',
    isAuthenticated,
    async (req, res) => {
        const user = req.user;
        try {
            const claims = await ClaimLog.find({
                user: user._id
            });
            return res.json(claims);
        } catch (error) {
            console.error(error);
            return res.json([]);
        }
    }
)

expressApp.post(
    '/bets/:id/cancel',
    isAuthenticated,
    async (req, res) => {
        const { id: bet_id } = req.params;
        const user = req.user;
        try {
            const bet = await Bet.findOne({ userId: user._id, _id: bet_id });
            if (!bet) {
                return res.json({ success: false, error: 'Cannot cancel a bet. Not found.' });
            }
            const { matchStartDate, isParlay, bet: betAmount, pick, origin } = bet;
            if (origin == 'custom') {
                return res.json({ success: false, error: 'Cannot cancel a Side Bet.' });
            }
            if (new Date().getTime() > new Date(matchStartDate).getTime()) {
                return res.json({ success: false, error: 'Cannot cancel a bet. Game already started.' });
            }
            let betpool = null;
            if (isParlay) {
                betpool = await ParlayBetPool.findOne({
                    $or: [
                        { homeBets: bet_id },
                        { awayBets: bet_id }
                    ]
                })
            } else {
                betpool = await BetPool.findOne({
                    $or: [
                        { homeBets: bet_id },
                        { awayBets: bet_id },
                        { drawBets: bet_id },
                        { nonDrawBets: bet_id },
                    ]
                })
            }
            const cancelAmount = Number(Number(betAmount * 0.85).toFixed(2));
            if (!betpool) {
                await bet.update({ status: 'Cancelled', })
                await FinancialLog.create({
                    financialtype: 'betcancel',
                    uniqid: `BC${ID()}`,
                    user: user._id,
                    betId: bet_id,
                    amount: cancelAmount,
                    method: 'betcancel',
                    status: FinancialStatus.success,
                    beforeBalance: user.balance,
                    afterBalance: user.balance + cancelAmount
                });
                await user.update({ $inc: { balance: cancelAmount } });
                await sendBetCancelConfirmEmail(user, bet, betAmount * 0.15, cancelAmount);
                return res.json({ success: true });
            }

            let targetBets = [], oppositeBets = [], oppositeTeam = null, targetTeam = null;
            switch (pick) {
                case 'home':
                    targetBets = betpool.homeBets;
                    targetTeam = betpool.teamA;
                    oppositeBets = betpool.awayBets;
                    oppositeTeam = betpool.teamB;
                    break;
                case 'away':
                    targetBets = betpool.awayBets;
                    targetTeam = betpool.teamB;
                    oppositeBets = betpool.homeBets;
                    oppositeTeam = betpool.teamA;
                    break;
                case 'draw':
                    targetBets = betpool.drawBets;
                    targetTeam = betpool.teamDraw;
                    oppositeBets = betpool.nonDrawBets;
                    oppositeTeam = betpool.teamDraw;
                    break;
                case 'nondraw':
                    targetBets = betpool.nonDrawBets;
                    targetTeam = betpool.teamNonDraw;
                    oppositeBets = betpool.drawBets;
                    oppositeTeam = betpool.teamNonDraw;
                    break;
            }
            if (targetBets.length == 1) { // 1:1 or n:n
                for (const opposite_bet of oppositeBets) {
                    const bet = await Bet.findById(opposite_bet);
                    if (bet) {
                        const user = await User.findById(bet.userId);
                        await bet.update({ status: 'Cancelled' });
                        if (user) {
                            const afterBalance = user.balance + bet.bet;
                            await FinancialLog.create({
                                financialtype: 'betcancel',
                                uniqid: `BC${ID()}`,
                                user: user._id,
                                betId: opposite_bet,
                                amount: bet.bet,
                                method: 'betcancel',
                                status: FinancialStatus.success,
                                beforeBalance: user.balance,
                                afterBalance: afterBalance,
                            });
                            await user.update({ $inc: { balance: bet.bet } });

                            const cancelFee = betAmount * 0.1 * bet.bet / oppositeTeam.betTotal;
                            await FinancialLog.create({
                                financialtype: 'betcancelfee',
                                uniqid: `BCF${ID()}`,
                                user: user._id,
                                betId: opposite_bet,
                                amount: cancelFee,
                                method: 'betcancel',
                                status: FinancialStatus.success,
                                beforeBalance: afterBalance,
                                afterBalance: afterBalance + cancelFee
                            });
                            await sendBetCancelOpponentConfirmEmail(user, bet, cancelFee);
                            await user.update({ $inc: { balance: cancelFee } });
                        }
                    }
                }
                const updateObj = {};
                switch (pick) {
                    case 'home':
                    case 'away':
                        updateObj.awayBets = [];
                        updateObj.homeBets = [];
                        updateObj.teamA = {
                            ...betpool.teamA,
                            betTotal: 0,
                            toWinTotal: 0
                        };
                        updateObj.teamB = {
                            ...betpool.teamB,
                            betTotal: 0,
                            toWinTotal: 0
                        };
                        break;
                    case 'draw':
                    case 'nondraw':
                        updateObj.drawBets = [];
                        updateObj.nonDrawBets = [];
                        updateObj.teamDraw = {
                            ...betpool.teamDraw,
                            betTotal: 0,
                            toWinTotal: 0
                        };
                        updateObj.teamNonDraw = {
                            ...betpool.teamNonDraw,
                            betTotal: 0,
                            toWinTotal: 0
                        };
                        break;
                }
                await betpool.update(updateObj);
                await bet.update({ status: 'Cancelled', })
                await FinancialLog.create({
                    financialtype: 'betcancel',
                    uniqid: `BC${ID()}`,
                    user: user._id,
                    betId: bet_id,
                    amount: cancelAmount,
                    method: 'betcancel',
                    status: FinancialStatus.success,
                    beforeBalance: user.balance,
                    afterBalance: user.balance + cancelAmount
                });
                await user.update({ $inc: { balance: cancelAmount } });
                await sendBetCancelConfirmEmail(user, bet, betAmount * 0.15, cancelAmount);
                return res.json({ success: true });
            }

            const betTotalAfterCancelTarget = targetTeam.betTotal - betAmount;
            const toWinTotalAfterCancelTarget = targetTeam.toWinTotal - bet.toWin;

            const docChanges = {
                $pull: { homeBets: bet_id, awayBets: bet_id, nonDrawBets: bet_id, drawBets: bet_id },
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
            if (toWinTotalAfterCancelTarget < oppositeTeam.betTotal) {
                for (const opposite_bet of oppositeBets) {
                    const bet = await Bet.findById(opposite_bet);
                    if (bet) {
                        const user = await User.findById(bet.userId);
                        const betAfterCancel = toWinTotalAfterCancelTarget * bet.bet / oppositeTeam.betTotal;
                        const toWinAfterCancel = betTotalAfterCancelTarget * bet.bet / oppositeTeam.betTotal;
                        const cancelAmount = bet.bet - betAfterCancel;
                        await bet.update({
                            bet: betAfterCancel,
                            toWin: toWinAfterCancel,
                        });
                        if (user) {
                            const afterBalance = user.balance + cancelAmount;
                            await FinancialLog.create({
                                financialtype: 'betcancel',
                                uniqid: `BC${ID()}`,
                                user: user._id,
                                betId: opposite_bet,
                                amount: cancelAmount,
                                method: 'betcancel',
                                status: FinancialStatus.success,
                                beforeBalance: user.balance,
                                afterBalance: afterBalance,
                            });
                            await user.update({ $inc: { balance: cancelAmount } });

                            const cancelFee = betAmount * 0.1 * bet.bet / oppositeTeam.betTotal;
                            await FinancialLog.create({
                                financialtype: 'betcancelfee',
                                uniqid: `BCF${ID()}`,
                                user: user._id,
                                betId: opposite_bet,
                                amount: cancelFee,
                                method: 'betcancel',
                                status: FinancialStatus.success,
                                beforeBalance: afterBalance,
                                afterBalance: afterBalance + cancelFee
                            });
                            await sendBetCancelOpponentConfirmEmail(user, bet, cancelFee);
                            await user.update({ $inc: { balance: cancelFee } });
                        }
                    }
                }
                switch (bet.pick) {
                    case 'home':
                        docChanges.teamB = {
                            ...betpool.teamB,
                            betTotal: toWinTotalAfterCancelTarget,
                            toWinTotal: betTotalAfterCancelTarget,
                        };
                        break;
                    case 'draw':
                        docChanges.teamDraw = {
                            ...betpool.teamDraw,
                            betTotal: toWinTotalAfterCancelTarget,
                            toWinTotal: betTotalAfterCancelTarget,
                        };
                        break;
                    case 'nondraw':
                        docChanges.teamNonDraw = {
                            ...betpool.teamNonDraw,
                            betTotal: toWinTotalAfterCancelTarget,
                            toWinTotal: betTotalAfterCancelTarget,
                        };
                        break;
                    default:
                        docChanges.teamA = {
                            ...betpool.teamA,
                            betTotal: toWinTotalAfterCancelTarget,
                            toWinTotal: betTotalAfterCancelTarget,
                        };
                        break;
                }
            }

            await betpool.update(docChanges);
            bet.isParlay ? calculateParlayBetsStatus(betpool._id) : calculateBetsStatus(betpool.uid);

            await bet.update({ status: 'Cancelled', })
            await FinancialLog.create({
                financialtype: 'betcancel',
                uniqid: `BC${ID()}`,
                user: user._id,
                betId: bet_id,
                amount: cancelAmount,
                method: 'betcancel',
                status: FinancialStatus.success,
                beforeBalance: user.balance,
                afterBalance: user.balance + cancelAmount
            });
            await user.update({ $inc: { balance: cancelAmount } });
            await sendBetCancelConfirmEmail(user, bet, betAmount * 0.15, cancelAmount);

            return res.json({ success: true });
        } catch (error) {
            console.error(error);
            return res.json({ success: false, error: 'Cannot cancel a bet. Internal Server Error.' });
        }
    }
)

expressApp.post(
    '/events/:event_id/vote',
    isAuthenticated,
    async (req, res) => {
        const { pick } = req.body;
        const { event_id } = req.params;
        const user = req.user;
        try {
            const bet = await Bet.findOne({
                event: event_id,
                userId: user._id
            });
            if (!bet) {
                return res.json({ success: false, error: 'Cannot vote on this event. Bet Not Found.' })
            }
            const event = await Event.findById(event_id);
            if (!event) {
                return res.json({ success: false, error: 'Cannot vote on this event. Custom Event Not Found.' })
            }

            if (new Date(event.endDate).getTime() > new Date().getTime()) {
                return res.json({ success: false, error: 'Cannot vote on this event. You should try after the event ended.' })
            }

            let votes = event.votes;
            if (!votes) votes = [];
            if (!votes[pick]) votes[pick] = [];

            const exists = votes.find(vote => {
                return vote && vote.find(voted => voted.toString() == user._id.toString())
            });
            if (exists) {
                return res.json({ success: false, error: 'Cannot vote on this event. Already Voted.' })
            }

            votes[pick] = [...votes[pick], user._id]
            await event.update({ votes });
            return res.json({ success: true, votes: votes })
        } catch (erorr) {
            return res.json({ success: false, error: 'Cannot vote on this event. Internal Server Error.' })
        }
    }
)

expressApp.post(
    '/visit-affiliate',
    async (req, res) => {
        const { referrer } = req.body;
        if (referrer) {
            try {
                await Affiliate.findOneAndUpdate({ unique_id: referrer }, { $inc: { click: 1 } });
            } catch (error) { }
        }
        res.json({});
    }
)

// Router
expressApp.use('/admin', adminRouter);
expressApp.use('/premier', premierRouter);
expressApp.use('/triplea', tripleARouter);
expressApp.use('/shop', shopRouter);
expressApp.use('/tickets', ticketRouter);
expressApp.use('/affiliate', affiliateRouter);
expressApp.use('/onramper', onramperRouter);
expressApp.use('/widget', widgetRouter);
expressApp.use('/static', express.static('banners'));

const server = expressApp.listen(port, () => console.info(`API Server listening on port ${port}`));

const options = {
    cors: {
        origin: config.corsHosts,
        allowedHeaders: ["*"],
        credentials: true
    }
};
io.attach(server, options)
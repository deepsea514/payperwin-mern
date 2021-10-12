// models
const User = require('./models/user');
const LoginLog = require("./models/loginlog");
const Sport = require('./models/sport');
const Bet = require('./models/bet');
const BetPool = require('./models/betpool');
const SportsDir = require('./models/sportsDir');
const Pinnacle = require('./models/pinnacle');
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
const EventBetPool = require("./models/eventbetpool");
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
const ErrorLog = require('./models/errorlog');
//local helpers
const seededRandomString = require('./libs/seededRandomString');
const getLineFromSportData = require('./libs/getLineFromSportData');
const simpleresponsive = require('./emailtemplates/simpleresponsive');
const config = require('../config.json');
const io = require("./libs/socket");
const calculateNewOdds = require('./libs/calculateNewOdds');
const { generatePinnacleToken } = require('./libs/generatePinnacleToken');
const { generatePremierResponseSignature, generatePremierRequestSignature } = require('./libs/generatePremierSignature');
const { convertTimeLineDate } = require('./libs/timehelper');
const sendSMS = require("./libs/sendSMS");
const {
    ID,
    calculateToWinFromBet,
    calculateBetsStatus,
    get2FACode,
    calculateCustomBetsStatus,
    isFreeWithdrawalUsed,
    checkSignupBonusPromotionEnabled,
} = require('./libs/functions');
const BetFee = 0.05;
const FinancialStatus = config.FinancialStatus;
const EventStatus = config.EventStatus;
const fromEmailName = 'PAYPER WIN';
const fromEmailAddress = 'donotreply@payperwin.co';
const adminEmailAddress = 'admin@payperwin.co';
const adminEmailAddress1 = 'hello@payperwin.co';
const supportEmailAddress = 'support@payperwin.co';
const isDstObserved = config.isDstObserved;
const loyaltyPerBet = 25;
const maximumWin = 2000;
//external libraries
const express = require('express');
const ExpressBrute = require('express-brute');
const cors = require('cors');
const mongoose = require('mongoose');
const compression = require('compression');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// const cookieSession = require('cookie-session');
const expressSession = require('express-session');
const dateformat = require("dateformat");
require('dotenv').config();
// const MongoDBStore = require('connect-mongodb-session')(expressSession);
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
console.log(process.env.NODE_ENV, 'mode');
const databaseName = process.env.NODE_ENV === 'development' ? 'PayPerWinDev' : 'PayPerWin';
const mongooptions = {
    authSource: "admin",
    user: config.mongo.username,
    pass: config.mongo.password,
    useMongoClient: true,
}


mongoose.connect(`mongodb://${config.mongo.host}/${databaseName}`, mongooptions).then(async () => {
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

// CORS
// expressApp.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   next();
// });


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
                    console.log('incorrect email', email);
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
                    console.log(user.username, 'incorrect password');
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
        // if (process.env.NODE_ENV === 'development') {
        //   console.log(`Verify your email address by following this link: ${emailValidationPath}`);
        // } else {
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
            ErrorLog.create({
                name: 'Send Grid Error',
                error: {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                }
            });
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
            vipcode, referral_code } = req.body;
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(() => {
            // find a user whose username is the same as the forms username
            // we are checking to see if the user trying to login already exists
            User.findOne({
                $or: [

                    { email: new RegExp(`^${email}$`, 'i') },
                ],
            }, async (err, user) => {
                // if there are any errors, return the error
                if (err) return done(err);

                // check to see if theres already a user with that username
                if (user) {
                    if (user.username === username) {
                        return done(null, false, 'That username is already taken.');
                    } else if (user.email === email) {
                        return done(null, false, 'Another account is already using that address.');
                    }
                }

                // if there is no user with that username
                // create the user
                const newUserObj = {
                    username, email, password, firstname, lastname,
                    country, currency, title, dateofbirth, region,
                    vipcode, bet_referral_code: referral_code,
                    roles: {
                        registered: true,
                    },
                };
                const newUser = new User(newUserObj);
                console.info(`created new user ${username}`);

                // save the user
                newUser.save(async (err2) => {
                    if (err2) console.error(err2);
                    else {
                        sendVerificationEmail(email, req);
                        if (vipcode && vipcode != "") {
                            const promotion = await Promotion.findOne({ name: RegExp(`^${vipcode}$`, 'i') });
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
                            }
                        }
                    }
                    return done(null, newUser);
                });
            });
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

const sessionSecret = 'secret for cookie session can be literally anything even this';
// expressApp.use(cookieParser(sessionSecret));
// expressApp.use(cookieSession({
//     name: 'session-a',
//     /* domain: 'jujubug.us', */
//     keys: [sessionSecret],
//     maxAge: 90 * 24 * 60 * 60 * 1000
// }));
expressApp.use(expressSession({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    // store,
    cookie: {
        name: 'session-a',
        keys: [sessionSecret],
        maxAge: 90 * 24 * 60 * 60 * 1000,
    },
}));

expressApp.use((req, res, next) => {
    const { hostname, subdomains } = req;
    if (hostname) {
        const mainHostname = hostname.replace(subdomains.map(sd => `${sd}.`), '');
        // req.sessionOptions.domain = mainHostname || req.sessionOptions.domain;
    }
    next();
})
// expressApp.use(session({ secret: 'change this', resave: false, saveUninitialized: false, cookie: { maxAge: 24 * 60 * 60 * 1000 } }));
expressApp.use(bodyParser.urlencoded({ extended: false }));
expressApp.use(bodyParser.json({
    limit: '50mb',
    verify: (req, res, buf) => {
        req.rawBody = buf;
    }
}));

expressApp.use(passport.initialize());
expressApp.use(passport.session());
// expressApp.use(flash());

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
                        if (error) console.log("register => ", error);
                        else console.log(`User register log - ${user.username}`);
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
                    ip_address
                });
                log.save((error) => {
                    if (error) console.log("login Error", error);
                    // else console.log(`User login log - ${user.username}`);
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
                if (error) console.log("login Error", error);
            });

            return res.json({ name: user.username, _2fa_required: false });
        });
    }
);

expressApp.post('/googleRegister',
    async (req, res, next) => {
        const { token } = req.body;
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
                        if (error) console.log("register => ", error);
                        else console.log(`User register log - ${user.username}`);
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

expressApp.post(
    '/resend-2fa-code',
    async (req, res) => {
        const { session, user } = req;
        console.log('resend verify email', user.email);
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
        console.log('verify code', user.email);
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
    await pinnacleLogout(req);
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
                const passwordRecoveryPath = `https://www.payperwin.co/newPasswordFromToken?username=${user.username}&h=${changePasswordHash}`;
                // if (process.env.NODE_ENV === 'development') {
                //   console.log(`Hey ${user.username}, you can create a new password here:\n${passwordRecoveryPath}`);
                // } else {
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
                        ErrorLog.create({
                            name: 'Send Grid Error',
                            error: {
                                name: error.name,
                                message: error.message,
                                stack: error.stack
                            }
                        });
                    });

                    res.send(`Sent password recovery to ${email}.
                        If you can't see mail in inbox, please check spam folder.`);
                } catch (error) {
                    console.log("email Send error", error);
                    res.send(`Can't send passwordrecovery mail`);
                }
                // }
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
                console.log('newPasswordFromToken => ', err);
                res.send(err);
            }
            if (user) {
                const changePasswordHash = seededRandomString(user.password, 20);
                if (h === changePasswordHash) {
                    if (process.env.NODE_ENV === 'development') {
                        console.log('new password:', password);
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

expressApp.post(
    '/placeBets',
    isAuthenticated,
    /* bruteforce.prevent, */
    async (req, res) => {
        const {
            betSlip,
        } = req.body;


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

        let autobet = await AutoBet
            .findOne({
                userId: user._id
            });
        if (autobet) {
            errors.push(`Autobet user can't place bet.`)
            return res.json({
                balance: user.balance,
                errors,
            });
        }
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
            } = bet;
            if (!odds || !pick || !toBet || !toWin || !lineQuery) {
                errors.push(`${pickName} ${odds[pick]} wager could not be placed. Query Incomplete.`);
            } else {
                // TODO: error if match has already started
                // TODO: prevent certain types of bets
                if (origin == 'other') {
                    const event = await Event.findById(lineId);
                    const { name, startDate, teamA, teamB, status } = event;

                    const existingBet = await Bet.findOne({
                        userId: user._id,
                        "lineQuery.lineId": "lineId",
                        "lineQuery.eventName": lineQuery,
                        "lineQuery.sportName": 'other',
                    });
                    if (existingBet) {
                        errors.push(`${pickName} @${odds[pick]} wager could not be placed. Already placed a bet on this line.`);
                        continue;
                    }

                    if (status == EventStatus.pending.value) {
                        if ((new Date(startDate)).getTime() <= (new Date()).getTime()) {
                            errors.push(`${pickName} @${odds[pick]} wager could not be placed. It is outdated.`);
                        }
                        else {
                            const betAfterFee = toBet;
                            const pickedCandidate = pick == 'home' ? teamA : teamB;
                            if (pickedCandidate) {
                                const toWin = calculateToWinFromBet(betAfterFee, pickedCandidate.currentOdds);
                                if (toWin > maximumWin) {
                                    errors.push(`${pickName} @${odds[pick]} wager could not be placed. Exceed maximum win amount.`);
                                    continue;
                                }
                                const fee = Number((toBet * BetFee).toFixed(2));
                                const balanceChange = toBet * -1;
                                const newBalance = user.balance ? user.balance + balanceChange : 0 + balanceChange;
                                if (newBalance >= 0) {
                                    // insert bet doc to bets table
                                    const newBetObj = {
                                        userId: user._id,
                                        transactionID: `B${ID()}`,
                                        teamA: { name: teamA.name, odds: teamA.currentOdds },
                                        teamB: { name: teamB.name, odds: teamB.currentOdds },
                                        pick: pick,
                                        pickOdds: pickedCandidate.currentOdds,
                                        oldOdds: null,
                                        pickName: pickName,
                                        bet: betAfterFee,
                                        toWin: toWin,
                                        fee: fee,
                                        matchStartDate: startDate,
                                        status: 'Pending',
                                        lineQuery: {
                                            lineId: lineId,
                                            eventName: lineQuery,
                                            sportName: 'other',
                                        },
                                        lineId: lineId,
                                        origin: origin
                                    };
                                    const newBet = new Bet(newBetObj);
                                    console.info(`created new bet`);
                                    try {
                                        const savedBet = await newBet.save();
                                        await LoyaltyLog.create({
                                            user: user._id,
                                            point: toBet * loyaltyPerBet
                                        });

                                        const preference = await Preference.findOne({ user: user._id });
                                        let timezone = "00:00";
                                        if (preference && preference.timezone) {
                                            timezone = preference.timezone;
                                        }
                                        const timeString = convertTimeLineDate(new Date(), timezone);

                                        if (!preference || !preference.notification_settings || preference.notification_settings.bet_accepted.email) {
                                            const msg = {
                                                from: `${fromEmailName} <${fromEmailAddress}>`,
                                                to: user.email,
                                                subject: 'Your bet is waiting for a match',
                                                text: `Your bet is waiting for a match`,
                                                html: simpleresponsive(
                                                    `Hi <b>${user.email}</b>.
                                                    <br><br>
                                                    This email is to advise you that your bet for ${name} ${type} on $${betAfterFee.toFixed(2)} for ${timeString} is waiting for a match. We will notify when we find you a match. An unmatched wager will be refunded upon the start of the game. 
                                                    <br><br>
                                                    <ul>
                                                        <li>Wager: $${betAfterFee.toFixed(2)}</li>
                                                        <li>Odds: ${pickedCandidate.currentOdds > 0 ? ('+' + pickedCandidate.currentOdds) : pickedCandidate.currentOdds}</li>
                                                        <li>Platform: PAYPER WIN Peer-to Peer</li>
                                                    </ul>
                                                `),
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
                                        if (user.roles.phone_verified && (!preference || !preference.notification_settings || preference.notification_settings.bet_accepted.sms)) {
                                            sendSMS(`This email is to advise you that your bet for ${name} ${type} on $${betAfterFee.toFixed(2)} for ${timeString} is waiting for a match. We will notify when we find you a match. An unmatched wager will be refunded upon the start of the game. \n 
                                            Wager: $${betAfterFee.toFixed(2)}
                                            Odds: ${pickedCandidate.currentOdds > 0 ? ('+' + pickedCandidate.currentOdds) : pickedCandidate.currentOdds}
                                            Platform: PAYPER WIN Peer-to Peer`, user.phone);
                                        }

                                        const matchTimeString = convertTimeLineDate(new Date(startDate), timezone);
                                        let adminMsg = {
                                            from: `${fromEmailName} <${fromEmailAddress}>`,
                                            to: adminEmailAddress1,
                                            subject: 'New Bet',
                                            text: `New Bet`,
                                            html: simpleresponsive(
                                                `<ul>
                                                    <li>Customer: ${user.email} (${user.firstname} ${user.lastname})</li>
                                                    <li>Event: ${name}</li>
                                                    <li>Bet: ${type}</li>
                                                    <li>Wager: $${betAfterFee.toFixed(2)}</li>
                                                    <li>Odds: ${pickedCandidate.currentOdds > 0 ? ('+' + pickedCandidate.currentOdds) : pickedCandidate.currentOdds}</li>
                                                    <li>Pick: ${pickedCandidate.name}</li>
                                                    <li>Date: ${matchTimeString}</li>
                                                    <li>Win: $${toWin.toFixed(2)}</li>
                                                </ul>`),
                                        }
                                        sgMail.send(adminMsg).catch(error => {
                                            ErrorLog.create({
                                                name: 'Send Grid Error',
                                                error: {
                                                    name: error.name,
                                                    message: error.message,
                                                    stack: error.stack
                                                }
                                            });
                                        });

                                        adminMsg.to = supportEmailAddress;
                                        sgMail.send(adminMsg).catch(error => {
                                            ErrorLog.create({
                                                name: 'Send Grid Error',
                                                error: {
                                                    name: error.name,
                                                    message: error.message,
                                                    stack: error.stack
                                                }
                                            });
                                        });


                                        const betId = savedBet.id;
                                        // add betId to betPool
                                        const exists = await EventBetPool.findOne({ eventId: new ObjectId(lineId) });
                                        if (exists) {
                                            console.log('update existing betpool');
                                            if (pick == 'home') {
                                                const teamA = {
                                                    name: exists.teamA.name,
                                                    odds: exists.teamA.currentOdds,
                                                    betTotal: exists.teamA.betTotal + betAfterFee,
                                                    toWinTotal: exists.teamA.toWinTotal + toWin,
                                                }
                                                const homeBets = [...exists.homeBets, betId];
                                                await exists.update({ teamA: teamA, homeBets: homeBets });
                                            } else {
                                                const teamB = {
                                                    name: exists.teamB.name,
                                                    odds: exists.teamB.currentOdds,
                                                    betTotal: exists.teamB.betTotal + betAfterFee,
                                                    toWinTotal: exists.teamB.toWinTotal + toWin,
                                                }
                                                const awayBets = [...exists.awayBets, betId];
                                                await exists.update({ teamB: teamB, awayBets: awayBets });
                                            }
                                        } else {
                                            // Create new bet pool
                                            const newTeamA = {
                                                name: teamA.name,
                                                odds: teamA.currentOdds,
                                                betTotal: pick === 'home' ? betAfterFee : 0,
                                                toWinTotal: pick === 'home' ? toWin : 0,
                                            }
                                            const homeBets = pick === 'home' ? [betId] : [];
                                            const newTeamB = {
                                                name: teamB.name,
                                                odds: teamB.currentOdds,
                                                betTotal: pick === 'away' ? betAfterFee : 0,
                                                toWinTotal: pick === 'away' ? toWin : 0,
                                            }
                                            const awayBets = pick === 'away' ? [betId] : []
                                            console.log('creating betpool');
                                            const newBetPool = new EventBetPool(
                                                {
                                                    eventId: lineId,
                                                    teamA: newTeamA,
                                                    teamB: newTeamB,
                                                    homeBets: homeBets,
                                                    awayBets: awayBets,
                                                    matchStartDate: startDate,
                                                    lineType: type,
                                                }
                                            );

                                            try {
                                                await newBetPool.save();
                                            } catch (err) {
                                                console.log('can\'t save newBetPool => ' + err);
                                            }
                                        }

                                        await calculateCustomBetsStatus(lineId);

                                        user.balance = newBalance;
                                        try {
                                            await FinancialLog.create({
                                                financialtype: 'bet',
                                                uniqid: `BP${ID()}`,
                                                user: user._id,
                                                amount: toBet,
                                                method: 'bet',
                                                status: FinancialStatus.success,
                                            });
                                            await user.save();
                                        } catch (err) {
                                            console.log('can\'t save user balance => ' + err);
                                        }
                                    }
                                    catch (e2) {
                                        if (e2) console.error('newBetError', e2);
                                    }

                                } else {
                                    errors.push(`${pickName} @${odds[pick]} wager could not be placed. Insufficient funds.`);
                                }
                            } else {
                                errors.push(`${pickName} @${odds[pick]} wager could not be placed. Can't find candidate.`);
                            }
                        }
                    }
                    else {
                        errors.push(`${pickName} @${odds[pick]} wager could not be placed. Already Settled or Cancelled.`);
                    }
                }
                else {
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
                        const line = getLineFromSportData(sportData, leagueId, eventId, lineId, type, subtype, altLineId);
                        if (line) {
                            const { teamA, teamB, startDate, line: { home, away, hdp, points } } = line;
                            const existingBet = await Bet.findOne({
                                userId: user._id,
                                "lineQuery.sportName": lineQuery.sportName,
                                "lineQuery.leagueId": lineQuery.leagueId,
                                "lineQuery.eventId": lineQuery.eventId,
                                "lineQuery.lineId": lineQuery.lineId,
                                "lineQuery.type": lineQuery.type,
                                "lineQuery.subtype": lineQuery.subtype,
                                "lineQuery.altLineId": lineQuery.altLineId
                            });
                            if (existingBet) {
                                errors.push(`${pickName} @${odds[pick]} wager could not be placed. Already placed a bet on this line.`);
                                continue;
                            }
                            const pickWithOverUnder = ['total', 'alternative_total'].includes(lineQuery.type) ? (pick === 'home' ? 'over' : 'under') : pick;
                            const lineOdds = line.line[pickWithOverUnder];
                            const oddsA = ['total', 'alternative_total'].includes(lineQuery.type) ? line.line.over : line.line.home;
                            const oddsB = ['total', 'alternative_total'].includes(lineQuery.type) ? line.line.under : line.line.away;
                            let newLineOdds = calculateNewOdds(oddsA, oddsB, pick, lineQuery.type, lineQuery.subtype);
                            if (sportsbook) {
                                newLineOdds = pick == 'home' ? oddsA : oddsB;
                            }
                            const oddsMatch = odds[pick] === newLineOdds;
                            if (oddsMatch) {
                                const betAfterFee = toBet /* * 0.98 */;
                                const toWin = calculateToWinFromBet(betAfterFee, newLineOdds);
                                if (toWin > maximumWin) {
                                    errors.push(`${pickName} @${odds[pick]} wager could not be placed. Exceed maximum win amount.`);
                                } else {
                                    const fee = Number((toWin * BetFee).toFixed(2));
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
                                        console.info(`created new bet`);

                                        // save the user
                                        try {
                                            const savedBet = await newBet.save();

                                            await LoyaltyLog.create({
                                                user: user._id,
                                                point: toBet * loyaltyPerBet
                                            })

                                            const preference = await Preference.findOne({ user: user._id });
                                            let timezone = "00:00";
                                            if (preference && preference.timezone) {
                                                timezone = preference.timezone;
                                            }
                                            const timeString = convertTimeLineDate(new Date(), timezone);

                                            if (!preference || !preference.notification_settings || preference.notification_settings.bet_accepted.email) {
                                                const msg = {
                                                    from: `${fromEmailName} <${fromEmailAddress}>`,
                                                    to: user.email,
                                                    subject: 'Your bet is waiting for a match',
                                                    text: `Your bet is waiting for a match`,
                                                    html: simpleresponsive(
                                                        `Hi <b>${user.email}</b>.
                                                            <br><br>
                                                            This email is to advise you that your bet for ${lineQuery.sportName} ${lineQuery.type} on ${timeString} for ${betAfterFee.toFixed(2)} is waiting for a match. We will notify when we find you a match. An unmatched wager will be refunded upon the start of the game. 
                                                            <br><br>
                                                            <ul>
                                                                <li>Wager: $${betAfterFee.toFixed(2)}</li>
                                                                <li>Odds: ${newLineOdds > 0 ? ('+' + newLineOdds) : newLineOdds}</li>
                                                                <li>Platform: PAYPER ${sportsbook ? 'Sportsbook' : 'Peer-to Peer'}</li>
                                                            </ul>
                                                        `),
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
                                            if (user.roles.phone_verified && (!preference || !preference.notification_settings || preference.notification_settings.bet_accepted.sms)) {
                                                sendSMS(`This is to advise you that your bet for ${lineQuery.sportName} ${lineQuery.type} on ${timeString} for ${betAfterFee.toFixed(2)} is waiting for a match. We will notify when we find you a match. An unmatched wager will be refunded upon the start of the game. \n 
                                                        Wager: $${betAfterFee.toFixed(2)}
                                                        Odds: ${newLineOdds > 0 ? ('+' + newLineOdds) : newLineOdds}
                                                        Platform: PAYPER WIN ${sportsbook ? 'Peer-to Peer' : 'Sportsbook'}`, user.phone);
                                            }

                                            const matchTimeString = convertTimeLineDate(new Date(startDate), timezone);
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
                                                        betType += `${hdp > 0 ? '+' : ''}${hdp}`;
                                                    } else {
                                                        betType += `${-1 * hdp > 0 ? '+' : ''}${-1 * hdp}`;
                                                    }
                                                    break;
                                            }
                                            let adminMsg = {
                                                from: `${fromEmailName} <${fromEmailAddress}>`,
                                                to: adminEmailAddress1,
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
                                                ErrorLog.create({
                                                    name: 'Send Grid Error',
                                                    error: {
                                                        name: error.name,
                                                        message: error.message,
                                                        stack: error.stack
                                                    }
                                                });
                                            });

                                            adminMsg.to = supportEmailAddress;
                                            sgMail.send(adminMsg).catch(error => {
                                                ErrorLog.create({
                                                    name: 'Send Grid Error',
                                                    error: {
                                                        name: error.name,
                                                        message: error.message,
                                                        stack: error.stack
                                                    }
                                                });
                                            });

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
                                                await checkAutoBet(bet, exists, user, sportData, line);
                                                betpoolId = exists.uid;
                                            } else {
                                                console.log('creating betpool');
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
                                                        points: hdp ? hdp : points ? points : null,
                                                        homeBets: pick === 'home' ? [betId] : [],
                                                        awayBets: pick === 'away' ? [betId] : [],
                                                        origin
                                                    }
                                                );

                                                try {
                                                    await newBetPool.save();
                                                    await checkAutoBet(bet, newBetPool, user, sportData, line);
                                                    betpoolId = newBetPool.uid;
                                                } catch (err) {
                                                    console.log('can\'t save newBetPool => ' + err);
                                                }
                                            }
                                            await calculateBetsStatus(betpoolId);

                                            user.balance = newBalance;
                                            try {
                                                await FinancialLog.create({
                                                    financialtype: 'bet',
                                                    uniqid: `BP${ID()}`,
                                                    user: user._id,
                                                    amount: toBet,
                                                    method: 'bet',
                                                    status: FinancialStatus.success,
                                                });
                                                await user.save();
                                            } catch (err) {
                                                console.log('can\'t save user balance => ' + err);
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
        }
        res.json({
            balance: user.balance,
            errors,
        });
    }
);

const checkAutoBet = async (bet, betpool, user, sportData, line) => {
    const { AutoBetStatus } = config;
    let { pick: originPick, win: toBet, lineQuery } = bet;
    pick = originPick == 'home' ? "away" : "home";

    const { type, subtype } = lineQuery;

    const { originSportId } = sportData;
    lineQuery.sportId = originSportId;

    const { teamA, teamB, startDate, line: { home, away, hdp, points } } = line;

    const pickWithOverUnder = ['total', 'alternative_total'].includes(type) ? (pick === 'home' ? 'over' : 'under') : pick;
    const lineOdds = line.line[pickWithOverUnder];
    const oddsA = ['total', 'alternative_total'].includes(type) ? line.line.over : line.line.home;
    const oddsB = ['total', 'alternative_total'].includes(type) ? line.line.under : line.line.away;
    const newLineOdds = bet.sportsbook ? (pick == 'home' ? oddsA : oddsB) : calculateNewOdds(oddsA, oddsB, pick, lineQuery.type);

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
        default:
            betType = 'Over/Under';
            break;
    }

    let orCon = [
        {
            side: side,
            betType: betType,
        }
    ]
    if (user.bet_referral_code) {
        orCon.push({
            referral_code: user.bet_referral_code
        })
    }
    let autobets = await AutoBet
        .find({
            $or: orCon
        })
        .populate('userId');
    autobets = JSON.parse(JSON.stringify(autobets));

    const asyncFilter = async (arr, predicate) => {
        const results = await Promise.all(arr.map(predicate));
        return arr.filter((_v, index) => results[index]);
    }
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
                            type: bet.sportsbook ? 'sportsbook' : { $ne: 'sportsbook' },
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
            if (autobet.referral_code && autobet.referral_code == user.bet_referral_code) {
                return (
                    autobet.userId._id.toString() != user._id.toString() &&     //Not same user
                    autobet.status == AutoBetStatus.active &&                   //Check active status
                    autobet.userId.balance > 0 &&                               //Check Balance
                    autobet.bettable > 0 &&                                     //Check bettable
                    // autobet.maxRisk >= toBet &&                                 //Check Max.Risk
                    // (bettedamount < (budget - toBet))                           //Check Budget
                    true
                );
            }
            return (
                autobet.userId._id.toString() != user._id.toString() &&     //Not same user
                autobet.status == AutoBetStatus.active &&                   //Check active status
                autobet.userId.balance > 0 &&                               //Check Balance
                autobet.bettable > 0 &&                                     //Check bettable
                // autobet.maxRisk >= toBet &&                                  //Check Max.Risk
                // (bettedamount < (budget - toBet)) &&                         //Check Budget
                !autobet.sports.find((sport) => sport == lineQuery.sportName)   // Check Sports
            );
        } catch (error) {
            console.log('filter => ', error);
            return false;
        }
    });

    if (autobetusers.length == 0) return;

    autobetusers.sort((a, b) => {
        if (a.referral_code == user.bet_referral_code) return -1;
        if (b.referral_code == user.bet_referral_code) return 1;
        return (a.priority > b.priority) ? -1 : 1;
    });

    let pickName = '';
    betType = '';
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
        default:
            pickName += 'Pick: ';
            break;
    }
    switch (type) {
        case 'total':
        case 'alternative_total':
            if (pick == 'home') {
                pickName += `Over ${points}`;
                betType += `O ${points}`;
            } else {
                pickName += `Under ${points}`;
                betType += `U ${points}`;
            }
            break;
        case 'spread':
        case 'alternative_spread':
            if (pick == 'home') {
                pickName += `${teamA} ${hdp > 0 ? '+' : ''}${hdp}`;
                betType += `${hdp > 0 ? '+' : ''}${hdp}`;
            } else {
                pickName += `${teamB} ${-1 * hdp > 0 ? '+' : ''}${-1 * hdp}`;
                betType += `${-1 * hdp > 0 ? '+' : ''}${-1 * hdp}`;
            }
            break;

        case 'moneyline':
            if (pick == 'home') {
                pickName += teamA;
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
        const fee = Number((bettable * BetFee).toFixed(2));

        // insert bet doc to bets table
        const newBetObj = {
            userId: selectedauto.userId._id,
            transactionID: `B${ID()}`,
            teamA: {
                name: teamA,
                odds: home,
            },
            teamB: {
                name: teamB,
                odds: away,
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
        console.info(`created new auto bet`);

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

            const preference = await Preference.findOne({ user: selectedauto.userId._id.toString() });
            let timezone = "00:00";
            if (preference && preference.timezone) {
                timezone = preference.timezone;
            }
            const timeString = convertTimeLineDate(new Date(), timezone);

            if (!preference || !preference.notification_settings || preference.notification_settings.bet_accepted.email) {
                const msg = {
                    from: `${fromEmailName} <${fromEmailAddress}>`,
                    to: selectedauto.userId.email,
                    subject: 'Your bet is waiting for a match',
                    text: `Your bet is waiting for a match`,
                    html: simpleresponsive(
                        `Hi <b>${selectedauto.userId.email}</b>.
                            <br><br>
                            This email is to advise you that your bet for ${lineQuery.sportName} ${lineQuery.type} on ${timeString} for $${betAfterFee.toFixed(2)} is waiting for a match. We will notify when we find you a match. An unmatched wager will be refunded upon the start of the game. 
                            <br><br>
                            <ul>
                                <li>Wager: $${betAfterFee.toFixed(2)}</li>
                                <li>Odds: ${newLineOdds > 0 ? ('+' + newLineOdds) : newLineOdds}</li>
                                <li>Platform: PAYPER WIN ${bet.sportsbook ? 'Sportsbook' : 'Peer-to Peer'}(Autobet)</li>
                            </ul>
                            `),
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
            if (selectedauto.userId.roles.phone_verified && (!preference || !preference.notification_settings || preference.notification_settings.bet_accepted.sms)) {
                sendSMS(`This email is to advise you that your bet for ${lineQuery.sportName} ${lineQuery.type} on ${timeString} for $${betAfterFee.toFixed(2)} is waiting for a match. We will notify when we find you a match. An unmatched wager will be refunded upon the start of the game.\n 
                    Wager: $${betAfterFee.toFixed(2)}
                    Odds: ${newLineOdds > 0 ? ('+' + newLineOdds) : newLineOdds}
                    Platform: PAYPER WIN ${bet.sportsbook ? 'Sportsbook' : 'Peer-to Peer'}(Autobet)`, selectedauto.userId.phone);
            }

            const matchTimeString = convertTimeLineDate(new Date(startDate), timezone);
            let adminMsg = {
                from: `${fromEmailName} <${fromEmailAddress}>`,
                to: adminEmailAddress1,
                subject: 'New Bet',
                text: `New Bet`,
                html: simpleresponsive(
                    `<ul>
                            <li>Customer: ${selectedauto.userId.email} (${selectedauto.userId.firstname} ${selectedauto.userId.lastname})</li>
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
                ErrorLog.create({
                    name: 'Send Grid Error',
                    error: {
                        name: error.name,
                        message: error.message,
                        stack: error.stack
                    }
                });
            });
            adminMsg.to = supportEmailAddress;
            sgMail.send(adminMsg).catch(error => {
                ErrorLog.create({
                    name: 'Send Grid Error',
                    error: {
                        name: error.name,
                        message: error.message,
                        stack: error.stack
                    }
                });
            });

            const betId = savedBet.id;
            // add betId to betPool
            const docChanges = {
                $push: pick === 'home' ? { homeBets: betId } : { awayBets: betId },
                $inc: {},
            };
            docChanges.$inc[`${pick === 'home' ? 'teamA' : 'teamB'}.betTotal`] = betAfterFee;
            docChanges.$inc[`${pick === 'home' ? 'teamA' : 'teamB'}.toWinTotal`] = toWin;
            await betpool.update(docChanges);

            try {
                await FinancialLog.create({
                    financialtype: 'bet',
                    uniqid: `BP${ID()}`,
                    user: selectedauto.userId._id,
                    amount: bettable,
                    method: 'bet',
                    status: FinancialStatus.success,
                });
                await User.findByIdAndUpdate(selectedauto.userId._id, { $inc: { balance: -bettable } });
            } catch (err) {
                console.log('selectedauto.userId =>' + err);
            }

            let amount = 0;
            const logs = await AutoBetLog
                .aggregate([
                    {
                        $match: {
                            user: new ObjectId(selectedauto.userId._id),
                            createdAt: { $gte: fromTime },
                            type: bet.sportsbook ? 'sportsbook' : { $ne: 'sportsbook' },
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
                        { href: 'https://www.payperwin.co/autobet-settings', name: 'Increase daily limit' }),
                }
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
                    const { originSportId } = sportData;
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
            searchObj.status = { $in: ['Pending', 'Partial Match', 'Matched', 'Accepted', 'Partial Accepted', null] };
        } else if (settledBets) {
            searchObj.status = { $in: ['Settled - Win', 'Settled - Lose', 'Cancelled', 'Draw'] }
        } else if (custom) {
            searchObj.status = { $in: ['Pending', 'Partial Match', 'Matched'] };
            searchObj.origin = 'other';
        }

        if (daterange) {
            try {
                const { startDate, endDate } = daterange;
                searchObj.createdAt = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate),
                }
            } catch (error) { }
        }

        if (filter) {
            let orCon = [];
            if (filter.p2p) {
                orCon.push({
                    sportsbook: { $exists: false },
                });
                orCon.push({
                    sportsbook: false,
                });
            }
            if (filter.sportsbook) {
                orCon.push({
                    sportsbook: true,
                });
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
            .limit(perPage);
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
            let linePoints = bet.pickName.split(' ');
            if (lineQuery.type == 'moneyline') {
                linePoints = null;
            } else if (['spread', 'alternative_spread'].includes(lineQuery.type)) {
                linePoints = Number(linePoints[linePoints.length - 1]);
                if (bet.pick == 'away' || bet.pick == 'under') linePoints = -linePoints;
            } else if (['total', 'alternative_total'].includes(lineQuery.type)) {
                linePoints = Number(linePoints[linePoints.length - 1]);
            }

            const betpool = await BetPool.findOne({
                sportId: lineQuery.sportId,
                leagueId: lineQuery.leagueId,
                eventId: lineQuery.eventId,
                lineId: lineQuery.lineId,
                lineType: lineQuery.type,
                lineSubType: lineQuery.subtype,
                sportName: lineQuery.sportName,
                origin: bet.origin,
                points: linePoints
            });

            // if (betpool) {
            //     if (bet.pick == 'home' && betpool.homeBets.length > 0) {
            //         betpool.homeBets = betpool.homeBets.filter(bet => bet.toString() != id);
            //         betpool.teamA.betTotal -= bet.bet;
            //         betpool.teamA.toWinTotal -= bet.toWin;
            //     } else if (bet.pick == 'away' && betpool.awayBets.length > 0) {
            //         betpool.awayBets = betpool.awayBets.filter(bet => bet.toString() != id);
            //         betpool.teamB.betTotal -= bet.bet;
            //         betpool.teamB.toWinTotal -= bet.toWin;
            //     }
            //     if (betpool.homeBets.length == 0 && betpool.awayBets.length == 0) {
            //         await BetPool.deleteOne({ _id: betpool._id });
            //     } else {
            //         await betpool.save();
            //         await calculateBetsStatus(betpool.uid);
            //     }
            // }

            bet.pickOdds = bet.oldOdds;
            bet.status = null;
            bet.toWin = calculateToWinFromBet(bet.bet, Number(bet.oldOdds));
            bet.fee = bet.toWin * BetFee;
            bet.sportsbook = true;
            await bet.save();

            await checkAutoBet(bet, betpool, user, { originSportId: bet.lineQuery.sportId },
                {
                    teamA: bet.teama.name,
                    teamB: bet.teamB.name,
                    startDate: bet.matchStartDate,
                    line: {
                        home: Number(teamA.odds),
                        over: Number(teamA.odds),
                        away: Number(teamB.odds),
                        under: Number(teamB.odds),
                        hdp: linePoints,
                        points: linePoints
                    }
                });
            await calculateBetsStatus(betpool.uid);

            res.json(bet);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.stack });
        }
    }
)

expressApp.get(
    '/user',
    isAuthenticated,
    async (req, res) => {
        let userObj = false;
        if (req.isAuthenticated()) {
            const { username, _id: userId, settings, roles, email, balance, phone } = req.user;
            let preference = await Preference.findOne({ user: userId });
            if (!preference) {
                preference = await Preference.create({ user: userId });
            }
            const messages = await Message
                .find({
                    published_at: { $ne: null },
                    userFor: userId,
                })
                .count();
            const autobet = await AutoBet.findOne({
                userId: userId
            });
            userObj = { username, userId: userId.toString(), roles, email, balance, phone, preference, messages, autobet };
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
        const sportData = await Sport.findOne({ name: new RegExp(`^${name}$`, 'i') });
        if (sportData) {
            if (leagueId) {
                const sportLeague = sportData.leagues.find(league => league.originId == leagueId)
                if (sportLeague) {
                    if (eventId) {
                        const event = sportLeague.events.find(event => event.originId == eventId);
                        if (event)
                            return res.json({
                                leagueName: sportLeague.name,
                                origin: sportData.origin,
                                ...event
                            });
                        return res.json(null);
                    }
                    return res.json({
                        name: sportData.name,
                        leagues: [sportLeague],
                        origin: sportData.origin,
                        originSportId: sportData.originSportId
                    });
                }
                return res.json(null);
            }
            return res.json(sportData);
        } else {
            return res.json(null);
        }
    },
);

expressApp.get(
    '/sportleague',
    async (req, res) => {
        const { name } = req.query;
        const sportData = await Sport.findOne({ name: new RegExp(`^${name}$`, 'i') });
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
            })
            data = data.filter(data => data.eventCount)
            data.sort((a, b) => b.eventCount - a.eventCount);
            // data = data.slice(0, 5);
            res.json(data);
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
                            name: sp.name
                        })
                        continue;
                    }
                    sports.push({
                        eventCount: 0,
                        hasOfferings: true,
                        name: sp.name
                    })
                }
            }
            sports.push({
                eventCount: customBets,
                hasOfferings: true,
                name: "Other"
            });
            res.json(sports);
        } else {
            res.status(404).end();
        }
    },
);

expressApp.get(
    '/others',
    async (req, res) => {
        const { id } = req.query;
        if (id) {
            try {
                const customBet = await Event.findOne({
                    _id: id,
                    startDate: { $gte: new Date() },
                    status: EventStatus.pending.value,
                    approved: true,
                })
                    .sort({ createdAt: -1 });
                res.json([customBet]);
            } catch (error) {
                res.json([]);
            }
        } else {
            const customBets = await Event.find({
                startDate: { $gte: new Date() },
                status: EventStatus.pending.value,
                approved: true,
                public: true,
            })
                .sort({ createdAt: -1 });
            res.json(customBets);
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
                                    leagueName: league.name,
                                    leagueId: league.originId,
                                    team: event.teamA
                                });
                            } else if (event.teamB.toLowerCase().includes(param.toLowerCase())) {
                                results.push({
                                    type: 'team',
                                    sportName: sport.name,
                                    leagueName: league.name,
                                    leagueId: league.originId,
                                    team: event.teamB
                                });
                            }
                        }
                    }
                }
            }
            res.json(results);
        } catch (error) {
            console.log(error);
            res.json([]);
        }
    }
)

expressApp.get('/getPinnacleLogin',
    // bruteforce.prevent,
    isAuthenticated,
    async (req, res) => {
        const pinnacleSandboxAddon = await Addon.findOne({ name: 'pinnacle sandbox' });
        if (!pinnacleSandboxAddon || !pinnacleSandboxAddon.value || !pinnacleSandboxAddon.value.sandboxUrl) {
            console.warn("Pinnacel Sandbox Api is not set");
            return res.status(400).json({
                error: "Can't create pinnacle user."
            });
        }
        const { sandboxUrl, agentCode, agentKey, secretKey } = pinnacleSandboxAddon.value;
        let pinnacle = await Pinnacle.findOne({ user: new ObjectId(req.user._id) });
        const token = generatePinnacleToken(agentCode, agentKey, secretKey);
        if (!pinnacle) {
            try {
                const { data } = await axios.post(`${sandboxUrl}/player/create`, {}, {
                    headers: {
                        userCode: agentCode,
                        token
                    },
                })
                pinnacle = await Pinnacle.create({ ...data, ...{ user: req.user._id } });
            } catch (error) {
                return res.status(400).json({
                    error: "Can't create pinnacle user."
                });
            }
        }
        let loginInfo = null;
        try {
            const { data } = await axios.post(`${sandboxUrl}/player/loginV2?view=EURO`, {
                loginId: pinnacle.loginId
            }, {
                headers: {
                    userCode: agentCode,
                    token
                }
            });

            loginInfo = data;
        } catch (error) {
            // console.log("getPinnacleLogin1 => ", error);
            return res.status(400).json({
                error: "Pinnacle login failed."
            });
        }

        let userInfo = null;
        try {
            const { data } = await axios.get(`${sandboxUrl}/player/info?userCode=${pinnacle.userCode}`, {
                headers: {
                    userCode: agentCode,
                    token
                }
            });

            userInfo = data;
        } catch (error) {
            // console.log("getPinnacleLogin2 => ", error);
            return res.status(400).json({
                error: "Pinnacle login failed."
            });
        }

        return res.json({
            loginInfo,
            userInfo,
        })
    }
);

const pinnacleLogout = async (req) => {
    const pinnacleSandboxAddon = await Addon.findOne({ name: 'pinnacle sandbox' });
    if (!pinnacleSandboxAddon || !pinnacleSandboxAddon.value || !pinnacleSandboxAddon.value.sandboxUrl) {
        console.warn("Pinnacel Sandbox Api is not set");
        return false;
    }
    const { sandboxUrl, agentCode, agentKey, secretKey } = pinnacleSandboxAddon.value;
    if (req.user) {
        let pinnacle = await Pinnacle.findOne({ user: new ObjectId(req.user._id) });
        const token = generatePinnacleToken(agentCode, agentKey, secretKey);
        if (!pinnacle) {
            return false;
        }
        try {
            await axios.post(`${sandboxUrl}/player/logout?userCode=${pinnacle.userCode}`, {}, {
                headers: {
                    userCode: agentCode,
                    token
                }
            });

        } catch (error) {
            // console.log('/logout error', error)
            return false;
        }
        return true;
    }
    return false;
}

expressApp.get('/pinnacleLogout',
    // bruteforce.prevent,
    isAuthenticated,
    async (req, res) => {
        try {
            const result = pinnacleLogout(req);
            if (result) {
                return res.json({ message: 'succes' });
            }
            return res.status(400).json({
                error: "Pinnacle logout failed."
            });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ error: "Pinnacle logout failed." });
        }
    }
);

expressApp.get('/vipCodeExist', async (req, res) => {
    const { vipcode } = req.query;
    if (!vipcode)
        return res.json({ success: 1 });
    try {
        const promotion = await Promotion.findOne({ name: vipcode });
        if (promotion) {
            if (promotion.number_of_usage == -1) {
                return res.json({ success: 1 });
            }
            const logs = await PromotionLog.find({ promotion: promotion._id });
            if (logs.length < promotion.number_of_usage)
                return res.json({ success: 1 });
            return res.json({ success: 0, message: "Promotion usage reached to limit." });
        }
        return res.json({ success: 0, message: "Can't find Promotion." });
    } catch (error) {
        return res.json({ success: 0, message: "Can't find Promotion." });
    }
});

expressApp.get('/referralCodeExist', async (req, res) => {
    const { referral_code } = req.query;
    if (!referral_code)
        return res.json({ success: 1 });
    try {
        const autobet = await AutoBet.findOne({ referral_code: referral_code });
        if (autobet) {
            return res.json({ success: 1 });
        }
        return res.json({ success: 0, message: "Can't find Autobet User." });
    } catch (error) {
        console.log(error);
        return res.json({ success: 0, message: "Can't find Autobet User." });
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
        "notify_url": "https://api.payperwin.co/triplea/deposit",
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
        case 'Bitcoin':
        default:
            break;
    }
    api_id = testMode ? test_btc_api_id : api_id;

    try {
        const { data } = await axios.post(
            `${paymenturl}/${api_id}`,
            body,
            {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            });
        hosted_url = data.hosted_url;
    } catch (error) {
        ErrorLog.create({
            name: 'Triple-A Error',
            error: {
                name: error.name,
                message: error.message,
                stack: error.stack
            }
        });
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
        const { amount, email, phone, method } = data;
        if (method == "eTransfer") {
            if (!amount || !email || !phone) {
                return res.status(400).json({ success: 0, message: "Deposit Amount, Email and Phone are required." });
            }
            const premierpayAddon = await Addon.findOne({ name: 'premierpay' });
            if (!premierpayAddon || !premierpayAddon.value || !premierpayAddon.value.sid) {
                console.warn("PremierPay Api is not set");
                return res.status(400).json({ success: 0, message: "PremierPay Api is not set" });
            }
            const { paymenturl, payouturl, sid, rcode } = premierpayAddon.value;
            try {
                const { user } = req;
                try {
                    const uniqid = `D${ID()}`;
                    const signature = await generatePremierRequestSignature(email, amount, user._id, uniqid);
                    let data = null;
                    try {
                        const { data: result } = await axios.post(`${paymenturl}/${sid}`,
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
                                "notification_url": "https://api.payperwin.co/premier/etransfer-deposit",
                                "amount_shipping": 0.00,
                                "udf1": user._id,
                                "udf2": uniqid,
                                "signature": signature
                            }
                        );
                        data = result;
                    } catch (error) {
                        ErrorLog.create({
                            name: 'PremierPay Error',
                            error: {
                                name: error.name,
                                message: error.message,
                                stack: error.stack
                            }
                        });
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
                        return res.json({ success: 1, message: "Please wait until deposit is finished." });
                    }
                    return res.status(400).json({ success: 0, message: "Failed to create etransfer." });
                } catch (error) {
                    console.log("deposit => ", error);
                    return res.status(400).json({ success: 0, message: "Failed to create deposit." });
                }
            } catch (error) {
                return res.status(500).json({ success: 0, message: "Can't make deposit.", error });
            }
        }
        else if (method == "Bitcoin" || method == "Ethereum" || method == "Tether") {
            if (!amount || !email || !phone) {
                return res.status(400).json({ success: 0, message: "Deposit Amount, Email and Phone are required." });
            }
            depositTripleA(req, res, data);
        }
        else {
            return res.status(400).json({ success: 0, message: "Method is not suitable." });
        }
    }
);

const getMaxWithdraw = async (user) => {
    let totalwagers = await Bet.aggregate(
        { $match: { userId: new ObjectId(user._id), } },
        { $group: { _id: null, total: { $sum: "$bet" } } }
    );
    if (totalwagers.length) totalwagers = totalwagers[0].total;
    else totalwagers = 0;

    let totalwinbet = await Bet.aggregate(
        {
            $match: {
                userId: new ObjectId(user._id),
                status: "Settled - Win",
            }
        },
        { $group: { _id: null, total: { $sum: "$credited" } } }
    );
    if (totalwinbet.length) totalwinbet = totalwinbet[0].total;
    else totalwinbet = 0;

    let signupBonusAmount = 0;
    const signUpBonusEnabled = await checkSignupBonusPromotionEnabled(user._id);
    if (signUpBonusEnabled) {
        const signUpBonus = await FinancialLog.findOne({
            user: user._id,
            financialtype: 'signupbonus'
        });
        if (signUpBonus) {
            signupBonusAmount = signUpBonus.amount;
        }
    }

    let maxwithdraw = totalwagers / 3 + totalwinbet;
    if (signupBonusAmount > 0) {
        if (totalwagers >= signupBonusAmount * 5)
            maxwithdraw += signupBonusAmount;
    }
    maxwithdraw = Number(maxwithdraw.toFixed(2));
    return maxwithdraw;
}

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
                const premierpayAddon = await Addon.findOne({ name: 'premierpay' });
                if (!premierpayAddon || !premierpayAddon.value || !premierpayAddon.value.sid) {
                    console.warn("PremierPay Api is not set");
                    return res.status(400).json({ success: 0, message: "PremierPay Api is not set" });
                }

                const maxwithdraw = getMaxWithdraw(user);
                let totalwithdraw = await FinancialLog.aggregate(
                    {
                        $match: {
                            financialtype: "withdraw",
                            user: new ObjectId(user._id),
                        }
                    },
                    {
                        $group: { _id: null, total: { $sum: "$amount" } }
                    }
                )
                if (totalwithdraw.length) totalwithdraw = totalwithdraw[0].total;
                else totalwithdraw = 0;

                if ((amount + totalwithdraw) > maxwithdraw) {
                    return res.json({ success: 0, message: "Your withdrawal request was declined. The reason we declined your withdrawal is you made a deposit and are now requesting a withdrawal without rolling (betting) your deposit by the minimum stated on our website. We require you to complete the three-time rollover requirement before you resubmit a new withdrawal request." });
                }

                if (amount + fee > user.balance) {
                    return res.json({ success: 0, message: "Insufficient funds." });
                }

                const { payouturl, sid } = premierpayAddon.value;
                const signature = await generatePremierRequestSignature(user.email, amount, user._id, uniqid);
                const amount2 = Number(amount).toFixed(2);

                const { data } = await axios.post(`${payouturl}/${sid}`,
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
                        "notification_url": "https://api.payperwin.co/premier/etransfer-withdraw",
                        "amount_shipping": 0.00,
                        "udf1": user._id,
                        "udf2": uniqid,
                        "signature": signature
                    }
                );

                const responsesignature = await generatePremierResponseSignature(data.txid, data.status, data.descriptor, data.udf1, data.udf2);
                if (responsesignature != data.signature) {
                    return res.status(400).json({ success: 0, message: "Failed to create etransfer. Signatuer mismatch" });
                }
                if (data.status == "APPROVED") {
                    const withdraw = new FinancialLog({
                        financialtype: 'withdraw',
                        uniqid: uniqid,
                        user: user._id,
                        amount: amount,
                        method: method,
                        status: FinancialStatus.pending,
                        fee: fee
                    });
                    await withdraw.save();

                    if (fee > 0) {
                        const withdrawFee = new FinancialLog({
                            financialtype: 'withdrawfee',
                            uniqid: `WF${ID()}`,
                            user: user._id,
                            amount: fee,
                            method: method,
                            status: FinancialStatus.success,
                        });
                        await withdrawFee.save();
                    }
                    await User.findOneAndUpdate({ _id: user._id }, { $inc: { balance: -(fee + amount) } });

                    return res.json({ success: 1, message: "Please wait until withdraw is finished." });
                }
                return res.status(400).json({ success: 0, message: "Failed to create etransfer." });
            } catch (error) {
                console.log("withdraw => ", error);
                return res.status(400).json({ success: 0, message: "Failed to create withdraw." });
            }
        } else if (method == "Bitcoin" || method == "Ethereum" || method == "Tether") {
            if (!amount) {
                return res.json({ success: 0, message: "Withdraw Amount is required." });
            }
            if (!user.roles.verified) {
                return res.json({ success: 0, message: "You should verify your identify to make withdraw." });
            }
            const fee = freeWithdrawalUsed ? 25 : 0;

            try {
                const uniqid = `W${ID()}`;
                const maxwithdraw = getMaxWithdraw(user);

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
                    return res.json({ success: 0, message: "Your withdrawal request was declined. The reason we declined your withdrawal is you made a deposit and are now requesting a withdrawal without rolling (betting) your deposit by the minimum stated on our website. We require you to complete the three-time rollover requirement before you resubmit a new withdrawal request." });
                }

                if (amount + fee > user.balance) {
                    return res.json({ success: 0, message: "Insufficient funds." });
                }

                const withdraw = new FinancialLog({
                    financialtype: 'withdraw',
                    uniqid: uniqid,
                    user: user._id,
                    amount: amount,
                    method: method,
                    status: FinancialStatus.pending
                });
                await withdraw.save();

                if (fee > 0) {
                    const withdrawFee = new FinancialLog({
                        financialtype: 'withdrawfee',
                        uniqid: `WF${ID()}`,
                        user: user._id,
                        amount: fee,
                        method: method,
                        status: FinancialStatus.success,
                    });
                    await withdrawFee.save();
                }

                await User.findOneAndUpdate({ _id: user._id }, { $inc: { balance: -(fee + amount) } });

                return res.json({ success: 1, message: "Please wait until withdraw is finished." });
            } catch (error) {
                console.log("withdraw => ", error);
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
                    searchObj = {
                        ...searchObj,
                        $or: orCon
                    }
                } else {
                    searchObj = {
                        ...searchObj,
                        $or: [
                            {
                                financialtype: { $ne: "withdraw" },
                                status: FinancialStatus.success
                            },
                            {
                                financialtype: "withdraw",
                            }
                        ]
                    }
                }
            }
            const perPage = 20;
            const financials = await FinancialLog.find(searchObj)
                .sort({ createdAt: -1 })
                .skip(perPage * page)
                .limit(perPage);
            res.json(financials);
        } catch (error) {
            console.log("transactions => ", error);
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

            const ticket = await Ticket.create({
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
                ErrorLog.create({
                    name: 'Send Grid Error',
                    error: {
                        name: error.name,
                        message: error.message,
                        stack: error.stack
                    }
                });
            });

            res.json({ message: "success" });
        } catch (error) {
            console.log(error);
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
    '/meta/:title',
    async (req, res) => {
        const { title } = req.params;
        const meta_tag = await MetaTag.findOne({ pageTitle: title });
        res.json(meta_tag);
    }
);

expressApp.get(
    '/articles/home',
    async (req, res) => {
        try {
            const articles = await Article.find({ published_at: { $ne: null } })
                .select(['permalink', 'logo', 'categories', 'published_at', 'title', 'subtitle'])
                .sort({ published_at: -1 })
                .limit(6);
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
            console.log(error)
            res.status(500).json({ success: false });
        }
    }
)

expressApp.get(
    '/article/:id',
    async (req, res) => {
        const { id } = req.params;
        try {
            const article = await Article.findOne({ _id: id, published_at: { $ne: null } })
            res.json(article);
        } catch (error) {
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
                .sort({ published_at: -1 })
            res.json(articles);
        } catch (error) {
            console.log(error)
            res.status(500).json({ success: false });
        }
    }
)

expressApp.get(
    '/articles/related/:id',
    async (req, res) => {
        const { id } = req.params;
        try {
            const article = await Article.findById(id);
            if (article) {
                const articles = await Article.find({ _id: { $ne: article._id }, published_at: { $ne: null }, categories: article.categories })
                    .select(['categories', 'permalink', 'title', 'published_at'])
                    .sort({ published_at: -1 })
                    .limit(10);
                res.json(articles);
            }
            else {
                res.status(404).json({ success: false });
            }
        } catch (error) {
            res.status(500).json({ success: false });
        }
    }
)

expressApp.get(
    '/articles/recent',
    async (req, res) => {
        try {
            const articles = await Article.find({ published_at: { $ne: null } })
                .select(['permalink', 'logo', 'categories', 'published_at', 'title', 'subtitle'])
                .sort({ published_at: -1 })
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
                .select(['permalink', 'logo', 'categories', 'published_at', 'title', 'subtitle'])
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
                    console.log(error);
                    return res.status(500).json({ success: false, error: "Can't create verification service." });
                }
            }

            try {
                await twilioClient.verify.services(service.value.sid)
                    .verifications
                    .create({ to: phone, channel: 'sms' });
                res.json({ success: true });
            } catch (error) {
                console.log(error);
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
                await twilioClient.verify.services(service.value.sid)
                    .verificationChecks
                    .create({ to: user.phone, code: verification_code });
                await user.update({
                    roles: {
                        ...user.roles,
                        phone_verified: true,
                    }
                })
                res.json({ success: true });
            } catch (error) {
                console.log(error);
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
            console.log(error)
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
                        sportsbook: false,
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
                sportsbook: false,
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
            console.log(error);
            res.json(null);
        }

    }
)

expressApp.post(
    '/customBet',
    isAuthenticated,
    async (req, res) => {
        const {
            name,
            option_1,
            option_2,
            startDate,
            favorite,
            odds,
            visiblity,
            wagerAmount,
        } = req.body;
        const user = req.user;
        if (user.balance < wagerAmount || user.balance < 10 || wagerAmount < 5) {
            return res.status(400).json({ error: "Can't create a bet." });
        }
        try {
            const teamAOdds = favorite == 'teamA' ? odds : -odds;
            const teamBOdds = -teamAOdds;
            await Event.create({
                name: name,
                teamA: {
                    name: option_1,
                    odds: [teamAOdds],
                    currentOdds: teamAOdds
                },
                teamB: {
                    name: option_2,
                    odds: [teamBOdds],
                    currentOdds: teamBOdds
                },
                startDate: startDate,
                approved: false,
                public: visiblity == 'public' ? true : false,
                status: config.EventStatus.pending.value,
                creator: 'User',
                user: user._id,
                initialWager: {
                    wagerAmount: wagerAmount,
                    favorite: favorite
                }
            });
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: "Can't create a bet." });
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
                orgin: { $ne: 'other' }
            }).sort({ updatedAt: -1 });

            let betamount = await Bet.aggregate([
                {
                    $match: {
                        userId: user._id,
                        updatedAt: dateObj,
                        orgin: { $ne: 'other' }
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
                orgin: { $ne: 'other' },
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
                        orgin: { $ne: 'other' },
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
                orgin: { $ne: 'other' },
                status: 'Settled - Lose'
            }).count();

            let lossamount = await Bet.aggregate([
                {
                    $match: {
                        userId: user._id,
                        updatedAt: dateObj,
                        orgin: { $ne: 'other' },
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
                orgin: { $ne: 'other' },
                status: { $in: ['Pending', 'Partial Match', 'Matched'] }
            }).count();

            let pendingamount = await Bet.aggregate([
                {
                    $match: {
                        userId: user._id,
                        updatedAt: dateObj,
                        orgin: { $ne: 'other' },
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
                        orgin: { $ne: 'other' },
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
            console.log(error);
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
                console.log(error);
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
                res.json({ success: true, used: true });
            } else {
                res.json({ success: true, used: false });
            }
        } catch (erorr) {
            console.log(error);
            res.status(500).json({ success: false });
        }
    }
)

expressApp.post(
    '/prize',
    isAuthenticated,
    async (req, res) => {
        const { prize, date } = req.body;
        if (!date) res.status(400).json({ success: false, error: 'Date is required.' });
        if (!prize) res.status(400).json({ success: false, error: 'Prize is required.' });
        const user = req.user;
        const prizeExist = await PrizeLog.findOne({
            createdAt: { $gte: new Date(date) },
            user: user._id,
        });
        if (prizeExist) {
            return res.status(400).json({ success: false, error: "Prize already taken." });
        }
        try {
            switch (prize) {
                case 1:     // $5 Credit
                case 5:
                case 9:
                    await PrizeLog.create({
                        user: user._id,
                        type: '$5 Credit'
                    });
                    await User.findOneAndUpdate({
                        _id: user._id,
                    }, { $inc: { balance: 5 } });
                    await FinancialLog.create({
                        financialtype: 'prize',
                        uniqid: `P${ID()}`,
                        user: user._id,
                        amount: 5,
                        method: 'prize',
                        status: FinancialStatus.success,
                    });
                    break;
                case 2:
                case 8:     // $25 Credit
                    await PrizeLog.create({
                        user: user._id,
                        type: '$25 Credit'
                    });
                    await User.findOneAndUpdate({
                        _id: user._id,
                    }, { $inc: { balance: 25 } });
                    await FinancialLog.create({
                        financialtype: 'prize',
                        uniqid: `P${ID()}`,
                        user: user._id,
                        amount: 25,
                        method: 'prize',
                        status: FinancialStatus.success,
                    });
                    break;
                case 4:     // $10 Credit
                case 10:
                    await PrizeLog.create({
                        user: user._id,
                        type: '$10 Credit'
                    });
                    await User.findOneAndUpdate({
                        _id: user._id,
                    }, { $inc: { balance: 10 } });
                    await FinancialLog.create({
                        financialtype: 'prize',
                        uniqid: `P${ID()}`,
                        user: user._id,
                        amount: 10,
                        method: 'prize',
                        status: FinancialStatus.success,
                    });
                    break;
                case 6:     // $100 Credit
                case 12:
                    await PrizeLog.create({
                        user: user._id,
                        type: '$100 Credit'
                    });
                    await User.findOneAndUpdate({
                        _id: user._id,
                    }, { $inc: { balance: 100 } });
                    await FinancialLog.create({
                        financialtype: 'prize',
                        uniqid: `P${ID()}`,
                        user: user._id,
                        amount: 100,
                        method: 'prize',
                        status: FinancialStatus.success,
                    });
                    break;
                case 3:     // +2,000 Loyalty
                    await PrizeLog.create({
                        user: user._id,
                        type: '+2,000 Loyalty'
                    });
                    await LoyaltyLog.create({
                        user: user._id,
                        point: 2000
                    });
                    break;
                case 7:     // +5,000 Loyalty
                    await PrizeLog.create({
                        user: user._id,
                        type: '+5,000 Loyalty'
                    });
                    await LoyaltyLog.create({
                        user: user._id,
                        point: 5000
                    });
                    break;
                case 11:    // +10,000 Loyalty
                    await PrizeLog.create({
                        user: user._id,
                        type: '+10,000 Loyalty'
                    });
                    await LoyaltyLog.create({
                        user: user._id,
                        point: 10000
                    });
                    break;
            }
            res.json({ success: true });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false });
        }
    }
)


// Admin
expressApp.use('/admin', adminRouter);
expressApp.use('/premier', premierRouter);
expressApp.use('/triplea', tripleARouter);

// if (sslPort) {
//   // Https
//   const pathToCerts = '';
//   const key = fs.readFileSync(`${pathToCerts}cert.key`);
//   const cert = fs.readFileSync(`${pathToCerts}cert.cer`);
//   https.createServer({
//     key,
//     cert,
//   }, expressApp).listen(sslPort, () => console.info(`API Server listening on port ${sslPort}`));
//   expressApp.listen(port, () => console.info(`API Server listening on port ${port}`));
// } else {
// Http
const server = expressApp.listen(port, () => console.info(`API Server listening on port ${port}`));
// }
const options = {
    cors: {
        origin: config.corsHosts,
        allowedHeaders: ["*"],
        credentials: true
    }
};
io.attach(server, options)
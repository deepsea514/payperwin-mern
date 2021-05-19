//.env
require('dotenv').config();
// models
const User = require('./models/user');
const LoginLog = require("./models/loginlog");
const Sport = require('./models/sport');
const Bet = require('./models/bet');
const BetPool = require('./models/betpool');
const SportsDir = require('./models/sportsDir');
const Pinnacle = require('./models/pinnacle');
const ExpressBrute = require('express-brute');
const AutoBet = require("./models/autobet");
const AutoBetLog = require("./models/autobetlog");
const Promotion = require('./models/promotion');
const PromotionLog = require('./models/promotionlog');
const FinancialLog = require('./models/financiallog');
const PremierResponse = require('./models/premier-response');
const BetSportsBook = require('./models/betsportsbook');
const Verification = require('./models/verification');
const Ticket = require("./models/ticket");
const Preference = require('./models/preference');
const FAQSubject = require("./models/faq_subject");
const FAQItem = require('./models/faq_item');
//local helpers
const seededRandomString = require('./libs/seededRandomString');
const getLineFromSportData = require('./libs/getLineFromSportData');
const simpleresponsive = require('./emailtemplates/simpleresponsive');
const config = require('../config.json');
const io = require("./libs/socket");
const { generateToken } = require('./generateToken');
const { generatePremierResponseSignature, generatePremierRequestSignature } = require('./generateSignature');
const InsufficientFunds = 8;
const BetFee = 0.03;
const PremiumPay = config.PremiumPay;
const FinancialStatus = config.FinancialStatus;
const TripleA = config.TripleA;
const fromEmailName = 'PAYPER Win';
const fromEmailAddress = 'donotreply@payperwin.co';
const adminEmailAddress = 'admin@payperwin.co';
//external libraries
const express = require('express');
const apicache = require('apicache');
const cors = require('cors');
const mongoose = require('mongoose');
const compression = require('compression');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// const cookieSession = require('cookie-session');
const expressSession = require('express-session');
// const MongoDBStore = require('connect-mongodb-session')(expressSession);
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const { ObjectId } = require('mongodb');
const axios = require('axios');
const fileUpload = require('express-fileupload');
//express routers
const v1Router = require('./v1Routes');
const premierRouter = require('./premierRoutes');
const adminRouter = require('./adminRoutes');
const tripleARouter = require("./tripleARoutes");

const ID = function () {
    return '' + Math.random().toString(10).substr(2, 9);
};

const get2FACode = function () {
    return '' + Math.random().toString(10).substr(2, 6);
};

Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}

Date.prototype.addMins = function (m) {
    this.setTime(this.getTime() + (m * 60 * 1000));
    return this;
}

let port = config.serverPort;
// let sslPort = 443;
if (process.env.NODE_ENV === 'development') {
    sslPort = null;
    // port = port;
}

// Brute Force Mitigation Middleware
const bruteStore = new ExpressBrute.MemoryStore(); // TODO: stores state locally, don't use this in production
const bruteforce = new ExpressBrute(bruteStore);

// Database
mongoose.Promise = global.Promise;
const databaseName = 'PayPerWinDev'
// const databaseName = process.env.NODE_ENV === 'development' ? 'PayPerWinDev' : 'PayPerWin';
console.info('Using database:', databaseName);
const mongooptions = {
    useMongoClient: true,
}
if (config.mongo && config.mongo.username) {
    mongooptions.authSource = "admin";
    mongooptions.user = config.mongo.username;
    mongooptions.pass = config.mongo.password;
}
mongoose.connect(`mongodb://localhost/${databaseName}`, mongooptions);
// const store = new MongoDBStore(
//     {
//         uri: `mongodb://localhost/${databaseName}`,
//         databaseName: databaseName,
//         collection: 'sessions',
//         expires: 90 * 24 * 60 * 60 * 1000,
//         connectionOptions: mongooptions
//     },
//     function (error) {
//         // Should have gotten an error
//     }
// );

// Server
const expressApp = express();
const cache = apicache.middleware;

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
function shouldCompress(req, res) {
    const { compress } = req.query;
    if (compress === 'false') {
        // don't compress responses with this query property
        return false;
    }

    // fallback to standard filter function
    return compression.filter(req, res);
}
expressApp.use(compression({ filter: shouldCompress }));


// is authenticated middleware
function isAuthenticated(req, res, next) {
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
                if (process.env.NODE_ENV === 'development') {
                    console.log(user.username, 'incorrect password', password);
                }
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }
));


function sendVerificationEmail(email, username, req) {
    const { hostname, protocol, headers, subdomains } = req;
    const mainHostname = hostname.replace(subdomains.map(sd => `${sd}.`), '');
    const emailHash = seededRandomString(email, 10);
    const emailValidationPath = `${protocol}://${req.headers.host}/validateEmail?email=${email}&h=${emailHash}`;
    return new Promise((resolve, reject) => {
        // if (process.env.NODE_ENV === 'development') {
        //   console.log(`Verify your email address by following this link: ${emailValidationPath}`);
        // } else {
        const msg = {
            from: `"${fromEmailName}" <${fromEmailAddress}>`,
            to: email,
            subject: 'Welcome to Payper Win',
            text: `Verify your email address by following this link: ${emailValidationPath}`,
            html: simpleresponsive(
                `Hi <b>${email}</b>.
                <br><br>
                Just a quick reminder that you registered to PayperWin.
                <br><br>
                Verify your email address by following this link:`,
                { href: emailValidationPath, name: 'Verify Email' }),
        };
        sgMail.send(msg);
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
            vipcode, } = req.body;
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
                    vipcode,
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
                        sendVerificationEmail(email, username, req);
                        if (vipcode && vipcode != "") {
                            const promotion = await Promotion.findOne({ name: vipcode });
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

expressApp.use(function (req, res, next) {
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
        console.log(username);
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
                    log.save(function (error) {
                        if (error) console.log("register => ", error);
                        else console.log(`User register log - ${user.username}`);
                    });
                    return res.send(`registered ${user.username}`);
                });
            }
        })(req, res, next);
    },
);

expressApp.post('/login', bruteforce.prevent, (req, res, next) => {
    const { session } = req;
    passport.authenticate('local', (err, user/* , info */) => {
        if (err) { return next(err); }
        if (!user) { return res.status(403).json({ error: 'Incorrect username or password' }); }
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
            log.save(function (error) {
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
});

function send2FAVerifyEmail(email, code) {
    const msg = {
        from: `"${fromEmailName}" <${fromEmailAddress}>`,
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
    sgMail.send(msg);
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

expressApp.get('/logout', (req, res) => {
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

expressApp.post('/passwordChange', bruteforce.prevent, isAuthenticated, async (req, res) => {
    const { oldPassword, password } = req.body;
    User.findOne(
        { username: req.user.username },
        async (err, user) => {
            if (err) {
                res.send(err);
            }

            if (user) {
                const validPassword = await user.validPassword(oldPassword);
                if (validPassword) {
                    if (process.env.NODE_ENV === 'development') {
                        console.log('new password:', password);
                    }
                    user.password = password;
                    user.save((err2) => {
                        if (err2) {
                            console.error(err2);
                        }
                        res.json('Successfully changed password!');
                    });
                } else {
                    res.status(403).json({ error: 'Invalid Password.' });
                }
            } else {
                res.json({ error: 'No account with that username exists.' });
            }
        },
    );
});

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
                const passwordRecoveryPath = `https://payperwin.co/newPasswordFromToken?username=${user.username}&h=${changePasswordHash}`;
                // if (process.env.NODE_ENV === 'development') {
                //   console.log(`Hey ${user.username}, you can create a new password here:\n${passwordRecoveryPath}`);
                // } else {
                const msg = {
                    from: `"${fromEmailName}" <${fromEmailAddress}>`,
                    to: email, // An array if you have multiple recipients.
                    subject: 'Password Reset Request for Payper Win',
                    text: `You requested password recovery. You can create a new password here: ${passwordRecoveryPath}`,
                    html: simpleresponsive(`Hi <b>${user.firstname}</b>.
                            <br><br>
                            Someone has requested a new password for the following account on Payper Win:
                            <br><br>
                            Username: ${user.username}
                            <br>
                            If you didn't make this request, just ignore this email. If you'd like to proceed:
                            <br><br>`,
                        { href: passwordRecoveryPath, name: 'Click Here to reset your password' }
                    ),
                };
                try {
                    await sgMail.send(msg);
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

function calculateToWinFromBet(bet, americanOdds) {
    const stake = Math.abs(Number(Number(bet).toFixed(2)));
    const decimalOdds = americanOdds > 0 ? (americanOdds / 100) : -(100 / americanOdds);
    const calculateWin = (stake * 1) * decimalOdds;
    const roundToPennies = Number((calculateWin).toFixed(2));
    return roundToPennies;
}

async function calculateBetsStatus(betpoolUid) {
    const betpool = await BetPool.findOne({ uid: betpoolUid });
    const { homeBets, awayBets, teamA, teamB } = betpool;
    // console.log(homeBets, awayBets);
    const bets = await Bet.find({
        _id:
        {
            $in: [
                ...homeBets,
                ...awayBets,
            ]
        }
    });
    const payPool = {
        home: teamB.betTotal,
        away: teamA.betTotal,
    }
    for (const bet of bets) {
        const { _id, toWin, pick, matchingStatus: currentMatchingStatus, payableToWin: currentPayableToWin, userId } = bet;
        // console.log(bet, payPool[pick]);
        // TODO: i dont think this algo is correct
        // I think you have to account for how much money is refunded to player for unmatched bet
        let payableToWin = 0;
        if (payPool[pick]) {
            if (payPool[pick] > 0) {
                payableToWin += toWin;
                payPool[pick] -= toWin;
                if (payPool[pick] < 0) payableToWin += payPool[pick];
            }
        }
        let matchingStatus;
        if (payableToWin === toWin) matchingStatus = 'Matched';
        else if (payableToWin === 0) matchingStatus = 'Pending';
        else matchingStatus = 'Partial Match'
        const betChanges = {
            $set: {
                payableToWin,
                matchingStatus,
                status: matchingStatus,
            }
        };
        // console.log(betChanges);
        if (payableToWin !== currentPayableToWin || matchingStatus !== currentMatchingStatus) {
            // console.log(2);
            // if (matchingStatus === 'Matched') {
            //   const user = await User.findById(userId);
            //   const { email } = user;
            //   const msg = {
            //     from: `"${fromEmailName}" <${fromEmailAddress}>`,
            //     to: email,
            //     subject: 'Your bet has been matched!',
            //     text: `Your bet has been matched. You can view your open bets here: http://dev.payperwin.ca/bets`,
            //     html: `
            //                 <p>
            //                   Your bet has been matched. You can view your open bets here:
            //                   <a href="http://dev.payperwin.ca/bets">Open Bets</a>
            //                 </p>
            //               `,
            //   };
            //   sgMail.send(msg);
            // }
            await Bet.findOneAndUpdate({ _id }, betChanges);
        }
    }
}

expressApp.post('/placeBets', /* bruteforce.prevent, */ async (req, res) => {
    const {
        betSlip,
    } = req.body;


    if (!req.user) {
        res.status(403).json({ errors: ['You have to be logged in to place bets.'] });
        return;
    }
    User.findOne(
        { username: req.user.username },
        async (err, user) => {
            if (err) {
                console.log('placeBets => ', err);
                res.send(err);
                return;
            }
            const errors = [];
            if (user) {
                for (const bet of betSlip) {
                    const {
                        odds,
                        pick, // TODO: fix over under pick
                        stake: toBet,
                        win: toWin,
                        lineQuery,
                        pickName,
                        origin
                    } = bet;
                    if (!odds || !pick || !toBet || !toWin || !lineQuery) {
                        errors.push(`${pickName} ${odds[pick]} wager could not be placed. Query Incomplete.`);
                    } else {
                        const {
                            sportName,
                            leagueId,
                            eventId,
                            lineId,
                            type,
                            altLineId,
                        } = lineQuery;
                        // TODO: error if match has already started
                        // TODO: prevent certain types of bets
                        const sportData = await Sport.findOne({ name: new RegExp(`^${sportName}$`, 'i') });
                        if (sportData) {
                            const { originSportId } = sportData;
                            lineQuery.sportId = originSportId;
                            const line = getLineFromSportData(sportData, leagueId, eventId, lineId, type, altLineId);
                            if (line) {
                                const { teamA, teamB, startDate, line: { home, away, draw, hdp, points, periodNumber } } = line;
                                lineQuery.periodNumber = periodNumber;
                                // if (draw) {
                                // errors.push(`${pickName} ${odds[pick]} wager could not be placed. Invalid Bet Type.`);
                                // } else {
                                const pickWithOverUnder = type === 'total' ? (pick === 'home' ? 'over' : 'under') : pick;
                                const lineOdds = line.line[pickWithOverUnder];
                                const oddsA = type === 'total' ? line.line.over : line.line.home;
                                const oddsB = type === 'total' ? line.line.under : line.line.away;
                                const oddsDifference = Math.abs(Math.abs(oddsA) - Math.abs(oddsB)) / 2;
                                if (oddsA > 0 && oddsB > 0 || oddsA < 0 && oddsB < 0) {
                                    errors.push(`${pickName} ${odds[pick]} wager could not be placed. Invalid Bet Type.`);
                                } else {
                                    let bigHome = 1;
                                    if (oddsA > 0) {
                                        if (Math.abs(oddsB) > Math.abs(oddsA)) bigHome = 1;
                                        else bigHome = -1;
                                    }
                                    if (oddsA < 0) {
                                        if (Math.abs(oddsB) > Math.abs(oddsA)) bigHome = -1;
                                        else bigHome = 1;
                                    }
                                    const newLineOdds = lineOdds + oddsDifference * bigHome;
                                    const oddsMatch = odds[pick] === newLineOdds;
                                    if (oddsMatch) {
                                        const betAfterFee = toBet /* * 0.98 */;
                                        const toWin = calculateToWinFromBet(betAfterFee, newLineOdds);
                                        const fee = Number((toBet * BetFee).toFixed(2));
                                        const balanceChange = toBet * -1;
                                        const newBalance = user.balance ? user.balance + balanceChange : 0 + balanceChange;
                                        if (newBalance >= InsufficientFunds) {
                                            // insert bet doc to bets table
                                            const newBetObj = {
                                                userId: user._id,
                                                transactionID: `B${ID()}`,
                                                teamA: {
                                                    name: teamA,
                                                    odds: home,
                                                },
                                                teamB: {
                                                    name: teamB,
                                                    odds: away,
                                                },
                                                // sportName,
                                                pick,
                                                pickOdds: newLineOdds,
                                                oldOdds: lineOdds,
                                                pickName,
                                                bet: betAfterFee,
                                                toWin,
                                                fee,
                                                matchStartDate: startDate,
                                                // lineType: type,
                                                // index,
                                                status: 'Pending',
                                                lineQuery,
                                            };
                                            if (altLineId) newBetObj.pinnacleAltLineId = altLineId;
                                            const newBet = new Bet(newBetObj);
                                            console.info(`created new bet`);

                                            // save the user

                                            try {
                                                const savedBet = await newBet.save();

                                                const msg = {
                                                    from: `"${fromEmailName}" <${fromEmailAddress}>`,
                                                    to: user.email,
                                                    subject: 'Your bet was accepted',
                                                    text: `Your bet was accepted`,
                                                    html: simpleresponsive(
                                                        `Hi <b>${user.firstname}</b>.
                                                        <br><br>
                                                        This email is to advise that your bet for ${lineQuery.sportName} ${lineQuery.type} for ${betAfterFee} was accepted on ${new Date()}
                                                        <br><br>`),
                                                };
                                                sgMail.send(msg);


                                                const betId = savedBet.id;
                                                // add betId to betPool
                                                const exists = await BetPool.findOne({ uid: JSON.stringify(lineQuery) });
                                                if (exists) {
                                                    // console.log('exists updating betpool');
                                                    const docChanges = {
                                                        $push: pick === 'home' ? {
                                                            homeBets: betId,
                                                        } : {
                                                            awayBets: betId,
                                                        },
                                                        $inc: {},
                                                    };
                                                    docChanges.$inc[`${pick === 'home' ? 'teamA' : 'teamB'}.betTotal`] = betAfterFee;
                                                    docChanges.$inc[`${pick === 'home' ? 'teamA' : 'teamB'}.toWinTotal`] = toWin;
                                                    await BetPool.findOneAndUpdate(
                                                        {
                                                            uid: JSON.stringify(lineQuery)
                                                        },
                                                        docChanges,
                                                    );
                                                } else {
                                                    // Create new bet pool
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
                                                            points: hdp ? hdp : points ? points : null,
                                                            homeBets: pick === 'home' ? [betId] : [],
                                                            awayBets: pick === 'away' ? [betId] : [],
                                                            origin
                                                        }
                                                    );

                                                    try {
                                                        await newBetPool.save();

                                                        await checkAutoBet(bet, newBetPool, user, sportData, line);
                                                    } catch (err) {
                                                        console.log('can\'t save newBetPool => ' + err);
                                                    }
                                                }

                                                await calculateBetsStatus(JSON.stringify(lineQuery));

                                                user.betHistory = user.betHistory ? [...user.betHistory, betId] : [betId];
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

                                            // await Admin.findOneAndUpdate({}, {
                                            //     $inc: {
                                            //         feesWallet: fee,
                                            //         betsWallet: betAfterFee,
                                            //         userWallet: toBet * -1,
                                            //     },
                                            // }, { upsert: true });
                                        } else {
                                            errors.push(`${pickName} ${odds[pick]} wager could not be placed. Insufficient funds. Balance must not drop below $${InsufficientFunds} to place bets.`);
                                        }
                                    } else {
                                        errors.push(`${pickName} ${odds[pick]} wager could not be placed. Odds have changed.`);
                                    }
                                }
                                // }
                            } else {
                                errors.push(`${pickName} ${odds[pick]} wager could not be placed. Line not found`);
                            }
                        }
                    }
                }
                res.json({
                    balance: user.balance,
                    errors,
                });
            }
        },
    );
});

async function checkAutoBet(bet, betpool, user, sportData, line) {
    const { AutoBetStatus, AutoBetPeorid } = config;
    let { pick, win: toBet, lineQuery } = bet;
    let autobets = await AutoBet
        .find({ deletedAt: null })
        .populate('userId');

    const asyncFilter = async (arr, predicate) => {
        const results = await Promise.all(arr.map(predicate));
        return arr.filter((_v, index) => results[index]);
    }
    let autobetusers = await asyncFilter(autobets, async (autobet) => {
        if (!autobet.userId) return false;
        const today = new Date();
        let fromTime = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        if (autobet.peorid == AutoBetPeorid.weekly) {
            var day = fromTime.getDay(),
                diff = fromTime.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
            fromTime = new Date(fromTime.setDate(diff));
        }
        const logs = await AutoBetLog
            // .find({ user: autobet.userId._id, createdAt: fromTime })
            .aggregate([
                { $match: { user: autobet.userId._id, createdAt: { $gte: fromTime } } },
                { $group: { _id: null, amount: { $sum: "$amount" } } }
            ]);
        let bettedamount = 0;
        if (logs && logs.length)
            bettedamount = logs[0].amount;
        return (
            autobet.userId._id.toString() != user._id.toString() &&     //Not same user
            autobet.status == AutoBetStatus.active &&                   //Check active status
            autobet.userId.balance >= InsufficientFunds + toBet &&      //Check Balance
            autobet.maxRisk >= toBet &&                                 //Check Max.Risk
            (bettedamount < (autobet.budget - toBet))                   //Check Budget
        );
    });

    if (autobetusers.length == 0) return;

    autobetusers.sort((a, b) => {
        return (a.priority > b.priority) ? -1 : 1;
    });

    const selectedauto = autobetusers[0];
    pick = pick == 'home' ? "away" : "home";

    // const americanOdds = odds[pick];
    // const decimalOdds = americanOdds > 0 ? (americanOdds / 100) : -(100 / americanOdds);
    // const calculateWin = (toBet * 1) * decimalOdds;
    // const roundToPennies = Number((calculateWin).toFixed(2));
    // const toWin = roundToPennies;

    const { type, altLineId, } = lineQuery;

    const { originSportId } = sportData;
    lineQuery.sportId = originSportId;

    const { teamA, teamB, startDate, line: { home, away, periodNumber, hdp, points } } = line;
    lineQuery.periodNumber = periodNumber;

    const pickWithOverUnder = type === 'total' ? (pick === 'home' ? 'over' : 'under') : pick;
    const lineOdds = line.line[pickWithOverUnder];
    const oddsA = type === 'total' ? line.line.over : line.line.home;
    const oddsB = type === 'total' ? line.line.under : line.line.away;
    const oddsDifference = Math.abs(Math.abs(oddsA) - Math.abs(oddsB)) / 2;
    const newLineOdds = lineOdds + oddsDifference;

    let pickName = '';
    switch (type) {
        case 'total':
            if (pick == 'home') {
                pickName = `Over ${points}`;
            } else {
                pickName = `Under ${points}`;
            }
            break;

        case 'spread':
            if (pick == 'home') {
                pickName = `${teamA} ${hdp > 0 ? '+' : ''}${hdp}`;
            } else {
                pickName = `${teamB} ${-1 * hdp > 0 ? '+' : ''}${-1 * hdp}`;
            }
            break;

        case 'moneyline':
            if (pick == 'home') {
                pickName = teamA;
            } else {
                pickName = teamB;
            }
            break;

        default:
            break;
    }

    const betAfterFee = toBet /* * 0.97 */;
    const toWin = calculateToWinFromBet(betAfterFee, newLineOdds);
    const fee = Number((toBet * BetFee).toFixed(2));
    const balanceChange = toBet * -1;
    const newBalance = selectedauto.userId.balance ? selectedauto.userId.balance + balanceChange : 0 + balanceChange;

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
    };
    if (altLineId) newBetObj.pinnacleAltLineId = altLineId;
    const newBet = new Bet(newBetObj);
    console.info(`created new auto bet`);

    try {
        const savedBet = await newBet.save();

        await AutoBetLog.create({
            user: selectedauto.userId._id,
            amount: betAfterFee
        });

        const msg = {
            from: `"${fromEmailName}" <${fromEmailAddress}>`,
            to: selectedauto.userId.email,
            subject: 'Your bet was accepted',
            text: `Your bet was accepted`,
            html: simpleresponsive(
                `Hi <b>${selectedauto.userId.firstname}</b>.
                    <br><br>
                    This email is to advise that your auto bet for ${lineQuery.sportName} ${lineQuery.type} for ${betAfterFee} was accepted on ${new Date()}
                    <br><br>`),
        };
        sgMail.send(msg);

        const betId = savedBet.id;
        // add betId to betPool
        const docChanges = {
            $push: pick === 'home' ? {
                homeBets: betId,
            } : {
                awayBets: betId,
            },
            $inc: {},
        };
        docChanges.$inc[`${pick === 'home' ? 'teamA' : 'teamB'}.betTotal`] = betAfterFee;
        docChanges.$inc[`${pick === 'home' ? 'teamA' : 'teamB'}.toWinTotal`] = toWin;
        await betpool.update(docChanges);

        await calculateBetsStatus(JSON.stringify(lineQuery));

        const betHistory = selectedauto.userId.betHistory ? [...selectedauto.userId.betHistory, betId] : [betId];
        const balance = Number(newBalance.toFixed(2));
        try {
            await FinancialLog.create({
                financialtype: 'bet',
                uniqid: `BP${ID()}`,
                user: selectedauto.userId._id,
                amount: toBet,
                method: 'bet',
                status: FinancialStatus.success,
            });
            await User.findByIdAndUpdate(selectedauto.userId._id, { betHistory, balance });
        } catch (err) {
            console.log('selectedauto.userId =>' + err);
        }
    }
    catch (e2) {
        if (e2) console.error('newBetError', e2);
    }
}

expressApp.get(
    '/betforward',
    async (req, res) => {
        if (req.user && req.user.username) {
            const { betId } = req.query;
            const bet = await Bet.findById(new ObjectId(betId));
            if (bet) {
                const { lineQuery, pick, pickName, payableToWin, bet: betAmount, toWin, pickOdds, oldOdds } = bet;
                const { sportName, leagueId, eventId, lineId, type, altLineId, sportId, periodNumber } = lineQuery;
                const unplayableBet = payableToWin < toWin
                    ? ((1 - (payableToWin / toWin)) * betAmount).toFixed(2) : null;
                const data = {
                    "oddsFormat": "AMERICAN", // HAVE
                    "uniqueRequestId": betId,
                    "acceptBetterLine": true, // TRUE
                    "stake": /* unplayableBet */ 1, // HAVE
                    "winRiskStake": "RISK", // "RISK"
                    "lineId": lineId, // HAVE
                    "altLineId": altLineId || null, // HAVE
                    "pitcher1MustStart": true, // ??? TRUE
                    "pitcher2MustStart": true, // ??? TRUE
                    "fillType": "NORMAL", // "NORMAL"
                    "sportId": sportId, // HAVE 
                    "eventId": eventId, // HAVE
                    "periodNumber": periodNumber || 0, // HAVE (NOW)
                    "betType": type, // HAVE
                    "team": pick === 'home' ? "TEAM1" : "TEAM2", // HAVE
                    "side": pick === 'over' ? "OVER" : "UNDER" // OMIT OR HAVE
                };
                try {
                    // await axios({
                    //   method: 'post',
                    //   url: `${config.pinnacleApiHost}/v2/bets/straight`,
                    //   data,
                    //   maxRedirects: 999,
                    //   headers: {
                    //     'User-Agent': 'PostmanRuntime/7.24.1',
                    //     'Authorization': 'Basic SkIxMDUyNzIyOkN1cnpvbjg4OA==',
                    //     'Accept': 'application/json',
                    //   },
                    // });
                    // TODO: remove original bet if unmatched or modify the bet and toWin amount
                    await calculateBetsStatus(JSON.stringify(lineQuery));
                } catch (e) {
                    console.log("betforward => ", e);
                    res.status(404).json({ error: 'There was a problem submitting this bet.' });
                }
            } else {
                res.status(404).json({ error: 'BetId not found.' });
            }
        } else {
            res.status(404).end();
        }
    },
);

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

expressApp.get(
    '/bets',
    async (req, res) => {
        if (req.user && req.user.username) {
            const { betHistory } = req.user;
            if (betHistory && betHistory.length > 0) {
                const { openBets, settledBets } = req.query;
                let bets;
                if (openBets) {
                    // TODO: query for bets with specific status
                    bets = await Bet.find({ _id: { $in: betHistory }, status: { $in: ['Pending', 'Partial Match', 'Matched'] } }).sort({ createdAt: -1 });
                } else if (settledBets) {
                    bets = await Bet.find({ _id: { $in: betHistory }, status: { $in: ['Settled - Win', 'Settled - Lose', 'Cancelled'] } }).sort({ createdAt: -1 });
                } else {
                    bets = await Bet.find({ _id: { $in: betHistory } }).sort({ createdAt: -1 });
                }
                res.json(bets);
            } else {
                res.json([]);
            }
        } else {
            res.status(404).end();
        }
    },
);

expressApp.get(
    '/bets-sportsbook',
    async (req, res) => {
        const { openBets, settledBets } = req.query;
        if (req.user && req.user.username) {
            let bets = [];
            if (settledBets)
                bets = await BetSportsBook.find({ userId: req.user._id, Name: 'SETTLED' }).sort({ createdAt: -1 });
            else
                bets = await BetSportsBook.find({ userId: req.user._id, Name: { $in: ['ACCEPTED', 'BETTED'] } }).sort({ createdAt: -1 });
            res.json(bets);
        } else {
            res.status(404).end();
        }
    },
);

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
            userObj = { username, userId: userId.toString(), roles, email, balance, phone, preference };
            if (settings && settings.site) {
                userObj.settings = settings.site;
            }
        }
        res.json(userObj);
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
        const { name } = req.query;
        const sportData = await Sport.findOne({ name: new RegExp(`^${name}$`, 'i') });
        if (sportData) {
            res.json(sportData);
        } else {
            res.json([]);
        }
    },
);

expressApp.get(
    '/sportsdir',
    async (req, res) => {
        const sportData = await SportsDir.find({});
        if (sportData) {
            let sports = [];
            for (const sport of sportData) {
                sports = [...sports, ...sport.sports];
            }
            res.json(sports);
        } else {
            res.status(404).end();
        }
    },
);


expressApp.get('/logout', (req, res) => {
    req.logout();
    res.send('logged out');
});

expressApp.get('/getPinnacleLogin',
    // bruteforce.prevent,
    isAuthenticated,
    async (req, res) => {
        const { sandboxUrl, agentCode, agentKey, secretKey } = config;
        let pinnacle = await Pinnacle.findOne({ user: new ObjectId(req.user._id) });
        const token = generateToken(agentCode, agentKey, secretKey);
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
            const { data } = await axios.post(`${sandboxUrl}/player/loginV2`, {
                loginId: pinnacle.loginId
            }, {
                headers: {
                    userCode: agentCode,
                    token
                }
            });

            loginInfo = data;
        } catch (error) {
            console.log("getPinnacleLogin1 => ", error);
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
            console.log("getPinnacleLogin2 => ", error);
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

expressApp.get('/pinnacleLogout',
    // bruteforce.prevent,
    isAuthenticated,
    async (req, res) => {
        try {
            const { sandboxUrl, agentCode, agentKey, secretKey } = config;
            let pinnacle = await Pinnacle.findOne({ user: new ObjectId(req.user._id) });
            const token = generateToken(agentCode, agentKey, secretKey);
            if (!pinnacle) {
                return res.status(400).json({
                    error: "Can't find pinnacle account."
                });
            }
            try {
                await axios.post(`${sandboxUrl}/player/logout?userCode=${pinnacle.userCode}`, {
                    userCode: agentCode,
                    token
                });

            } catch (error) {
                console.log(error);
                return res.status(400).json({
                    error: "Pinnacle logout failed."
                });
            }

            return res.json({ message: 'succes' });
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
            try {
                const { user } = req;
                try {
                    const uniqid = `D${ID()}`;
                    const signature = generatePremierRequestSignature(email, amount, user._id, uniqid);
                    const { data } = await axios.post(`${PremiumPay.paymenturl}/${PremiumPay.sid}`,
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
                    await PremierResponse.create(data);

                    const responsesignature = generatePremierResponseSignature(data.txid, data.status, data.descriptor, data.udf1, data.udf2);
                    if (responsesignature != data.signature) {
                        return res.status(400).json({ success: 0, message: "Failed to create etransfer. Signatuer mismatch" });
                    }
                    if (data.status == "APPROVED") {
                        const deposit = new FinancialLog({
                            financialtype: 'deposit',
                            uniqid,
                            user: user._id,
                            amount,
                            method,
                            status: "Pending"
                        });
                        await deposit.save();
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
        else if (method == "Bitcoin") {
            if (!amount || !email || !phone) {
                return res.status(400).json({ success: 0, message: "Deposit Amount, Email and Phone are required." });
            }
            const { user } = req;
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
                "type": "widget",
                "api_id": TripleA.testMode ? TripleA.test_api_id : TripleA.api_id,
                "crypto_currency": TripleA.testMode ? "testBTC" : "BTC",
                "order_currency": "CAD",
                "order_amount": amount,
                "notify_email": email,
                "notify_url": "https://api.payperwin.co/triplea/bitcoin-deposit",
                "notify_secret": TripleA.notify_secret,
                "payer_id": user._id,
                "payer_name": user.username,
                "payer_email": email,
                "webhook_data" : {
                    "payer_id": user._id,
                },
            };
            let hosted_url = null;
            try {
                const { data } = await axios.post(TripleA.paymenturl, body, {
                    headers: {
                        'Authorization': `Bearer ${access_token}`
                    }
                });
                hosted_url = data.hosted_url;
            } catch (error) {
                console.log(error);
                return res.status(500).json({ success: 0, message: "Can't get Hosted URL." });
            }
            if (!hosted_url) {
                return res.status(500).json({ success: 0, message: "Can't get Hosted URL." });
            }
            return res.json({ hosted_url });
        }
        else {
            return res.status(400).json({ success: 0, message: "Method is not suitable." });
        }
    }
);

expressApp.post(
    '/withdraw',
    bruteforce.prevent,
    isAuthenticated,
    async (req, res) => {
        const data = req.body;
        const { amount, method } = data;
        if (method == "eTransfer") {
            if (!amount) {
                return res.json({ success: 0, message: "Withdraw Amount is required." });
            }
            const { user } = req;
            if (!user.roles.verified) {
                return res.json({ success: 0, message: "You should verify your identify to make withdraw." });
            }

            try {
                const uniqid = `W${ID()}`;

                // const signature = generatePremierRequestSignature(user.email, amount, user._id, uniqid);
                // const amount2 = Number(amount).toFixed(2);
                // const { data } = await axios.post(`${PremiumPay.payouturl}/${PremiumPay.sid}`,
                //     {
                //         "payby": "etransfer",
                //         "amount": amount2,
                //         "first_name": user.firstname,
                //         "last_name": user.lastname,
                //         "email": user.email,
                //         "phone": user.phone,
                //         "address": "Artery roads",
                //         "city": "Edmonton",
                //         "state": "AB",
                //         "country": "CA",
                //         "zip_code": "T5A",
                //         "ip_address": "159.203.4.60",
                //         "notification_url": "https://api.payperwin.co/premier/etransfer-withdraw",
                //         "amount_shipping": 0.00,
                //         "udf1": user._id,
                //         "udf2": uniqid,
                //         "signature": signature
                //     }
                // );
                // await PremierResponse.create(data);

                // const responsesignature = generatePremierResponseSignature(data.txid, data.status, data.descriptor, data.udf1, data.udf2);
                // if (responsesignature != data.signature) {
                //     return res.status(400).json({ success: 0, message: "Failed to create etransfer. Signatuer mismatch" });
                // }
                // if (data.status == "APPROVED") {
                let totalsportsbookwagers = 0;
                let totalwinsportsbook = 0;
                const betSportsbookHistory = await BetSportsBook.find({ userId: user._id });
                for (const bet of betSportsbookHistory) {
                    totalsportsbookwagers += Number(bet.WagerInfo.ToRisk);
                    const profit = Number(bet.WagerInfo.ProfitAndLoss);
                    if (profit > 0) {
                        totalwinsportsbook += profit;
                    }
                }

                let totalwagers = await Bet.aggregate(
                    {
                        $match: {
                            userId: new ObjectId(user._id),
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
                if (totalwagers.length) totalwagers = totalwagers[0].total;
                else totalwagers = 0;

                totalwagers += totalsportsbookwagers;

                let totalwinbet = await Bet.aggregate(
                    {
                        $match: {
                            userId: new ObjectId(user._id),
                            status: "Settled - Win",
                            deletedAt: null,
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            total: {
                                $sum: "$credited"
                            }
                        }
                    }
                );
                if (totalwinbet.length) totalwinbet = totalwinbet[0].total;
                else totalwinbet = 0;

                totalwinbet += totalwinsportsbook;

                const maxwithdraw = Number((totalwagers / 3 + totalwinbet).toFixed(2));

                let totalwithdraw = await FinancialLog.aggregate(
                    {
                        $match: {
                            financialtype: "withdraw",
                            user: new ObjectId(user._id),
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
                if (totalwithdraw.length) totalwithdraw = totalwithdraw[0].total;
                else totalwithdraw = 0;

                if ((amount + totalwithdraw) > maxwithdraw) {
                    return res.json({ success: 0, message: "Your withdrawal request was declined. The reason we declined your withdrawal is you made a deposit and are now requesting a withdrawal without rolling (betting) your deposit by the minimum stated on our website. We require you to complete the three-time rollover requirement before you resubmit a new withdrawal request." });
                }

                const withdraw = new FinancialLog({
                    financialtype: 'withdraw',
                    uniqid,
                    user: user._id,
                    amount,
                    method,
                    status: "Pending"
                });
                await withdraw.save();
                return res.json({ success: 1, message: "Please wait until withdraw is finished." });
                // }
                // return res.status(400).json({ success: 0, message: "Failed to create etransfer." });
            } catch (error) {
                console.log("withdraw => ", error);
                return res.status(400).json({ success: 0, message: "Failed to create withdraw." });
            }
        }
        else {
            return res.status(400).json({ success: 0, message: "Method is not suitable." });
        }
    });

expressApp.post(
    '/transactions',
    // bruteforce.prevent,
    isAuthenticated,
    async (req, res) => {
        try {
            const { filter, daterange } = req.body;
            let searchObj = {
                user: req.user._id,
                status: FinancialStatus.success,
                deletedAt: null
            };
            if (daterange) {
                const { startDate, endDate } = daterange;
                searchObj = {
                    ...searchObj,
                    ...{
                        updatedAt: {
                            "$gte": new Date(startDate),
                            "$lte": new Date(endDate),
                        }
                    }
                }
            }
            const financials = await FinancialLog.find(searchObj);
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
                from: `"${fromEmailName}" <${fromEmailAddress}>`,
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
            await sgMail.send(msg);

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
        const { lang, oddsFormat, dateFormat, timezone } = req.body;
        const { _id } = req.user;
        try {
            let preference = await Preference.findOne({ user: _id });
            if (!preference) {
                preference = await Preference.create({ user: _id });
            }
            if (lang) {
                preference.lang = lang;
            }
            if (oddsFormat) {
                preference.oddsFormat = oddsFormat;
            }
            if (dateFormat) {
                preference.dateFormat = dateFormat;
            }
            if (timezone) {
                preference.timezone = timezone;
            }

            await preference.save();
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

// Admin
expressApp.use('/admin', adminRouter);
expressApp.use('/v1', v1Router)
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
require('dotenv').config();
const User = require('./models/user');
const LoginLog = require("./models/loginlog");
const express = require('express');
const apicache = require('apicache');
const cors = require('cors');
const mongoose = require('mongoose');
const compression = require('compression');
const seededRandomString = require('./libs/seededRandomString');
const getLineFromSportData = require('./libs/getLineFromSportData');
const Sport = require('./models/sport');
// const Admin = require('./models/admin');
const Bet = require('./models/bet');
const BetPool = require('./models/betpool');
const SportsDir = require('./models/sportsDir');
const Pinnacle = require('./models/pinnacle');
const ExpressBrute = require('express-brute');
const AutoBet = require("./models/autobet");
const AutoBetLog = require("./models/autobetlog");
const simpleresponsive = require('./emailtemplates/simpleresponsive');
const config = require('../config.json');
const adminRouter = require('./adminRoutes');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const sgMail = require('@sendgrid/mail');
const { ObjectId } = require('mongodb');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const fromEmailName = 'PAYPER Win';
const fromEmailAddress = 'donotreply@payperwin.co';
const axios = require('axios');
const { generateToken } = require('./generateToken');
const v1Router = require('./v1Routes');
const Promotion = require('./models/promotion');
const PromotionLog = require('./models/promotionlog');
const FinancialLog = require('./models/financiallog');
const { generatePremierResponseSignature, generatePremierRequestSignature } = require('./generateSignature');
const PremierResponse = require('./models/premier-response');
const premierRouter = require('./premierRoutes');
const InsufficientFunds = 8;
const BetFee = 0.03;
const PremiumPay = config.PremiumPay;
const FinancialStatus = config.FinancialStatus;
const io = require("./libs/socket");
const BetSportsBook = require('./models/betsportsbook');

const ID = function () {
    return '' + Math.random().toString(10).substr(2, 9);
};

let port = config.serverPort;
// let sslPort = 443;
if (process.env.NODE_ENV === 'development') {
    sslPort = null;
    // port = port;
}

// Brute Force Mitigation Middleware
const store = new ExpressBrute.MemoryStore(); // TODO: stores state locally, don't use this in production
const bruteforce = new ExpressBrute(store);

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
        return next();
    }
    res.status(403).send('Authentication Required.');
}

passport.use(new LocalStrategy((username, password, done) => {
    User.findOne({ username: new RegExp(`^${username}$`, 'i') }, async (err, user) => {
        if (err) { console.error(err); return done(err); }
        if (!user) {
            if (process.env.NODE_ENV === 'development') {
                console.log('incorrect username', username);
            }
            return done(null, false, { message: 'Incorrect username.' });
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
}));


function sendVerificationEmail(email, req) {
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
                Just a quick reminder that you currently have funds in your Payper Win account. You can find out how much is in
                your Payper Win account by logging in now.
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
        // usernameField: 'username',
        // passwordField: 'password',
        passReqToCallback: true, // allows us to pass back the entire request to the callback
    },
    async (req, username, password, done) => {
        const { email, firstname, lastname,
            country, currency, title, dateofbirth, region,
            address, address2, city, postalcode, phone,
            securityquiz, securityans, vipcode, } = req.body;
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(() => {
            // find a user whose username is the same as the forms username
            // we are checking to see if the user trying to login already exists
            User.findOne({
                $or: [
                    { username: new RegExp(`^${username}$`, 'i') },
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
                    address, address2, city, postalcode, phone,
                    securityquiz, securityans, vipcode,
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
expressApp.use(cookieParser(sessionSecret));
expressApp.use(cookieSession({ name: 'session-a', /* domain: 'jujubug.us', */ keys: [sessionSecret], maxAge: 90 * 24 * 60 * 60 * 1000 }));

expressApp.use(function (req, res, next) {
    const { hostname, subdomains } = req;
    if (hostname) {
        const mainHostname = hostname.replace(subdomains.map(sd => `${sd}.`), '');
        req.sessionOptions.domain = mainHostname || req.sessionOptions.domain;
    }
    next();
})
// expressApp.use(session({ secret: 'change this', resave: false, saveUninitialized: false, cookie: { maxAge: 24 * 60 * 60 * 1000 } }));
expressApp.use(bodyParser.urlencoded({ extended: false }));
expressApp.use(bodyParser.json());

expressApp.use(passport.initialize());
expressApp.use(passport.session());
// expressApp.use(flash());

expressApp.post(
    '/register',
    bruteforce.prevent,
    async (req, res, next) => {
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
                    let log = new LoginLog({
                        user: user._id,
                        ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress
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
    passport.authenticate('local', (err, user/* , info */) => {
        if (err) { return next(err); }
        if (!user) { return res.status(403).json({ error: 'Incorrect username or password' }); }
        req.logIn(user, (err2) => {
            if (err) { return next(err2); }
            let log = new LoginLog({
                user: user._id,
                ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress
            });
            log.save(function (error) {
                if (error) console.log("login", error);
                else console.log(`User login log - ${user.username}`);
            });

            return res.send(user.username);
        });
    })(req, res, next);
});

expressApp.get('/logout', (req, res) => {
    req.logout();
    res.send('logged out');
});


expressApp.get('/usernameTaken', (req, res) => {
    const { username } = req.query;
    User.findOne(
        { username: new RegExp(`^${username}$`, 'i') },
        (err, user) => {
            if (err) {
                throw Error(err);
            }
            if (user && user.username === username) {
                res.json({ usernameTaken: true });
            } else {
                res.json({ usernameTaken: false });
            }
        },
    );
});

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

expressApp.post('/sendVerificationEmail', bruteforce.prevent, isAuthenticated, async (req, res) => {
    const {
        email: newEmail,
    } = req.body;
    User.findOne(
        { username: req.user.username },
        async (err, user) => {
            if (err) {
                res.send(err);
            }

            if (user) {
                const emailChanged = newEmail !== req.user.email;
                if (emailChanged) {
                    user.email = newEmail;
                    const rolesCopy = { ...user.roles };
                    delete rolesCopy.emailVerified;
                    user.roles = { ...rolesCopy };
                    await user.save((err2) => {
                        if (err2) {
                            console.error(err2);
                        }
                    });
                }
                const { email } = user;
                sendVerificationEmail(email, req);
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

expressApp.get('/recoverUsername', bruteforce.prevent, async (req, res) => {
    const { hostname, protocol, headers, subdomains } = req;
    const mainHostname = hostname.replace(subdomains.map(sd => `${sd}.`), '');
    const { email } = req.query;
    User.findOne(
        { email: new RegExp(`^${email}$`, 'i') },
        (err, user) => {
            if (err) {
                res.send(err);
            }
            if (user) {
                // if (process.env.NODE_ENV === 'development') {
                //   console.log(`Your username is ${user.username}`);
                // } else {
                const msg = {
                    from: `"${fromEmailName}" <${fromEmailAddress}>`,
                    to: email, // An array if you have multiple recipients.
                    subject: 'Username Recovery',
                    text: `You requested username recovery. Your username: ${user.username}`,
                    html: simpleresponsive(`
                        You requested username recovery. Your username: <b>${user.username}</b>
                    `),
                };
                sgMail.send(msg);
                // }
                res.json("Please check your email for your Payper Win username");
            } else {
                res.status(403).json({ error: 'User with that email not found.' });
            }
        },
    );
});

// Helps keep the domain consistent when having multiple domains point to same app
const serverHostToClientHost = config.serverHostToClientHost;

expressApp.get('/sendPasswordRecovery', bruteforce.prevent, async (req, res) => {
    const { hostname, protocol, headers, subdomains } = req;
    const mainHostname = hostname.replace(subdomains.map(sd => `${sd}.`), '');
    const { username, email } = req.query;
    User.findOne(
        {
            username: new RegExp(`^${username}$`, 'i'),
            email: new RegExp(`^${email}$`, 'i'),
        },
        async (err, user) => {
            if (err) {
                res.send(err);
            }

            if (user) {
                const changePasswordHash = seededRandomString(user.password, 20);
                const passwordRecoveryPath = `${protocol}://${serverHostToClientHost[req.headers.host]}/newPasswordFromToken?username=${user.username}&h=${changePasswordHash}`;
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
                        If you can't see mail in inbox, please checm spam folder.`);
                } catch (error) {
                    console.log("email Send error", error);
                    res.send(`Can't send passwordrecovery mail`);
                }
                // }
            } else {
                res.status(403).json({ error: 'User with that username and email not found.' });
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

expressApp.post('/usernameChange', bruteforce.prevent, async (req, res) => {
    const { username } = req.body;
    User.findOne(
        { username: req.user.username },
        (err, user) => {
            if (err) {
                console.log('usernameChange => ', err);
                res.send(err);
            }

            if (user) {
                if (false) { // TODO: decide wether to allow username change
                    user.username = username;
                    user.save((err2) => {
                        if (err2) {
                            console.error('err2', err2);
                        }
                        res.send('Successfully changed username!');
                    });
                } else {
                    res.status(403).json({ error: 'You are not authorized to change username.' });
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
                                if (draw) {
                                    errors.push(`${pickName} ${odds[pick]} wager could not be placed. Invalid Bet Type.`);
                                } else {
                                    const pickWithOverUnder = type === 'total' ? (pick === 'home' ? 'over' : 'under') : pick;
                                    const lineOdds = line.line[pickWithOverUnder];
                                    const oddsA = type === 'total' ? line.line.over : line.line.home;
                                    const oddsB = type === 'total' ? line.line.under : line.line.away;
                                    const oddsDifference = Math.abs(Math.abs(oddsA) - Math.abs(oddsB)) / 2;
                                    const newLineOdds = lineOdds + oddsDifference;
                                    // console.log(odds[pick], newLineOdds);
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
    async (req, res) => {
        let userObj = false;
        if (req.isAuthenticated()) {
            const { username, _id: userId, settings, roles, email, balance, phone } = req.user;
            userObj = { username, userId: userId.toString(), roles, email, balance, phone };
            if (settings && settings.site) {
                userObj.settings = settings.site;
            }
        }
        res.json(userObj);
    },
);

expressApp.get(
    '/profile',
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
        const { name } = req.query;
        const sportData = await SportsDir.findOne({});
        if (sportData) {
            res.json(sportData.sports);
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
    });

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

expressApp.post('/deposit', bruteforce.prevent, isAuthenticated, async (req, res) => {
    const data = req.body;
    const { amount, email, phone, method } = data;
    if (method == "eTransfer") {
        if (!amount || !email || !phone) {
            return res.status(400).json({ success: 0, message: "Deposit Amount, Email and Phone is required." });
        }
        try {
            const { user } = req;
            try {
                const uniqid = `D${ID()}`;
                const signature = generatePremierRequestSignature(email, amount, user._id, uniqid);
                const { data } = await axios.post(`${PremiumPay.url}/${PremiumPay.sid}`,
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
                        "notification_url": "https://api.payperwin.co/premier/result",
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
                        uniqid: `D${ID()}`,
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

// Admin
expressApp.use('/admin', adminRouter);
expressApp.use('/v1', v1Router)
expressApp.use('/premier', premierRouter);

if (process.env.NODE_ENV === 'development') {
    expressApp.get(
        '/testemail',
        async (req, res) => {
            const { email } = req.query;
            // if (email) {
            const msg = {
                to: email || 'toonamiafter@gmail.com', // default test email address
                from: '"PAYPER Win" <donotreply@payperwin.co>',
                subject: 'Test Email',
                text: 'This is a test email for PAYPER Win http://dev.payperwin.ca',
                html: simpleresponsive('This is a test email for', { href: 'http://dev.payperwin.ca', name: 'PAYPER Win' }),
            };
            await sgMail.send(msg);
            res.end();
            // }
        },
    );
}

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
const mongoose = require('mongoose');
const User = require('./user');
const Preference = require('./preference');
const ErrorLog = require('./errorlog');
const fromEmailName = 'PAYPER WIN';
const fromEmailAddress = 'donotreply@payperwin.com';
const simpleresponsive = require('../emailtemplates/simpleresponsive');
const sendSMS = require("../libs/sendSMS");

const { Schema } = mongoose;

const BetSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        lineQuery: Object,
        teamA: {
            name: String,
            odds: String,
        },
        teamB: {
            name: String,
            odds: String,
        },
        teamDraw: {
            name: String,
            odds: String,
        },
        teamNonDraw: {
            name: String,
            odds: String,
        },
        pick: String,
        pickName: String,
        pickOdds: String,
        oldOdds: String,
        bet: Number,
        toWin: Number,
        fee: Number,
        matchStartDate: Date,
        result: String, // team name that won
        credited: Number, // amount won or lost
        status: { type: String, default: null }, // undefined, Settled, Cancelled
        matchingStatus: String, // Matched, Partial, Waiting
        homeScore: Number,
        awayScore: Number,
        payableToWin: Number, // how much has been matched with opposing bets
        transactionID: { type: String, unique: true },
        origin: { type: String, default: 'bet365' },
        notifySent: Date,
        sportsbook: { type: Boolean, default: false },
        isParlay: { type: Boolean, default: false },
        parlayQuery: { type: Array, default: null },
        scoreMismatch: { type: Object, default: null },
        event: { type: Schema.Types.ObjectId, ref: "Event", default: null },
    },
    {
        timestamps: true,
    },
);

BetSchema.pre('save', async function (next) { // eslint-disable-line func-names
    const bet = this;
    if (bet.isModified('matchingStatus')) {
        try {
            const user = await User.findById(bet.userId);
            if (!user) return;
            const preference = await Preference.findOne({ user: bet.userId });
            if (bet.matchingStatus == 'Matched') {
                const { pickOdds, lineQuery, bet: betAmount, payableToWin } = bet;
                if (!preference || !preference.notification_settings || preference.notification_settings.wager_matched.email) {
                    let msg = null;
                    if (bet.origin == 'custom') {
                        msg = {
                            from: `${fromEmailName} <${fromEmailAddress}>`,
                            to: user.email,
                            subject: 'Bet Matched!',
                            text: `Bet Matched!`,
                            html: simpleresponsive(
                                `Hi <b>${user.email}</b>.
                                <br><br>
                                Good news! We found you a match for ${lineQuery.eventName}
                                <br><br>
                                <ul>
                                    <li>Wager: $${betAmount.toFixed(2)}</li>
                                    <li>Odds: ${Number(pickOdds) > 0 ? ('+' + pickOdds) : pickOdds}</li>
                                    <li>Matched Amount: $${payableToWin.toFixed(2)}</li>
                                    <li>Platform: PAYPER WIN Peer-to Peer</li>
                                </ul>
                                Good luck!
                            `),
                        };
                    } else {
                        msg = {
                            from: `${fromEmailName} <${fromEmailAddress}>`,
                            to: user.email,
                            subject: 'Bet Matched!',
                            text: `Bet Matched!`,
                            html: simpleresponsive(
                                `Hi <b>${user.email}</b>.
                                <br><br>
                                Good news! We found you a match for ${lineQuery.sportName} ${lineQuery.type}
                                <br><br>
                                <ul>
                                    <li>Wager: $${betAmount.toFixed(2)}</li>
                                    <li>Odds: ${Number(pickOdds) > 0 ? ('+' + pickOdds) : pickOdds}</li>
                                    <li>Matched Amount: $${payableToWin.toFixed(2)}</li>
                                    <li>Platform: PAYPER WIN Peer-to Peer</li>
                                </ul>
                                Good luck!
                                `),
                        };
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
                if (user.roles.phone_verified && (!preference || !preference.notification_settings || preference.notification_settings.wager_matched.sms)) {
                    if (bet.origin == 'custom') {
                        sendSMS(`Good news! We found you a match for ${lineQuery.eventName}\n
                            Wager: $${betAmount.toFixed(2)}\n 
                            Odds: ${Number(pickOdds) > 0 ? ('+' + pickOdds) : pickOdds}\n 
                            Matched Amount: $${payableToWin.toFixed(2)}\n
                            Platform: PAYPER WIN Peer-to Peer`, user.phone);
                    } else {
                        sendSMS(`Good news! We found you a match for ${lineQuery.sportName} ${lineQuery.type}\n
                            Wager: $${betAmount.toFixed(2)}\n 
                            Odds: ${Number(pickOdds) > 0 ? ('+' + pickOdds) : pickOdds}\n 
                            Matched Amount: $${payableToWin.toFixed(2)}\n
                            Platform: PAYPER WIN Peer-to Peer`, user.phone);
                    }
                }
            }
            if (bet.matchingStatus == 'Accepted') {
                const { pickOdds, lineQuery, bet: betAmount, payableToWin } = bet;
                if (!preference || !preference.notification_settings || preference.notification_settings.wager_matched.email) {
                    let msg = null;
                    msg = {
                        from: `${fromEmailName} <${fromEmailAddress}>`,
                        to: user.email,
                        subject: 'Bet Accepted!',
                        text: `Bet Accepted!`,
                        html: simpleresponsive(
                            `Hi <b>${user.email}</b>.
                                <br><br>
                                Good news! Your bet on ${lineQuery.sportName} ${lineQuery.type} was accepted to PAYPER WIN HIGH STAKER
                                <br><br>
                                <ul>
                                    <li>Wager: $${betAmount.toFixed(2)}</li>
                                    <li>Odds: ${Number(pickOdds) > 0 ? ('+' + pickOdds) : pickOdds}</li>
                                    <li>Accepted Amount: $${payableToWin.toFixed(2)}</li>
                                    <li>Platform: PAYPER WIN HIGH STAKER</li>
                                </ul>
                                Good luck!
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
                if (user.roles.phone_verified && (!preference || !preference.notification_settings || preference.notification_settings.wager_matched.sms)) {
                    sendSMS(`Good news! Your bet on ${lineQuery.sportName} ${lineQuery.type} was accepted to PAYPER WIN HIGH STAKER\n
                            Wager: $${betAmount.toFixed(2)}\n 
                            Odds: ${Number(pickOdds) > 0 ? ('+' + pickOdds) : pickOdds}\n 
                            Matched Amount: $${payableToWin.toFixed(2)}\n
                            Platform: PAYPER WIN Peer-to Peer`, user.phone);
                }
            }
        } catch (error) {
            console.error(error)
        }
    }
    next();
});

const Bet = mongoose.model('Bet', BetSchema);

module.exports = Bet;

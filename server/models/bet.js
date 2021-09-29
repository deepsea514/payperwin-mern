const mongoose = require('mongoose');
const User = require('./user');
const Preference = require('./preference');
const ErrorLog = require('./errorlog');
const fromEmailName = 'PAYPER WIN';
const fromEmailAddress = 'donotreply@payperwin.co';
const simpleresponsive = require('../emailtemplates/simpleresponsive');
const { convertTimeLineDate } = require('../libs/timehelper');
const sendSMS = require("../libs/sendSMS");

const { Schema } = mongoose;

const BetSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        lineQuery: Object,
        lineId: String,
        teamA: {
            name: String,
            odds: String,
        },
        teamB: {
            name: String,
            odds: String,
        },
        sportName: String,
        pick: String,
        pickName: String,
        pickOdds: String,
        oldOdds: String,
        bet: Number,
        toWin: Number,
        fee: Number,
        matchStartDate: Date,
        // lineType: String, // REDUNDANT
        // index: Number, // REDUNDANT
        result: String, // team name that won
        credited: Number, // amount won or lost
        walletBeforeCredited: Number, // to show user how it changed their wallet
        status: String, // undefined, Settled, Cancelled
        matchingStatus: String, // Matched, Partial, Waiting
        homeScore: Number,
        awayScore: Number,
        payableToWin: Number, // how much has been matched with opposing bets
        // betStartDate: Date,
        // betEndDate: Date,
        transactionID: { type: String, unique: true },
        origin: { type: String, default: 'bet365' },
        notifySent: Date,
        sportsbook: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    },
);

BetSchema.pre('save', async function (next) { // eslint-disable-line func-names
    const bet = this;
    if (bet.isModified('matchingStatus') && bet.matchingStatus == 'Matched') {
        try {
            const user = await User.findById(bet.userId);
            if (!user) return;
            const preference = await Preference.findOne({ user: bet.userId });
            let timezone = "00:00";
            if (preference && preference.timezone) {
                timezone = preference.timezone;
            }
            const { pickOdds, lineQuery, bet: betAmount, payableToWin } = bet;
            if (!preference || !preference.notification_settings || preference.notification_settings.wager_matched.email) {
                let msg = null;
                if (bet.origin == 'other') {
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
                                <li>Platform: PAYPERWIN Peer-to Peer</li>
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
                                <li>Platform: PAYPERWIN Peer-to Peer</li>
                            </ul>
                            Good luck!
                            `),
                    };
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
            if (user.roles.phone_verified && (!preference || !preference.notification_settings || preference.notification_settings.wager_matched.sms)) {
                if (bet.origin == 'other') {
                    sendSMS(`Good news! We found you a match for ${lineQuery.eventName}\n
                        Wager: $${betAmount.toFixed(2)}\n 
                        Odds: ${Number(pickOdds) > 0 ? ('+' + pickOdds) : pickOdds}\n 
                        Matched Amount: $${payableToWin.toFixed(2)}\n
                        Platform: PAYPERWIN Peer-to Peer`, user.phone);
                } else {
                    sendSMS(`Good news! We found you a match for ${lineQuery.sportName} ${lineQuery.type}\n
                        Wager: $${betAmount.toFixed(2)}\n 
                        Odds: ${Number(pickOdds) > 0 ? ('+' + pickOdds) : pickOdds}\n 
                        Matched Amount: $${payableToWin.toFixed(2)}\n
                        Platform: PAYPERWIN Peer-to Peer`, user.phone);
                }
            }

        } catch (error) {
            console.log(error)
        }
    }
    next();
});

const Bet = mongoose.model('Bet', BetSchema);

module.exports = Bet;

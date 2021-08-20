const mongoose = require('mongoose');
const User = require('./user');
const Preference = require('./preference');
const fromEmailName = 'PAYPER WIN';
const fromEmailAddress = 'donotreply@payperwin.co';
const simpleresponsive = require('../emailtemplates/simpleresponsive');
const { convertTimeLineDate } = require('../libs/timehelper');

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
        origin: String,
        notifySent: Date,
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
            const timeString = convertTimeLineDate(new Date(), timezone);
            const { pickOdds, lineQuery, bet: betAmount } = bet;

            if (!preference || !preference.notification_settings || preference.notification_settings.wager_matched.email) {
                let msg = null;
                if (bet.origin == 'other') {
                    msg = {
                        from: `${fromEmailName} <${fromEmailAddress}>`,
                        to: user.email,
                        subject: 'Your bet was matched',
                        text: `Your bet was matched`,
                        html: simpleresponsive(
                            `Hi <b>${user.email}</b>.
                            <br><br>
                            This email is to advise that your bet for ${lineQuery.eventName} for $${betAmount.toFixed(2)} was matched on ${timeString}
                            <br><br>
                            <ul>
                                <li>Wager: $${betAmount.toFixed(2)}</li>
                                <li>Odds: ${Number(pickOdds) > 0 ? ('+' + pickOdds) : pickOdds}</li>
                                <li>Platform: PAYPERWIN Peer-to Peer</li>
                            </ul>
                        `),
                    };
                } else {
                    msg = {
                        from: `${fromEmailName} <${fromEmailAddress}>`,
                        to: user.email,
                        subject: 'Your bet was matched',
                        text: `Your bet was matched`,
                        html: simpleresponsive(
                            `Hi <b>${user.email}</b>.
                            <br><br>
                            This email is to advise that your bet for ${lineQuery.sportName} ${lineQuery.type} for $${betAmount.toFixed(2)} was matched on ${timeString}
                            <br><br>
                            <ul>
                                <li>Wager: $${betAmount.toFixed(2)}</li>
                                <li>Odds: ${Number(pickOdds) > 0 ? ('+' + pickOdds) : pickOdds}</li>
                                <li>Platform: PAYPERWIN Peer-to Peer</li>
                            </ul>
                            `),
                    };
                }
                sgMail.send(msg);
            }
            if (user.roles.phone_verified && (!preference || !preference.notification_settings || preference.notification_settings.wager_matched.sms)) {
                if (bet.origin == 'other') {
                    sendSMS(`This is to advise that your bet for ${lineQuery.eventName} for $${betAmount.toFixed(2)} was matched on ${timeString}\n
                    Wager: $${betAmount.toFixed(2)}\n 
                    Odds: ${Number(pickOdds) > 0 ? ('+' + pickOdds) : pickOdds}\n 
                    Platform: PAYPERWIN Peer-to Peer`, user.phone);
                } else {
                    sendSMS(`This is to advise that your bet for ${lineQuery.sportName} ${lineQuery.type} for $${betAmount.toFixed(2)} was matched on ${timeString}\n
                    Wager: $${betAmount.toFixed(2)}\n 
                    Odds: ${Number(pickOdds) > 0 ? ('+' + pickOdds) : pickOdds}\n 
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

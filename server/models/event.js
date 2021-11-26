const mongoose = require('mongoose');
const Preference = require('./preference');
const User = require('./user');
const { convertTimeLineDate } = require('../libs/timehelper');
const EventBetPool = require('./eventbetpool');
const FinancialLog = require('./financiallog');
const ErrorLog = require('./errorlog');
const Bet = require('./bet');
const simpleresponsive = require('../emailtemplates/simpleresponsive');
const sendSMS = require("../libs/sendSMS");
const {
    ID,
    calculateToWinFromBet,
    calculateCustomBetsStatus,
} = require('../libs/functions');
const sgMail = require('@sendgrid/mail');
const config = require('../../config.json');
const fromEmailName = 'PAYPER WIN';
const fromEmailAddress = 'donotreply@payperwin.com';
const adminEmailAddress = 'hello@payperwin.com';
const supportEmailAddress = 'support@payperwin.com';
const FinancialStatus = config.FinancialStatus;
const { Schema } = mongoose;

const EventSchema = new Schema(
    {
        name: { type: String, unique: true, required: true },
        teamA: Object, // { name: String, odds: Array, currentOdds: Number }
        teamB: Object, // { name: String, odds: Array, currentOdds: Number }
        teamAScore: Number,
        teamBScore: Number,
        startDate: { type: Date, required: true },
        approved: { type: Boolean, default: true },
        public: { type: Boolean, default: true },
        status: { type: Number, default: 0 },
        creator: { type: String, default: 'Admin' },
        user: { type: Schema.Types.ObjectId, ref: 'User', default: null },
        initialWager: { type: Object, default: null },
    },
    {
        timestamps: true,
    },
);


EventSchema.pre('save', async function (next) { // eslint-disable-line func-names
    const event = this;
    const BetFee = 0.05;
    // check if approved.
    if (event.isModified('approved') && event.approved && event.creator == 'User' && event.user) {
        const { name, teamA, teamB, startDate, initialWager: { wagerAmount, favorite } } = event;
        const betAfterFee = Number(wagerAmount);
        const user = await User.findById(event.user);
        if (!user)
            return next();

        const preference = await Preference.findOne({ user: user._id });
        let timezone = "00:00";
        if (preference && preference.timezone) {
            timezone = preference.timezone;
        }
        const timeString = convertTimeLineDate(new Date(), timezone);
        // Approve notification
        const betLink = `https://www.payperwin.com/others/${event._id}`;
        if (!preference || !preference.notification_settings || preference.notification_settings.bet_accepted.email) {
            const msg = {
                from: `${fromEmailName} <${fromEmailAddress}>`,
                to: user.email,
                subject: 'Your custom bet is approved',
                text: `Your custom bet is approved`,
                html: simpleresponsive(
                    `Hi <b>${user.email}</b>.
                        <br><br>
                        Your custom bet for ${name} has been approved. You can invite your pals to bet with or against you by sharing this link ${betLink}.
                        <br><br>
                        Good luck!
                    `,
                    { href: betLink, name: 'View Custom Bet' }
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
        }

        // Place initial Bet
        const fee = Number((betAfterFee * BetFee).toFixed(2));
        const balanceChange = wagerAmount * -1;
        const newBalance = user.balance ? user.balance + balanceChange : 0 + balanceChange;
        const pick = favorite == 'teamA' ? 'home' : 'away';
        const pickOdds = favorite == 'teamA' ? teamA.currentOdds : teamB.currentOdds;
        const toWin = calculateToWinFromBet(betAfterFee, pickOdds);
        if (newBalance >= 0) {
            // insert bet doc to bets table
            const newBetObj = {
                userId: user._id,
                transactionID: `B${ID()}`,
                teamA: { name: teamA.name, odds: teamA.currentOdds },
                teamB: { name: teamB.name, odds: teamB.currentOdds },
                pick: pick,
                pickOdds: pickOdds,
                oldOdds: null,
                pickName: favorite == 'teamA' ? teamA.name : teamB.name,
                bet: betAfterFee,
                toWin: toWin,
                fee: fee,
                matchStartDate: startDate,
                status: 'Pending',
                lineQuery: {
                    lineId: event._id,
                    eventName: name,
                    sportName: 'other',
                },
                lineId: event._id,
                origin: 'other'
            };
            const newBet = new Bet(newBetObj);
            console.info(`created new bet`);
            const savedBet = await newBet.save();

            //TODO: Uncomment this code in when bet_accepted status email and sms need 
           /*  if (!preference || !preference.notification_settings || preference.notification_settings.bet_accepted.email) {
                const msg = {
                    from: `${fromEmailName} <${fromEmailAddress}>`,
                    to: user.email,
                    subject: 'Your bet is waiting for a match',
                    text: `Your bet is waiting for a match`,
                    html: simpleresponsive(
                        `Hi <b>${user.email}</b>.
                            <br><br>
                            This email is to advise you that your bet for ${name} moneyline on ${timeString} for $${betAfterFee.toFixed(2)} is waiting for a match. We will notify when we find you a match. An unmatched wager will be refunded upon the start of the game. 
                            <br><br>
                            <ul>
                                <li>Wager: $${betAfterFee.toFixed(2)}</li>
                                <li>Odds: ${pickOdds > 0 ? ('+' + pickOdds) : pickOdds}</li>
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
                sendSMS(`This is to advise you that your bet for ${name} moneyline on ${timeString} for $${betAfterFee.toFixed(2)} is waiting for a match. We will notify when we find you a match. An unmatched wager will be refunded upon the start of the game. 
                Wager: $${betAfterFee.toFixed(2)}
                Odds: ${pickOdds > 0 ? ('+' + pickOdds) : pickOdds}
                Platform: PAYPER WIN Peer-to Peer`, user.phone);
            }

            */
            const matchTimeString = convertTimeLineDate(new Date(startDate), timezone);
            let adminMsg = {
                from: `${fromEmailName} <${fromEmailAddress}>`,
                to: adminEmailAddress,
                subject: 'New Bet',
                text: `New Bet`,
                html: simpleresponsive(
                    `<ul>
                        <li>Customer: ${user.email} (${user.firstname} ${user.lastname})</li>
                        <li>Event: ${name}</li>
                        <li>Bet: Moneyline</li>
                        <li>Wager: $${betAfterFee.toFixed(2)}</li>
                        <li>Odds: ${pickOdds > 0 ? ('+' + pickOdds) : pickOdds}</li>
                        <li>Pick: ${favorite == 'teamA' ? teamA.name : teamB.name}</li>
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
            const exists = await EventBetPool.findOne({ eventId: event._id });
            if (exists) {
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
                const newBetPool = new EventBetPool(
                    {
                        eventId: event._id,
                        teamA: newTeamA,
                        teamB: newTeamB,
                        homeBets: homeBets,
                        awayBets: awayBets,
                        matchStartDate: startDate,
                        lineType: 'moneyline',
                    }
                );

                try {
                    await newBetPool.save();
                } catch (err) {
                    console.error('can\'t save newBetPool => ' + err);
                }
            }

            await calculateCustomBetsStatus(event._id);

            user.balance = newBalance;
            await FinancialLog.create({
                financialtype: 'bet',
                uniqid: `BP${ID()}`,
                user: user._id,
                amount: betAfterFee,
                method: 'bet',
                status: FinancialStatus.success,
            });
            await user.save();
        }
    }
    next();
});

const Event = mongoose.model('Event', EventSchema);

module.exports = Event;

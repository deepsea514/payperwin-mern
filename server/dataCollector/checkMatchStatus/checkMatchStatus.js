//Models
const Addon = require("../../models/addon");
const Preference = require('../../models/preference');
const Bet = require('../../models/bet');
const User = require('../../models/user');
const FinancialLog = require('../../models/financiallog');
const BetSportsBook = require('../../models/betsportsbook');
const SharedLine = require('../../models/sharedline');
const BetPool = require('../../models/betpool');
//local helpers
const config = require('../../../config.json');
const simpleresponsive = require('../../emailtemplates/simpleresponsive');
const { convertTimeLineDate } = require('../../libs/timehelper');
const sendSMS = require("../../libs/sendSMS");
const fromEmailName = 'PAYPER WIN';
const fromEmailAddress = 'donotreply@payperwin.co';
const FinancialStatus = config.FinancialStatus;
//external libraries
const mongoose = require('mongoose');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const ID = function () {
    return '' + Math.random().toString(10).substr(2, 9);
};

Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}

// Database
mongoose.Promise = global.Promise;
// const databaseName = 'PayPerWinDev';
const databaseName = process.env.NODE_ENV === 'development' ? 'PayPerWinDev' : 'PayPerWin';
mongoose.connect(`mongodb://${config.mongo.host}/${databaseName}`, {
    authSource: "admin",
    user: config.mongo.username,
    pass: config.mongo.password,
    useMongoClient: true,
}).then(async () => {
    console.info('Using database:', databaseName);

    const lineInterval1 = 1000 * 60 * 60;
    checkTimerOne();
    setInterval(checkTimerOne, lineInterval1);

    const lineInterval2 = 3000 * 60 * 60;
    checkTimerTwo();
    setInterval(checkTimerTwo, lineInterval2);

    const sendGridAddon = await Addon.findOne({ name: 'sendgrid' });
    if (!sendGridAddon || !sendGridAddon.value || !sendGridAddon.value.sendgridApiKey) {
        console.warn('Send Grid Key is not set');
        return;
    }
    sgMail.setApiKey(sendGridAddon.value.sendgridApiKey);
});

async function checkTimerOne() {
    //////////////////// Check match status
    checkMatchStatus();

    ////////////////// Delete Shared Lines
    await SharedLine.deleteMany({
        eventDate: {
            $lte: new Date()
        }
    });

    ////////////////// Cashback in the last day of the month.
    checkCashBack();
}

async function checkTimerTwo() {
    // Check Betpool status
    calculateBetsStatus();

    // Check bet without betpool
    checkBetWithoutBetpool();
}

async function checkMatchStatus() {
    // Check Match Status
    const bets = await Bet.find(
        {
            matchStartDate: { $lt: new Date().addHours(5) },
            notifySent: { $exists: false },
            matchingStatus: ['Pending', 'Partial Match']
        }
    );
    console.log(`${bets.length} of Unmatched bets.`);
    for (const bet of bets) {
        await bet.update({ notifySent: new Date() });
        const user = await User.findById(bet.userId);
        let eventName = '';
        if (bet.origin == 'other') {
            eventName = bet.lineQuery.eventName;
        } else {
            eventName = `${bet.teamA.name} vs ${bet.teamB.name} (${bet.lineQuery.sportName})`;
        }

        const preference = await Preference.findOne({ user: user._id });
        let timezone = "00:00";
        if (preference && preference.timezone) {
            timezone = preference.timezone;
        }
        const timeString = convertTimeLineDate(new Date(bet.matchStartDate), timezone);

        if (!preference || !preference.notification_settings || preference.notification_settings.no_match_found.email) {
            const msg = {
                from: `${fromEmailName} <${fromEmailAddress}>`,
                to: user.email,
                subject: 'We couldn’t find you a match for your bet',
                text: `We couldn’t find you a match for your bet`,
                html: simpleresponsive(
                    `Hi <b>${user.email}</b>.
                    <br><br>
                    Unfortunately we are still unable to match your bet with another player for <b>${eventName}</b> on ${timeString}. 
                    <br><br>
                    You can forward your bet to our sportsbook for an instant bet.
                `, { href: "https://www.payperwin.co/bets", name: 'View Open Bets' }),
            };
            sgMail.send(msg).catch(error => {
                console.log('Can\'t send mail');
            });
        }
        if (user.roles.phone_verified && (!preference || !preference.notification_settings || preference.notification_settings.no_match_found.sms)) {
            sendSMS(`Unfortunately we are still unable to match your bet with another player for <b>${eventName}</b> on ${timeString}. `, user.phone);
        }

    }
    console.log("Sent mails.")

}

async function checkCashBack() {
    const today = new Date();
    if (!isLastDay(today)) return;
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const cashbacks = await FinancialLog.find({
        financialtype: 'cashback',
        note: `${year}:${month}`,
    });
    if (cashbacks.length) {
        console.log('already made cashback.');
        return;
    }

    let lossbetsSportsbook = await BetSportsBook.aggregate({
        $match: {
            Name: "SETTLED",
            "WagerInfo.Outcome": "LOSE",
            createdAt: {
                $gte: new Date(year, month - 1, 0),
                $lte: new Date(year, month, 0),
            }
        }
    }, {
        $group: {
            _id: "$userId",
            total: {
                $sum: { $toDouble: "$WagerInfo.ProfitAndLoss" }
            }
        }
    });

    lossbetsSportsbook.map(async lossbet => {
        const { _id, total } = lossbet;
        const loss = Math.abs(total);
        const user = await User.findById(_id);
        if (!user) return;
        let cashback = 0;
        if (loss > 0 && loss < 500) {
            cashback = 0.5;
        } else if (loss >= 500 && loss < 3000) {
            cashback = 1;
        } else if (loss >= 3000 && loss < 7000) {
            cashback = 2;
        } else if (loss >= 7000) {
            cashback = 3;
        }
        if (!cashback) return;
        cashback = cashback * loss / 100;
        await FinancialLog.create({
            financialtype: 'cashback',
            user: _id,
            uniqid: ID(),
            amount: cashback,
            method: 'cashback',
            note: `${year}:${month}`,
            fee: loss,
            status: FinancialStatus.success,
        });
        console.log(user.username, ' cashback => ', cashback)
        await user.update({ $inc: { balance: cashback } });
    })
}

function isLastDay(date) {
    return new Date(date.getTime() - 86400000).getDate() === 1;
}

async function calculateBetsStatus() {
    const betpools = await BetPool.find({
        origin: 'bet365',
        result: { $exists: false }
    });

    betpools.forEach(async betpool => {
        try {
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
                const { _id, toWin, pick, matchingStatus: currentMatchingStatus, payableToWin: currentPayableToWin } = bet;
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
                if (payableToWin !== currentPayableToWin || matchingStatus !== currentMatchingStatus) {
                    await Bet.findOneAndUpdate({ _id }, betChanges);
                }
            }
        } catch (error) {
            console.error(error);
        }
    })
}

async function checkBetWithoutBetpool() {
    const bets = await Bet.find({
        status: 'Pending'
    });
    bets.forEach(async bet => {
        const uid = JSON.stringify(bet.lineQuery);
        const exists = await BetPool.find({ uid: uid });
        if (exists.length > 0) return;
        try {
            if (bet.origin == 'other') return;
            let points = bet.pickName.split(' ');
            if (bet.lineQuery.type == 'moneyline') {
                points = null;
            } else {
                points = Number(points[points.length - 1]);
            }
            await BetPool.create(
                {
                    uid: uid,
                    sportId: bet.lineQuery.sportId,
                    leagueId: bet.lineQuery.leagueId,
                    eventId: bet.lineQuery.eventId,
                    lineId: bet.lineQuery.lineId,
                    teamA: {
                        name: bet.teamA.name,
                        // odds: home,
                        betTotal: bet.pick === 'home' ? bet.bet : 0,
                        toWinTotal: bet.pick === 'home' ? bet.toWin : 0,
                    },
                    teamB: {
                        name: bet.teamB.name,
                        // odds: away,
                        betTotal: bet.pick === 'away' ? bet.bet : 0,
                        toWinTotal: bet.pick === 'away' ? bet.toWin : 0,
                    },
                    sportName: bet.lineQuery.sportName,
                    matchStartDate: bet.matchStartDate,
                    lineType: bet.lineQuery.type,
                    points: points,
                    homeBets: bet.pick === 'home' ? [bet._id] : [],
                    awayBets: bet.pick === 'away' ? [bet._id] : [],
                    origin: bet.origin
                }
            );
            console.log('Fix one bet.');
        } catch (error) {
            console.error(error);
        }
    })
}
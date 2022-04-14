//Models
const Addon = require("../../models/addon");
const Preference = require('../../models/preference');
const Bet = require('../../models/bet');
const User = require('../../models/user');
const FinancialLog = require('../../models/financiallog');
const SharedLine = require('../../models/sharedline');
const BetPool = require('../../models/betpool');
const ErrorLog = require('../../models/errorlog');
const ParlayBetPool = require("../../models/parlaybetpool");
//local helpers
const config = require('../../../config.json');
const simpleresponsive = require('../../emailtemplates/simpleresponsive');
const { convertTimeLineDate } = require('../../libs/timehelper');
const sendSMS = require("../../libs/sendSMS");
const {
    ID,
    calculateBetsStatus,
    calculateParlayBetsStatus,
} = require('../../libs/functions');
const getMatchScores = require("../bet365/getMatchScores");
const fromEmailName = 'PAYPER WIN';
const fromEmailAddress = 'donotreply@payperwin.com';
const FinancialStatus = config.FinancialStatus;
//external libraries
const axios = require('axios');

Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}

Date.prototype.addMins = function (m) {
    this.setTime(this.getTime() + (m * 60 * 1000));
    return this;
}

const checkTimerOne = async () => {
    try {
        //////////////////// Check match status
        // checkMatchStatus();

        ////////////////// Delete Shared Lines
        await SharedLine.deleteMany({
            eventDate: {
                $lte: new Date()
            }
        });

        ////////////////// Cashback in the last day of the month.
        checkCashBack();
    } catch (error) {
        console.error(error);
    }
}

const checkTimerTwo = async () => {
    try {
        // Check BetPool status
        calculateBetPoolsStatus();

        // Check bet without betpool
        // checkBetWithoutBetPool();

        // Check settled score;
        checkSettledScore();
    } catch (error) {
        console.error(error);
    }
}

const checkBetMatchStatus = async () => {
    // Check Match Status
    const bets = await Bet.find(
        {
            matchStartDate: { $lt: (new Date()).addHours(5) },
            notifySent: { $exists: false },
            matchingStatus: ['Pending', 'Partial Match']
        }
    );

    for (const bet of bets) {
        await bet.update({ notifySent: new Date() });
        const user = await User.findById(bet.userId);
        let eventName = '';
        if (bet.origin == 'custom') {
            eventName = bet.lineQuery.eventName;
        } else {
            eventName = bet.isParlay ? 'Parlay Bet' : `${bet.teamA.name} vs ${bet.teamB.name} (${bet.lineQuery.sportName})`;
        }

        const preference = await Preference.findOne({ user: user._id });
        let timezone = "00:00";
        if (preference && preference.timezone) {
            timezone = preference.timezone;
        }
        const timeString = convertTimeLineDate(new Date(bet.matchStartDate), timezone);

        //Comment: disable this email and SMS message since there should always be a match now.
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
                 `, { href: "https://www.payperwin.com/bets", name: 'View Open Bets' }),
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
        if (user.roles.phone_verified && (!preference || !preference.notification_settings || preference.notification_settings.no_match_found.sms)) {
            sendSMS(`Unfortunately we are still unable to match your bet with another player for ${eventName} on ${timeString}. `, user.phone);
        }
    }
}

const checkCashBack = async () => {
    const today = new Date();
    if (!isLastDay(today)) return;
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const cashbacks = await FinancialLog.find({
        financialtype: 'cashback',
        note: `${year}:${month}`,
    });
    if (cashbacks.length) {
        return;
    }

    let lossbetsSportsbook = await Bet.aggregate(
        {
            $match: {
                status: "Settled - Lose",
                sportsbook: true,
                createdAt: {
                    $gte: new Date(year, month - 1, 0),
                    $lte: new Date(year, month, 0),
                }
            }
        },
        { $group: { _id: "$userId", total: { $sum: "$bet" } } }
    );

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
            beforeBalance: user.balance,
            afterBalance: user.balance + cashback
        });
        await user.update({ $inc: { balance: cashback } });
    })
}

const isLastDay = (date) => {
    return new Date().addHours(-24).getDate() === 1;
}

const calculateBetPoolsStatus = async () => {
    const betpools = await BetPool.find({
        origin: 'bet365',
        result: { $exists: false }
    });

    betpools.forEach(async betpool => {
        try {
            calculateBetsStatus(betpool.uid);
        } catch (error) {
            console.error(error);
        }
    });

    // await BetPool.deleteMany({
    //     result: { $exists: true }
    // });

    const parlayBetPools = await ParlayBetPool.find({
        origin: 'bet365',
        result: { $exists: false }
    });

    parlayBetPools.forEach(async parlayBetpool => {
        try {
            calculateParlayBetsStatus(parlayBetpool._id);
        } catch (error) {
            console.error(error);
        }
    });

    // await ParlayBetPool.deleteMany({
    //     result: { $exists: true }
    // });
}

const checkSettledScore = async () => {
    const bet365Addon = await Addon.findOne({ name: 'bet365' });
    if (!bet365Addon || !bet365Addon.value || !bet365Addon.value.bet365ApiKey) {
        console.warn("Bet365 Api Key is not set");
        return;
    }
    const { bet365ApiKey } = bet365Addon.value;

    const bets = await Bet.find({
        status: { $in: ['Settled - Win', 'Settled - Lose'] },
        updatedAt: { $gte: new Date().addHours(-1) },
        scoreMismatch: null,
        origin: 'bet365'
    });
    for (const bet of bets) {
        if (bet.isParlay) {
            const parlayQuery = bet.parlayQuery;
            const resultQuery = JSON.parse(JSON.stringify(parlayQuery));
            let breaked = false;
            let page = 0;
            while (true) {
                let success = false;
                let results = [];
                let event_ids = '';
                const resultQueryForOne = resultQuery.slice(page * 10, ++page * 10);
                resultQueryForOne.forEach((query, index) => {
                    event_ids += query.lineQuery.eventId;
                    event_ids += index == resultQueryForOne.length - 1 ? '' : ',';
                })
                try {
                    const { data: { success: success_result, results: results_result } } = await axios
                        .get(`https://api.b365api.com/v1/bet365/result`, {
                            params: {
                                token: bet365ApiKey,
                                event_id: event_ids
                            }
                        });
                    success = success_result;
                    results = results_result;
                } catch (error) {
                    console.error(error);
                    breaked = true;
                    break;
                }

                if (!success) {
                    breaked = true;
                    break;
                }

                resultQuery.map(query => {
                    const result = results.find((result) => query.lineQuery.eventId == result.bet365_id);
                    if (result) query.result = result;
                });

                if (page * 10 >= resultQuery.length) break;
            }
            if (breaked) continue;

            const cancelledEvents = [];
            for (let nI = 0; nI < resultQuery.length; nI++) {
                const query = resultQuery[nI];
                const query2 = parlayQuery[nI];
                if (!query2.status) break;
                const { lineQuery, result } = query;
                if (!result) {
                    continue;
                }
                const { ss, scores, time_status, timer } = result;
                let matchResult = {
                    homeScore: 0,
                    awayScore: 0,
                    cancellationReason: false
                };
                if (time_status == "3") { //Ended, In Play
                    const result = getMatchScores(lineQuery.sportName, lineQuery.type, lineQuery.subtype, ss, scores, timer, time_status);
                    matchResult = { ...matchResult, ...result };
                } else if (time_status == "0" ||
                    time_status == "2" ||
                    time_status == "1") { // Postponed, Not Started
                    continue;
                } else if (time_status == "4" ||
                    time_status == "5" ||
                    time_status == "7" ||
                    time_status == "8" ||
                    time_status == "9" ||
                    time_status == "6") { // Cancelled, Interrupted, Abandoned, Retired, Walkover
                    matchResult.cancellationReason = true;
                } else {
                    matchResult.cancellationReason = true;
                }
                const { homeScore, awayScore, cancellationReason } = matchResult;
                if (cancellationReason) {
                    cancelledEvents.push(lineQuery.eventId);
                    query.status = 'Cancelled';
                } else {
                    query.homeScore = homeScore;
                    query.awayScore = awayScore;
                }

                if (query2.status &&
                    (query2.status != query.status ||
                        query2.homeScore != query.homeScore ||
                        query2.awayScore != query.awayScore)
                ) {
                    await bet.update({
                        scoreMismatch: resultQuery.map(query => ({
                            homeScore: query.homeScore,
                            awayScore: query.awayScore,
                            status: query.status,
                        }))
                    });
                    break;
                }
            }
        } else {
            const lineQuery = bet.lineQuery;
            try {
                const { data: { success, results } } = await axios
                    .get(`https://api.b365api.com/v1/bet365/result`, {
                        params: {
                            token: bet365ApiKey,
                            event_id: lineQuery.eventId,
                        }
                    });
                if (!success) {
                    continue;
                }
                const { ss, scores, time_status, timer } = results[0];
                if (time_status != "3") {
                    continue;
                }
                const result = getMatchScores(lineQuery.sportName, lineQuery.type, lineQuery.subtype, ss, scores, timer, time_status);
                const { homeScore, awayScore } = result;
                if (bet.homeScore != homeScore || bet.awayScore != awayScore) {
                    await bet.update({ scoreMismatch: { homeScore, awayScore } });
                }
            } catch (error) {
                console.error(error);
                continue;
            }
        }
    }
    console.log(new Date(), 'All done');
}

const checkMatchStatus = () => {
    const lineInterval1 = 1000 * 60 * 60;
    checkTimerOne();
    setInterval(checkTimerOne, lineInterval1);

    const lineInterval2 = 1000 * 60 * 20;
    checkTimerTwo();
    setInterval(checkTimerTwo, lineInterval2);
}

module.exports = { checkMatchStatus };
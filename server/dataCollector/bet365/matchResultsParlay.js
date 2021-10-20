//Models
const ParlayBetPool = require('../../models/parlaybetpool');
const Bet = require('../../models/bet');
const User = require('../../models/user');
const FinancialLog = require("../../models/financiallog");
const Preference = require('../../models/preference');
const ErrorLog = require('../../models/errorlog');
//Local helpers
const simpleresponsive = require('../../emailtemplates/simpleresponsive');
const config = require('../../../config.json');
const sendSMS = require('../../libs/sendSMS');
const { ID, getLinePoints } = require('../../libs/functions');
const getMatchScores = require('./getMatchScores');
//external libraries
const axios = require('axios');
const sgMail = require('@sendgrid/mail');
const FinancialStatus = config.FinancialStatus;
const fromEmailName = 'PAYPER WIN';
const fromEmailAddress = 'donotreply@payperwin.co';
const BetFee = 0.05;

Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}

Date.prototype.addMinutes = function (m) {
    this.setTime(this.getTime() + (m * 60 * 1000));
    return this;
}

const cancelBetPool = async (betpool) => {
    const { homeBets, awayBets } = betpool;
    for (const betId of [...homeBets, ...awayBets]) {
        const bet = await Bet.findById(betId);
        if (bet) {
            const { userId, bet: betAmount } = bet;
            // refund user
            await bet.update({ status: 'Cancelled' });
            await User.findByIdAndUpdate(userId, { $inc: { balance: betAmount } });
            await FinancialLog.create({
                financialtype: 'betcancel',
                uniqid: `BC${ID()}`,
                user: userId,
                amount: betAmount,
                method: 'betcancel',
                status: FinancialStatus.success,
            });
        }
    }
    await betpool.update({ $set: { result: 'Cancelled' } });
}

const matchResultsParlay = async (bet365ApiKey) => {
    // Check  betpools
    const betpools = await ParlayBetPool.find(
        // settle matches that started before 3 hours ago
        {
            origin: 'bet365',
            matchStartDate: { $lt: new Date().addMinutes(-60) },
            result: { $exists: false }
        }
    );

    // loop through betpools
    if (!betpools || betpools.length === 0) {
        console.log('no eligible parlay betpools');
        return;
    }
    for (const betpool of betpools) {
        const { homeBets, awayBets, parlayQuery } = betpool;
        let matchCancelled = false;
        if (homeBets.length > 0 && awayBets.length > 0) {
            let homeWin = true;
            let breaked = false;
            let resultQuery = JSON.parse(JSON.stringify(parlayQuery));
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
                    console.log('no data from api/cache for this line');
                    breaked = true;
                    break;
                }

                resultQuery.map(query => {
                    const result = results.find((result) => query.lineQuery.eventId == result.bet365_id);
                    if (result) query.result = result;
                });

                if (page * 10 >= resultQuery.length) break;
            }
            if (breaked) {
                continue;
            }

            const cancelledEvents = [];
            for (const query of resultQuery) {
                const { lineQuery, result, pick, pickName } = query;
                const { ss, scores, time_status, time, timer } = result;
                let matchResult = {
                    homeScore: 0,
                    awayScore: 0,
                    cancellationReason: false
                };
                if (time_status == "3" || time_status == "1") { //Ended, In Play
                    // Calculate Match Score
                    const result = getMatchScores(lineQuery.sportName, lineQuery.type, lineQuery.subtype, ss, scores, timer, time_status);
                    if (typeof result == 'object')
                        matchResult = { ...matchResult, ...result };
                    else if (result == 'inplay') {
                        breaked = true;
                        break;
                    } else {
                        console.error("matchError:", eventId);
                        breaked = true;
                        break;
                    }
                } else if (time_status == "4" ||
                    time_status == "0" ||
                    time_status == "2") { // Postponed, Not Started
                    breaked = true;
                    break;
                } else if (time_status == "5" ||
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
                    query.cancelled = true;
                } else {
                    query.homeScore = homeScore;
                    query.awayScore = awayScore;
                    let moneyLineWinner = null;
                    if (homeScore > awayScore) moneyLineWinner = 'home';
                    else if (awayScore > homeScore) moneyLineWinner = 'away';

                    const linePoints = getLinePoints(pickName, pick, lineQuery);
                    let betWin;
                    if (lineQuery.type === 'moneyline') {
                        betWin = pick === moneyLineWinner;
                    } else if (['spread', 'alternative_spread'].includes(lineQuery.type)) {
                        const spread = { home: linePoints, away: 0 };
                        const homeScoreHandiCapped = homeScore + spread.home;
                        const awayScoreHandiCapped = awayScore + spread.away;
                        let spreadWinner;
                        if (homeScoreHandiCapped > awayScoreHandiCapped) spreadWinner = 'home';
                        else if (awayScoreHandiCapped > homeScoreHandiCapped) spreadWinner = 'away';
                        betWin = pick === spreadWinner;
                    } else if (['total', 'alternative_total'].includes(lineQuery.type)) {
                        const totalPoints = homeScore + awayScore;
                        const overUnderWinner = totalPoints > linePoints ? 'home' : 'away';
                        betWin = pick === overUnderWinner;
                    }

                    homeWin = homeWin && betWin;
                }

                delete query.result;
            }

            if (breaked) {
                continue;
            }
            if (cancelledEvents.length > 0) {
                // Adjust wallet and odds
                if (cancelledEvents.length == resultQuery.length) {
                    cancelBetPool(betpool);
                    continue;
                }
                console.log(cancelledEvents);
            }

            const winBets = homeWin ? homeBets : awayBets;
            const lossBets = homeWin ? awayBets : homeBets;
            for (const bet_id of winBets) {
                const bet = await Bet.findById(bet_id);
                if (bet) {
                    const { userId, bet: betAmount, payableToWin } = bet;
                    const user = await User.findById(userId);
                    if (user) {
                        const { email } = user;
                        const betFee = Number((payableToWin * BetFee).toFixed(2));
                        const betChanges = {
                            $set: {
                                status: 'Settled - Win',
                                credited: betAmount + payableToWin,
                                fee: betFee,
                                parlayQuery: resultQuery
                            }
                        }
                        await bet.update(betChanges);
                        if (payableToWin > 0) {
                            await user.update({ $inc: { balance: betAmount + payableToWin - betFee } });
                            await FinancialLog.create({
                                financialtype: 'betwon',
                                uniqid: `BW${ID()}`,
                                user: userId,
                                amount: betAmount + payableToWin,
                                method: 'betwon',
                                status: FinancialStatus.success,
                            });
                            await FinancialLog.create({
                                financialtype: 'betfee',
                                uniqid: `BF${ID()}`,
                                user: userId,
                                amount: betFee,
                                method: 'betfee',
                                status: FinancialStatus.success,
                            });
                        }
                        // TODO: email winner
                        const preference = await Preference.findOne({ user: user._id });
                        if (!preference || !preference.notification_settings || preference.notification_settings.win_confirmation.email) {
                            const msg = {
                                from: `${fromEmailName} <${fromEmailAddress}>`,
                                to: email,
                                subject: 'You won a wager!',
                                text: `Congratulations! You won $${payableToWin.toFixed(2)}. View Result Details: https://www.payperwin.co/history`,
                                html: simpleresponsive(`
                                        <p>
                                            Congratulations! You won $${payableToWin.toFixed(2)}. View Result Details:
                                        </p>
                                    `,
                                    { href: 'https://www.payperwin.co/history', name: 'View Settled Bets' }
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
                        if (user.roles.phone_verified && (!preference || !preference.notification_settings || preference.notification_settings.win_confirmation.sms)) {
                            sendSMS(`Congratulations! You won $${payableToWin.toFixed(2)}.`, user.phone);
                        }
                    }
                }
            }
            for (const bet_id of lossBets) {
                const bet = await Bet.findById(bet_id);
                if (bet) {
                    const { userId, payableToWin, toWin, bet: betAmount } = bet;
                    const betChanges = {
                        $set: {
                            status: 'Settled - Lose',
                            parlayQuery: resultQuery
                        }
                    }
                    const unplayableBet = payableToWin < toWin
                        ? ((1 - (payableToWin / toWin)) * betAmount).toFixed(2) : null;
                    if (unplayableBet) {
                        betChanges.$set.credited = unplayableBet;
                        await User.findByIdAndUpdate({ _id: userId }, { $inc: { balance: unplayableBet } });
                        await FinancialLog.create({
                            financialtype: 'betrefund',
                            uniqid: `BF${ID()}`,
                            user: userId,
                            amount: unplayableBet,
                            method: 'betrefund',
                            status: FinancialStatus.success,
                        });
                    }
                    await bet.update(betChanges);
                }
            }
            await betpool.update({ $set: { result: 'Settled' } });
        } else {
            cancelBetPool(betpool);
        }
    }
    console.log('Finished checking parlay betpools', new Date().toLocaleString());
}

module.exports = matchResultsParlay;
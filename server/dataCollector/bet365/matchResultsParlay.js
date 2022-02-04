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
const { ID, getLinePoints, calculateToWinFromBet, calculateParlayBetsStatus, sendBetWinConfirmEmail, sendBetLoseConfirmEmail, cancelBetPool } = require('../../libs/functions');
const getMatchScores = require('./getMatchScores');
const convertOdds = require('../../libs/convertOdds');
//external libraries
const axios = require('axios');
const sgMail = require('@sendgrid/mail');
const getTeaserOdds = require('../../libs/getTeaserOdds');
const FinancialStatus = config.FinancialStatus;
const fromEmailName = 'PAYPER WIN';
const fromEmailAddress = 'donotreply@payperwin.com';
const BetFee = 0.05;

Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}

Date.prototype.addMinutes = function (m) {
    this.setTime(this.getTime() + (m * 60 * 1000));
    return this;
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
        return;
    }
    for (const betpool of betpools) {
        const { homeBets, awayBets, parlayQuery } = betpool;
        if (homeBets.length > 0 && awayBets.length > 0) {
            let homeWin = true;
            let breaked = false;
            let resultQuery = JSON.parse(JSON.stringify(parlayQuery));
            let page = 0;
            while (true) {
                let success = false;
                let results = [];
                const resultQueryForOne = resultQuery.slice(page * 10, (page + 1) * 10);
                const event_ids = resultQueryForOne.map(query => query.lineQuery.eventId).join(',');
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

                for (let nI = page * 10; nI < Math.min(resultQuery.length, (page + 1) * 10); nI++) {
                    resultQuery[nI].result = results[nI - page * 10];
                }

                if (++page * 10 >= resultQuery.length) break;
            }
            if (breaked) {
                continue;
            }
            const cancelledEvents = [];
            for (const query of resultQuery) {
                const { lineQuery, result, pick, pickName } = query;
                if (!result) {
                    breaked = true;
                    break;
                }
                const { ss, scores, time_status, time, timer } = result;
                let matchResult = {
                    homeScore: 0,
                    awayScore: 0,
                    cancellationReason: false
                };
                if (time_status == "3") { //Ended, In Play
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
                } else if (time_status == "0" ||
                    time_status == "2" || time_status == "1") { // Postponed, Not Started
                    breaked = true;
                    break;
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
                    let moneyLineWinner = null;
                    if (homeScore > awayScore) moneyLineWinner = 'home';
                    else if (awayScore > homeScore) moneyLineWinner = 'away';

                    const linePoints = lineQuery.points ? lineQuery.points : getLinePoints(pickName, pick, lineQuery);
                    let betWin;
                    let draw = false;
                    if (lineQuery.type === 'moneyline') {
                        betWin = pick === moneyLineWinner;
                        draw = homeScore == awayScore;
                    } else if (['spread', 'alternative_spread'].includes(lineQuery.type)) {
                        const spread = { home: linePoints, away: 0 };
                        const homeScoreHandiCapped = homeScore + spread.home;
                        const awayScoreHandiCapped = awayScore + spread.away;
                        let spreadWinner;
                        if (homeScoreHandiCapped > awayScoreHandiCapped) spreadWinner = 'home';
                        else if (awayScoreHandiCapped > homeScoreHandiCapped) spreadWinner = 'away';
                        betWin = pick === spreadWinner;
                        draw = homeScoreHandiCapped == awayScoreHandiCapped;
                    } else if (['total', 'alternative_total'].includes(lineQuery.type)) {
                        const totalPoints = homeScore + awayScore;
                        const overUnderWinner = totalPoints > linePoints ? 'home' : 'away';
                        betWin = pick === overUnderWinner;
                        draw = totalPoints == linePoints
                    } else if (lineQuery.type == 'home_total') {
                        const overUnderWinner = homeScore > linePoints ? 'home' : 'away';
                        betWin = pick === overUnderWinner;
                        draw = homeScore == linePoints
                    } else if (lineQuery.type == 'away_total') {
                        const overUnderWinner = awayScore > linePoints ? 'home' : 'away';
                        betWin = pick === overUnderWinner;
                        draw = awayScore == linePoints
                    }

                    if (draw) {
                        if (['Boxing-UFC', 'Boxing/MMA'].includes(lineQuery.sportName)) {
                            draw = false;
                            betWin = false;
                        } else {
                            cancelledEvents.push(lineQuery.eventId);
                        }
                    }

                    homeWin = homeWin && (betWin || draw);
                    query.status = betWin ? 'Win' : 'Lose';
                    query.status = draw ? 'Draw' : query.status;
                    if (homeWin == false) {
                        delete query.result;
                        break;
                    }
                }
                delete query.result;
            }
            if (breaked) {
                continue;
            }

            if (cancelledEvents.length > 0) {
                // Adjust wallet and odds
                if (cancelledEvents.length == resultQuery.length) {
                    await cancelBetPool(betpool);
                    continue;
                }

                let teaserPoint = null;
                for (const query of parlayQuery) {
                    if (query.lineQuery.teaserPoint != undefined) {
                        teaserPoint = query.lineQuery.teaserPoint;
                        break;
                    }
                }

                let parlayOdds = 1;
                if (teaserPoint != null) {
                    let sportName = null;
                    const newParlayQuery = [];
                    for (const query of parlayQuery) {
                        const { lineQuery: { eventId, sportName: querySportName } } = query;
                        sportName = querySportName;
                        const cancelled = cancelledEvents.find(event => event == eventId);
                        if (cancelled) continue;
                        newParlayQuery.push(query);
                    }
                    if (newParlayQuery.length <= 1) {
                        await cancelBetPool(betpool);
                        continue;
                    }
                    parlayOdds = getTeaserOdds(sportName, teaserPoint, newParlayQuery.length);
                } else {
                    for (const query of parlayQuery) {
                        const { pickOdds, lineQuery: { eventId } } = query;
                        const cancelled = cancelledEvents.find(event => event == eventId);
                        if (cancelled) continue;
                        parlayOdds *= Number(convertOdds(Number(pickOdds), 'decimal'));
                    }
                    if (parlayOdds >= 2) {
                        parlayOdds = parseInt((parlayOdds - 1) * 100);
                    } else {
                        parlayOdds = parseInt(-100 / (parlayOdds - 1));
                    }
                }

                const teamA = { odds: parlayOdds, betTotal: 0, toWinTotal: 0 };
                const teamB = { odds: -parlayOdds, betTotal: 0, toWinTotal: 0 };
                const newHomeBets = [];
                const newAwayBets = [];
                for (const bet_id of homeBets) {
                    const bet = await Bet.findById(bet_id);
                    if (bet) {
                        newHomeBets.push(bet._id);
                        const { bet: betAmount } = bet;
                        const toWin = calculateToWinFromBet(betAmount, parlayOdds);
                        teamA.betTotal = betAmount;
                        teamA.toWinTotal = toWin;
                        await bet.update({
                            toWin: toWin,
                            payableToWin: 0,
                            pickOdds: parlayOdds
                        });
                    } else {
                    }
                }

                const totalAwayBet = teamA.toWinTotal;
                const prevTotalAwayBet = betpool.teamB.betTotal;
                if (totalAwayBet == 0 || prevTotalAwayBet <= 0) {
                    await cancelBetPool(betpool);
                    continue;
                }

                for (const bet_id of awayBets) {
                    const bet = await Bet.findById(bet_id);
                    if (bet) {
                        newAwayBets.push(bet._id);
                        const { userId, bet: betAmount } = bet;
                        let newBetAmount = betAmount;
                        if (totalAwayBet < prevTotalAwayBet) {
                            const rate = betAmount / prevTotalAwayBet;
                            newBetAmount = totalAwayBet * rate;
                        }
                        const toWin = calculateToWinFromBet(newBetAmount, -parlayOdds);
                        teamB.betTotal += newBetAmount;
                        teamB.toWinTotal += toWin;
                        await bet.update({
                            bet: newBetAmount,
                            toWin: toWin,
                            payableToWin: 0,
                            pickOdds: -parlayOdds
                        });
                        if (newBetAmount < betAmount) {
                            const user = await User.findById(userId);
                            if (user) {
                                await FinancialLog.create({
                                    financialtype: 'betrefund',
                                    uniqid: `BF${ID()}`,
                                    user: userId,
                                    betId: bet_id,
                                    amount: betAmount - newBetAmount,
                                    method: 'betrefund',
                                    status: FinancialStatus.success,
                                    beforeBalance: user.balance,
                                    afterBalance: user.balance + betAmount - newBetAmount
                                });
                                await user.update({ $inc: { balance: betAmount - newBetAmount } });
                            }
                        }
                    }
                }
                await betpool.update({ teamA, teamB, homeBets: newHomeBets, awayBets: newAwayBets });
                await calculateParlayBetsStatus(betpool._id);
            }
            const winBets = homeWin ? homeBets : awayBets;
            const lossBets = homeWin ? awayBets : homeBets;
            for (const bet_id of winBets) {
                const bet = await Bet.findById(bet_id);
                if (bet) {
                    const { _id, userId, bet: betAmount, payableToWin } = bet;
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
                    const user = await User.findById(userId);
                    if (user) {
                        if (payableToWin > 0) {
                            const afterBalance = user.balance + betAmount + payableToWin;
                            await FinancialLog.create({
                                financialtype: 'betwon',
                                uniqid: `BW${ID()}`,
                                user: userId,
                                betId: _id,
                                amount: betAmount + payableToWin,
                                method: 'betwon',
                                status: FinancialStatus.success,
                                beforeBalance: user.balance,
                                afterBalance: afterBalance
                            });
                            await FinancialLog.create({
                                financialtype: 'betfee',
                                uniqid: `BF${ID()}`,
                                user: userId,
                                betId: _id,
                                amount: betFee,
                                method: 'betfee',
                                status: FinancialStatus.success,
                                beforeBalance: afterBalance,
                                afterBalance: afterBalance - betFee
                            });
                            await user.update({ $inc: { balance: betAmount + payableToWin - betFee } });
                        }
                        // TODO: email winner
                        sendBetWinConfirmEmail(user, bet);
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
                        ? Number(((1 - payableToWin / toWin) * betAmount).toFixed(2)) : null;

                    const user = await User.findById(userId);
                    if (user) {
                        sendBetLoseConfirmEmail(user, betAmount);
                        if (unplayableBet) {
                            betChanges.$set.credited = unplayableBet;
                            await User.findByIdAndUpdate({ _id: userId }, { $inc: { balance: unplayableBet } });
                            await FinancialLog.create({
                                financialtype: 'betrefund',
                                uniqid: `BF${ID()}`,
                                user: userId,
                                betId: bet_id,
                                amount: unplayableBet,
                                method: 'betrefund',
                                status: FinancialStatus.success,
                                beforeBalance: user.balance,
                                afterBalance: user.balance + unplayableBet
                            });
                        }
                    }
                    await bet.update(betChanges);
                }
            }
            await betpool.update({ $set: { result: 'Settled' } });
        } else {
            await cancelBetPool(betpool);
        }
    }
}

module.exports = matchResultsParlay;
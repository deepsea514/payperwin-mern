//Models
const BetPool = require('../../models/betpool');
const Bet = require('../../models/bet');
const User = require('../../models/user');
const FinancialLog = require("../../models/financiallog");
const Preference = require('../../models/preference');
const ErrorLog = require('../../models/errorlog');
//Local helpers
const simpleresponsive = require('../../emailtemplates/simpleresponsive');
const config = require('../../../config.json');
const sendSMS = require('../../libs/sendSMS');
const { ID, sendBetWinConfirmEmail, sendBetLoseConfirmEmail, cancelBetPool } = require('../../libs/functions');
const getMatchScores = require('./getMatchScores');
//external libraries
const axios = require('axios');
const sgMail = require('@sendgrid/mail');
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

const matchResultsP2PAndSB = async (bet365ApiKey) => {
    // Check  betpools
    const betpools = await BetPool.find(
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
        const { homeBets, awayBets, uid, eventId, lineType, lineSubType, points, sportName } = betpool;
        let matchCancelled = false;
        if (homeBets.length > 0 && awayBets.length > 0) {
            try {
                const { data: { success, results } } = await axios
                    .get(`https://api.b365api.com/v1/bet365/result`, {
                        params: {
                            token: bet365ApiKey,
                            event_id: eventId,
                        }
                    });
                if (!success) {
                    continue;
                }
                const { ss, scores, time_status, time, timer } = results[0];
                let matchResult = {
                    homeScore: 0,
                    awayScore: 0,
                    cancellationReason: false
                };
                if (time_status == "3") { //Ended, In Play
                    // Calculate Match Score
                    if (ss == null || ss == "") {
                        await betpool.update({ matchStartDate: new Date(Number(time) * 1000) });
                        continue;
                    }
                    const result = getMatchScores(sportName, lineType, lineSubType, ss, scores, timer, time_status);
                    if (typeof result == 'object')
                        matchResult = { ...matchResult, ...result };
                    else if (result == 'inplay') {
                        continue;
                    } else {
                        console.error("matchError:", eventId);
                        continue;
                    }
                } else if (time_status == "0" ||
                    time_status == "2" || time_status == "1") { // Postponed, Not Started
                    await betpool.update({ matchStartDate: new Date(Number(time) * 1000) });
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
                    matchCancelled = true;
                }
                else {
                    let moneyLineWinner = null;
                    if (homeScore > awayScore) moneyLineWinner = 'home';
                    else if (awayScore > homeScore) moneyLineWinner = 'away';
                    const bets = await Bet.find({ _id: { $in: [...homeBets, ...awayBets] } });
                    for (const bet of bets) {
                        const { _id, userId, bet: betAmount, toWin, pick, payableToWin, status, sportsbook } = bet;

                        if (payableToWin <= 0 || status == 'Pending') {
                            const { _id, userId, bet: betAmount } = bet;
                            await Bet.findOneAndUpdate({ _id }, { status: 'Cancelled' });
                            const user = await User.findById(userId);
                            if (user) {
                                await FinancialLog.create({
                                    financialtype: 'betcancel',
                                    uniqid: `BC${ID()}`,
                                    user: userId,
                                    betId: _id,
                                    amount: betAmount,
                                    method: 'betcancel',
                                    status: FinancialStatus.success,
                                    beforeBalance: user.balance,
                                    afterBalance: user.balance + betAmount
                                });
                                await user.update({ $inc: { balance: betAmount } });
                            }
                            continue;
                        }

                        if (['Cancelled', 'Draw', 'Settled - Win', 'Settled - Lose'].includes(status)) {
                            continue;
                        }

                        let betWin;
                        let draw = false;
                        if (lineType === 'moneyline') {
                            betWin = pick === moneyLineWinner;
                            draw = awayScore == homeScore;
                        } else if (['spread', 'alternative_spread'].includes(lineType)) {
                            const spread = {
                                home: points,
                                away: 0,
                            };
                            const homeScoreHandiCapped = homeScore + spread.home;
                            const awayScoreHandiCapped = awayScore + spread.away;
                            let spreadWinner;
                            if (homeScoreHandiCapped > awayScoreHandiCapped) spreadWinner = 'home';
                            else if (awayScoreHandiCapped > homeScoreHandiCapped) spreadWinner = 'away';
                            betWin = pick === spreadWinner;
                            draw = homeScoreHandiCapped == awayScoreHandiCapped;
                        } else if (['total', 'alternative_total'].includes(lineType)) {
                            const totalPoints = homeScore + awayScore;
                            const overUnderWinner = totalPoints > points ? 'home' : 'away';
                            betWin = pick === overUnderWinner;
                            draw = totalPoints == points;
                        } else if (lineType == 'home_total') {
                            const overUnderWinner = homeScore > points ? 'home' : 'away';
                            betWin = pick === overUnderWinner;
                            draw = homeScore == points;
                        } else if (lineType == 'away_total') {
                            const overUnderWinner = awayScore > points ? 'home' : 'away';
                            betWin = pick === overUnderWinner;
                            draw = awayScore == points;
                        }

                        if (draw && !['Boxing-UFC', 'Boxing/MMA'].includes(sportName)) {
                            // refund user
                            await Bet.findOneAndUpdate({ _id: _id }, {
                                status: 'Draw',
                                credited: betAmount,
                                homeScore,
                                awayScore,
                            });
                            const user = await User.findById(userId);
                            if (user) {
                                await FinancialLog.create({
                                    financialtype: 'betdraw',
                                    uniqid: `BD${ID()}`,
                                    user: userId,
                                    betId: _id,
                                    amount: betAmount,
                                    method: 'betdraw',
                                    status: FinancialStatus.success,
                                    beforeBalance: user.balance,
                                    afterBalance: user.balance + betAmount
                                });
                                await user.update({ $inc: { balance: betAmount } });
                            }
                            await BetPool.findOneAndUpdate({ uid }, { $set: { result: 'Draw' } });
                            continue;
                        }

                        if (betWin === true) {
                            // TODO: credit back bet ammount
                            const user = await User.findById(userId);
                            if (user) {
                                const { email } = user;
                                const betFee = sportsbook ? 0 : Number((payableToWin * BetFee).toFixed(2));
                                const betChanges = {
                                    $set: {
                                        status: 'Settled - Win',
                                        credited: betAmount + payableToWin,
                                        homeScore: homeScore,
                                        awayScore: awayScore,
                                        fee: betFee
                                    }
                                }
                                await Bet.findOneAndUpdate({ _id }, betChanges);
                                if (payableToWin > 0) {
                                    const user = await User.findById(userId);
                                    if (user) {
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
                                }
                                // TODO: email winner
                                sendBetWinConfirmEmail(user, bet);
                            }
                        } else if (betWin === false) {
                            const betChanges = {
                                $set: {
                                    status: 'Settled - Lose',
                                    homeScore,
                                    awayScore,
                                }
                            }

                            const unplayableBet = payableToWin < toWin
                                ? Number(((1 - payableToWin / toWin) * betAmount).toFixed(2)) : null;
                            const user = await User.findById(userId);
                            if (user) {
                                sendBetLoseConfirmEmail(user, betAmount);

                                if (unplayableBet) {
                                    betChanges.$set.credited = unplayableBet;
                                    await FinancialLog.create({
                                        financialtype: 'betrefund',
                                        uniqid: `BF${ID()}`,
                                        user: userId,
                                        betId: _id,
                                        amount: unplayableBet,
                                        method: 'betrefund',
                                        status: FinancialStatus.success,
                                        beforeBalance: user.balance,
                                        afterBalance: user.balance + Number(unplayableBet)
                                    });
                                    await user.update({ $inc: { balance: unplayableBet } });
                                }
                            }
                            await Bet.findOneAndUpdate({ _id }, betChanges);
                        } else {
                            console.error('error: somehow', lineType, 'bet did not result in win or loss. betWin value:', betWin);
                        }
                    }
                    await betpool.update({ $set: { result: 'Settled' } });
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            matchCancelled = true;
        }

        if (matchCancelled) {
            await cancelBetPool(betpool);
        }
    }
}

module.exports = matchResultsP2PAndSB;
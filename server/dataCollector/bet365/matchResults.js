//Models
const BetPool = require('../../models/betpool');
const Bet = require('../../models/bet');
const User = require('../../models/user');
const FinancialLog = require("../../models/financiallog");
const Preference = require('../../models/preference');
const Addon = require('../../models/addon');
//Local helpers
const getLineFromPinnacleData = require('../../libs/getLineFromPinnacleData');
const simpleresponsive = require('../../emailtemplates/simpleresponsive');
const config = require('../../../config.json');
const sendSMS = require('../../libs/sendSMS');
const { ID } = require('../../libs/functions');
//external libraries
const axios = require('axios');
const sgMail = require('@sendgrid/mail');
const FinancialStatus = config.FinancialStatus;
const fromEmailName = 'PAYPER WIN';
const fromEmailAddress = 'donotreply@payperwin.co';

Date.prototype.addHours = (h) => {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}

const matchResults = async () => {
    // const bet365Addon = await Addon.findOne({ name: 'bet365' });
    // if (!bet365Addon || !bet365Addon.value || !bet365Addon.value.bet365ApiKey) {
    //     console.warn("Bet365 Api Key is not set");
    //     return;
    // }
    // const { bet365ApiKey } = bet365Addon.value;
    const bet365ApiKey = "93744-14OHbIxqh3sRxS";
    // Check  betpools
    const betpools = await BetPool.find(
        // settle matches that started before 3 hours ago
        {
            origin: 'bet365',
            matchStartDate: { $lt: new Date().addHours(-6) },
            result: { $exists: false }
        }
    );

    // loop through betpools
    if (!betpools || betpools.length === 0) {
        console.log('no eligible betpools');
        return;
    }
    for (const betpool of betpools) {
        const {
            homeBets,
            awayBets,
            uid,
            sportId,
            leagueId,
            eventId,
            lineType,
            points
        } = betpool;
        let matchCancelled = false;
        if (homeBets.length > 0 && awayBets.length > 0) {
            // checkmatchresult
            try {
                const { data: { success, results } } = await axios
                    .get(`https://api.b365api.com/v1/bet365/result`, {
                        params: {
                            token: bet365ApiKey,
                            event_id: eventId,
                        }
                    });

                if (!success) {
                    console.log('no data from api/cache for this line');
                    continue;
                }
                const { ss, time_status, time } = results[0];
                const matchResult = {
                    homeScore: 0,
                    awayScore: 0,
                    cancellationReason: false
                };
                if (time_status == 3) { //Ended
                    const matchScores = ss.split(',');
                    for (let match = 0; match < matchScores.length; match++) {
                        const scores = matchScores[match].split('-');
                        if (lineType == 'moneyline') {
                            if (Number(scores[0]) > Number(scores[1]))
                                matchResult.homeScore++;
                            if (Number(scores[1]) > Number(scores[0]))
                                matchResult.awayScore++;
                        } else {
                            matchResult.homeScore += Number(scores[0]);
                            matchResult.awayScore += Number(scores[1]);
                        }
                    }
                } else if (time_status == 4 ||
                    time_status == 0 ||
                    time_status == 1 ||
                    time_status == 2) { // Postponed, Not Started, InPlay
                    await betpool.update({ matchStartDate: new Date(Number(time) * 1000) });
                    continue;
                } else if (time_status == 5 ||
                    time_status == 7 ||
                    time_status == 8 ||
                    time_status == 9 ||
                    time_status == 6) { // Cancelled, Interrupted, Abandoned, Retired, Walkover
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
                    const bets = await Bet.find({
                        _id:
                        {
                            $in: [
                                ...homeBets,
                                ...awayBets,
                            ]
                        }
                    });
                    for (const bet of bets) {
                        const { _id, userId, bet: betAmount, toWin, pick, payableToWin } = bet;
                        let betWin;
                        if (lineType === 'moneyline') {
                            betWin = pick === moneyLineWinner;
                        } else if (lineType === 'spread') {
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
                        } else if (lineType === 'total') {
                            const totalPoints = homeScore + awayScore;
                            const overUnderWinner = totalPoints > points ? 'home' : 'away';
                            betWin = pick === overUnderWinner;
                        }

                        if (betWin === true) {
                            // TODO: credit back bet ammount
                            const user = await User.findById(userId);
                            const { balance, email } = user;
                            const betChanges = {
                                $set: {
                                    status: 'Settled - Win',
                                    walletBeforeCredited: balance,
                                    credited: betAmount + payableToWin,
                                    homeScore,
                                    awayScore,
                                }
                            }
                            const betFee = Number((payableToWin * 0.03).toFixed(2));
                            await Bet.findOneAndUpdate({ _id }, betChanges);
                            if (payableToWin > 0) {
                                await User.findOneAndUpdate({ _id: userId }, { $inc: { balance: betAmount + payableToWin - betFee } });
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
                                    console.log('Can\'t send mail');
                                });
                            }
                            if (user.roles.phone_verified && (!preference || !preference.notification_settings || preference.notification_settings.win_confirmation.sms)) {
                                sendSMS(`Congratulations! You won $${payableToWin.toFixed(2)}.`, user.phone);
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
                                ? ((1 - (payableToWin / toWin)) * betAmount).toFixed(2) : null;
                            if (unplayableBet) {
                                betChanges.$set.credited = unplayableBet;
                                await User.findOneAndUpdate({ _id: userId }, { $inc: { balance: unplayableBet } });
                            }
                            await Bet.findOneAndUpdate({ _id }, betChanges);
                        } else {
                            console.log('error: somehow', lineType, 'bet did not result in win or loss. betWin value:', betWin);
                        }
                        await BetPool.findOneAndUpdate({ uid }, { $set: { result: 'Settled' } });
                    }
                }
            } catch (e) {
                console.log(e);
            }
        } else {
            matchCancelled = true;
        }
        if (matchCancelled) {
            for (const betId of homeBets) {
                const bet = await Bet.findOne({ _id: betId });
                const { _id, userId, bet: betAmount } = bet;
                // refund user
                await Bet.findOneAndUpdate({ _id }, { status: 'Cancelled' });
                await User.findOneAndUpdate({ _id: userId }, { $inc: { balance: betAmount } });
            }
            for (const betId of awayBets) {
                const bet = await Bet.findOne({ _id: betId });
                const { _id, userId, bet: betAmount } = bet;
                // refund user
                await Bet.findOneAndUpdate({ _id }, { status: 'Cancelled' });
                await User.findOneAndUpdate({ _id: userId }, { $inc: { balance: betAmount } });
            }
            await BetPool.findOneAndUpdate({ uid }, { $set: { result: 'Cancelled' } });
        }
    }
    console.log('finished checking betpools', new Date().toLocaleString());
}

module.exports = matchResults;
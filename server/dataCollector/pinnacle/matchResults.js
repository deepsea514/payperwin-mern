const BetPool = require('../../models/betpool');
const Bet = require('../../models/bet');
const User = require('../../models/user');
const FinancialLog = require("../../models/financiallog");
const ApiCache = require('../../models/apiCache');
const axios = require('axios');
const getLineFromPinnacleData = require('../../libs/getLineFromPinnacleData');
const simpleresponsive = require('../../emailtemplates/simpleresponsive');
const config = require('../../../config.json');
const FinancialStatus = config.FinancialStatus;

const ID = function () {
    return '' + Math.random().toString(10).substr(2, 9);
};

Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}

async function matchResults() {
    // Check  betpools
    const betpools = await BetPool.find(
        // settle matches that started before 3 hours ago
        {
            origin: 'pinnacle',
            matchStartDate: { $lt: new Date().addHours(3) },
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
                const url = `${config.pinnacleApiHost}/v1/fixtures/settled?sportId=${sportId}&leagueIds=${leagueId}`;
                let result = await ApiCache.findOne({ url });
                if (!result || (result.updatedAt && new Date() - new Date(result.updatedAt) > 1000 * 60 * 59)) {
                    // TODO: last/since
                    result = await axios.get(url, reqConfig);
                    // TODO: last/since merge previous
                    console.log(result.data);
                    if (result) {
                        await ApiCache.findOneAndUpdate({ url }, result, { upsert: true });
                    }
                }
                const { data } = result;
                if (!data) {
                    console.log('no data from api/cache for this line');
                }
                const matchResult = getLineFromPinnacleData(data, leagueId, eventId);
                if (matchResult) {
                    const { homeScore, awayScore, cancellationReason } = matchResult;
                    if (cancellationReason) {
                        matchCancelled = true;
                    }
                    if (!cancellationReason) {
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
                                console.log(lineType, 'betWin:', betWin, pick, moneyLineWinner);
                            } else if (lineType === 'spread') {
                                const spread = {
                                    home: points,
                                    away: points * -1,
                                };
                                const homeScoreHandiCapped = homeScore + spread.home;
                                const awayScoreHandiCapped = awayScore + spread.away;
                                let spreadWinner;
                                console.log(homeScore, spread.home);
                                console.log(homeScoreHandiCapped, awayScoreHandiCapped);
                                if (homeScoreHandiCapped > awayScoreHandiCapped) spreadWinner = 'home';
                                else if (awayScoreHandiCapped > homeScoreHandiCapped) spreadWinner = 'away';
                                betWin = pick === spreadWinner;
                                console.log(lineType, 'betWin:', betWin, pick, spreadWinner);
                            } else if (lineType === 'total') {
                                const totalPoints = homeScore + awayScore;
                                const overUnderWinner = totalPoints > points ? 'home' : 'away';
                                betWin = pick === overUnderWinner;
                                console.log(lineType, 'betWin:', betWin, pick, overUnderWinner);
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
                                console.log(betChanges);
                                await Bet.findOneAndUpdate({ _id }, betChanges);
                                await User.findOneAndUpdate({ _id: userId }, { $inc: { balance: betAmount + payableToWin } });
                                await FinancialLog.create({
                                    financialtype: 'betwon',
                                    uniqid: `BW${ID()}`,
                                    user: userId,
                                    amount: betAmount + payableToWin,
                                    method: 'betwon',
                                    status: FinancialStatus.success,
                                });
                                // TODO: email winner
                                const msg = {
                                    from: `"${fromEmailName}" <${fromEmailAddress}>`,
                                    to: email,
                                    subject: 'You won a wager!',
                                    text: `Congratulations! You won $${payableToWin.toFixed(2)}. View Result Details: https://payperwin.co/history`,
                                    html: simpleresponsive(`
                                        <p>
                                            Congratulations! You won $${payableToWin.toFixed(2)}. View Result Details:
                                        </p>
                                        `,
                                        { href: 'https://payperwin.co/history', name: 'Settled Bets' }
                                    ),
                                };
                                sgMail.send(msg);
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
                                console.log(betChanges);
                                await Bet.findOneAndUpdate({ _id }, betChanges);
                            } else {
                                console.log('error: somehow', lineType, 'bet did not result in win or loss. betWin value:', betWin);
                            }
                            await BetPool.findOneAndUpdate({ uid }, { $set: { result: 'Settled' } });
                        }
                    }
                } else {
                    console.log('no match result found');
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
                console.log('betObj', bet, betAmount);
                // refund user
                await Bet.findOneAndUpdate({ _id }, { status: 'Cancelled' });
                await User.findOneAndUpdate({ _id: userId }, { $inc: { balance: betAmount } });
            }
            for (const betId of awayBets) {
                const bet = await Bet.findOne({ _id: betId });
                const { _id, userId, bet: betAmount } = bet;
                console.log('betObj', bet, betAmount);
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
require('dotenv').config();
const mongoose = require('mongoose');
const getSportLines = require('./getSportLines');
const sleep = require('../../libs/sleep');
const Sport = require('../../models/sport');
const SportsDir = require('../../models/sportsDir');
const axios = require('axios');
const config = require('../../../config.json');
const BetPool = require('../../models/betpool');
const Bet = require('../../models/bet');
const User = require('../../models/user');
const ApiCache = require('../../models/apiCache');
const getLineFromPinnacleData = require('../../libs/getLineFromPinnacleData');
const simpleresponsive = require('../../emailtemplates/simpleresponsive');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const fromEmailName = 'PAYPER Win';
const fromEmailAddress = 'donotreply@payperwin.co';

// Database
mongoose.Promise = global.Promise;
const databaseName = 'PayPerWinDev'
// const databaseName = process.env.NODE_ENV === 'development' ? 'PayPerWinDev' : 'PayPerWin';
console.info('Using database:', databaseName);
mongoose.connect(`mongodb://localhost/${databaseName}`, {
    authSource: "admin",
    user: config.mongo.username,
    pass: config.mongo.password,
    useMongoClient: true,
});

const reqConfig = {
    maxRedirects: 999,
    headers: {
        'Authorization': config.pinnacleAuthorizationHeader,
        'Accept': 'application/json',
    },
};

Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}

async function getAllSportsLines() {
    const url = `${config.pinnacleApiHost}/v2/sports`; // pinnacle or proxy url for /v2/sports endpoint
    try {
        const { data } = await axios.get(url, reqConfig);
        if (data) {
            const soccer = data.sports.find(sport => sport.name.toLowerCase() == 'soccer');
            await SportsDir.findOneAndUpdate({ origin: "pinnacle" }, { sports: [soccer] }, { upsert: true });
            const { hasOfferings, eventCount, name } = soccer;
            if (hasOfferings && eventCount > 0) {
                const sportData = await Sport.findOne({ name: new RegExp(`^${name}$`, 'i') });
                // if (
                //     !sportData
                //     || new Date() - new Date(sportData.updatedAt) > (1000 * 60 * 60 * 20)
                // ) {
                    console.log('Getting lines for', name);
                    await getSportLines(name);
                    console.log('sleeping...')
                    await sleep(61 * 1000);
                // } else {
                //     console.log(name, 'skipped, already got within 20 hours');
                // }
            }
        } else {
            console.log('no data');
        }
    } catch (e) {
        console.log("getSportsError => ", e);
    }
    console.log('finished');
}


async function checkResults() {
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
            lineId,
            lineType,
            teamA,
            teamB,
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
            // cancel or not enough bettors
            // refund bettors
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

const lineInterval = 1000 * 60 * 60;
getAllSportsLines();
setInterval(getAllSportsLines, lineInterval);

const resultInterval = 1000 * 60 * 60 * 12;
checkResults();
setInterval(checkResults, resultInterval);

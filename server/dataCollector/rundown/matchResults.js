require('dotenv').config();
const BetPool = require('../../models/betpool');
const Bet = require('../../models/bet');
const User = require('../../models/user');
const FinancialLog = require("../../models/financiallog");
const simpleresponsive = require('../../emailtemplates/simpleresponsive');
const config = require('../../../config.json');
const sgMail = require('@sendgrid/mail');
const fromEmailName = 'PAYPER WIN';
const fromEmailAddress = 'donotreply@payperwin.co';
const FinancialStatus = config.FinancialStatus;

const ID = function () {
    return '' + Math.random().toString(10).substr(2, 9);
};
Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}

async function matchResults(sportName, events) {
    const betpools = await BetPool.find(
        {
            origin: 'rundown',
            sportName,
            matchStartDate: { $lt: (new Date()).addHours(3) },
            result: { $exists: false }
        }
    );
    if (!betpools || betpools.length === 0) {
        console.log('no eligible betpools');
        return;
    }
    for (const betpool of betpools) {
        const {
            uid,
            homeBets,
            awayBets,
            eventId,
            lineType,
            points,
            matchStartDate,
        } = betpool;
        let matchCancelled = false;

        const matchStartDateNum = new Date(matchStartDate).getTime();
        const current = new Date().getTime();
        if (matchStartDateNum < (current - 48 * 3600 * 1000)) {
            matchCancelled = true;
        }
        else {
            if (homeBets.length > 0 && awayBets.length > 0) {
                const event = events.find((event) => event.event_id == eventId);
                if (!event)
                    continue;
                const { score } = event;
                if (!score) continue;
                const { event_status, event_status_detail, score_away, score_home } = score;
                if (event_status_detail == "Final") {
                    let moneyLineWinner = null;
                    if (score_home > score_away)
                        moneyLineWinner = 'home';
                    else if (score_away > score_home)
                        moneyLineWinner = 'away';

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
                                away: points * -1,
                            };
                            const homeScoreHandiCapped = score_home + spread.home;
                            const awayScoreHandiCapped = score_away + spread.away;
                            let spreadWinner;
                            if (homeScoreHandiCapped > awayScoreHandiCapped) spreadWinner = 'home';
                            else if (awayScoreHandiCapped > homeScoreHandiCapped) spreadWinner = 'away';
                            betWin = pick === spreadWinner;
                        } else if (lineType === 'total') {
                            const totalPoints = score_home + score_away;
                            const overUnderWinner = totalPoints > points ? 'home' : 'away';
                            betWin = pick === overUnderWinner;
                        }

                        if (betWin === true) {
                            const user = await User.findById(userId);
                            const { balance, email } = user;
                            const betChanges = {
                                $set: {
                                    status: 'Settled - Win',
                                    walletBeforeCredited: balance,
                                    credited: betAmount + payableToWin,
                                    homeScore: score_home,
                                    awayScore: score_away,
                                }
                            }
                            const betFee = Number((payableToWin * 0.03).toFixed(2));
                            await Bet.findByIdAndUpdate(_id, betChanges);
                            await User.findByIdAndUpdate(userId, { $inc: { balance: betAmount + payableToWin - betFee } });
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
                            // TODO: email winner

                            const preference = await Preference.findOne({ user: user._id });
                            if (!preference || !preference.notify_email || preference.notify_email == 'yes') {
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
                                sgMail.send(msg);
                            }
                            if (user.roles.phone_verified && preference && preference.notify_phone == 'yes') {
                                sendSMS(`Congratulations! You won $${payableToWin.toFixed(2)}.`, user.phone);
                            }
                        } else if (betWin === false) {
                            const betChanges = {
                                $set: {
                                    status: 'Settled - Lose',
                                    homeScore: score_home,
                                    awayScore: score_away,
                                }
                            }
                            const unplayableBet = payableToWin < toWin
                                ? ((1 - (payableToWin / toWin)) * betAmount).toFixed(2) : null;
                            if (unplayableBet) {
                                betChanges.$set.credited = unplayableBet;
                                await User.findByIdAndUpdate(userId, { $inc: { balance: unplayableBet } });
                            }
                            await Bet.findByIdAndUpdate(_id, betChanges);
                        } else {
                            console.log('error: somehow', lineType, 'bet did not result in win or loss. betWin value:', betWin);
                        }
                        await BetPool.findOneAndUpdate({ uid }, { $set: { result: 'Settled' } });
                    }
                }
            }
            else {
                matchCancelled = true;
            }
        }

        if (matchCancelled) {
            for (const betId of homeBets) {
                const bet = await Bet.findById(betId);
                const { _id, userId, bet: betAmount } = bet;

                await Bet.findByIdAndUpdate(_id, { status: 'Cancelled' });
                await User.findByIdAndUpdate(userId, { $inc: { balance: betAmount } });
            }
            for (const betId of awayBets) {
                const bet = await Bet.findOne({ _id: betId });
                const { _id, userId, bet: betAmount } = bet;

                await Bet.findByIdAndUpdate(_id, { status: 'Cancelled' });
                await User.findByIdAndUpdate(userId, { $inc: { balance: betAmount } });
            }
            await BetPool.findOneAndUpdate({ uid }, { $set: { result: 'Cancelled' } });
        }
    }

}

module.exports = matchResults;
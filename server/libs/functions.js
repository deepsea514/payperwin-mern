const PromotionLog = require('../models/promotionlog');
const FinancialLog = require('../models/financiallog');
const BetPool = require('../models/betpool');
const Bet = require('../models/bet');
const ParlayBetPool = require('../models/parlaybetpool');
const Preference = require('../models/preference');
const ErrorLog = require('../models/errorlog');
const User = require('../models/user');

const { ObjectId } = require('mongodb');
const sgMail = require('@sendgrid/mail');

const simpleresponsive = require('../emailtemplates/simpleresponsive');
const sendSMS = require('./sendSMS');
const config = require('../../config.json');

const fromEmailName = 'PAYPER WIN';
const fromEmailAddress = 'donotreply@payperwin.com';
const FinancialStatus = config.FinancialStatus;

const checkSignupBonusPromotionEnabled = async (user_id) => {
    const promotionlog = await PromotionLog.aggregate([
        {
            $lookup: {
                from: 'promotions',
                localField: 'promotion',
                foreignField: '_id',
                as: 'promotion'
            }
        },
        {
            $match: {
                user: new ObjectId(user_id),
                "promotion.type": "_100_SignUpBonus"
            }
        }
    ]);
    if (promotionlog.length > 0) return true;
    return false;
}

const isSignupBonusUsed = async (user_id) => {
    const signupBonus = await FinancialLog.findOne({
        financialtype: 'signupbonus',
        user: user_id
    });
    if (signupBonus) return true;
    return false;
}

const ID = () => {
    return '' + Math.random().toString(10).substr(2, 9);
};

const calculateToWinFromBet = (bet, americanOdds) => {
    const stake = Math.abs(Number(Number(bet).toFixed(2)));
    const decimalOdds = americanOdds > 0 ? (americanOdds / 100) : -(100 / americanOdds);
    const calculateWin = (stake * 1) * decimalOdds;
    const roundToPennies = Number(calculateWin.toFixed(2));
    return roundToPennies;
}

const calculateBetsStatus = async (betpoolUid) => {
    const betpool = await BetPool.findOne({ uid: new RegExp(`^${betpoolUid}$`, 'i') });
    if (!betpool) {
        return;
    }
    const { homeBets, awayBets, teamA, teamB, drawBets, nonDrawBets, teamNonDraw, teamDraw } = betpool;
    const bets = await Bet.find({ _id: { $in: [...homeBets, ...awayBets, ...drawBets, ...nonDrawBets] } });
    const payPool = {
        home: teamB.betTotal,
        away: teamA.betTotal,
        draw: teamNonDraw.betTotal,
        nondraw: teamDraw.betTotal,
    }
    const betAmounts = {
        home: teamA.betTotal,
        away: teamB.betTotal,
        draw: teamDraw.betTotal,
        nondraw: teamNonDraw.betTotal,
    }
    for (const bet of bets) {
        const { _id, bet: betAmount, toWin, pick, matchingStatus: currentMatchingStatus, payableToWin: currentPayableToWin, sportsbook } = bet;
        let payableToWin = 0;
        if (payPool[pick] && payPool[pick] > 0 && betAmounts[pick]) {
            const rate = betAmount / betAmounts[pick];
            payableToWin = Number((payPool[pick] * rate).toFixed(2));
        }
        let matchingStatus;
        if (payableToWin >= toWin) matchingStatus = sportsbook ? 'Accepted' : 'Matched';
        else if (payableToWin === 0) matchingStatus = 'Pending';
        else matchingStatus = sportsbook ? 'Partial Accepted' : 'Partial Match';
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
}

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const get2FACode = () => {
    return '' + Math.random().toString(10).substr(2, 6);
};

const calculateParlayBetsStatus = async (id) => {
    const betpool = await ParlayBetPool.findById(id);
    if (!betpool) {
        return;
    }
    const { homeBets, awayBets, teamA, teamB } = betpool;
    const bets = await Bet.find({ _id: { $in: [...homeBets, ...awayBets] } });
    const payPool = {
        home: teamB.betTotal,
        away: teamA.betTotal,
    }
    const betAmounts = {
        home: teamA.betTotal,
        away: teamB.betTotal,
    }
    for (const bet of bets) {
        const { _id, bet: betAmount, toWin, pick, matchingStatus: currentMatchingStatus, payableToWin: currentPayableToWin } = bet;
        let payableToWin = 0;
        if (payPool[pick] && payPool[pick] > 0 && betAmounts[pick]) {
            const rate = betAmount / betAmounts[pick];
            payableToWin = Number((payPool[pick] * rate).toFixed(2));
        }
        let matchingStatus;
        if (payableToWin >= toWin) matchingStatus = 'Matched';
        else if (payableToWin === 0) matchingStatus = 'Pending';
        else matchingStatus = 'Partial Match';
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
}

const isFreeWithdrawalUsed = async (user) => {
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const freeWithdraw = await FinancialLog.find({
        fee: 0,
        createdAt: { $gte: firstDay },
        user: user._id,
        financialtype: 'withdraw'
    });

    if (freeWithdraw && freeWithdraw.length) {
        return true
    }
    return false;
}

const checkFirstDeposit = async (user) => {
    const deposits = await FinancialLog.find({
        financialtype: 'deposit',
        user: user._id,
        status: FinancialStatus.success
    });
    if (deposits.length == 1) return true;
    return false;
}

const getMaxWithdraw = async (user) => {
    let totalwagers = await Bet.aggregate(
        { $match: { userId: new ObjectId(user._id), } },
        { $group: { _id: null, total: { $sum: "$bet" } } }
    );
    if (totalwagers.length) totalwagers = totalwagers[0].total;
    else totalwagers = 0;

    let totalwinbet = await Bet.aggregate(
        {
            $match: {
                userId: new ObjectId(user._id),
                status: "Settled - Win",
            }
        },
        { $group: { _id: null, total: { $sum: "$payableToWin" } } }
    );
    if (totalwinbet.length) totalwinbet = totalwinbet[0].total;
    else totalwinbet = 0;

    let totaldeposit = await FinancialLog.aggregate(
        {
            $match: {
                user: user._id,
                financialtype: "deposit"
            }
        },
        { $group: { _id: null, total: { $sum: "$amount" } } }
    )
    if (totaldeposit.length) totaldeposit = totaldeposit[0].total;
    else totaldeposit = 0;

    let signupBonusAmount = 0;
    const signUpBonusEnabled = await checkSignupBonusPromotionEnabled(user._id);
    if (signUpBonusEnabled) {
        const signUpBonus = await FinancialLog.findOne({
            user: user._id,
            financialtype: 'signupbonus'
        });
        if (signUpBonus) {
            signupBonusAmount = signUpBonus.amount;
        }
    }

    let inviteBonus = await FinancialLog.aggregate(
        {
            $match: {
                user: user._id,
                financialtype: 'invitebonus',
            }
        },
        { $group: { _id: null, total: { $sum: "$amount" } } }
    )
    if (inviteBonus.length) inviteBonus = inviteBonus[0].total;
    else inviteBonus = 0;

    let usedCredit = await FinancialLog.aggregate(
        {
            $match: {
                user: new ObjectId(user._id),
                financialtype: { $in: ['transfer-out', 'transfer-in'] }
            }
        },
        { $group: { _id: "$financialtype", total: { $sum: "$amount" } } }
    );
    const inamount = usedCredit.find(credit => credit._id == 'transfer-in');
    const outamount = usedCredit.find(credit => credit._id == 'transfer-out');
    usedCredit = (outamount ? outamount.total : 0) - (inamount ? inamount.total : 0);

    let maxwithdraw = 0;
    if (totalwagers >= ((signupBonusAmount + inviteBonus) * 4 + (totaldeposit + (inamount ? inamount.total : 0)) * 5)) {
        maxwithdraw = totalwinbet + signupBonusAmount + inviteBonus + totaldeposit + (inamount ? inamount.total : 0);
    }
    if (maxwithdraw) {
        maxwithdraw = Number((maxwithdraw - usedCredit).toFixed(2));
    }
    return maxwithdraw;
}

const asyncFilter = async (arr, predicate) => {
    const results = await Promise.all(arr.map(predicate));
    return arr.filter((_v, index) => results[index]);
}

const getLinePoints = (pickName, pick, lineQuery) => {
    let linePoints = pickName.split(' ');
    if (lineQuery.type == 'moneyline') {
        linePoints = null;
    } else if (['spread', 'alternative_spread'].includes(lineQuery.type)) {
        linePoints = Number(linePoints[linePoints.length - 1]);
        if (pick == 'away') linePoints = -linePoints;
    } else if (['total', 'alternative_total', 'home_total', 'away_total'].includes(lineQuery.type)) {
        linePoints = Number(linePoints[linePoints.length - 1]);
    }
    return linePoints;
}

const sendBetWinConfirmEmail = async (user, bet) => {
    const { payableToWin, isParlay, bet: betAmount, pickOdds, teamA, teamB, lineQuery, origin } = bet;
    const numberOdds = Number(Number(pickOdds).toFixed(0));
    const preference = await Preference.findOne({ user: user._id });
    if (!preference || !preference.notification_settings || preference.notification_settings.win_confirmation.email) {
        const msg = {
            from: `${fromEmailName} <${fromEmailAddress}>`,
            to: user.email,
            subject: 'You won a wager!',
            text: `Congratulations! You won $${Number(payableToWin).toFixed(2)}. View Result Details: https://www.payperwin.com/history`,
            html: simpleresponsive(`
                    <p>
                        Congratulations! You won $${Number(payableToWin).toFixed(2)}.
                    </p>
                    <ul>
                        <li><b>Game:</b> ${origin == 'custom' ? lineQuery.eventName : (isParlay ? 'Parlay Bet' : `${teamA.name} VS ${teamB.name}`)}</li>
                        <li><b>Wager:</b> $${Number(betAmount).toFixed(2)}</li>
                        <li><b>Odds:</b> ${numberOdds > 0 ? '+' + numberOdds : numberOdds}</li>
                    </ul>
                `,
                { href: 'https://www.payperwin.com/history', name: 'View Settled Bets' }
            ),
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
    if (user.roles.phone_verified && (!preference || !preference.notification_settings || preference.notification_settings.win_confirmation.sms)) {
        sendSMS(`Congratulations! You won $${payableToWin.toFixed(2)}.`, user.phone);
    }
}

const sendBetLoseConfirmEmail = async (user, loseAmount) => {
    const preference = await Preference.findOne({ user: user._id });
    if (!preference || !preference.notification_settings || preference.notification_settings.lose_confirmation.email) {
        const msg = {
            from: `${fromEmailName} <${fromEmailAddress}>`,
            to: user.email,
            subject: 'You lose a wager.',
            text: `😥 You lose $${loseAmount.toFixed(2)}. View Result Details: https://www.payperwin.com/history`,
            html: simpleresponsive(`
                    <p>
                    😥 You lose $${loseAmount.toFixed(2)}. View Result Details:
                    </p>
                `,
                { href: 'https://www.payperwin.com/history', name: 'View Settled Bets' }
            ),
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
    if (user.roles.phone_verified && (!preference || !preference.notification_settings || preference.notification_settings.lose_confirmation.sms)) {
        // sendSMS(`😥 You lose $${loseAmount.toFixed(2)}.`, user.phone);
    }
}

const sendBetCancelConfirmEmail = async (user, bet, fee, credited) => {
    const msg = {
        from: `${fromEmailName} <${fromEmailAddress}>`,
        to: user.email,
        subject: 'Your bet has been successfully cancelled.',
        text: `Your bet has been successfully cancelled.`,
        html: simpleresponsive(`
                    <p>
                    Your request to cancel the bet has been confirmed.
                    </p>
                    <ul>
                        <li><b>Game</b>: ${bet.isParlay ? 'Parlay Bet' : `${bet.teamA.name} VS ${bet.teamB.name}`}</li>
                        ${bet.isParlay ? bet.parlayQuery.map((query, index) => (`<li><b>Line ${index + 1}</b>: ${query.teamA.name} VS ${query.teamB.name}</li>`)).join('') : ''}
                        <li><b>Wager</b>: $${Number(bet.bet).toFixed(2)}</li>
                        <li><b>Penalty Fee(15%)</b>: $${Number(fee).toFixed(2)}</li>
                        <li><b>Account Credited</b>: $${Number(credited).toFixed(2)}</li>
                    </ul>
                    <p>View Details:</p>
                `,
            { href: 'https://www.payperwin.com/history', name: 'View Settled Bets' }
        ),
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

const sendBetCancelOpponentConfirmEmail = async (user, bet, credited) => {
    const msg = {
        from: `${fromEmailName} <${fromEmailAddress}>`,
        to: user.email,
        subject: 'Your opponent has cancelled the bet.',
        text: `Your opponent has cancelled the bet.`,
        html: simpleresponsive(`
                    <p>
                    Unfortunately your opponent has cancelled the bet for ${bet.isParlay ? 'Parlay Bet' : `${bet.teamA.name} VS ${bet.teamB.name}`}.
                    A penalty fee has been deducted from your opponent’s account and we have credited your account ${Number(credited).toFixed(2)} for the inconvenience.
                    </p>
                    <ul>
                        <li><b>Game</b>: ${bet.isParlay ? 'Parlay Bet' : `${bet.teamA.name} VS ${bet.teamB.name}`}</li>
                        ${bet.isParlay ? bet.parlayQuery.map((query, index) => (`<li><b>Line ${index + 1}</b>: ${query.teamA.name} VS ${query.teamB.name}</li>`)).join('') : ''}
                    </ul>
                    <p>View Details:</p>
                `,
            { href: 'https://www.payperwin.com/history', name: 'View Settled Bets' }
        ),
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

const ResetWinnerFinancialLog = async () => {
    //reseting wininer finacial logs amount and substracting user balance
    const oldfinancialLogs = await FinancialLog.find({ betId: { $in: [...homeBets, ...awayBets] }, method: { $in: ['betwon', 'betfee'] } });

    for (const oldfinancialLog of oldfinancialLogs) {
        const betAmount = oldfinancialLog.amount;
        const oldWinnerUserId = oldfinancialLog.user;

        if (oldfinancialLog.method === 'betwon') {
            await User.findOneAndUpdate({ _id: oldWinnerUserId }, { $inc: { balance: -betAmount } });
        }
        else if (oldfinancialLog.method === 'betfee') {
            await User.findOneAndUpdate({ _id: oldWinnerUserId }, { $inc: { balance: betAmount } });
        }
        //Remove wiiner previous financial log
        await FinancialLog.deleteOne({ _id: oldfinancialLog._id });
    }
}

const cancelBetPool = async (betpool) => {
    const { homeBets, awayBets, drawBets, nonDrawBets } = betpool;
    for (const betId of [...homeBets, ...awayBets, ...(drawBets ? drawBets : []), ...(nonDrawBets ? nonDrawBets : [])]) {
        const bet = await Bet.findById(betId);
        if (bet) {
            const { _id, userId, bet: betAmount } = bet;
            await bet.update({ status: 'Cancelled' });
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
        }
    }
    await betpool.update({ $set: { result: 'Cancelled' } });
}

module.exports = {
    checkSignupBonusPromotionEnabled,
    isSignupBonusUsed,
    checkFirstDeposit,
    ID,
    calculateToWinFromBet,
    calculateBetsStatus,
    calculateParlayBetsStatus,
    get2FACode,
    isFreeWithdrawalUsed,
    asyncFilter,
    getLinePoints,
    getMaxWithdraw,
    sendBetWinConfirmEmail,
    sendBetLoseConfirmEmail,
    sendBetCancelConfirmEmail,
    sendBetCancelOpponentConfirmEmail,
    cancelBetPool
}
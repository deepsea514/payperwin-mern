const PromotionLog = require('../models/promotionlog');
const FinancialLog = require('../models/financiallog');
const BetPool = require('../models/betpool');
const Bet = require('../models/bet');
const EventBetPool = require('../models/eventbetpool');
const ParlayBetPool = require('../models/parlaybetpool');
const { ObjectId } = require('mongodb');
const config = require('../../config.json');

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
        console.log('BetPool not found.');
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

const calculateCustomBetsStatus = async (eventId) => {
    const betpool = await EventBetPool.findOne({ eventId: eventId });
    const { homeBets, awayBets, teamA, teamB } = betpool;

    const bets = await Bet.find({ _id: { $in: [...homeBets, ...awayBets] } });

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
}

const calculateParlayBetsStatus = async (id) => {
    const betpool = await ParlayBetPool.findById(id);
    if (!betpool) {
        console.log('BetPool not found.');
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
        createdAt: {
            $gte: firstDay
        },
        user: user._id,
        financialtype: 'withdraw'
    });

    if (freeWithdraw && freeWithdraw.length) {
        return true
    }
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
        { $group: { _id: null, total: { $sum: "$credited" } } }
    );
    if (totalwinbet.length) totalwinbet = totalwinbet[0].total;
    else totalwinbet = 0;

    let totaldeposit = await FinancialLog.aggregate(
        { $match: { financialtype: "deposit" } },
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

    let maxwithdraw = 0;
    if (signupBonusAmount) {
        if (totalwagers >= (signupBonusAmount * 8 + totaldeposit * 5)) {
            maxwithdraw = totalwinbet;
        }
    } else {
        if (totalwagers >= totaldeposit * 5) {
            maxwithdraw = totalwinbet
        }
    }

    maxwithdraw = Number(maxwithdraw.toFixed(2));
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
    } else if (['total', 'alternative_total'].includes(lineQuery.type)) {
        linePoints = Number(linePoints[linePoints.length - 1]);
    }
    return linePoints;
}

module.exports = {
    checkSignupBonusPromotionEnabled,
    isSignupBonusUsed,
    ID,
    calculateToWinFromBet,
    calculateBetsStatus,
    calculateParlayBetsStatus,
    get2FACode,
    calculateCustomBetsStatus,
    isFreeWithdrawalUsed,
    asyncFilter,
    getLinePoints,
    getMaxWithdraw
}
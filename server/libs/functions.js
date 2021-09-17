const PromotionLog = require('../models/promotionlog');
const FinancialLog = require('../models/financiallog');
const BetPool = require('../models/betpool');
const Bet = require('../models/bet');
const EventBetPool = require('../models/eventbetpool');
const { ObjectId } = require('mongodb');

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
        console.log('Betpool not found.');
    }
    const { homeBets, awayBets, teamA, teamB } = betpool;
    // console.log(homeBets, awayBets);
    const bets = await Bet.find({
        _id:
        {
            $in: [
                ...homeBets,
                ...awayBets,
            ]
        }
    });
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
            // const timeout = getRandomInt(3, 10);
            // setTimeout(async () => {
            // try {
            await Bet.findOneAndUpdate({ _id }, betChanges);
            //     } catch (error) {
            //         console.error(error);
            //     }
            // }, timeout);
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

    const bets = await Bet.find({
        _id:
        {
            $in: [
                ...homeBets,
                ...awayBets,
            ]
        }
    });

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

const isFreeWithdrawalUsed = async (user) => {
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const freeWithdraw = await FinancialLog.find({
        fee: 0,
        createdAt: {
            $gte: firstDay
        },
        user: user._id,
        type: 'withdraw'
    });

    if (freeWithdraw && freeWithdraw.length) {
        return true
    }
    return false;
}

module.exports = {
    checkSignupBonusPromotionEnabled,
    isSignupBonusUsed,
    ID,
    calculateToWinFromBet,
    calculateBetsStatus,
    get2FACode,
    calculateCustomBetsStatus,
    isFreeWithdrawalUsed
}
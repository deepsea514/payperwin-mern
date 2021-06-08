const mongoose = require('mongoose');

const { Schema } = mongoose;

const BetSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        lineQuery: Object,
        lineId: String,
        teamA: {
            name: String,
            odds: String,
        },
        teamB: {
            name: String,
            odds: String,
        },
        sportName: String,
        pick: String,
        pickName: String,
        pickOdds: String,
        oldOdds: String,
        bet: Number,
        toWin: Number,
        fee: Number,
        matchStartDate: Date,
        // lineType: String, // REDUNDANT
        // index: Number, // REDUNDANT
        result: String, // team name that won
        credited: Number, // amount won or lost
        walletBeforeCredited: Number, // to show user how it changed their wallet
        status: String, // undefined, Settled, Cancelled
        matchingStatus: String, // Matched, Partial, Waiting
        homeScore: Number,
        awayScore: Number,
        payableToWin: Number, // how much has been matched with opposing bets
        // betStartDate: Date,
        // betEndDate: Date,
        transactionID: { type: String, unique: true },
        origin: String,
    },
    {
        timestamps: true,
    },
);

const Bet = mongoose.model('Bet', BetSchema);

module.exports = Bet;

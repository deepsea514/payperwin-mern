const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ParlayBetPoolSchema = new Schema(
    {
        parlayQuery: { type: Array },
        teamA: {
            odds: String,
            betTotal: Number,
            toWinTotal: Number,
        },
        teamB: {
            odds: String,
            betTotal: Number,
            toWinTotal: Number,
        },
        matchStartDate: Date,
        result: String,
        homeBets: [{ type: Schema.Types.ObjectId, ref: "Bet" }],
        awayBets: [{ type: Schema.Types.ObjectId, ref: "Bet" }],
        origin: { type: String, default: 'bet365' }
    },
    {
        timestamps: true,
    },
);

const ParlayBetPool = mongoose.model('ParlayBetPool', ParlayBetPoolSchema);

module.exports = ParlayBetPool;

const mongoose = require('mongoose');

const { Schema } = mongoose;

const BetPoolSchema = new Schema(
    {
        uid: { type: String, index: { unique: true } },
        sportId: String,
        sportName: String,
        leagueId: String,
        eventId: String,
        lineId: String,
        teamA: {
            name: String,
            odds: String,
            betTotal: Number,
            toWinTotal: Number,
        },
        teamB: {
            name: String,
            odds: String,
            betTotal: Number,
            toWinTotal: Number,
        },
        points: Number, // hdp or total points
        matchStartDate: Date,
        lineType: String,
        lineSubType: { type: String, default: null },
        result: String,
        homeBets: [{ type: Schema.Types.ObjectId, ref: "Bet" }],
        awayBets: [{ type: Schema.Types.ObjectId, ref: "Bet" }],
        homeScore: Number,
        awayScore: Number,
        origin: { type: String, default: 'bet365' }
        // betStartDate: Date,
        // betEndDate: Date,
    },
    {
        timestamps: true,
    },
);

const BetPool = mongoose.model('BetPool', BetPoolSchema);

module.exports = BetPool;

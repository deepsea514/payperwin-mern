const mongoose = require('mongoose');

const { Schema } = mongoose;

const BetpoolSchema = new Schema(
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

const Betpool = mongoose.model('Betpool', BetpoolSchema);

module.exports = Betpool;

const mongoose = require('mongoose');

const { Schema } = mongoose;

const EventBetPoolSchema = new Schema(
    {
        eventId: { type: Schema.Types.ObjectId, ref: "Event" },
        teamA: {
            name: { type: String },
            odds: { type: String },
            betTotal: { type: Number },
            toWinTotal: { type: Number },
            score: { type: Number },
        },
        teamB: {
            name: { type: String },
            odds: { type: String },
            betTotal: { type: Number },
            toWinTotal: { type: Number },
            score: { type: Number },
        },
        homeBets: [{ type: Schema.Types.ObjectId, ref: "Bet" }],
        awayBets: [{ type: Schema.Types.ObjectId, ref: "Bet" }],
        matchStartDate: Date,
        lineType: String,
        result: String,
    },
    {
        timestamps: true,
    },
);

const EventBetPool = mongoose.model('EventBetPool', EventBetPoolSchema);

module.exports = EventBetPool;

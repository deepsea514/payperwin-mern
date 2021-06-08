const mongoose = require('mongoose');

const { Schema } = mongoose;

const EventBetpoolSchema = new Schema(
    {
        eventId: { type: Schema.Types.ObjectId, ref: "Event" },
        candidates: [{
            name: String,
            odds: String,
            betTotal: Number,
            toWinTotal: Number,
            score: Number,
            bets: [{ type: Schema.Types.ObjectId, ref: "Bet" }]
        }],
        matchStartDate: Date,
        lineType: String,
        result: String,
    },
    {
        timestamps: true,
    },
);

const EventBetpool = mongoose.model('EventBetpool', EventBetpoolSchema);

module.exports = EventBetpool;

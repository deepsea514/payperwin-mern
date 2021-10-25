const mongoose = require('mongoose');

const { Schema } = mongoose;

const AutoBetSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        usersExcluded: [{ type: Schema.Types.ObjectId, ref: "User" }],
        priority: Number,
        rollOver: { type: Boolean, default: false },
        maxRisk: Number,
        budget: Number,
        sportsbookBudget: Number,
        acceptParlay: { type: Boolean, default: false },
        parlayBudget: Number,
        status: String,
        sports: { type: Array, default: [] },
        side: { type: Array, default: [] },
        betType: { type: Array, default: [] },
        referral_code: { type: String, default: null },
    },
    {
        timestamps: true,
    },
);

const AutoBet = mongoose.model('AutoBet', AutoBetSchema);

module.exports = AutoBet;

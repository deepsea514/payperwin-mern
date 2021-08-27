const mongoose = require('mongoose');

const { Schema } = mongoose;

const AutoBetSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        priority: Number,
        rollOver: { type: Boolean, default: 'false' },
        maxRisk: Number,
        budget: Number,
        peorid: String,
        status: String,
        sports: { type: Array, default: [] },
        side: { type: Array, default: [] },
        betType: { type: Array, default: [] },
        referral_code: { type: String, default: null },
        deletedAt: Date,
    },
    {
        timestamps: true,
    },
);

const AutoBet = mongoose.model('AutoBet', AutoBetSchema);

module.exports = AutoBet;

const mongoose = require('mongoose');

const { Schema } = mongoose;

const AutoBetSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        priority: Number,
        maxRisk: Number,
        budget: Number,
        peorid: String,
        status: String,
        deletedAt: Date,
    },
    {
        timestamps: true,
    },
);

const AutoBet = mongoose.model('AutoBet', AutoBetSchema);

module.exports = AutoBet;

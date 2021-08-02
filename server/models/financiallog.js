const mongoose = require('mongoose');
const { Schema } = mongoose;
const config = require("../../config.json");
const FinancialStatus = config.FinancialStatus;

const FinancialLogSchema = new Schema(
    {
        financialtype: { type: String, required: true },
        uniqid: { type: String, required: true },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        reason: {
            type: Schema.Types.ObjectId,
            ref: "DepositReason"
        },
        amount: { type: Number, required: true },
        method: { type: String, required: true },
        note: { type: String, default: null },
        status: { type: String, default: FinancialStatus.pending },
        fee: { type: Number, default: 0 },
        deletedAt: Date,
    },
    {
        timestamps: true,
    },
);

const FinancialLog = mongoose.model('FinancialLog', FinancialLogSchema);

module.exports = FinancialLog;
const mongoose = require('mongoose');

const { Schema } = mongoose;

const DepositReasonSchema = new Schema(
    {
        title: String
    },
    {
        timestamps: true,
    },
);

const DepositReason = mongoose.model('DepositReason', DepositReasonSchema);

module.exports = DepositReason;

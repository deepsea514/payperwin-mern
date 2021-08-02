const mongoose = require('mongoose');

const { Schema } = mongoose;

const AutoBetLogSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        amount: Number
    },
    {
        timestamps: true,
    },
);

const AutoBetLog = mongoose.model('AutoBetLog', AutoBetLogSchema);

module.exports = AutoBetLog;

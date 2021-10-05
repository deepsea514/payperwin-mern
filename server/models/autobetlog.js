const mongoose = require('mongoose');

const { Schema } = mongoose;

const AutoBetLogSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        amount: Number,
        type: String
    },
    {
        timestamps: true,
    },
);

const AutoBetLog = mongoose.model('AutoBetLog', AutoBetLogSchema);

module.exports = AutoBetLog;

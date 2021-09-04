const mongoose = require('mongoose');

const { Schema } = mongoose;

const LoyaltyLogSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        point: Number,
    },
    {
        timestamps: true,
    },
);

const LoyaltyLog = mongoose.model('LoyaltyLog', LoyaltyLogSchema);

module.exports = LoyaltyLog;

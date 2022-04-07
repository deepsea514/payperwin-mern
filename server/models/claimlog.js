const mongoose = require('mongoose');

const { Schema } = mongoose;

const ClaimLogSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        points: Number,
    },
    {
        timestamps: true,
    },
);

const ClaimLog = mongoose.model('ClaimLog', ClaimLogSchema);

module.exports = ClaimLog;

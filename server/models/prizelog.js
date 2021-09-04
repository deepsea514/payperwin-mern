const mongoose = require('mongoose');

const { Schema } = mongoose;

const PrizeLogSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        type: String,
    },
    {
        timestamps: true,
    },
);

const PrizeLog = mongoose.model('PrizeLog', PrizeLogSchema);

module.exports = PrizeLog;

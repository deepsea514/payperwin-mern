const mongoose = require('mongoose');

const { Schema } = mongoose;

const PromotionLogSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        promotion: {
            type: Schema.Types.ObjectId,
            ref: "Promotion"
        },
        ip_address: String,
    },
    {
        timestamps: true,
    },
);

const PromotionLog = mongoose.model('PromotionLog', PromotionLogSchema);

module.exports = PromotionLog;

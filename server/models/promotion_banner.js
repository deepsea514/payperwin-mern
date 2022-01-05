const mongoose = require('mongoose');

const { Schema } = mongoose;

const PromotionBannerSchema = new Schema(
    {
        path: { type: String, required: true },
        type: { type: String, required: true },
        priority: { type: Number, required: true },
    },
    {
        timestamps: true,
    },
);

const PromotionBanner = mongoose.model('PromotionBanner', PromotionBannerSchema);

module.exports = PromotionBanner;

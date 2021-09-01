const mongoose = require('mongoose');

const { Schema } = mongoose;

const PromotionSchema = new Schema(
    {
        name: { type: String, unique: true },
        description: String,
        expiration_date: Date,
        type: String,
        number_of_usage: Number, // if it is -1, it is unlimited
        usage_limit: Number,
        usage_for: String,
        value: Number,
    },
    {
        timestamps: true,
    },
);

const Promotion = mongoose.model('Promotion', PromotionSchema);

module.exports = Promotion;

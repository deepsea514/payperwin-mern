const mongoose = require('mongoose');

const { Schema } = mongoose;

const GiftCardSchema = new Schema(
    {
        card_number: { type: String, required: true, unique: true },
        amount: Number,
        used: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    },
);

const GiftCard = mongoose.model('GiftCard', GiftCardSchema);

module.exports = GiftCard;

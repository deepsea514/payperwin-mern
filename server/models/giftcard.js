const mongoose = require('mongoose');

const { Schema } = mongoose;

const GiftCardSchema = new Schema(
    {
        card_number: { type: String, required: true, unique: true },
        amount: Number,
        usedAt: { type: Date, default: null },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        }
    },
    {
        timestamps: true,
    },
);

const GiftCard = mongoose.model('GiftCard', GiftCardSchema);

module.exports = GiftCard;

const mongoose = require('mongoose');

const { Schema } = mongoose;

const BetSportsBookSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        originId: String,
        Name: String,
        WagerInfo: Object,
    },
    {
        timestamps: true,
    },
);

const BetSportsBook = mongoose.model('BetSportsBook', BetSportsBookSchema);

module.exports = BetSportsBook;

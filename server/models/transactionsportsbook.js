const mongoose = require('mongoose');

const { Schema } = mongoose;

const TransactionSportsBookSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        TransactionId: String,
        TransactionType: String,
        TransactionDate: String,
        Amount: Number,
    },
    {
        timestamps: true,
    },
);

const TransactionSportsBook = mongoose.model('TransactionSportsBook', TransactionSportsBookSchema);

module.exports = TransactionSportsBook;

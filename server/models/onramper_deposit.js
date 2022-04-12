const mongoose = require('mongoose');
const { Schema } = mongoose;

const OnramperDepositSchema = new Schema(
    {
        data: { type: Object },
    },
    { timestamps: true }
);

const OnramperDeposit = mongoose.model('OnramperDeposit', OnramperDepositSchema);

module.exports = OnramperDeposit;

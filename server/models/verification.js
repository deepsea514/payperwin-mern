const mongoose = require('mongoose');
const { Schema } = mongoose;

const VerificationSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        address: { type: Object, default: null },
        identification: { type: Object, default: null },
    },
    {
        timestamps: true,
    }
);

const Verification = mongoose.model('Verification', VerificationSchema);

module.exports = Verification;

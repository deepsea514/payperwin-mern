const mongoose = require('mongoose');
const { Schema } = mongoose;

const AffiliateCommissionSchema = new Schema(
    {
        affiliater: { type: Schema.Types.ObjectId, ref: "Affiliate", required: true },
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        amount: { type: Number, required: true },
    },
    { timestamps: true }
);

const AffiliateCommission = mongoose.model('AffiliateCommission', AffiliateCommissionSchema);

module.exports = AffiliateCommission;

const mongoose = require('mongoose');
const { Schema } = mongoose;

const TevoClientSchema = new Schema(
    {
        user_id: { type: Schema.Types.ObjectId, ref: "User" },
        addresses: Array,
        company: Object,
        email_addresses: Array,
        id: String,
        name: String,
        notes: String,
        affiliate_store: Object,
        phone_numbers: Array,
        primary_credit_card: Object,
        primary_shipping_address: Object,
        primary_billing_address: Object,
        primary_phone_number: Object,
        primary_email_address: Object,
        tags: Array,
        url: String,
        balance: Number,
        commission_junction_sid: String
    },
    { timestamps: true, },
);

const TevoClient = mongoose.model('TevoClient', TevoClientSchema);

module.exports = TevoClient;

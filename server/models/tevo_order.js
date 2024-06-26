const mongoose = require('mongoose');
const { Schema } = mongoose;

const TevoOrderSchema = new Schema(
    {
        id: { type: String, required: true, index: { unique: true } },
        user_id: { type: Schema.Types.ObjectId, ref: "User" },
        created_by: { type: Object },
        updated_at: { type: Date },
        partner: { type: Boolean },
        seller_rejection_reason: { type: String },
        service_fee: { type: Number },
        patron_type: { type: String },
        was_auto_pended: { type: String },
        seller_cancellation_notes: { type: String },
        seller_is_pos: { type: Boolean },
        url: { type: String },
        created_at: { type: Date },
        discount: { type: Number },
        was_auto_accepted: { type: String },
        spec: { type: Boolean },
        refunded: { type: Number },
        pending_non_refund_payments_total: { type: Number },
        buyer_rejection_reason: { type: String },
        seller_state: { type: String },
        substitutions: { type: Array },
        was_auto_canceled: { type: String },
        oth_created: { type: Boolean },
        created_by_ip_address: { type: String },
        billing_address: { type: Object },
        buyer_cancellation_notes: { type: String },
        kount_score: { type: String },
        completed_non_refund_payments_total: { type: Number },
        penalties_total: { type: Number },
        order_type: { type: String },
        payments: { type: Array },
        kount_notifications: { type: String },
        subtotal: { type: Number },
        balance: { type: Number },
        oid: { type: String, required: true },
        buyer_state: { type: String },
        shipment_snapshot: { type: Object },
        kount_status: { type: String },
        seller: { type: Object },
        items: { type: Array },
        seller_cancellation_reason: { type: String },
        state: { type: String },
        kount_transactions: { type: String },
        tax: { type: Number },
        shipping_address: { type: Object },
        buyer: { type: Object },
        returns_total: { type: Number },
        substitute_order_link_id: { type: String },
        notes: { type: Array },
        pending_balance: { type: Number },
        is_new_inventory: { type: Boolean },
        minfraud_response: { type: String },
        child_orders: { type: Array },
        seller_rejection_notes: { type: String },
        spec_fulfilled: { type: Boolean },
        buyer_cancellation_reason: { type: String },
        shipping: { type: Number },
        fee: { type: Number },
        additional_expense: { type: Number },
        placer: { type: Object },
        shipments: { type: Array },
        consignment: { type: Boolean },
        client: { type: Object },
        isPO: { type: Boolean },
        instructions: { type: String },
        reference: { type: String },
        buyer_rejection_notes: { type: String },
        total: { type: Number },

        deliveries: { type: Array },
        fraud_check_status: { type: String },
    },
    { timestamps: true, },
);

const TevoOrder = mongoose.model('TevoOrder', TevoOrderSchema);

module.exports = TevoOrder;

const mongoose = require('mongoose');
const { Schema } = mongoose;

const TicketEventSchema = new Schema(
    {
        name: { type: String, required: true },
        id: { type: Number, required: true, index: { unique: true } },
        products_eticket_count: { type: Number },
        products_count: { type: Number },
        owned_by_office: { type: Boolean },
        long_term_popularity_score: { type: Number },
        venue: { type: Object },
        configuration: { type: Object },
        popularity_score: { type: Number },
        categories: { type: Array, default: [] },
        state: { type: String },
        url: { type: String },
        notes: { type: String },
        occurs_at: { type: Date },
        performances: { type: Array, default: [] },
        listings: { type: Object, default: null }
    },
    { timestamps: true, },
);

const TicketEvent = mongoose.model('TicketEvent', TicketEventSchema);

module.exports = TicketEvent;

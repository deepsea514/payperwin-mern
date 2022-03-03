const mongoose = require('mongoose');
const { Schema } = mongoose;

const TicketPerformerSchema = new Schema(
    {
        name: { type: String, required: true },
        id: { type: Number, required: true, index: { unique: true } },
        slug: { type: String, required: true },
        url: { type: String, required: true },
        slug_url: { type: String, required: true },
        categories: { type: Array, default: [] },
        keywords: { type: String },
        popularity_score: { type: String },
        upcoming_events: Object,
        meta: Object
    },
    { timestamps: true, },
);

const TicketPerformer = mongoose.model('TicketPerformer', TicketPerformerSchema);

module.exports = TicketPerformer;

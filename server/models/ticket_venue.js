const mongoose = require('mongoose');
const { Schema } = mongoose;

const TicketVenueSchema = new Schema(
    {
        name: { type: String, required: true },
        id: { type: Number, required: true, index: { unique: true } },
        location: String,
        url: { type: String, required: true },
        country_code: String,
        keywords: { type: String },
        popularity_score: { type: String },
        upcoming_events: Object,
        address: Object,
    },
    { timestamps: true, },
);

const TicketVenue = mongoose.model('TicketVenue', TicketVenueSchema);

module.exports = TicketVenue;

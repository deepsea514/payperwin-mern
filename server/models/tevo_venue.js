const mongoose = require('mongoose');
const { Schema } = mongoose;

const TevoVenueSchema = new Schema(
    {
        name: { type: String, required: true },
        id: { type: Number, required: true, index: { unique: true } },
        location: String,
        url: { type: String, required: true },
        slug_url: { type: String, required: true },
        slug: { type: String, required: true },
        country_code: String,
        keywords: { type: String },
        popularity_score: { type: String },
        upcoming_events: Object,
        address: Object,
    },
    { timestamps: true, },
);

const TevoVenue = mongoose.model('TevoVenue', TevoVenueSchema);

module.exports = TevoVenue;

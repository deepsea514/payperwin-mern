const mongoose = require('mongoose');
const { Schema } = mongoose;

const TevoPerformerSchema = new Schema(
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
        meta: Object,
        gotFullData: { type: Boolean, default: false },
    },
    { timestamps: true, },
);

const TevoPerformer = mongoose.model('TevoPerformer', TevoPerformerSchema);

module.exports = TevoPerformer;

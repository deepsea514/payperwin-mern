const mongoose = require('mongoose');
const { Schema } = mongoose;
const config = require("../../config.json");

const FAQItemSchema = new Schema(
    {
        subject: { type: Schema.Types.ObjectId, ref: 'FAQSubject' },
        title: { type: String, required: true },
        content: { type: String, required: true }
    },
    {
        timestamps: true,
    },
);

const FAQItem = mongoose.model('FAQItem', FAQItemSchema);

module.exports = FAQItem;

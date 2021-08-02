const mongoose = require('mongoose');
const { Schema } = mongoose;
const config = require("../../config.json");

const FAQSubjectSchema = new Schema(
    {
        title: { type: String, required: true },
        items: [{ type: Schema.Types.ObjectId, ref: "FAQItem", default: [] }]
    },
    {
        timestamps: true,
    },
);

const FAQSubject = mongoose.model('FAQSubject', FAQSubjectSchema);

module.exports = FAQSubject;

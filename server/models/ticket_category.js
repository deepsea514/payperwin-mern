const mongoose = require('mongoose');
const { Schema } = mongoose;

const TicketCategorySchema = new Schema(
    {
        name: { type: String, required: true },
        id: { type: String, required: true, index: { unique: true } },
        slug: { type: String, required: true },
        url: { type: String, required: true },
        slug_url: { type: String, required: true },
        sub_categories: { type: Array, default: [] }
    },
    { timestamps: true, },
);

const TicketCategory = mongoose.model('TicketCategory', TicketCategorySchema);

module.exports = TicketCategory;

const mongoose = require('mongoose');

const { Schema } = mongoose;

const SharedLineSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        url: { type: String, required: true },
        eventDate: { type: Date, required: true },
        uniqueId: { type: String, required: true },
        type: { type: String, required: true },
        subtype: { type: String, default: null },
        index: { type: Number },
    },
    {
        timestamps: true,
    },
);

const SharedLine = mongoose.model('SharedLine', SharedLineSchema);

module.exports = SharedLine;

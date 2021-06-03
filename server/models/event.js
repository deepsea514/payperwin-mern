const mongoose = require('mongoose');

const { Schema } = mongoose;

const EventSchema = new Schema(
    {
        name: String,
        candidates: Array, // {name: String, odds: Array, score: Number}
        startDate: Date,
        status: { type: Number, default: 0 },
        result: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    },
);

const Event = mongoose.model('Event', EventSchema);

module.exports = Event;

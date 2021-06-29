const mongoose = require('mongoose');

const { Schema } = mongoose;

const EventSchema = new Schema(
    {
        name: { type: String, unique: true, required: true },
        teamA: Object, // { name: String, odds: Array, currentOdds: Number }
        teamB: Object, // { name: String, odds: Array, currentOdds: Number }
        teamAScore: Number,
        teamBScore: Number,
        startDate: { type: Date, required: true },
        status: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    },
);

const Event = mongoose.model('Event', EventSchema);

module.exports = Event;

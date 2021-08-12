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
        approved: { type: Boolean, default: false },
        public: { type: Boolean, default: true },
        status: { type: Number, default: 0 },
        creator: { type: String, default: 'Admin' },
        user: { type: Schema.Types.ObjectId, default: null },
    },
    {
        timestamps: true,
    },
);

const Event = mongoose.model('Event', EventSchema);

module.exports = Event;

const mongoose = require('mongoose');

const { Schema } = mongoose;

const SportSchema = new Schema(
    {
        origin: { type: String, default: 'bet365' },
        originSportId: { type: Number, index: { unique: true } },
        name: String,
        shortName: String,
        originFixturesLast: Number,
        originOddsLast: Number,
        leagues: Array,
        liveLeagues: Array,
    },
    {
        timestamps: true,
    },
);

const Sport = mongoose.model('Sport', SportSchema);

module.exports = Sport;

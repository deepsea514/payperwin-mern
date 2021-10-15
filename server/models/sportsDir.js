const mongoose = require('mongoose');

const { Schema } = mongoose;

const SportsDirSchema = new Schema(
    {
        origin: { type: String, default: 'bet365' },
        sports: Object,
    },
    {
        timestamps: true,
    }
);

const SportsDir = mongoose.model('sportsdir', SportsDirSchema);

module.exports = SportsDir;

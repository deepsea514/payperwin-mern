const mongoose = require('mongoose');

const { Schema } = mongoose;

const SportSchema = new Schema(
  {
    origin: { type: String, default: 'pinnacle' },
    originSportId: { type: Number, index: { unique: true } },
    name: String,
    originFixturesLast: Number,
    originOddsLast: Number,
    leagues: Array,
  },
  {
    timestamps: true,
  },
);

const Sport = mongoose.model('Sport', SportSchema);

module.exports = Sport;

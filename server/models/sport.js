const mongoose = require('mongoose');

const { Schema } = mongoose;

const SportSchema = new Schema(
  {
    pinnacleSportId: { type: Number, index: { unique: true } },
    name: String,
    pinnacleFixturesLast: Number,
    pinnacleOddsLast: Number,
    leagues: Array,
  },
  {
    timestamps: true,
  },
);

const Sport = mongoose.model('Sport', SportSchema);

module.exports = Sport;

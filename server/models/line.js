const mongoose = require('mongoose');

const { Schema } = mongoose;

const LineSchema = new Schema(
  {
    uid: { type: String, index: { unique: true } },
    sportName: String,
    sportId: String,
    leagueId: String,
    eventId: String,
    lineId: String,
    eventName: String,
    homeName: String,
    awayName: String,
    homeOdds: String,
    awayOdds: String,
    points: Number,
    type: String,
    typeGroupIndex: Number,
    extra: Boolean,
    matchStartDate: Date,
    cutoffDate: Date,
  },
  {
    timestamps: true,
  },
);

const Line = mongoose.model('Line', LineSchema);

module.exports = Line;

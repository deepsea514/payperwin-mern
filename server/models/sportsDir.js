const mongoose = require('mongoose');

const { Schema } = mongoose;

const SportsDirSchema = new Schema({
  sports: Object,
});

const SportsDir = mongoose.model('sportsdir', SportsDirSchema);

module.exports = SportsDir;

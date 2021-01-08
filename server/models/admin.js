const mongoose = require('mongoose');

const { Schema } = mongoose;

const AdminSchema = new Schema({
  registrationOpen: Boolean,
  feesWallet: Number,
  betsWallet: Number,
  totalWallet: Number,
  userWallet: Number,
});

const Admin = mongoose.model('admin', AdminSchema);

module.exports = Admin;

const mongoose = require('mongoose');

const { Schema } = mongoose;

const AddonSchema = new Schema(
    {
        name: { type: String, required: true },
        value: { type: Object, required: true },
    },
    {
        timestamps: true,
    },
);

const Addon = mongoose.model('Addon', AddonSchema);

module.exports = Addon;

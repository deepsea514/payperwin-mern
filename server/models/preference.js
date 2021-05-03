const mongoose = require('mongoose');

const { Schema } = mongoose;

const PreferenceSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        oddsFormat: { type: String, default: 'american' },
        dateFormat: { type: String, default: 'dd-MM-yyyy' },
        timezone: { type: String, default: "-07:00" },
        lang: { type: String, default: 'en' },
    },
    {
        timestamps: true,
    },
);

const Preference = mongoose.model('Preference', PreferenceSchema);

module.exports = Preference;

const mongoose = require('mongoose');

const { Schema } = mongoose;

const PreferenceSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        oddsFormat: { type: String, default: 'american' },
        dateFormat: { type: String, default: 'dd-MM-yyyy' },
        timezone: { type: String },
        lang: { type: String, default: 'en' },
        display_mode: { type: String, default: 'light' },
        notify_email: { type: String, default: 'yes' },
        notify_phone: { type: String, default: 'no' },
    },
    {
        timestamps: true,
    },
);

const Preference = mongoose.model('Preference', PreferenceSchema);

module.exports = Preference;

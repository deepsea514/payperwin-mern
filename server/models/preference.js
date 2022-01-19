const mongoose = require('mongoose');

const { Schema } = mongoose;

const PreferenceSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        oddsFormat: { type: String, default: 'american' },
        dateFormat: { type: String, default: 'dd-MM-yyyy' },
        timezone: { type: String, default: 'pacific_time' },
        lang: { type: String, default: 'en' },
        display_mode: { type: String, default: 'dark' },
        pro_mode: { type: Boolean, default: true },
        notification_settings: {
            win_confirmation: {
                email: { type: Boolean, default: true },
                sms: { type: Boolean, default: true },
            },
            lose_confirmation: {
                email: { type: Boolean, default: false },
                sms: { type: Boolean, default: false },
            },
            wager_matched: {
                email: { type: Boolean, default: true },
                sms: { type: Boolean, default: true },
            },
            bet_accepted: {
                email: { type: Boolean, default: true },
                sms: { type: Boolean, default: true },
            },
            no_match_found: {
                email: { type: Boolean, default: true },
                sms: { type: Boolean, default: true },
            },
            bet_forward_reminder: {
                email: { type: Boolean, default: true },
                sms: { type: Boolean, default: true },
            },
            deposit_confirmation: {
                email: { type: Boolean, default: true },
                sms: { type: Boolean, default: true },
            },
            withdraw_confirmation: {
                email: { type: Boolean, default: true },
                sms: { type: Boolean, default: true },
            },
            other: {
                email: { type: Boolean, default: true },
                sms: { type: Boolean, default: true },
            },
        },
    },
    {
        timestamps: true,
    },
);

const Preference = mongoose.model('Preference', PreferenceSchema);

module.exports = Preference;

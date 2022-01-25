const mongoose = require('mongoose');

const { Schema } = mongoose;
const TeamSchema = new Schema(
    {
        sport: {
            id: { type: Number },
            name: { type: String }
        },
        id: { type: String, index: { unique: true } },
        name: String,
        image_id: String,
        cc: String
    },
    { timestamps: true },
);

const Team = mongoose.model('Team', TeamSchema);

module.exports = Team;

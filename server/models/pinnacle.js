const mongoose = require('mongoose');

const { Schema } = mongoose;

const PinnacleSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        loginId: {
            type: String,
            required: true,
        },
        userCode: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    },
);

const Pinnacle = mongoose.model('Pinnacle', PinnacleSchema);

module.exports = Pinnacle;

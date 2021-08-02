const mongoose = require('mongoose');

const { Schema } = mongoose;

const FrontendSchema = new Schema(
    {
        name: { type: String, required: true },
        value: { type: Object, required: true },
    },
    {
        timestamps: true,
    },
);

const Frontend = mongoose.model('Frontend', FrontendSchema);

module.exports = Frontend;

const mongoose = require('mongoose');

const { Schema } = mongoose;

const ErrorLogSchema = new Schema(
    {
        name: { type: String, required: true },
        error: { type: Object, required: true },
    },
    {
        timestamps: true,
    },
);

const ErrorLog = mongoose.model('ErrorLog', ErrorLogSchema);

module.exports = ErrorLog;

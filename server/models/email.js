const mongoose = require('mongoose');

const { Schema } = mongoose;

const EmailSchema = new Schema(
    {
        title: String,
        trigger: String,
        subject: String,
        content: String,
    },
    {
        timestamps: true,
    },
);

const Email = mongoose.model('Email', EmailSchema);

module.exports = Email;

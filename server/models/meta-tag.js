const mongoose = require('mongoose');

const { Schema } = mongoose;

const MetaTagSchema = new Schema(
    {
        pageTitle: {
            type: String,
            required: true,
            unique: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        keywords: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true,
    },
);

const MetaTag = mongoose.model('MetaTag', MetaTagSchema);

module.exports = MetaTag;

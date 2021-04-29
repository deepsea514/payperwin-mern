const mongoose = require('mongoose');

const { Schema } = mongoose;

const ApiCacheSchema = new Schema(
    {
        url: { type: String, required: true, index: { unique: true } },
        data: Object,
    },
    {
        timestamps: true,
    },
);

const ApiCache = mongoose.model('ApiCache', ApiCacheSchema);

module.exports = ApiCache;

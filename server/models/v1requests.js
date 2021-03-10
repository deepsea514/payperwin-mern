const mongoose = require('mongoose');

const { Schema } = mongoose;

const V1RequestSchema = new Schema({
    request: Object,
    type: String,
    params: Object
});

const V1Request = mongoose.model('V1Request', V1RequestSchema);

module.exports = V1Request;

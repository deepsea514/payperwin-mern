const mongoose = require('mongoose');
const { Schema } = mongoose;

const TripleANotificationSchema = new Schema({
    body: Object,
    rawBody: String,
    signature: String,
    succeed: { type: Boolean, default: false }
});

const TripleANotification = mongoose.model('TripleANotification', TripleANotificationSchema);
module.exports = TripleANotification;

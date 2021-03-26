const mongoose = require('mongoose');
const { Schema } = mongoose;

const PremierNotificationSchema = new Schema({
    parent_txid: String,
    txid: String,
    amount: String,
    amount_raw: Number,
    comment: String,
    tx_action: String,
    parent_txaction: String,
    status: String,
    descriptor: String,
    udf1: String,
    udf2: String,
    udf3: String,
    udf4: String,
    udf5: String,
    udf6: String,
    signature_v2: String,
    signature: String
});

const PremierNotification = mongoose.model('PremierNotification', PremierNotificationSchema);
module.exports = PremierNotification;

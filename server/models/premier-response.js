const mongoose = require('mongoose');
const { Schema } = mongoose;

const PremierResponseSchema = new Schema({
    status: String,
    tx_action: String,
    txid: String,
    customer_id: String,
    amount: String,
    sid: Number,
    descriptor: String,
    code: String,
    message: String,
    redirect_html: String,
    redirect_url: String,
    redirect_fields: String,
    etransfer_email: String,
    etransfer_message: String,
    etransfer_answer: String,
    udf1: String,
    udf2: String,
    udf3: String,
    udf4: String,
    udf5: String,
    udf6: String,
    signature: String
});

const PremierResponse = mongoose.model('PremierResponse', PremierResponseSchema);
module.exports = PremierResponse;

const crypto = require('crypto');
const config = require('../../config.json');
const PremiumPay = config.PremiumPay;

function generatePremierRequestSignature(email, amount, udf1, udf2, udf3, udf4, udf5, udf6) {
    if (!udf1) udf1 = '';
    if (!udf2) udf2 = '';
    if (!udf3) udf3 = '';
    if (!udf4) udf4 = '';
    if (!udf5) udf5 = '';
    if (!udf6) udf6 = '';

    const amount2 = Number(amount).toFixed(2);
    const string = `${PremiumPay.sid}|${email}|${amount2}|${udf1}${udf2}${udf3}${udf4}${udf5}${udf6}`;
    const secret = PremiumPay.rcode;
    const signature = crypto.createHmac('sha256', secret)
        .update(string)
        .digest('hex');
    return signature;
}

function generatePremierResponseSignature(txid, status, descriptor, udf1, udf2, udf3, udf4, udf5, udf6) {
    if (!udf1) udf1 = '';
    if (!udf2) udf2 = '';
    if (!udf3) udf3 = '';
    if (!udf4) udf4 = '';
    if (!udf5) udf5 = '';
    if (!udf6) udf6 = '';

    const string = `${PremiumPay.sid}|${txid}|${status}|${descriptor}|${udf1}${udf2}${udf3}${udf4}${udf5}${udf6}`;
    const secret = PremiumPay.rcode;
    const signature = crypto.createHmac('sha256', secret)
        .update(string)
        .digest('hex');
    return signature;
}

function generatePremierNotificationSignature(txid, status, amount_raw, descriptor) {
    amount_raw = Number(amount_raw).toFixed(2).toString();

    const string = `${PremiumPay.sid}|${txid}|${status}|${amount_raw}|${descriptor}`;
    const secret = PremiumPay.rcode;
    const signature = crypto.createHmac('sha256', secret)
        .update(string)
        .digest('hex');
    return signature;
}

module.exports = {
    generatePremierRequestSignature,
    generatePremierResponseSignature,
    generatePremierNotificationSignature
}
const crypto = require('crypto');
const Addon = require("../models/addon");

const generatePremierRequestSignature = async (email, amount, udf1, udf2, udf3, udf4, udf5, udf6) => {
    if (!udf1) udf1 = '';
    if (!udf2) udf2 = '';
    if (!udf3) udf3 = '';
    if (!udf4) udf4 = '';
    if (!udf5) udf5 = '';
    if (!udf6) udf6 = '';

    const premierpayAddon = await Addon.findOne({ name: 'premierpay' });
    if (!premierpayAddon || !premierpayAddon.value || !premierpayAddon.value.sid) {
        console.warn("PremierPay Api is not set");
        return '';
    }
    const { sid, rcode } = premierpayAddon.value;

    const amount2 = Number(amount).toFixed(2);
    const string = `${sid}|${email}|${amount2}|${udf1}${udf2}${udf3}${udf4}${udf5}${udf6}`;
    const secret = rcode;
    const signature = crypto.createHmac('sha256', secret)
        .update(string)
        .digest('hex');
    return signature;
}

const generatePremierResponseSignature = async (txid, status, descriptor, udf1, udf2, udf3, udf4, udf5, udf6) => {
    if (!udf1) udf1 = '';
    if (!udf2) udf2 = '';
    if (!udf3) udf3 = '';
    if (!udf4) udf4 = '';
    if (!udf5) udf5 = '';
    if (!udf6) udf6 = '';

    const premierpayAddon = await Addon.findOne({ name: 'premierpay' });
    if (!premierpayAddon || !premierpayAddon.value || !premierpayAddon.value.sid) {
        console.warn("PremierPay Api is not set");
        return '';
    }
    const { sid, rcode } = premierpayAddon.value;

    const string = `${sid}|${txid}|${status}|${descriptor}|${udf1}${udf2}${udf3}${udf4}${udf5}${udf6}`;
    const secret = rcode;
    const signature = crypto.createHmac('sha256', secret)
        .update(string)
        .digest('hex');
    return signature;
}

const generatePremierNotificationSignature = async (txid, status, amount_raw, descriptor) => {
    amount_raw = Number(amount_raw).toFixed(2).toString();

    const premierpayAddon = await Addon.findOne({ name: 'premierpay' });
    if (!premierpayAddon || !premierpayAddon.value || !premierpayAddon.value.sid) {
        console.warn("PremierPay Api is not set");
        return '';
    }
    const { sid, rcode } = premierpayAddon.value;

    const string = `${sid}|${txid}|${status}|${amount_raw}|${descriptor}`;
    const secret = rcode;
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
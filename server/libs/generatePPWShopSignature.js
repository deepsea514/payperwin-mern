const crypto = require('crypto');

const generatePPWShopSignature = async (card_number, amount) => {
    const prefix = 'PAYPERWIN - SHOP';
    const secret = 'PPWSHOP~!@#$%^&*()_+';
    const string = `${prefix}|${card_number}|${amount}`;
    const signature = crypto.createHmac('sha256', secret)
        .update(string)
        .digest('hex');
    return signature;
}


module.exports = generatePPWShopSignature
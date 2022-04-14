const axios = require('axios');
const Frontend = require('../../models/frontend');

const getCurrencyRate = async (API_KEY) => {
    try {
        const { data: { rates } } = await axios.get('https://api.getgeoapi.com/v2/currency/convert', {
            params: {
                api_key: API_KEY,
                from: 'USD',
                to: 'CAD',
                format: 'json',
            }
        });
        await Frontend.findOneAndUpdate({ name: 'currency_rate' }, { value: rates });
        console.log(new Date(), 'Got Currency Rate.');

    } catch (error) {
        console.error(error);
    }
}

module.exports = { getCurrencyRate };
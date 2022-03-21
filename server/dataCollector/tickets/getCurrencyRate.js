const axios = require('axios');
const Frontend = require('../../models/frontend');

const getCurrencyRate = async (API_KEY) => {
    try {
        const { data: { rates } } = await axios.get('http://api.exchangeratesapi.io/v1/latest', {
            params: {
                access_key: API_KEY,
                base: 'EUR',
                symbols: ['USD', 'CAD', 'EUR', 'GBP', 'AUD', 'JPY'].join(',')
            }
        });
        await Frontend.findOneAndUpdate({ name: 'currency_rate' }, { value: rates });
        console.log('Got Currency Rate.');

    } catch (error) {
        console.error(error);
    }
}

module.exports = { getCurrencyRate };
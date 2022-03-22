const axios = require('axios');
const Frontend = require('../../models/frontend');

const getCurrencyRate = async (API_KEY) => {
    try {
        const { data: { rates } } = await axios.get('https://api.getgeoapi.com/v2/currency/convert', {
            params: {
                api_key: API_KEY,//'82ed1714be13a2497b86a9905c77f5bdf4e766b7',
                from: 'USD',
                to: 'CAD',
                format: 'json',
            }
        });
        await Frontend.findOneAndUpdate({ name: 'currency_rate' }, { value: rates });
        console.log('Got Currency Rate.');

    } catch (error) {
        console.error(error);
    }
}

module.exports = { getCurrencyRate };
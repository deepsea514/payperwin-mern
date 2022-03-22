//Models
const Addon = require("../../models/addon");
//local helpers
//external libraries
const { getCategories } = require('./getCategories');
const { getVenues } = require('./getVenues');
const { getEvents } = require('./getEvents');
const { getCurrencyRate } = require("./getCurrencyRate");

const getTicketsInformation = async () => {
    try {
        const ticketAddon = await Addon.findOne({ name: 'ticketevolution' });
        if (!ticketAddon || !ticketAddon.value || !ticketAddon.value.api_token) {
            console.warn('Ticket Evolution Key is not set');
        } else {
            const API_TOKEN = ticketAddon.value.api_token;
            const API_SECRET = ticketAddon.value.api_secret;

            await getCategories(API_TOKEN, API_SECRET);
            await getVenues(API_TOKEN, API_SECRET);

            getEvents(API_TOKEN, API_SECRET);
            const EVENT_INTERVAL = 1.5 * 60 * 60 * 1000;
            setInterval(() => getEvents(API_TOKEN, API_SECRET), EVENT_INTERVAL);
        }

        const rateAddon = await Addon.findOne({ name: 'currency_getgeoapi' });
        if (!rateAddon || !rateAddon.value || !rateAddon.value.api_key) {
            console.warn('Exchange rates Api Key is not set');
        } else {
            const RATE_INTERVAL = 1 * 60 * 60 * 1000;
            getCurrencyRate(rateAddon.value.api_key);
            setInterval(() => getCurrencyRate(rateAddon.value.api_key), RATE_INTERVAL);
        }

    } catch (error) { console.error(error) }
}

module.exports = {
    getTicketsInformation
}
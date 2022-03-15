//Models
const Addon = require("../../models/addon");
//local helpers
const config = require('../../../config.json');
//external libraries
const mongoose = require('mongoose');
const { getCategories } = require('./getCategories');
// const { getPerformers } = require('./getPerformers');
const { getVenues } = require('./getVenues');
const { getEvents } = require('./getEvents');
require('dotenv').config();

// // Database
// mongoose.Promise = global.Promise;
// // const databaseName = 'PayPerWinDev'
// const databaseName = process.env.NODE_ENV === 'development' ? 'PayPerWinDev' : 'PayPerWin';
// mongoose.connect(`mongodb://${config.mongo.host}/${databaseName}`, {
//     authSource: "admin",
//     user: config.mongo.username,
//     pass: config.mongo.password,
//     useMongoClient: true,
// }).then(async () => {
//     console.info('Using database:', databaseName);

//     const ticketAddon = await Addon.findOne({ name: 'ticketevolution' });
//     if (!ticketAddon || !ticketAddon.value || !ticketAddon.value.api_token) {
//         console.warn('Ticket Evolution Key is not set');
//         return;
//     }
//     const API_TOKEN = ticketAddon.value.api_token;
//     const API_SECRET = ticketAddon.value.api_secret;

//     await getCategories(API_TOKEN, API_SECRET);
//     // await getPerformers(API_TOKEN, API_SECRET);
//     await getVenues(API_TOKEN, API_SECRET);

//     getEvents(API_TOKEN, API_SECRET);
//     const EVENT_INTERVAL = 3 * 60 * 60 * 1000;
//     setInterval(() => getEvents(API_TOKEN, API_SECRET), EVENT_INTERVAL);
// });


const getTicketsInformation = async () => {
    try {
        const ticketAddon = await Addon.findOne({ name: 'ticketevolution' });
        if (!ticketAddon || !ticketAddon.value || !ticketAddon.value.api_token) {
            console.warn('Ticket Evolution Key is not set');
            return;
        }
        const API_TOKEN = ticketAddon.value.api_token;
        const API_SECRET = ticketAddon.value.api_secret;

        await getCategories(API_TOKEN, API_SECRET);
        // await getPerformers(API_TOKEN, API_SECRET);
        await getVenues(API_TOKEN, API_SECRET);

        getEvents(API_TOKEN, API_SECRET);
        const EVENT_INTERVAL = 3 * 60 * 60 * 1000;
        setInterval(() => getEvents(API_TOKEN, API_SECRET), EVENT_INTERVAL);
    } catch (error) { }
}

module.exports = {
    getTicketsInformation
}
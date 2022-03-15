//Models
const Addon = require("../../models/addon");
//local helpers
const config = require('../../../config.json');
const matchResults = require('./matchResults');
const getLiveSportsLines = require('./getLiveSportsLines');
const { getAllSportsLines } = require('./getAllSportsLines');
const { getTicketsInformation } = require("../tickets");
//external libraries
const mongoose = require('mongoose');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

// Database
mongoose.Promise = global.Promise;
// const databaseName = 'PayPerWinDev'
const databaseName = process.env.NODE_ENV === 'development' ? 'PayPerWinDev' : 'PayPerWin';
mongoose.connect(`mongodb://${config.mongo.host}/${databaseName}`, {
    authSource: "admin",
    user: config.mongo.username,
    pass: config.mongo.password,
    useMongoClient: true,
}).then(async () => {
    console.info('Using database:', databaseName);

    const sendGridAddon = await Addon.findOne({ name: 'sendgrid' });
    if (!sendGridAddon || !sendGridAddon.value || !sendGridAddon.value.sendgridApiKey) {
        console.warn('Send Grid Key is not set');
        return;
    }
    sgMail.setApiKey(sendGridAddon.value.sendgridApiKey);

    const lineInterval = 1000 * 60 * 10;
    getAllSportsLines();
    setInterval(getAllSportsLines, lineInterval);

    const liveInterval = 10 * 1000;
    getLiveSportsLines();
    setInterval(getLiveSportsLines, liveInterval);

    const resultInterval = 10 * 60 * 1000;
    matchResults();
    setInterval(matchResults, resultInterval);

    getTicketsInformation();
});

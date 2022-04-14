//Models
const Addon = require("../models/addon");
//local helpers
const config = require('../../config.json');
const { checkMatchStatus } = require("./checkMatchStatus");
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
    } else {
        sgMail.setApiKey(sendGridAddon.value.sendgridApiKey);
    }

    // check
    checkMatchStatus();
});

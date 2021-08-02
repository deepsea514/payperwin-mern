const Addon = require("../../models/addon");
const getSportLines = require('./getSportLines');
const sports = require("./sports.json");
const mongoose = require('mongoose');
const config = require('../../../config.json');
const sgMail = require('@sendgrid/mail');
let call = 0;

// Database
mongoose.Promise = global.Promise;
const databaseName = 'PayPerWinDev'
console.info('Using database:', databaseName);
mongoose.connect(`mongodb://localhost/${databaseName}`, {
    authSource: "admin",
    user: config.mongo.username,
    pass: config.mongo.password,
    useMongoClient: true,
}).then(async () => {
    console.info('Using database:', databaseName);

    const intervalTime = 1000 * 60 * 60;
    getAllSportsLines();
    setInterval(getAllSportsLines, intervalTime);

    const sendGridAddon = await Addon.findOne({ name: 'sendgrid' });
    if (!sendGridAddon || !sendGridAddon.value || !sendGridAddon.value.sendgridApiKey) {
        console.warn('Send Grid Key is not set');
        return;
    }
    sgMail.setApiKey(sendGridAddon.value.sendgridApiKey);
});

async function getAllSportsLines() {
    console.log(`Starting to get lines for ${call} time.`);
    try {
        for (const sport of sports) {
            const { name } = sport;
            console.log('Getting lines for', name);
            await getSportLines(name, call);
            console.log('Got lines for ', name)
        }
    } catch (e) {
        console.log("getSportsError => ", e);
    }
    console.log('finished getting sportsline in ', Date());
    call++;
}

//Models
const Sport = require('../../models/sport');
const SportsDir = require('../../models/sportsDir');
const Addon = require("../../models/addon");
//local helpers
const getSportLines = require('./getSportLines');
const sleep = require('../../libs/sleep');
const matchResults = require('./matchResults');
const config = require('../../../config.json');
//external libraries
const mongoose = require('mongoose');
const axios = require('axios');
const sgMail = require('@sendgrid/mail');

// Database
mongoose.Promise = global.Promise;
const databaseName = 'PayPerWinDev'
// const databaseName = process.env.NODE_ENV === 'development' ? 'PayPerWinDev' : 'PayPerWin';
mongoose.connect(`mongodb://localhost/${databaseName}`, {
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
});

async function getAllSportsLines() {
    const pinnacleAddon = await Addon.findOne({ name: 'pinnacle' });
    if (!pinnacleAddon || !pinnacleAddon.value || !pinnacleAddon.pinnacleApiHost) {
        console.log(pinnacleAddon | pinnacleAddon.value)
        console.warn("Pinnacle Api is not set");
        return;
    }
    const { pinnacleApiHost, pinnacleAuthorizationHeader } = pinnacleAddon.value;
    const url = `${pinnacleApiHost}/v2/sports`; // pinnacle or proxy url for /v2/sports endpoint
    try {
        const reqConfig = {
            maxRedirects: 999,
            headers: {
                'Authorization': pinnacleAuthorizationHeader,
                'Accept': 'application/json',
            },
        };
        const { data } = await axios.get(url, reqConfig);
        if (data) {
            const soccer = data.sports.find(sport => sport.name.toLowerCase() == 'soccer');
            await SportsDir.findOneAndUpdate({ origin: "pinnacle" }, { sports: [soccer] }, { upsert: true });
            const { hasOfferings, eventCount, name } = soccer;
            if (hasOfferings && eventCount > 0) {
                const sportData = await Sport.findOne({ name: new RegExp(`^${name}$`, 'i') });
                // if (
                //     !sportData
                //     || new Date() - new Date(sportData.updatedAt) > (1000 * 60 * 60 * 20)
                // ) {
                console.log('Getting lines for', name);
                await getSportLines(name);
                console.log('sleeping...')
                await sleep(61 * 1000);
                // } else {
                //     console.log(name, 'skipped, already got within 20 hours');
                // }
            }
        } else {
            console.log('no data');
        }
    } catch (e) {
        console.log("getSportsError => ", e);
    }
    console.log('finished');
}

const lineInterval = 1000 * 60 * 60;
getAllSportsLines();
setInterval(getAllSportsLines, lineInterval);

const resultInterval = 1000 * 60 * 60 * 12;
matchResults();
setInterval(matchResults, resultInterval);

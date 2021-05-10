require('dotenv').config();
const mongoose = require('mongoose');
const getSportLines = require('./getSportLines');
const sleep = require('../../libs/sleep');
const Sport = require('../../models/sport');
const SportsDir = require('../../models/sportsDir');
const axios = require('axios');
const config = require('../../../config.json');
const BetPool = require('../../models/betpool');
const Bet = require('../../models/bet');
const User = require('../../models/user');
const ApiCache = require('../../models/apiCache');
const getLineFromPinnacleData = require('../../libs/getLineFromPinnacleData');
const simpleresponsive = require('../../emailtemplates/simpleresponsive');
const matchResults = require('./matchResults');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const fromEmailName = 'PAYPER Win';
const fromEmailAddress = 'donotreply@payperwin.co';

// Database
mongoose.Promise = global.Promise;
const databaseName = 'PayPerWinDev'
// const databaseName = process.env.NODE_ENV === 'development' ? 'PayPerWinDev' : 'PayPerWin';
console.info('Using database:', databaseName);
mongoose.connect(`mongodb://localhost/${databaseName}`, {
    authSource: "admin",
    user: config.mongo.username,
    pass: config.mongo.password,
    useMongoClient: true,
});

const reqConfig = {
    maxRedirects: 999,
    headers: {
        'Authorization': config.pinnacleAuthorizationHeader,
        'Accept': 'application/json',
    },
};

async function getAllSportsLines() {
    const url = `${config.pinnacleApiHost}/v2/sports`; // pinnacle or proxy url for /v2/sports endpoint
    try {
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

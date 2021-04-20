const getSportLines = require('./getSportLines');
const sleep = require('../../libs/sleep');
const sports = require("./sports.json");
const mongoose = require('mongoose');
const config = require('../../../config.json');
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

const intervalTime = 1000 * 60 * 60;
getAllSportsLines();
setInterval(getAllSportsLines, intervalTime);
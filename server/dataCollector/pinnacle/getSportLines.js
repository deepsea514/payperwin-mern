const mongoose = require('mongoose');
const axios = require('axios');
const sports = require('./sports.json');
const formatFixturesOdds = require('./formatFixturesOdds');
const Sport = require('../../models/sport');
const sleep = require('../../libs/sleep');
const config = require('../../../config.json');

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

async function getSportLines(sportName) {
  const sportData = sports.find((sportObj) => sportObj.name.toLowerCase() === sportName.toLowerCase());
  if (sportData) {
    const { id, name } = sportData;
    // get fixtures
    const reqConfig = {
      maxRedirects: 999,
      headers: {
        'User-Agent': 'PostmanRuntime/7.24.1',
        'Authorization': config.pinnacleAuthorizationHeader,
        'Accept': 'application/json',
      },
    };
    try {
      const url = `${config.pinnacleApiHost}/v1/fixtures?sportId=${id}`;
      const { data: fixturesData } = await axios.get(url, reqConfig);
      console.log('got fixtures, sleeping...');
      await sleep(61 * 1000);
      const url2 = `${config.pinnacleApiHost}/v1/odds?sportId=${id}`;
      const { data: oddsData } = await axios.get(url2, reqConfig);
      
      // get odds
      const formattedSportData = formatFixturesOdds(fixturesData, oddsData);
      if (formattedSportData) {
        formattedSportData.name = name;
        // console.log(formattedSportData);
        // get sportid from sport
        // save to pinnacle db
        // update our db
        await Sport.findOneAndUpdate(
          { pinnacleSportId: id },
          formattedSportData,
          { upsert: true },
        );
        console.log('got odds');
        // get fixtures
          // reformat fitures
          // get any odds for active fixtures
          // add relevent info to fixture object
          // get any specials for active fixtures
      }
    } catch (e) {
      console.log(e);
    }
  } else {
    console.error('sport', sport, 'not found');
  }

}

module.exports = getSportLines;

const getSportLines = require('./getSportLines');
const sleep = require('../../libs/sleep');
const Sport = require('../../models/sport');
const SportsDir = require('../../models/sportsDir');
const axios = require('axios');
const config = require('../../../config.json')

async function getAllSportsLines() {
  const reqConfig = {
    maxRedirects: 999,
    headers: {
      'User-Agent': 'PostmanRuntime/7.24.1',
      'Authorization': config.pinnacleAuthorizationHeader,
      'Accept': 'application/json',
    },
  };
  const url = `${config.pinnacleApiHost}/v2/sports`; // pinnacle or proxy url for /v2/sports endpoint
  try {
    const { data } = await axios.get(url, reqConfig);
    if (data) {
      await SportsDir.findOneAndUpdate({}, { sports: data.sports }, { upsert: true });
      const { sports } = data;
      for (const sport of sports) {
        console.log(sport);
        const { hasOfferings, eventCount, name } = sport;
        if (hasOfferings && eventCount > 0) {
          const sportData = await Sport.findOne({ name: new RegExp(`^${name}$`, 'i') });
          if (
            !sportData
            || new Date() - new Date(sportData.updatedAt) > (1000 * 60 * 60 * 20)
          ) {
            console.log('Getting lines for', name);
            await getSportLines(name);
            console.log('sleeping...')
            await sleep(61 * 1000);
          } else {
            console.log(name, 'skipped, already got within 20 hours');
          }
        }
      }
    } else {
      console.log('no data');
    }
  } catch (e) {
    console.log(e);
  }
  console.log('finished');
}

getAllSportsLines();
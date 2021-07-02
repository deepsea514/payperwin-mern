//Models
const Sport = require('../../models/sport');
const Addon = require('../../models/addon');
//local helpers
const sports = require('./sports.json');
const formatFixturesOdds = require('./formatFixturesOdds');
const sleep = require('../../libs/sleep');
//external libraries
const axios = require('axios');

async function getSportLines(sportName) {
    const pinnacleAddon = await Addon.findOne({ name: 'pinnacle' });
    if (!pinnacleAddon || !pinnacleAddon.value || !pinnacleAddon.pinnacleApiHost) {
        console.log(pinnacleAddon | pinnacleAddon.value)
        console.warn("Pinnacle Api is not set");
        return;
    }
    const { pinnacleApiHost, pinnacleAuthorizationHeader } = pinnacleAddon.value;

    const sportData = sports.find((sportObj) => sportObj.name.toLowerCase() === sportName.toLowerCase());
    if (sportData) {
        const { id, name } = sportData;
        // get fixtures
        const reqConfig = {
            maxRedirects: 999,
            headers: {
                'User-Agent': 'PostmanRuntime/7.24.1',
                'Authorization': pinnacleAuthorizationHeader,
                'Accept': 'application/json',
            },
        };
        try {
            const url = `${pinnacleApiHost}/v1/fixtures?sportId=${id}`;
            const { data: fixturesData } = await axios.get(url, reqConfig);
            console.log('got fixtures, sleeping...');
            await sleep(61 * 1000);
            const url2 = `${pinnacleApiHost}/v1/odds?sportId=${id}`;
            const { data: oddsData } = await axios.get(url2, reqConfig);

            // get odds
            const formattedSportData = formatFixturesOdds(fixturesData, oddsData);
            if (formattedSportData) {
                formattedSportData.name = name;
                formattedSportData.origin = "pinnacle";
                // console.log(formattedSportData);
                // get sportid from sport
                // save to pinnacle db
                // update our db
                const sport = await Sport.findOne({ originSportId: id });
                if (sport) {
                    await sport.update(
                        formattedSportData,
                        { upsert: true },
                    );
                }
                else {
                    await Sport.create(formattedSportData);
                }
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
        console.error('sport', sportName, 'not found');
    }
}

module.exports = getSportLines;

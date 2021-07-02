const axios = require('axios');
const sports = require('./sports.json');
const formatFixturesOdds = require('./formatFixturesOdds');
const matchResults = require('./matchResults');
const Sport = require('../../models/sport');
const SportsDir = require("../../models/sportsDir");
const sleep = require('../../libs/sleep');
const config = require('../../../config.json');
const dateformat = require("dateformat");

async function getSportLines(sportName, call) {
    const rundownAddon = await Addon.findOne({ name: 'rundown' });
    if (!rundownAddon || !rundownAddon.value || !rundownAddon.value.rundownApiHost) {
        console.warn("Rundown Api is not set");
        return;
    }
    const { rundownApiHost, rundownXRapidapiKey, rundownXRapidapiHost } = rundownAddon.value;
    const numberOfDateToGet = (call % 12 == 0) ? 15 : 5; // 90
    const sportData = sports.find((sportObj) => sportObj.name.toLowerCase() === sportName.toLowerCase());
    if (sportData) {
        const { id, name } = sportData;
        // get fixtures
        const reqConfig = {
            maxRedirects: 999,
            headers: {
                'x-rapidapi-key': rundownXRapidapiKey,
                "x-rapidapi-host": rundownXRapidapiHost,
                "useQueryString": true,
                'Accept': 'application/json',
            },
        };
        try {
            const TodayDate = (new Date()).getTime();
            let eventSportData = [];
            for (let i = ((call % 12 == 0) ? -1 : 0); i < numberOfDateToGet; i++) {
                const date = TodayDate + 24 * 3600 * 1000 * i;
                const dateStr = dateformat(new Date(date), "isoDate");
                console.log(`Getting events for ${name} in ${dateStr}`);
                const url = `${rundownApiHost}/sports/${id}/events/${dateStr}?include=scores&offset=-300`;
                const { data: eventsData } = await axios.get(url, reqConfig);
                if (i == 0 || i == -1) {
                    await matchResults(name, eventsData.events);
                }
                else {
                    eventSportData = [...eventSportData, ...eventsData.events];
                }
            }
            const sport = await Sport.findOne({ originSportId: id });
            const existingEvents = sport ? sport.leagues[0].events : [];

            const formattedSportData = formatFixturesOdds(eventSportData, sportData, existingEvents);
            if (formattedSportData) {
                formattedSportData.name = name;
                formattedSportData.origin = "rundown";
                if (sport) {
                    await sport.update(
                        formattedSportData,
                        { upsert: true },
                    );
                }
                else {
                    await Sport.create(formattedSportData);
                }
                const sportsDir = await SportsDir.findOne({ origin: "rundown" });
                sportsDir.sports = sportsDir.sports.map(sport => {
                    if (sport.name == sportName) {
                        return {
                            ...sport,
                            eventCount: formattedSportData.leagues[0].events.length
                        }
                    }
                    return sport;
                })
                await sportsDir.save();
            }
        } catch (e) {
            console.log("getSportError => ", e);
        }
    } else {
    }
}

module.exports = getSportLines;

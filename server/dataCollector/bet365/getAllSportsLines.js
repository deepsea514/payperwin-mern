//Models
const Sport = require('../../models/sport');
const SportsDir = require('../../models/sportsDir');
const Addon = require("../../models/addon");
const ErrorLog = require("../../models/errorlog");
//local helpers
const config = require('../../../config.json');
let sportsData = require('./sports.json')
const formatFixturesOdds = require('./formatFixturesOdds');
const matchResults = require('./matchResults');
const getLiveSportsLines = require('./getLiveSportsLines');
//external libraries
const mongoose = require('mongoose');
const axios = require('axios');
const sgMail = require('@sendgrid/mail');
const fs = require('fs');
const arrangeLeagues = require('./arrangeLeagues');
require('dotenv').config();

const per_page = 100;

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
});

Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}

const getAllSportsLines = async () => {
    const bet365Addon = await Addon.findOne({ name: 'bet365' });
    if (!bet365Addon || !bet365Addon.value || !bet365Addon.value.bet365ApiKey) {
        console.warn("Bet365 Api Key is not set");
        return;
    }
    const { bet365ApiKey } = bet365Addon.value;
    sportsData = sportsData.filter(sport => sport.name != 'Boxing-UFC');
    let sportsDir = await SportsDir.findOne({ origin: "bet365" });
    if (!sportsDir) {
        sportsDir = await SportsDir.create({ origin: "bet365", sports: sportsData });
    }

    for (const sport of sportsData) {
        console.log(`Start getting odds for ${sport.name}`);
        try {
            let sportEvents = {
                originSportId: sport.id,
                origin: 'bet365',
                name: sport.name,
                leagues: [],
            };

            let page = 1;
            while (true) {
                let success = false;
                let results = [];
                let total = 0;
                try {
                    const { data: { success: success_result, results: results_result, pager } } = await axios
                        .get(`https://api.b365api.com/v1/bet365/upcoming`, {
                            params: {
                                sport_id: sport.id,
                                token: bet365ApiKey,
                                page: page,
                                per_page: per_page,
                                // day: dateformat(date, "yyyymmdd"),
                            }
                        });
                    success = success_result;
                    results = results_result;
                    if (pager)
                        total = pager.total;
                }
                catch (error) {
                    ErrorLog.create({
                        name: 'Bet365 Error',
                        error: {
                            name: error.name,
                            message: error.message,
                            stack: error.stack
                        }
                    });
                }
                console.log("total =>", total);
                console.log("page =>", page);
                if (!success) continue;
                for (let ei = 0; ei < results.length; ei += 10) {
                    let ids = [];
                    for (let i = 0; i < 10 && results[ei + i]; i++) {
                        ids.push(results[ei + i].id);
                    }
                    let success = false;
                    let oddsResult = [];
                    try {
                        const { data: { success: success_result, results: oddsResult_result } } = await axios
                            .get(`https://api.b365api.com/v3/bet365/prematch`, {
                                params: {
                                    FI: ids.join(','),
                                    token: bet365ApiKey,
                                }
                            });
                        success = success_result;
                        oddsResult = oddsResult_result;
                    } catch (error) {
                        ErrorLog.create({
                            name: 'Bet365 Error',
                            error: {
                                name: error.name,
                                message: error.message,
                                stack: error.stack
                            }
                        });
                    }

                    if (!success) {
                        continue;
                    }
                    for (let i = 0; i < 10 && results[ei + i]; i++) {
                        results[ei + i].odds = oddsResult[i];
                    }
                }
                results.map(result => {
                    if (result.time_status != 0) return;
                    let league = sportEvents.leagues.find(league => league.originId == result.league.id);
                    if (!league) {
                        league = {
                            name: result.league.name,
                            originId: result.league.id,
                            events: [],
                        }
                        sportEvents.leagues.push(league);
                    }

                    let line = formatFixturesOdds(result, sport.name);
                    if (line) {
                        league.events.push({
                            originId: result.id,
                            startDate: new Date(parseInt(result.time) * 1000),
                            teamA: result.home.name,
                            teamB: result.away.name,
                            lines: [line],
                            // odds: result.odds,
                        });
                    }

                });
                if (total == 0 || Math.ceil(total / per_page) <= page) break;
                page++;
            }
            arrangeLeagues(sportEvents.leagues, sport.name);

            // fs.writeFileSync(`${sport.name}_odds.json`, JSON.stringify(sportEvents));

            const savedSport = await Sport.findOne({ originSportId: sportEvents.originSportId, origin: 'bet365' });
            if (savedSport) {
                await savedSport.update(
                    sportEvents,
                    { upsert: true },
                );
            }
            else {
                await Sport.create(sportEvents);
            }
            console.log(`Finished getting odds for ${sport.name}`);
        } catch (error) {
            console.error(error);
        }

    }
    console.log('All done')
}

//Models
const Sport = require('../../models/sport');
const SportsDir = require('../../models/sportsDir');
const Addon = require("../../models/addon");
const ErrorLog = require("../../models/errorlog");
//local helpers
let sportsData = require('./sports.json')
const formatFixturesOdds = require('./formatFixturesOdds');
//external libraries
const axios = require('axios');
// const fs = require('fs');
const arrangeLeagues = require('./arrangeLeagues');
require('dotenv').config();

const per_page = 100;
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
    await SportsDir.findOneAndUpdate(
        { origin: "bet365" },
        { origin: "bet365", sports: sportsData },
        { upsert: true }
    );

    for (const sport of sportsData) {
        try {
            let sportEvents = {
                originSportId: sport.id,
                origin: 'bet365',
                name: sport.name,
                shortName: sport.shortName,
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
                            }
                        });
                    success = success_result;
                    results = results_result;
                    if (pager)
                        total = pager.total;
                } catch (error) {
                    ErrorLog.findOneAndUpdate(
                        {
                            name: 'Bet365 Error',
                            "error.stack": error.stack
                        },
                        {
                            name: 'Bet365 Error',
                            error: {
                                name: error.name,
                                message: error.message,
                                stack: error.stack
                            }
                        },
                        { upsert: true }
                    );
                }

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
                        ErrorLog.findOneAndUpdate(
                            {
                                name: 'Bet365 Error',
                                "error.stack": error.stack
                            },
                            {
                                name: 'Bet365 Error',
                                error: {
                                    name: error.name,
                                    message: error.message,
                                    stack: error.stack
                                }
                            },
                            { upsert: true }
                        );
                    }

                    if (!success) {
                        continue;
                    }
                    for (let i = 0; i < 10 && results[ei + i]; i++) {
                        results[ei + i].odds = oddsResult[i];
                    }

                    let eventResult = [];
                    try {
                        const { data: { success: success_result, results: eventResult_result } } = await axios
                            .get(`https://api.b365api.com/v1/bet365/result`, {
                                params: {
                                    event_id: ids.join(','),
                                    token: bet365ApiKey,
                                }
                            });
                        success = success_result;
                        eventResult = eventResult_result;
                    } catch (error) {
                        ErrorLog.findOneAndUpdate(
                            {
                                name: 'Bet365 Error',
                                "error.stack": error.stack
                            },
                            {
                                name: 'Bet365 Error',
                                error: {
                                    name: error.name,
                                    message: error.message,
                                    stack: error.stack
                                }
                            },
                            { upsert: true }
                        );
                    }

                    for (let i = 0; i < 10 && results[ei + i]; i++) {
                        if (eventResult[i] && eventResult[i].home) {
                            try {
                                results[ei + i].home.image_id = success ? eventResult[i].home.image_id : null;
                                results[ei + i].away.image_id = success ? eventResult[i].away.image_id : null;
                            } catch (error) {
                                console.error(error, "event=> ", eventResult[i]);
                            }
                        }
                    }
                }

                await Promise.all(results.map(async result => {
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
                            logo_teamA: result.home.image_id,
                            teamB: result.away.name,
                            logo_teamB: result.away.image_id,
                            lines: [line],
                        });
                    }
                }))
                if (total == 0 || Math.ceil(total / per_page) <= page) break;
                page++;
            }
            arrangeLeagues(sportEvents.leagues, sport.name);

            // fs.writeFileSync(`${sport.name}_odds.json`, JSON.stringify(sportEvents));

            await Sport.findOneAndUpdate(
                {
                    originSportId: sportEvents.originSportId,
                    origin: 'bet365'
                },
                sportEvents,
                { upsert: true }
            );
            console.log(new Date(), `${sport.name} Got Odds`)
        } catch (error) {
            console.error(error);
        }

    }
}

module.exports = {
    getAllSportsLines
}
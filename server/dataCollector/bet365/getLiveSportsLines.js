//Models
const Sport = require('../../models/sport');
const Addon = require("../../models/addon");
const ErrorLog = require("../../models/errorlog");
//local helpers
const sportsData = require('./sports.json');
const formatFixturesOdds = require('./formatFixturesOdds');
//external libraries
const axios = require('axios');
const arrangeLeagues = require('./arrangeLeagues');

const per_page = 1000;

const getLiveSportsLines = async () => {
    const bet365Addon = await Addon.findOne({ name: 'bet365' });
    if (!bet365Addon || !bet365Addon.value || !bet365Addon.value.bet365ApiKey) {
        console.warn("Bet365 Api Key is not set");
        return;
    }
    const { bet365ApiKey } = bet365Addon.value;

    for (const sport of sportsData) {
        if (!sport.liveSupport) {
            continue;
        }
        try {
            let sportEvents = {
                liveLeagues: [],
            };

            let page = 1;
            while (true) {
                let success = false;
                let results = [];
                let total = 0;
                try {
                    const { data: { success: success_result, results: results_result, pager } } = await axios
                        .get(`https://api.b365api.com/v1/bet365/inplay_filter`, {
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
                }
                catch (error) {
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

                    success = false;
                    let timerResult = [];

                    try {
                        const { data: { success: success_result, results: timerResult_result } } = await axios
                            .get(`https://api.b365api.com/v1/bet365/result`, {
                                params: {
                                    event_id: ids.join(','),
                                    token: bet365ApiKey,
                                }
                            });
                        success = success_result;
                        timerResult = timerResult_result;
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
                        results[ei + i].timer = timerResult[i].timer;
                    }
                }
                results.map(result => {
                    if (result.time_status != "1") return;
                    let league = sportEvents.liveLeagues.find(league => league.originId == result.league.id);
                    if (!league) {
                        league = {
                            name: result.league.name,
                            originId: result.league.id,
                            events: [],
                        }
                        sportEvents.liveLeagues.push(league);
                    }

                    let line = formatFixturesOdds(result, sport.name);
                    if (line) {
                        league.events.push({
                            originId: result.id,
                            startDate: new Date(parseInt(result.time) * 1000),
                            teamA: result.home.name,
                            teamB: result.away.name,
                            lines: [line],
                            timer: result.timer
                        });
                    }
                });
                if (total == 0 || Math.ceil(total / per_page) <= page) break;
                page++;
            }

            arrangeLeagues(sportEvents.liveLeagues, sport.name);
            await Sport.findOneAndUpdate({ originSportId: sport.id, origin: 'bet365' }, sportEvents);
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = { getLiveSportsLines };
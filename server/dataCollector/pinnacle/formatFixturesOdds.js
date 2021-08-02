function mergeFixturesAndOdds(fixtures, odds) {
    // loop through events and find the corresponding event object and combine
    if (fixtures) {
        if (odds) {
            odds.leagues.forEach((oddsLeague) => {
                fixtures.oddsLast = odds.last;
                fixtures.league.forEach((fixturesLeague) => {
                    if (oddsLeague.id === fixturesLeague.id) {
                        oddsLeague.events.forEach((oddsEvent) => {
                            fixturesLeague.events.forEach((fixturesEvent, fei) => {
                                if (oddsEvent.id === fixturesEvent.id) {
                                    // add props from odds event to fixtures event
                                    fixturesLeague.events[fei] = {
                                        ...fixturesEvent,
                                        ...oddsEvent,
                                    };
                                }
                            });
                        });
                    }
                });
            });
        }
        return fixtures;
    }
}

function formatFixturesOdds(fixtures, odds) {
    const mergedData = mergeFixturesAndOdds(fixtures, odds);
    if (mergedData) {
        const sportData = {
            originSportId: mergedData.sportId,
            originFixturesLast: mergedData.last,
            originOddsLast: mergedData.oddsLast,
            leagues: [],
        };
        mergedData.league.forEach(league => {
            const leagueData = {
                originId: league.id,
                name: league.name,
                events: [],
            };
            league.events.forEach(event => {
                const {
                    id,
                    starts,
                    home,
                    away,
                    // rotNum,
                    // liveStatus,
                    // status,
                    // parlayRestriction,
                    // altTeaser,
                    // resultingUnit,
                    periods,
                } = event;
                const parsedEvent = {
                    // sportName: ,
                    // leagueName: league.name,
                    // pinnacleLeagueId: league.id,
                    // originFixturesLast: mergedData.last,
                    // originOddsLast: mergedData.oddsLast,
                    // originSportId: mergedData.sportId,
                };
                if (id) parsedEvent.originId = id;
                if (starts) parsedEvent.startDate = starts;
                if (home) parsedEvent.teamA = home;
                if (away) parsedEvent.teamB = away;
                if (periods) {
                    parsedEvent.lines = [];
                    periods.forEach(period => {
                        const {
                            lineId,
                            number,
                            cutoff,
                            maxSpread,
                            maxMoneyline,
                            maxTotal,
                            maxTeamTotal,
                            status,
                            spreads,
                            moneyline,
                            totals,
                            teamTotal,
                        } = period;

                        const line = {};
                        if (lineId) line.originId = lineId;
                        if (number) line.periodNumber = number;
                        if (cutoff) line.endDate = cutoff;
                        if (maxSpread) line.maxSpread = maxSpread;
                        if (maxMoneyline) line.maxMoneyline = maxMoneyline;
                        if (maxTotal) line.maxTotal = maxTotal;
                        if (maxTeamTotal) line.maxTeamTotal = maxTeamTotal;
                        if (status) line.status = status;


                        if (moneyline) {
                            if ((moneyline.home > 0 && moneyline.away < 0) || (moneyline.home < 0 && moneyline.away > 0)) {
                                line.moneyline = moneyline;
                            }
                        }

                        if (spreads) {
                            const filteredSpreads = spreads.filter(spread => {
                                if (spread && (spread.home > 0 && spread.away < 0) || (spread.home < 0 && spread.away > 0))
                                    return true;
                                return false;
                            });
                            line.spreads = filteredSpreads.length ? filteredSpreads : null;
                        }

                        if (totals) {
                            const filteredTotals = totals.filter(total => {
                                if (total && (total.over > 0 && total.under < 0) || (total.over < 0 && total.under > 0))
                                    return true;
                                return false;
                            });
                            line.totals = filteredTotals.length ? filteredTotals : null;
                        }

                        if (teamTotal) line.teamTotal = teamTotal;

                        if (line.moneyline && line.spreads && line.totals)
                            parsedEvent.lines.push(line);
                    });
                }
                // console.log('event:');
                // console.log(parsedEvent);
                // Exclude events with no lines
                if (parsedEvent.lines && parsedEvent.lines.length) {
                    leagueData.events.push(parsedEvent);
                }
                // console.log(event);
            });
            leagueData.events.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
            // Exclude leagues with no events
            if (leagueData.events.length > 0) {
                sportData.leagues.push(leagueData);
            }
        });
        return sportData;
    }
}

module.exports = formatFixturesOdds;

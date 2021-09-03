const getLineFromSportData = (data, leagueId, eventId, lineId, type, altLineId) => {
    const lineData = {}
    let found = false;
    if (data.name) lineData.sportName = data.name;
    data.leagues.forEach(league => {
        const { name, originId, events } = league;
        if (leagueId.toString() === league.originId.toString()) {
            lineData.leagueName = name;
            events.forEach(event => {
                if (eventId.toString() === event.originId.toString()) {
                    const { teamA, teamB, startDate, lines } = event;
                    lineData.teamA = event.teamA;
                    lineData.teamB = event.teamB;
                    lineData.startDate = event.startDate;
                    lines.forEach(line => {
                        if (lineId.toString() === line.originId.toString()) {
                            if (type === 'spread') {
                                line.spreads.forEach((spread) => {
                                    if (altLineId === spread.altLineId || (!altLineId && !spread.altLineId)) {
                                        lineData.line = spread;
                                    }
                                });
                            } else if (type === 'total') {
                                line.totals.forEach((total) => {
                                    if (altLineId === total.altLineId || (!altLineId && !total.altLineId)) {
                                        lineData.line = total;
                                    }
                                });
                            } else {
                                lineData.line = line[type];
                            }
                            if (lineData.line) {
                                found = true;
                            }
                        }
                    });
                }
            });
        }
    });
    return found ? lineData : false;
}

module.exports = getLineFromSportData;

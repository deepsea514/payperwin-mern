const getLineFromSportData = (data, leagueId, eventId, lineId, type, subtype, altLineId) => {
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
                            let selectedLine = line;
                            switch (subtype) {
                                case 'first_half':
                                    selectedLine = line.first_half;
                                    break;
                                case 'second_half':
                                    selectedLine = line.second_half;
                                    break;
                                case 'first_quarter':
                                    selectedLine = line.first_quarter;
                                    break;
                                case 'second_quarter':
                                    selectedLine = line.second_quarter;
                                    break;
                                case 'third_quarter':
                                    selectedLine = line.third_quarter;
                                    break;
                                case 'forth_quarter':
                                    selectedLine = line.forth_quarter;
                                    break;
                            }
                            if (selectedLine) {
                                if (type === 'spread') {
                                    selectedLine.spreads.forEach((spread) => {
                                        if (altLineId === spread.altLineId || (!altLineId && !spread.altLineId)) {
                                            lineData.line = spread;
                                        }
                                    });
                                } else if (type === 'total') {
                                    selectedLine.totals.forEach((total) => {
                                        if (altLineId === total.altLineId || (!altLineId && !total.altLineId)) {
                                            lineData.line = total;
                                        }
                                    });
                                } else if (type == 'moneyline') {
                                    lineData.line = selectedLine[type];
                                }
                                if (lineData.line) {
                                    found = true;
                                }
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

const getLineFromSportData = (data, leagueId, eventId, lineId, type, subtype, altLineId, live) => {
    const lineData = {}
    let found = false;
    if (data.name) lineData.sportName = data.name;
    if (live) {
        data.liveLeagues.forEach(league => {
            const { name, originId, events } = league;
            if (leagueId.toString() === originId.toString()) {
                lineData.leagueName = name;
                events.forEach(event => {
                    if (eventId.toString() === event.originId.toString()) {
                        const { teamA, teamB, startDate, lines, timer } = event;
                        lineData.teamA = teamA;
                        lineData.teamB = teamB;
                        lineData.startDate = startDate;
                        lines.forEach(line => {
                            if (lineId.toString() === line.originId.toString()) {
                                let selectedLine = false;
                                switch (subtype) {
                                    case 'first_half':
                                        selectedLine = false;
                                        break;
                                    case 'second_half':
                                        if (timer && timer.q < "3")
                                            selectedLine = line.second_half;
                                        break;
                                    case 'first_quarter':
                                        selectedLine = false;
                                        break;
                                    case 'second_quarter':
                                        if (timer && timer.q < "2")
                                            selectedLine = line.second_quarter;
                                        break;
                                    case 'third_quarter':
                                        if (timer && timer.q < "3")
                                            selectedLine = line.third_quarter;
                                        break;
                                    case 'forth_quarter':
                                        if (timer && timer.q < "4")
                                            selectedLine = line.forth_quarter;
                                        break;
                                    case 'fifth_innings':
                                        selectedLine = false;
                                        break;
                                }
                                if (selectedLine) {
                                    if (type === 'spread') {
                                        if (selectedLine.spreads) {
                                            selectedLine.spreads.forEach((spread) => {
                                                if (altLineId === spread.altLineId || (!altLineId && !spread.altLineId)) {
                                                    lineData.line = spread;
                                                }
                                            });
                                        }
                                    } else if (type === 'total') {
                                        if (selectedLine.totals) {
                                            selectedLine.totals.forEach((total) => {
                                                if (altLineId === total.altLineId || (!altLineId && !total.altLineId)) {
                                                    lineData.line = total;
                                                }
                                            });
                                        }
                                    } else if (type == 'moneyline') {
                                        lineData.line = selectedLine[type];
                                    } else if (type == 'alternative_spread') {
                                        if (selectedLine.alternative_spreads) {
                                            selectedLine.alternative_spreads.forEach((spread) => {
                                                if (altLineId === spread.altLineId || (!altLineId && !spread.altLineId)) {
                                                    lineData.line = spread;
                                                }
                                            });
                                        }
                                    } else if (type == 'alternative_total') {
                                        if (selectedLine.alternative_totals) {
                                            selectedLine.alternative_totals.forEach((total) => {
                                                if (altLineId === total.altLineId || (!altLineId && !total.altLineId)) {
                                                    lineData.line = total;
                                                }
                                            });
                                        }
                                    } else if (type == 'home_total') {
                                        if (selectedLine.home_totals) {
                                            selectedLine.home_totals.forEach((total) => {
                                                if (altLineId === total.altLineId || (!altLineId && !total.altLineId)) {
                                                    lineData.line = total;
                                                }
                                            });
                                        }
                                    } else if (type == 'away_total') {
                                        if (selectedLine.away_totals) {
                                            selectedLine.away_totals.forEach((total) => {
                                                if (altLineId === total.altLineId || (!altLineId && !total.altLineId)) {
                                                    lineData.line = total;
                                                }
                                            });
                                        }
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
    } else {
        data.leagues.forEach(league => {
            const { name, originId, events } = league;
            if (leagueId.toString() === originId.toString()) {
                lineData.leagueName = name;
                events.forEach(event => {
                    if (eventId.toString() === event.originId.toString()) {
                        const { teamA, teamB, startDate, lines } = event;
                        lineData.teamA = teamA;
                        lineData.teamB = teamB;
                        lineData.startDate = startDate;
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
                                    case 'fifth_innings':
                                        selectedLine = line.fifth_innings;
                                        break;
                                }
                                if (selectedLine) {
                                    if (type === 'spread') {
                                        if (selectedLine.spreads) {
                                            selectedLine.spreads.forEach((spread) => {
                                                if (altLineId === spread.altLineId || (!altLineId && !spread.altLineId)) {
                                                    lineData.line = spread;
                                                }
                                            });
                                        }
                                    } else if (type === 'total') {
                                        if (selectedLine.totals) {
                                            selectedLine.totals.forEach((total) => {
                                                if (altLineId === total.altLineId || (!altLineId && !total.altLineId)) {
                                                    lineData.line = total;
                                                }
                                            });
                                        }
                                    } else if (type == 'moneyline') {
                                        lineData.line = selectedLine[type];
                                    } else if (type == 'alternative_spread') {
                                        if (selectedLine.alternative_spreads) {
                                            selectedLine.alternative_spreads.forEach((spread) => {
                                                if (altLineId === spread.altLineId || (!altLineId && !spread.altLineId)) {
                                                    lineData.line = spread;
                                                }
                                            });
                                        }
                                    } else if (type == 'alternative_total') {
                                        if (selectedLine.alternative_totals) {
                                            selectedLine.alternative_totals.forEach((total) => {
                                                if (altLineId === total.altLineId || (!altLineId && !total.altLineId)) {
                                                    lineData.line = total;
                                                }
                                            });
                                        }
                                    } else if (type == 'home_total') {
                                        if (selectedLine.home_totals) {
                                            selectedLine.home_totals.forEach((total) => {
                                                if (altLineId === total.altLineId || (!altLineId && !total.altLineId)) {
                                                    lineData.line = total;
                                                }
                                            });
                                        }
                                    } else if (type == 'away_total') {
                                        if (selectedLine.away_totals) {
                                            selectedLine.away_totals.forEach((total) => {
                                                if (altLineId === total.altLineId || (!altLineId && !total.altLineId)) {
                                                    lineData.line = total;
                                                }
                                            });
                                        }
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
    }
    return found ? lineData : false;
}

module.exports = getLineFromSportData;

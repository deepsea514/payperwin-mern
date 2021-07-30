function getLinesFromSportData(data, leagueId, eventId, lineId) {
    const lineData = {}
    let found = false;
    const { league, origin } = data;
    const { name, originId, events } = league;
    if (leagueId === originId.toString()) {
        lineData.leagueName = name;
        events.forEach(event => {
            if (eventId === event.originId.toString()) {
                const { teamA, teamB, startDate, lines } = event;
                lineData.teamA = teamA;
                lineData.teamB = teamB;
                lineData.startDate = startDate;
                lineData.lines = lines;
                lineData.origin = origin;
                found = true;
            }
        });
    }
    return found ? lineData : false;
}

module.exports = getLinesFromSportData;
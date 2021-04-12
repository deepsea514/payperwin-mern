function getLinesFromSportData(data, leagueId, eventId, lineId) {
    const lineData = {}
    let found = false;
    data.leagues.forEach(league => {
        const { name, pinnacleId, events } = league;
        // console.log(leagueId, league.pinnacleId.toString())
        if (leagueId === league.pinnacleId.toString()) {
            lineData.leagueName = name;
            events.forEach(event => {
                if (eventId === event.pinnacleId.toString()) {
                    const { teamA, teamB, startDate, lines } = event;
                    lineData.teamA = teamA;
                    lineData.teamB = teamB;
                    lineData.startDate = startDate;
                    lineData.lines = lines;
                    found = true;
                }
            });
        }
    });
    return found ? lineData : false;
}

module.exports = getLinesFromSportData;
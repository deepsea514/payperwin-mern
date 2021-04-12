function getLineFromPinnacleData(data, leagueId, eventId) {
    const lineData = {}
    let found = false;
    const { leagues } = data;
    if (leagues) {
        leagues.forEach(league => {
            const { events } = league;
            if (leagueId.toString() === league.id.toString()) {
                console.log('found league');
                if (events) {
                    events.forEach(event => {
                        if (eventId.toString() === event.id.toString()) {
                            console.log('found event');
                            const { periods } = event;
                            if (periods) {
                                periods.forEach(line => {
                                    if (line.number === 0 && line.status === 1) {
                                        console.log('found period');
                                        found = true;
                                        const { team1Score, team2Score } = line;
                                        lineData.homeScore = team1Score;
                                        lineData.awayScore = team2Score;
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    }
    return found ? lineData : false;
}

module.exports = getLineFromPinnacleData;
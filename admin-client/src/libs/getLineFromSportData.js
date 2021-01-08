function getLineFromSportData(data, leagueId, eventId, lineId, type) {
  const lineData = {}
  let found = false;
  data.leagues.forEach(league => {
    const { name, pinnacleId, events } = league;
    if (leagueId === league.pinnacleId.toString()) {
      lineData.leagueName = name;
      events.forEach(event => {
        if (eventId === event.pinnacleId.toString()) {
          const { teamA, teamB, startDate, lines } = event;
          lineData.teamA = event.teamA;
          lineData.teamB = event.teamB;
          lineData.startDate = event.startDate;
          lines.forEach(line => {
            if (lineId === line.pinnacleId.toString()) {
              if (type === 'spread') {
                lineData.line = line.spreads[0];
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

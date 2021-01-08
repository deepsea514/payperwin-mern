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
      pinnacleSportId: mergedData.sportId,
      pinnacleFixturesLast: mergedData.last,
      pinnacleOddsLast: mergedData.oddsLast,
      pinnacleSportId: mergedData.sportId,
      leagues: [],
    };
    mergedData.league.forEach(league => {
      const leagueData = {
        pinnacleId: league.id,
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
          // pinnacleFixturesLast: mergedData.last,
          // pinnacleOddsLast: mergedData.oddsLast,
          // pinnacleSportId: mergedData.sportId,
        };
        if (id) parsedEvent.pinnacleId = id;
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
            if (lineId) line.pinnacleId = lineId;
            if (number) line.periodNumber = number;
            if (cutoff) line.endDate = cutoff;
            if (maxSpread) line.maxSpread = maxSpread;
            if (maxMoneyline) line.maxMoneyline = maxMoneyline;
            if (maxTotal) line.maxTotal = maxTotal;
            if (maxTeamTotal) line.maxTeamTotal = maxTeamTotal;
            if (status) line.status = status;
            if (spreads) line.spreads = spreads;
            if (moneyline) line.moneyline = moneyline;
            // console.log('moneyline', moneyline);
            // console.log(spreads);
            if (totals) line.totals = totals;
            if (teamTotal) line.teamTotal = teamTotal;
            parsedEvent.lines.push(line);
          });
        }
        // console.log('event:');
        // console.log(parsedEvent);
        // Exclude events with no lines
        if (parsedEvent.lines) {
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

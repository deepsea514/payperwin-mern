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

function formatFixturesOdds(fixtures, odds, sportName) {
  const mergedData = mergeFixturesAndOdds(fixtures, odds);
  if (mergedData) {
    const lines = [];
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
      sportData.leagues.push(leagueData);
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
          periods.forEach((period, i) => {
            // console.log(i, period);
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

            if (sportName) line.sportName = sportName;
            if (league.id) line.leagueId = league.id;
            if (event.id) line.eventId = event.id;
            if (lineId) line.lineId = lineId;
            if (home) line.homeName = home;
            if (away) line.awayName = away;
            if (home && away) line.eventName = `${home} @ ${away}`;
            if (starts) line.matchStartDate = starts;
            if (cutoff) line.cutoffDate = cutoff;
            if (starts !== cutoff) console.log('start and cutoff dates are different, why?', starts, cutoff);
            if (status) line.status = status;
            if (i > 0) line.extra = true;
            if (moneyline) {
              const newLine = {
                ...line,
                type: 'moneyline',
              };
              newLine.uid = `${lineId}/${newLine.type}${line.extra ? '/extra' : ''}`;
              const { home: homeOdds, away: awayOdds } = moneyline;
              if (homeOdds) newLine.homeOdds = homeOdds;
              if (awayOdds) newLine.awayOdds = awayOdds;
              lines.push(newLine);
            }
            if (spreads) {
              spreads.forEach((spread, i) => {
                const newLine = { ...line, type: 'spread' };
                newLine.typeGroupIndex = i;
                newLine.uid = `${lineId}/${newLine.type}${line.extra ? '/extra' : ''}/${i}`;
                const { altLineId, hdp, home: homeOdds, away: awayOdds } = spread
                if (altLineId) newLine.lineId = altLineId;
                if (hdp) newLine.points = hdp;
                if (homeOdds) newLine.homeOdds = homeOdds;
                if (awayOdds) newLine.awayOdds = awayOdds;
                lines.push(newLine);
              });
            };
            if (totals) {
              totals.forEach((total, i) => {
                const newLine = {
                  ...line,
                  type: 'total',
                  homeName: 'Over',
                  awayName: 'Under',
                };
                newLine.typeGroupIndex = i;
                newLine.uid = `${lineId}/${newLine.type}${line.extra ? '/extra' : ''}/${i}`;
                const { altLineId, points, under, over } = total
                if (altLineId) newLine.lineId = altLineId;
                if (points) newLine.points = points;
                if (over) newLine.homeOdds = over;
                if (under) newLine.awayOdds = under;
                lines.push(newLine);
              });
            }
            if (teamTotal) {
              // teamTotal.forEach(total => {
              const newLine = {
                  ...line,
                  type: 'teamTotal',
                  homeName: 'Over',
                  awayName: 'Under',
                };
                newLine.uid = `${lineId}/${newLine.type}${line.extra ? '/extra' : ''}`;
                const { points, under, over } = teamTotal
                if (points) newLine.points = points;
                if (over) newLine.homeOdds = over;
                if (under) newLine.awayOdds = under;
                lines.push(newLine);
              // });
            }
          });
        }
        // console.log('event:');
        // console.log(parsedEvent);
        leagueData.events.push(parsedEvent);
        // console.log(event);
      });
      leagueData.events.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    });
    return lines;
  }
}

module.exports = formatFixturesOdds;

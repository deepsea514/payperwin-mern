const UNSET = 0.0001;

function mergeExistingOdds(events, oldEvents) {
    events.sort((e1, e2) => {
        let date1 = (new Date(e1.startDate)).getTime();
        let date2 = (new Date(e2.startDate)).getTime();
        return date1 - date2;
    })
    let lastDate;
    const afterOneHour = (new Date()).getTime() + 60 * 60 * 1000;
    if (events.length == 0) {
        lastDate = afterOneHour;
    }
    else {
        lastDate = (new Date(events[events.length - 1].startDate)).getTime();
        lastDate = lastDate > afterOneHour ? lastDate : afterOneHour;
    }
    oldEvents = oldEvents.filter(event => {
        let date = (new Date(event.startDate)).getTime();
        return (date > lastDate);
    })
    return [...events, ...oldEvents];
}

function formatFixturesOdds(events, sportData, oldEvents) {
    let formattedSportData = {
        originSportId: sportData.id,
        leagues: [],
    };
    let league = {
        events: [],
        name: sportData.name,
        originId: sportData.id
    };
    events.map(event => {
        const { teams, event_id, event_date, lines } = event;
        if (!lines)
            return;
        let odds = lines["3"];
        if (!odds)
            odds = lines["19"];
        if (!odds)
            return;
        let line = {
            originId: odds.line_id,
            endDate: event_date,
            status: 1,
        };
        const { moneyline, spread, total } = odds;

        let newMoneyline = null;
        if (moneyline.moneyline_home != UNSET) {
            newMoneyline = {
                home: moneyline.moneyline_home,
                away: moneyline.moneyline_away,
                draw: moneyline.moneyline_draw == UNSET ? null : moneyline.moneyline_draw
            };
            if ((newMoneyline.home > 0 && newMoneyline.away > 0) || (newMoneyline.home < 0 && newMoneyline.away < 0))
                newMoneyline = null;
        }
        line.moneyline = newMoneyline;

        let newSpread = null;
        if (spread.point_spread_home != UNSET) {
            newSpread = {
                hdp: spread.point_spread_home,
                home: spread.point_spread_home_money,
                away: spread.point_spread_away_money
            }
            if ((newSpread.home > 0 && newSpread.away > 0) || (newSpread.home < 0 && newSpread.away < 0))
                newSpread = null;
        }
        if (newSpread)
            line.spreads = [newSpread];
        else
            line.spreads = null;

        let newTotal = null;
        if (total.total_over != UNSET) {
            newTotal = {
                under: total.total_under_money,
                over: total.total_over_money,
                points: total.total_over
            }
            if ((newTotal.under > 0 && newTotal.over > 0) || (newTotal.under < 0 && newTotal.over < 0))
                newTotal = null;
        }
        if (newTotal)
            line.totals = [newTotal];
        else
            line.totals = null;

        console.log(line.totals, line.spreads, line.moneyline);
        if (line.totals && line.spreads && line.moneyline) {
            let formattedEvent = {
                lines: [line],
                teamA: teams[0].is_home ? teams[0].name : teams[1].name,
                teamB: teams[0].is_home ? teams[1].name : teams[0].name,
                startDate: event_date,
                originId: event_id,
            }
            league.events.push(formattedEvent);
        }
    });

    league.events = mergeExistingOdds(league.events, oldEvents);
    formattedSportData.leagues.push(league);
    return formattedSportData;
}

module.exports = formatFixturesOdds;

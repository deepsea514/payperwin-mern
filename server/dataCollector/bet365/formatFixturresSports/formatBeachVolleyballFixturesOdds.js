const { convertDecimalToAmericanOdds } = require('../convertOdds');
const formatBeachVolleyballFixturesOdds = (event) => {
    const { schedule } = event.odds;
    let line = {
        originId: event.id,
        endDate: new Date(parseInt(event.time) * 1000),
        status: 1,
        moneyline: null,
        spreads: [],
        totals: [],
    }

    if (schedule && schedule.sp.main) {
        line.moneyline = {
            home: convertDecimalToAmericanOdds(schedule.sp.main[0].odds),
            away: convertDecimalToAmericanOdds(schedule.sp.main[1].odds)
        };
    }

    if (line.moneyline && (!line.moneyline.home || !line.moneyline.away)) {
        line.moneyline = null
    }
    line.spreads = line.spreads && line.spreads.length ? line.spreads : null;
    line.totals = line.totals && line.totals.length ? line.totals : null;

    if (line.moneyline || line.spreads || line.totals)
        return line;
    return null;
}

module.exports = formatBeachVolleyballFixturesOdds;
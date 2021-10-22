const { convertDecimalToAmericanOdds } = require('../convertOdds');
const formatCricketFixturesOdds = (event) => {
    const { main, schedule } = event.odds;
    let line = {
        originId: event.id,
        endDate: new Date(parseInt(event.time) * 1000),
        status: 1,
        moneyline: null,
        spreads: [],
        totals: [],
    }

    if (main && main.sp.to_win_the_match) {
        const moneyline = main.sp.to_win_the_match.odds;
        line.moneyline = {
            home: convertDecimalToAmericanOdds(moneyline[0].odds),
            away: convertDecimalToAmericanOdds(moneyline[1].odds)
        }
    }

    if (!line.moneyline && schedule && schedule.sp.main) {
        const moneyline = schedule.sp.main;
        line.moneyline = {
            home: convertDecimalToAmericanOdds(moneyline[0].odds),
            away: convertDecimalToAmericanOdds(moneyline[1].odds)
        }
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

module.exports = formatCricketFixturesOdds;
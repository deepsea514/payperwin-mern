const { convertDecimalToAmericanOdds } = require('../convertOdds');
function formatSquashFixturesOdds(event) {
    const { schedule } = event.odds;
    let line = {
        originId: event.id,
        endDate: new Date(parseInt(event.time) * 1000),
        status: 1,
        moneyline: null,
        spreads: [],
        totals: [],
    }

    if (schedule) {
        line.moneyline = {
            home: convertDecimalToAmericanOdds(parseInt(schedule.sp.main[0].odds)),
            away: convertDecimalToAmericanOdds(parseInt(schedule.sp.main[1].odds))
        };
    }

    if (line.moneyline && !(line.moneyline.home > 0 && line.moneyline.away < 0) && !(line.moneyline.home < 0 && line.moneyline.away > 0)) {
        line.moneyline = null;
    }

    if (line.moneyline)
        return line;
    return null;
}

module.exports = formatSquashFixturesOdds;
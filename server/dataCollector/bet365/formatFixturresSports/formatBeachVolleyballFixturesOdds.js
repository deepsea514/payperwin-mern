const { convertDecimalToAmericanOdds } = require('../convertOdds');
const TestEvent = require('../../../models/testEvent');
function formatBeachVolleyballFixturesOdds(event) {
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

    if (line.moneyline)
        return line;
    return null;
}

module.exports = formatBeachVolleyballFixturesOdds;
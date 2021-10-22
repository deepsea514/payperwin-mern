const { convertDecimalToAmericanOdds } = require('../convertOdds');
const formatBoxingUFCFixturesOdds = (event) => {
    const { schedule, main } = event.odds;
    let line = {
        originId: event.id,
        endDate: new Date(parseInt(event.time) * 1000),
        status: 1,
        moneyline: null,
        spreads: null,
        totals: null,
    }

    if (main && main.sp && main.sp.to_win_fight) {
        const moneyline = main.sp.to_win_fight.odds;
        line.moneyline = {
            home: convertDecimalToAmericanOdds(moneyline[0].odds),
            away: convertDecimalToAmericanOdds(moneyline[1].odds)
        }
    }

    if (line.moneyline && (!line.moneyline.home || !line.moneyline.away)) {
        line.moneyline = null
    }

    if (line.moneyline || line.spreads || line.totals)
        return line;
    return null;
}

module.exports = formatBoxingUFCFixturesOdds;
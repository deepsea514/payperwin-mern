const { convertDecimalToAmericanOdds } = require('../convertOdds');
function formatCricketFixturesOdds(event) {
    const { schedule: { sp: { main: moneyline } } } = event.odds;
    let line = {
        originId: event.id,
        endDate: new Date(parseInt(event.time) * 1000),
        status: 1,
        moneyline: {},
        spreads: null,
        totals: null,
    }

    line.moneyline.home = convertDecimalToAmericanOdds(Number(moneyline[0].odds));
    line.moneyline.away = convertDecimalToAmericanOdds(Number(moneyline[1].odds));

    if (!(line.moneyline.home > 0 && line.moneyline.away < 0) && !(line.moneyline.home < 0 && line.moneyline.away > 0)) {
        line.moneyline = null;
    }

    if (line.moneyline)
        return line;
    return null;
}

module.exports = formatCricketFixturesOdds;
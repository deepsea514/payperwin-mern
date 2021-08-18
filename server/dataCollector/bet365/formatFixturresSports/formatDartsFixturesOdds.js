const { convertDecimalToAmericanOdds } = require('../convertOdds');
function formatDartsFixturesOdds(event) {
    const { main, schedule: { sp: { main: moneyline } } } = event.odds;
    let line = {
        originId: event.id,
        endDate: new Date(parseInt(event.time) * 1000),
        status: 1,
        moneyline: {},
        spreads: [],
        totals: [],
    }

    line.moneyline.home = convertDecimalToAmericanOdds(Number(moneyline[0].odds));
    line.moneyline.away = convertDecimalToAmericanOdds(Number(moneyline[1].odds));


    if (main && Object.keys(main.sp).length > 0) {
        const match_handicap = main.sp.alternative_handicaps;
        if (match_handicap) {
            const handicap_count = match_handicap.length / 2;
            for (let i = 0; i < handicap_count; i++)
                line.spreads.push({
                    hdp: -Number(match_handicap[i].name),
                    home: convertDecimalToAmericanOdds(Number(match_handicap[i].odds)),
                    away: convertDecimalToAmericanOdds(Number(match_handicap[i + handicap_count].odds)),
                });
        }

        const total_180s = main.sp.total_180s;
        if (total_180s) {
            const total_count = total_180s.length / 3;
            for (let i = 0; i < total_count; i++)
                line.totals.push({
                    points: Number(total_180s[i].name),
                    over: convertDecimalToAmericanOdds(Number(total_180s[i + total_count].odds)),
                    under: convertDecimalToAmericanOdds(Number(total_180s[i + 2 * total_count].odds)),
                })
        }
    }

    if (!(line.moneyline.home > 0 && line.moneyline.away < 0) && !(line.moneyline.home < 0 && line.moneyline.away > 0)) {
        line.moneyline = null;
    }

    const filteredSpreads = line.spreads.filter(spread => {
        if (spread && (spread.home > 0 && spread.away < 0) || (spread.home < 0 && spread.away > 0))
            return true;
        return false;
    });
    line.spreads = filteredSpreads.length ? filteredSpreads : null;

    const filteredTotals = line.totals.filter(total => {
        if (total && (total.over > 0 && total.under < 0) || (total.over < 0 && total.under > 0))
            return true;
        return false;
    });
    line.totals = filteredTotals.length ? filteredTotals : null;

    if (line.moneyline)
        return line;
    return null;
}

module.exports = formatDartsFixturesOdds;
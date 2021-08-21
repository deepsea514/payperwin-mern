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

    line.moneyline.home = parseInt(convertDecimalToAmericanOdds(moneyline[0].odds));
    line.moneyline.away = parseInt(convertDecimalToAmericanOdds(moneyline[1].odds));


    if (main && Object.keys(main.sp).length > 0) {
        const match_handicap = main.sp.alternative_handicaps;
        if (match_handicap) {
            const handicap_count = match_handicap.length / 2;
            for (let i = 0; i < handicap_count; i++)
                line.spreads.push({
                    altLineId: match_handicap[i].id,
                    hdp: Number(match_handicap[i].name),
                    home: parseInt(convertDecimalToAmericanOdds(match_handicap[i].odds)),
                    away: parseInt(convertDecimalToAmericanOdds(match_handicap[i + handicap_count].odds)),
                });
        }

        const total_180s = main.sp.total_180s;
        if (total_180s) {
            const total_count = total_180s.length / 3;
            for (let i = 0; i < total_count; i++)
                line.totals.push({
                    altLineId: total_180s[i].id,
                    points: Number(total_180s[i].name),
                    over: parseInt(convertDecimalToAmericanOdds(total_180s[i + total_count].odds)),
                    under: parseInt(convertDecimalToAmericanOdds(total_180s[i + 2 * total_count].odds)),
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
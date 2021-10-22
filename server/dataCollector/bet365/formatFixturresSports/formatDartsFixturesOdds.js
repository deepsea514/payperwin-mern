const { convertDecimalToAmericanOdds } = require('../convertOdds');
const formatDartsFixturesOdds = (event) => {
    const { main, schedule } = event.odds;
    let line = {
        originId: event.id,
        endDate: new Date(parseInt(event.time) * 1000),
        status: 1,
        moneyline: null,
        spreads: [],
        totals: [],
    }

    if (main) {
        if (main.sp.match_winner) {
            const moneyline = main.sp.match_winner.odds;
            line.moneyline = {
                home: convertDecimalToAmericanOdds(moneyline[0].odds),
                away: convertDecimalToAmericanOdds(moneyline[1].odds)
            }
        }

        if (main.sp.handicap_2_way) {
            const match_handicap = main.sp.handicap_2_way.odds;
            const handicap_count = match_handicap.length / 2;
            for (let i = 0; i < handicap_count; i++)
                line.spreads.push({
                    altLineId: match_handicap[i].id,
                    hdp: Number(match_handicap[i].name),
                    home: convertDecimalToAmericanOdds(match_handicap[i].odds),
                    away: convertDecimalToAmericanOdds(match_handicap[i + handicap_count].odds),
                });
        }

        if (main.sp.total_180s) {
            const total_180s = main.sp.total_180s.odds;
            const total_count = total_180s.length / 2;
            for (let i = 0; i < total_count; i++)
                line.totals.push({
                    altLineId: total_180s[i].id,
                    points: Number(total_180s[i].name),
                    over: convertDecimalToAmericanOdds(total_180s[i].odds),
                    under: convertDecimalToAmericanOdds(total_180s[i + total_count].odds),
                })
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

module.exports = formatDartsFixturesOdds;
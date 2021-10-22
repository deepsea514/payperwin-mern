const { convertDecimalToAmericanOdds } = require('../convertOdds');
const formatWaterPoloFixturesOdds = (event) => {
    const { main, schedule } = event.odds;
    let line = {
        originId: event.id,
        endDate: new Date(parseInt(event.time) * 1000),
        status: 1,
        moneyline: null,
        spreads: [],
        totals: [],
    }

    if (main && main.sp.game_lines) {
        const game_lines = main.sp.game_lines.odds;
        const count = game_lines.length / 2;
        for (let i = 0; i < count; i++) {
            if (game_lines[i].name == 'Handicap') {
                line.spreads.push({
                    altLineId: game_lines[i].id,
                    hdp: Number(game_lines[i].handicap),
                    home: convertDecimalToAmericanOdds(game_lines[i].odds),
                    away: convertDecimalToAmericanOdds(game_lines[i + count].odds),
                });
            }
            if (game_lines[i].name == 'Total') {
                line.totals.push({
                    altLineId: game_lines[i].id,
                    points: Number(game_lines[i].handicap.slice(2, game_lines[i].handicap.length)),
                    over: convertDecimalToAmericanOdds(game_lines[i].odds),
                    under: convertDecimalToAmericanOdds(game_lines[i + count].odds),
                })
            }
            if (game_lines[i].name == 'Money Line' || game_lines[i].name == 'To Win') {
                line.moneyline = {
                    home: convertDecimalToAmericanOdds(game_lines[i].odds),
                    away: convertDecimalToAmericanOdds(game_lines[i + count].odds),
                }
            }
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

module.exports = formatWaterPoloFixturesOdds;
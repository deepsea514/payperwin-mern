const { convertDecimalToAmericanOdds } = require('../convertOdds');
const formatGaelicSportsFixturesOdds = (event) => {
    const { main } = event.odds;
    let line = {
        originId: event.id,
        endDate: new Date(parseInt(event.time) * 1000),
        status: 1,
        moneyline: null,
        spreads: [],
        totals: [],
    }
    if (main && main.sp.game_betting_2_way) {
        const { game_betting_2_way: { odds: game_betting_2_way } } = main.sp;
        const line_count = game_betting_2_way.length / 2;
        for (let i = 0; i < line_count; i++) {
            if (game_betting_2_way[i].name == "To Win") {
                line.moneyline = {
                    home: convertDecimalToAmericanOdds(game_betting_2_way[i].odds),
                    away: convertDecimalToAmericanOdds(game_betting_2_way[i + line_count].odds)
                }
            } else if (game_betting_2_way[i].name == "Handicap") {
                line.spreads.push({
                    altLineId: game_betting_2_way[i].id,
                    hdp: Number(game_betting_2_way[i].handicap),
                    home: convertDecimalToAmericanOdds(game_betting_2_way[i].odds),
                    away: convertDecimalToAmericanOdds(game_betting_2_way[i + line_count].odds),
                })
            } else if (game_betting_2_way[i].name == "Total") {
                line.totals.push({
                    altLineId: game_betting_2_way[i].id,
                    points: Number(game_betting_2_way[i].handicap.slice(2, game_betting_2_way[i].handicap.length)),
                    over: convertDecimalToAmericanOdds(game_betting_2_way[i].odds),
                    under: convertDecimalToAmericanOdds(game_betting_2_way[i + line_count].odds),
                })
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

module.exports = formatGaelicSportsFixturesOdds;
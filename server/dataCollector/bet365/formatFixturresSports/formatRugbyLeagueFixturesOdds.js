const { convertDecimalToAmericanOdds } = require('../convertOdds');
function formatRugbyLeagueFixturesOdds(event) {
    const { main, schedule } = event.odds;
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
        const line_count = game_betting_2_way.length / 3;
        for (let i = 0; i < line_count; i++) {
            if (game_betting_2_way[i].name == "To Win") {
                line.moneyline = {
                    home: convertDecimalToAmericanOdds(game_betting_2_way[i + line_count].odds),
                    away: convertDecimalToAmericanOdds(game_betting_2_way[i + line_count * 2].odds)
                }
            } else if (game_betting_2_way[i].name == "Handicap") {
                line.spreads.push({
                    altLineId: game_betting_2_way[i + line_count].id,
                    hdp: Number(game_betting_2_way[i + line_count].handicap),
                    home: convertDecimalToAmericanOdds(game_betting_2_way[i + line_count].odds),
                    away: convertDecimalToAmericanOdds(game_betting_2_way[i + line_count * 2].odds),
                })
            } else if (game_betting_2_way[i].name == "Total") {
                line.totals.push({
                    altLineId: game_betting_2_way[i + line_count].id,
                    points: Number(game_betting_2_way[i + line_count].handicap),
                    over: convertDecimalToAmericanOdds(game_betting_2_way[i + line_count].odds),
                    under: convertDecimalToAmericanOdds(game_betting_2_way[i + line_count * 2].odds),
                })
            }
        }
    }

    if (line.moneyline && (!line.moneyline.home || !line.moneyline.away)) {
        line.moneyline = null
    }
    line.spreads = line.spreads.length ? line.spreads : null;
    line.totals = line.totals.length ? line.totals : null;

    if (line.moneyline || line.spreads || line.totals)
        return line;
    return null;
}

module.exports = formatRugbyLeagueFixturesOdds;
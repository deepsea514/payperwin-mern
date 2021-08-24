const { convertDecimalToAmericanOdds } = require('../convertOdds');
function formatAmericanFootballFixturesOdds(event) {
    if (!event.odds.schedule) {
        return;
    }
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
        const game_lines = main.sp.game_lines;
        const count = game_lines.length / 3;
        for (let i = 0; i < count; i++) {
            if (game_lines[i].name == 'Spread') {
                line.spreads.push({
                    altLineId: game_lines[i + count].id,
                    hdp: Number(game_lines[i + count].handicap),
                    home: convertDecimalToAmericanOdds(game_lines[i + count].odds),
                    away: convertDecimalToAmericanOdds(game_lines[i + count * 2].odds),
                });
            }
            if (game_lines[i].name == 'Total') {
                line.totals.push({
                    altLineId: game_lines[i + count].id,
                    points: Number(game_lines[i + count].handicap),
                    over: convertDecimalToAmericanOdds(game_lines[i + count].odds),
                    under: convertDecimalToAmericanOdds(game_lines[i + count * 2].odds),
                })
            }
            if (game_lines[i].name == 'Money Line') {
                line.moneyline = {
                    home: convertDecimalToAmericanOdds(game_lines[i + count].odds),
                    away: convertDecimalToAmericanOdds(game_lines[i + count * 2].odds),
                }
            }
        }
    }

    if (!line.moneyline && schedule && schedule.sp.main) {
        const moneyline = schedule.sp.main;
        line.moneyline = {
            home: convertDecimalToAmericanOdds(moneyline[0].odds),
            away: convertDecimalToAmericanOdds(moneyline[1].odds)
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

module.exports = formatAmericanFootballFixturesOdds;
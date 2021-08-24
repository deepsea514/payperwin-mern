const { convertDecimalToAmericanOdds } = require('../convertOdds');
const TestEvent = require('../../../models/testEvent');
function formatFutsalFixturesOdds(event) {
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
        const { game_lines } = main.sp;
        const line_count = game_lines.length / 3;
        for (let i = 0; i < line_count; i++) {
            if (game_lines[i].name == "To Win") {
                line.moneyline = {
                    home: convertDecimalToAmericanOdds(game_lines[i + line_count].odds),
                    away: convertDecimalToAmericanOdds(game_lines[i + line_count * 2].odds)
                }
            } else if (game_lines[i].name == "Handicap") {
                line.spreads.push({
                    hdp: Number(game_lines[i + line_count].handicap),
                    home: convertDecimalToAmericanOdds(game_lines[i + line_count].odds),
                    away: convertDecimalToAmericanOdds(game_lines[i + line_count * 2].odds),
                })
            } else if (game_lines[i].name == "Total") {
                line.totals.push({
                    points: Number(game_lines[i + line_count].handicap),
                    over: convertDecimalToAmericanOdds(game_lines[i + line_count].odds),
                    under: convertDecimalToAmericanOdds(game_lines[i + line_count * 2].odds),
                })
            }
        }
    }

    if (!line.moneyline && schedule) {
        line.moneyline = {
            home: convertDecimalToAmericanOdds(schedule.sp.main[0].odds),
            away: convertDecimalToAmericanOdds(schedule.sp.main[2].odds)
        };
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

module.exports = formatFutsalFixturesOdds;
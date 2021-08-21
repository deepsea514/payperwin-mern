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
                    home: parseInt(convertDecimalToAmericanOdds(game_lines[i + line_count].odds)),
                    away: parseInt(convertDecimalToAmericanOdds(game_lines[i + line_count * 2].odds))
                }
            } else if (game_lines[i].name == "Handicap") {
                line.spreads.push({
                    hdp: Number(game_lines[i + line_count].handicap),
                    home: parseInt(convertDecimalToAmericanOdds(game_lines[i + line_count].odds)),
                    away: parseInt(convertDecimalToAmericanOdds(game_lines[i + line_count * 2].odds)),
                })
            } else if (game_lines[i].name == "Total") {
                line.totals.push({
                    points: Number(game_lines[i + line_count].handicap),
                    over: parseInt(convertDecimalToAmericanOdds(game_lines[i + line_count].odds)),
                    under: parseInt(convertDecimalToAmericanOdds(game_lines[i + line_count * 2].odds)),
                })
            }
        }
    }

    if (!line.moneyline && schedule) {
        line.moneyline = {
            home: parseInt(convertDecimalToAmericanOdds(schedule.sp.main[0].odds)),
            away: parseInt(convertDecimalToAmericanOdds(schedule.sp.main[2].odds))
        };
    }

    if (line.moneyline && !(line.moneyline.home > 0 && line.moneyline.away < 0) && !(line.moneyline.home < 0 && line.moneyline.away > 0)) {
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

module.exports = formatFutsalFixturesOdds;
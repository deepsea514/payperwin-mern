const { convertDecimalToAmericanOdds } = require('../convertOdds');
function formatTableTennisFixturesOdds(event) {
    const { main, schedule } = event.odds;
    let line = {
        originId: event.id,
        endDate: new Date(parseInt(event.time) * 1000),
        status: 1,
        moneyline: null,
        spreads: [],
        totals: [],
    }

    if (main && main.sp.match_lines) {
        const { match_lines } = main.sp;
        const line_count = match_lines.length / 3;
        for (let i = 0; i < line_count; i++) {
            if (match_lines[i].name == "To Win") {
                line.moneyline = {
                    home: convertDecimalToAmericanOdds(match_lines[i + line_count].odds),
                    away: convertDecimalToAmericanOdds(match_lines[i + line_count * 2].odds)
                }
            } else if (match_lines[i].name == "Handicap") {
                line.spreads.push({
                    altLineId: match_lines[i + line_count].id,
                    hdp: Number(match_lines[i + line_count].handicap),
                    home: convertDecimalToAmericanOdds(match_lines[i + line_count].odds),
                    away: convertDecimalToAmericanOdds(match_lines[i + line_count * 2].odds),
                })
            } else if (match_lines[i].name == "Total") {
                line.totals.push({
                    altLineId: match_lines[i + line_count].id,
                    points: Number(match_lines[i + line_count].handicap),
                    over: convertDecimalToAmericanOdds(match_lines[i + line_count].odds),
                    under: convertDecimalToAmericanOdds(match_lines[i + line_count * 2].odds),
                })
            }
        }
    }

    if (!line.moneyline && schedule) {
        line.moneyline = {
            home: convertDecimalToAmericanOdds(schedule.sp.main[0].odds),
            away: convertDecimalToAmericanOdds(schedule.sp.main[1].odds)
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

module.exports = formatTableTennisFixturesOdds;
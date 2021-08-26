const { convertDecimalToAmericanOdds } = require('../convertOdds');
const TestEvent = require('../../../models/testEvent');
function formatBadmintonFixturesOdds(event) {
    const { main, match } = event.odds;
    let line = {
        originId: event.id,
        endDate: new Date(parseInt(event.time) * 1000),
        status: 1,
        moneyline: null,
        spreads: [],
        totals: [],
    }

    if (main && main.sp.match_lines) {
        const match_lines = main.sp.match_lines.odds;
        const line_count = match_lines.length / 2;
        for (let i = 0; i < line_count; i++) {
            if (match_lines[i].name == "To Win") {
                line.moneyline = {
                    home: convertDecimalToAmericanOdds(match_lines[i].odds),
                    away: convertDecimalToAmericanOdds(match_lines[i + line_count].odds)
                }
            } else if (match_lines[i].name == "Spread") {
                line.spreads.push({
                    altLineId: match_lines[i].id,
                    hdp: Number(match_lines[i].handicap),
                    home: convertDecimalToAmericanOdds(match_lines[i].odds),
                    away: convertDecimalToAmericanOdds(match_lines[i + line_count].odds),
                })
            } else if (match_lines[i].name == "Total") {
                line.totals.push({
                    altLineId: match_lines[i].id,
                    points: Number(match_lines[i].handicap.slice(2, match_lines[i].handicap.length)),
                    over: convertDecimalToAmericanOdds(match_lines[i].odds),
                    under: convertDecimalToAmericanOdds(match_lines[i + line_count].odds),
                })
            }
        }
    } else if (match && match.sp.match_lines) {
        const match_lines = match.sp.match_lines.odds;
        const line_count = match_lines.length / 2;
        for (let i = 0; i < line_count; i++) {
            if (match_lines[i].name == "To Win") {
                line.moneyline = {
                    home: convertDecimalToAmericanOdds(match_lines[i].odds),
                    away: convertDecimalToAmericanOdds(match_lines[i + line_count].odds)
                }
            } else if (match_lines[i].name == "Spread") {
                line.spreads.push({
                    altLineId: match_lines[i].id,
                    hdp: Number(match_lines[i].handicap),
                    home: convertDecimalToAmericanOdds(match_lines[i].odds),
                    away: convertDecimalToAmericanOdds(match_lines[i + line_count].odds),
                })
            } else if (match_lines[i].name == "Total") {
                line.totals.push({
                    altLineId: match_lines[i].id,
                    points: Number(match_lines[i].handicap.slice(2, match_lines[i].handicap.length)),
                    over: convertDecimalToAmericanOdds(match_lines[i].odds),
                    under: convertDecimalToAmericanOdds(match_lines[i + line_count].odds),
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

module.exports = formatBadmintonFixturesOdds;
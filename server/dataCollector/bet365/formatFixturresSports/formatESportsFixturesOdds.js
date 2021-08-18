const { convertDecimalToAmericanOdds } = require('../convertOdds');
function formatESportsFixturesOdds(event) {
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
                    home: convertDecimalToAmericanOdds(Number(match_lines[i + line_count].odds)),
                    away: convertDecimalToAmericanOdds(Number(match_lines[i + line_count * 2].odds))
                }
            } else if (match_lines[i].name == "Match Handicap") {
                line.spreads.push({
                    altLineId: match_lines[i + line_count].id,
                    hdp: -Number(match_lines[i + line_count].handicap),
                    home: convertDecimalToAmericanOdds(Number(match_lines[i + line_count].odds)),
                    away: convertDecimalToAmericanOdds(Number(match_lines[i + line_count * 2].odds)),
                })
            } else if (match_lines[i].name == "Total Maps") {
                line.totals.push({
                    altLineId: match_lines[i + line_count].id,
                    points: Number(match_lines[i + line_count].handicap),
                    over: convertDecimalToAmericanOdds(Number(match_lines[i + line_count].odds)),
                    under: convertDecimalToAmericanOdds(Number(match_lines[i + line_count * 2].odds)),
                })
            }
        }
    }

    if (!line.moneyline && schedule) {
        line.moneyline = {
            home: convertDecimalToAmericanOdds(Number(schedule.sp.main[0].odds)),
            away: convertDecimalToAmericanOdds(Number(schedule.sp.main[1].odds))
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
    line.spreads = filteredSpreads;

    const filteredTotals = line.totals.filter(total => {
        if (total && (total.over > 0 && total.under < 0) || (total.over < 0 && total.under > 0))
            return true;
        return false;
    });
    line.totals = filteredTotals;

    if (line.moneyline)
        return line;
    return null;
}

module.exports = formatESportsFixturesOdds;
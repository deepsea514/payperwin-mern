const { convertDecimalToAmericanOdds } = require('../convertOdds');
const formatFloorballFixturesOdds = (event) => {
    const { main, others } = event.odds;
    let line = {
        originId: event.id,
        endDate: new Date(parseInt(event.time) * 1000),
        status: 1,
        moneyline: null,
        spreads: [],
        totals: [],
    }

    if (main) {
        if (main.sp['3_way_betting']);
        const _3_way_betting = main.sp['3_way_betting'].odds;
        const line_count = _3_way_betting.length / 3;
        for (let i = 0; i < line_count; i++) {
            if (_3_way_betting[i].name == "Money Line") {
                line.moneyline = {
                    home: convertDecimalToAmericanOdds(_3_way_betting[i].odds),
                    away: convertDecimalToAmericanOdds(_3_way_betting[i + line_count * 2].odds)
                }
            }
        }
    }

    if (others) {
        let game_lines = others.find(other => {
            if (other && other.sp && other.sp.game_lines) return true;
            return false;
        });
        if (game_lines) {
            game_lines = game_lines.sp.game_lines.odds;
            const line_count = game_lines.length / 2;

            for (let i = 0; i < line_count; i++) {
                if (game_lines[i].name == 'Handicap') {
                    line.spreads.push({
                        altLineId: game_lines[i].id,
                        hdp: Number(game_lines[i].handicap),
                        home: convertDecimalToAmericanOdds(game_lines[i].odds),
                        away: convertDecimalToAmericanOdds(game_lines[i + line_count].odds),
                    });
                }
                if (game_lines[i].name == 'Total') {
                    line.totals.push({
                        altLineId: game_lines[i].id,
                        points: Number(game_lines[i].handicap.slice(2, game_lines[i].handicap.length)),
                        over: convertDecimalToAmericanOdds(game_lines[i].odds),
                        under: convertDecimalToAmericanOdds(game_lines[i + line_count].odds),
                    })
                }
                if (game_lines[i].name == 'Money Line' && !line.moneyline) {
                    line.moneyline = {
                        home: convertDecimalToAmericanOdds(game_lines[i].odds),
                        away: convertDecimalToAmericanOdds(game_lines[i + line_count].odds)
                    }
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

module.exports = formatFloorballFixturesOdds;
const { convertDecimalToAmericanOdds } = require('../convertOdds');
const formatVolleyballFixturesOdds = (event) => {
    const { main } = event.odds;
    let line = {
        originId: event.id,
        endDate: new Date(parseInt(event.time) * 1000),
        status: 1,
        moneyline: null,
        spreads: [],
        totals: [],
        home_totals: [],
        away_totals: [],
    }

    if (main) {
        if (main.sp.game_lines) {
            const { game_lines: { odds: game_lines } } = main.sp;
            const line_count = game_lines.length / 2;
            for (let i = 0; i < line_count; i++) {
                if (game_lines[i].name == "To Win") {
                    line.moneyline = {
                        home: convertDecimalToAmericanOdds(game_lines[i].odds),
                        away: convertDecimalToAmericanOdds(game_lines[i + line_count].odds)
                    }
                } else if (game_lines[i].name == "Handicap - Sets") {
                    line.spreads.push({
                        altLineId: game_lines[i].id,
                        hdp: Number(game_lines[i].handicap),
                        home: convertDecimalToAmericanOdds(game_lines[i].odds),
                        away: convertDecimalToAmericanOdds(game_lines[i + line_count].odds),
                    })
                } else if (game_lines[i].name == "Total Points") {
                    line.totals.push({
                        altLineId: game_lines[i].id,
                        points: Number(game_lines[i].handicap.slice(2, game_lines[i].handicap.length)),
                        over: convertDecimalToAmericanOdds(game_lines[i].odds),
                        under: convertDecimalToAmericanOdds(game_lines[i + line_count].odds),
                    })
                }
            }
        }
        if (main.sp.team_total_points) {
            const team_total_points = main.sp.team_total_points.odds;
            let home_totals = team_total_points.filter(total => total.header == "1");
            let away_totals = team_total_points.filter(total => total.header == "2");
            while (home_totals.length > 0) {
                const first = home_totals[0];
                const first_options = first.handicap.split(' ');
                const over_under = first_options[0];
                const points = first_options[1];
                const second = home_totals.find(total => total.handicap == (over_under == 'Over' ? 'Under ' : 'Over ') + points);
                if (!second) {
                    home_totals = home_totals.filter(total => total.id != first.id);
                    continue;
                }
                const over = over_under == 'Over' ? first : second;
                const under = over_under == 'Under' ? first : second;
                line.home_totals.push({
                    altLineId: over.id,
                    points: Number(points),
                    over: convertDecimalToAmericanOdds(over.odds),
                    under: convertDecimalToAmericanOdds(under.odds),
                });
                home_totals = home_totals.filter(total => total.id != over.id && total.id != under.id);
            }

            while (away_totals.length > 0) {
                const first = away_totals[0];
                const first_options = first.handicap.split(' ');
                const over_under = first_options[0];
                const points = first_options[1];
                const second = away_totals.find(total => total.handicap == (over_under == 'Over' ? 'Under ' : 'Over ') + points);
                if (!second) {
                    away_totals = away_totals.filter(total => total.id != first.id);
                    continue;
                }
                const over = over_under == 'Over' ? first : second;
                const under = over_under == 'Under' ? first : second;
                line.away_totals.push({
                    altLineId: over.id,
                    points: Number(points),
                    over: convertDecimalToAmericanOdds(over.odds),
                    under: convertDecimalToAmericanOdds(under.odds),
                });
                away_totals = away_totals.filter(total => total.id != over.id && total.id != under.id);
            }
        }
    }

    if (line.moneyline && (!line.moneyline.home || !line.moneyline.away)) {
        line.moneyline = null
    }
    line.spreads = line.spreads && line.spreads.length ? line.spreads : null;
    line.totals = line.totals && line.totals.length ? line.totals : null;
    line.home_totals = line.home_totals && line.home_totals.length ? line.home_totals : null;
    line.away_totals = line.away_totals && line.away_totals.length ? line.away_totals : null;

    if (line.moneyline || line.spreads || line.totals)
        return line;
    return null;
}

module.exports = formatVolleyballFixturesOdds;
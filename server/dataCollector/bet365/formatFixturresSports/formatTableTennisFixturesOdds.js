const { convertDecimalToAmericanOdds } = require('../convertOdds');
const formatTableTennisFixturesOdds = (event) => {
    const { main, others } = event.odds;
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

    if (main && main.sp.match_lines) {
        const { match_lines: { odds: match_lines } } = main.sp;
        const line_count = match_lines.length / 2;
        for (let i = 0; i < line_count; i++) {
            if (match_lines[i].name == "To Win") {
                line.moneyline = {
                    home: convertDecimalToAmericanOdds(match_lines[i].odds),
                    away: convertDecimalToAmericanOdds(match_lines[i + line_count].odds)
                }
            } else if (match_lines[i].name == "Handicap") {
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

    if (others) {
        let player_totals = others.find(other => other.sp.player_totals);
        if (player_totals && player_totals.sp.player_totals) {
            player_totals = player_totals.sp.player_totals.odds;
            let home_totals = player_totals.filter(total => total.header == "1");
            let away_totals = player_totals.filter(total => total.header == "2");
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

module.exports = formatTableTennisFixturesOdds;
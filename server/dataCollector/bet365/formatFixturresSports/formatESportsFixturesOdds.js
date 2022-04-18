const { convertDecimalToAmericanOdds } = require('../convertOdds');

const gotLineToOdds = (game_lines) => {
    let line = {
        moneyline: null,
        spreads: [],
        totals: [],
    }
    while (game_lines.length) {
        const first = game_lines[0];

        if (first.name == 'To Win') {
            const second = game_lines.find(game_line => game_line.header != first.header && game_line.name == first.name);
            if (!second) {
                game_lines = game_lines.filter(game_line => game_line.id != first.id);
                continue;
            }
            const home = first.header == '1' ? first : second;
            const away = first.header == '2' ? first : second;
            line.moneyline = {
                home: convertDecimalToAmericanOdds(home.odds),
                away: convertDecimalToAmericanOdds(away.odds),
            }
            game_lines = game_lines.filter(game_line => game_line.id != first.id && game_line.id != second.id);
        } else if (first.name == 'Match Handicap') {
            const second = game_lines.find(game_line => Number(game_line.handicap) == -Number(first.handicap) && game_line.header != first.header);
            if (!second) {
                game_lines = game_lines.filter(game_line => game_line.id != first.id);
                continue;
            }
            const home = first.header == '1' ? first : second;
            const away = first.header == '2' ? first : second;
            line.spreads.push({
                altLineId: home.id,
                hdp: Number(home.handicap),
                home: convertDecimalToAmericanOdds(home.odds),
                away: convertDecimalToAmericanOdds(away.odds),
            });
            game_lines = game_lines.filter(game_line => game_line.id != first.id && game_line.id != second.id);
        } else if (first.name == 'Total Maps') {
            const points = first.handicap.slice(2, first.handicap.length);
            const second = game_lines.find(game_line => game_line.name == first.name &&
                game_line.handicap != first.handicap &&
                game_line.handicap.slice(2, game_line.handicap.length) == points);
            if (!second) {
                game_lines = game_lines.filter(game_line => game_line.id != first.id);
                continue;
            }
            const over = first.header == '1' ? first : second;
            const under = first.header == '2' ? first : second;
            line.totals.push({
                altLineId: over.id,
                points: Number(points),
                over: convertDecimalToAmericanOdds(over.odds),
                under: convertDecimalToAmericanOdds(under.odds),
            });
            game_lines = game_lines.filter(game_line => game_line.id != first.id && game_line.id != second.id);
        } else {
            game_lines = game_lines.filter(game_line => game_line.id != first.id);
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

const formatESportsFixturesOdds = (event) => {
    const { main, match } = event.odds;
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
        const whole_line = gotLineToOdds(match_lines);
        if (whole_line == null) return null;
        line = { ...line, ...whole_line };
    }

    if (match) {
        if (match.sp.team_total_rounds) {
            const team_total_rounds = match.sp.team_total_rounds.odds;
            let home_totals = team_total_rounds.filter(total => total.header == "1");
            let away_totals = team_total_rounds.filter(total => total.header == "2");
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

module.exports = formatESportsFixturesOdds;
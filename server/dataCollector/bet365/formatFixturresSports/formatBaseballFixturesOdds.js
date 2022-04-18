const { convertDecimalToAmericanOdds } = require('../convertOdds');

const gotLineToOdds = (game_lines) => {
    let line = {
        moneyline: null,
        spreads: [],
        totals: [],
    }

    while (game_lines.length) {
        const first = game_lines[0];

        if (first.name == 'Money Line') {
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
        } else if (first.name == 'Run Line' || first.team == 'Run Line') {
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
        } else if (first.name == 'Total') {
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

const formatBaseballFixturesOdds = (event) => {
    const { main, main_props, others } = event.odds;
    let line = {
        originId: event.id,
        endDate: new Date(parseInt(event.time) * 1000),
        status: 1,
        moneyline: null,
        spreads: [],
        totals: [],
        alternative_spreads: [],
        alternative_totals: [],
        fifth_innings: null,
    }

    if (main) {
        if (main.sp.game_lines) {
            const game_lines = main.sp.game_lines.odds;
            const whole_line = gotLineToOdds(game_lines);
            if (whole_line == null) return null;
            line = { ...line, ...whole_line };
        }

        //Fifth Innings
        let _5_innings = [];
        if (main.sp["5_innings"]) {
            _5_innings = main.sp["5_innings"].odds;
        }
        if (_5_innings.length == 0 && others) {
            let other = others.find(other => other.sp && other.sp["5_innings"]);
            if (other) _5_innings = other.sp["5_innings"].odds;
        }
        if (_5_innings.length) {
            line.fifth_innings = gotLineToOdds(_5_innings);
        }
    }
    if (main_props) {
        // Alternative spreads and totals
        let alternative_run_line = [];
        if (main_props.sp["alternative_run_line"]) {
            alternative_run_line = main_props.sp["alternative_run_line"].odds;
        }
        if (alternative_run_line.length == 0 && others) {
            let other = others.find(other => other.sp && other.sp["alternative_run_line"]);
            alternative_run_line = other ? other.sp["alternative_run_line"].odds : [];
        }
        while (alternative_run_line.length > 0) {
            const first = alternative_run_line[0];
            const second = alternative_run_line.find(total => Number(total.handicap) == -Number(first.handicap) && total.header != first.header);
            if (!second) {
                alternative_run_line = alternative_run_line.filter(total => total.id != first.id);
                continue;
            }
            const home = first.header == '1' ? first : second;
            const away = first.header == '2' ? first : second;
            line.alternative_spreads.push({
                altLineId: home.id,
                hdp: Number(home.handicap),
                home: convertDecimalToAmericanOdds(home.odds),
                away: convertDecimalToAmericanOdds(away.odds),
            });
            alternative_run_line = alternative_run_line.filter(total => total.id != home.id && total.id != away.id);
        }

        let alternative_game_total = [];
        if (main_props.sp["alternative_game_total"]) {
            alternative_game_total = main_props.sp["alternative_game_total"].odds;
        }
        if (alternative_game_total.length == 0 && others) {
            let other = others.find(other => other.sp && other.sp["alternative_game_total"]);
            alternative_game_total = other ? other.sp["alternative_game_total"].odds : [];
        }
        while (alternative_game_total.length > 0) {
            const first = alternative_game_total[0];
            const second = alternative_game_total.find(total => total.name == first.name && total.header != first.header);
            if (!second) {
                alternative_game_total = alternative_game_total.filter(total => total.name != first.name);
                continue;
            }
            const over = first.header == 'Over' ? first : second;
            const under = first.header == 'Under' ? first : second;
            line.alternative_totals.push({
                altLineId: over.id,
                points: Number(over.name),
                over: convertDecimalToAmericanOdds(over.odds),
                under: convertDecimalToAmericanOdds(under.odds),
            });
            alternative_game_total = alternative_game_total.filter(total => total.name != first.name);
        }
    }

    if (line.moneyline && (!line.moneyline.home || !line.moneyline.away)) {
        line.moneyline = null
    }
    line.spreads = line.spreads && line.spreads.length ? line.spreads : null;
    line.totals = line.totals && line.totals.length ? line.totals : null;
    line.alternative_spreads = line.alternative_spreads && line.alternative_spreads.length ? line.alternative_spreads : null;
    line.alternative_totals = line.alternative_totals && line.alternative_totals.length ? line.alternative_totals : null;

    if (line.moneyline || line.spreads || line.totals)
        return line;
    return null;
}

module.exports = formatBaseballFixturesOdds;
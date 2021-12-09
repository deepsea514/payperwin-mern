const { convertDecimalToAmericanOdds } = require('../convertOdds');

const gotLineToOdds = (game_lines) => {
    let line = {
        moneyline: null,
        spreads: [],
        totals: [],
    }
    const count = game_lines.length / 2;
    for (let i = 0; i < count; i++) {
        if (game_lines[i].name == 'Run Line' || game_lines[i].team == 'Run Line') {
            line.spreads.push({
                altLineId: game_lines[i].id,
                hdp: Number(game_lines[i].handicap),
                home: convertDecimalToAmericanOdds(game_lines[i].odds),
                away: convertDecimalToAmericanOdds(game_lines[i + count].odds),
            });
        }
        if (game_lines[i].name == 'Total') {
            line.totals.push({
                altLineId: game_lines[i].id,
                points: Number(game_lines[i].handicap.slice(2, game_lines[i].handicap.length)),
                over: convertDecimalToAmericanOdds(game_lines[i].odds),
                under: convertDecimalToAmericanOdds(game_lines[i + count].odds),
            })
        }
        if (game_lines[i].name == 'Money Line' && !line.moneyline) {
            line.moneyline = {
                home: convertDecimalToAmericanOdds(game_lines[i].odds),
                away: convertDecimalToAmericanOdds(game_lines[i + count].odds)
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
            if (!second) continue;
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
            if (!second) continue;
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
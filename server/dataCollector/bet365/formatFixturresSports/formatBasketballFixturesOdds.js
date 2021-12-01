const { convertDecimalToAmericanOdds } = require('../convertOdds');

const gotLineToOdds = (game_lines) => {
    let line = {
        moneyline: null,
        spreads: [],
        totals: [],
    }
    const line_count = game_lines.length / 2;
    for (let i = 0; i < line_count; i++) {
        if (game_lines[i].name == "Money Line") {
            line.moneyline = {
                home: convertDecimalToAmericanOdds(game_lines[i].odds),
                away: convertDecimalToAmericanOdds(game_lines[i + line_count].odds)
            }
        } else if (game_lines[i].name == "Spread") {
            line.spreads.push({
                altLineId: game_lines[i].id,
                hdp: Number(game_lines[i].handicap),
                home: convertDecimalToAmericanOdds(game_lines[i].odds),
                away: convertDecimalToAmericanOdds(game_lines[i + line_count].odds),
            })
        } else if (game_lines[i].name == "Total") {
            line.totals.push({
                altLineId: game_lines[i].id,
                points: Number(game_lines[i].handicap.slice(2, game_lines[i].handicap.length)),
                over: convertDecimalToAmericanOdds(game_lines[i].odds),
                under: convertDecimalToAmericanOdds(game_lines[i + line_count].odds),
            })
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

const formatBasketballFixturesOdds = (event) => {
    const { main, others } = event.odds;
    let line = {
        originId: event.id,
        endDate: new Date(parseInt(event.time) * 1000),
        status: 1,
        moneyline: null,
        spreads: [],
        totals: [],
        alternative_spreads: [],
        alternative_totals: [],
        first_half: null,
        second_half: null,
        first_quarter: null,
        second_quarter: null,
        third_quarter: null,
        forth_quarter: null,
    }

    if (main) {
        if (main.sp.game_lines) {
            const game_lines = main.sp.game_lines.odds;
            const whole_line = gotLineToOdds(game_lines);
            if (whole_line == null) return null;
            line = { ...line, ...whole_line };
        }

        //First Half
        let _1st_half = [];
        if (main.sp["1st_half"]) {
            _1st_half = main.sp["1st_half"].odds;
        }
        if (_1st_half.length == 0 && others) {
            let other = others.find(other => other.sp && other.sp["1st_half"]);
            if (other) _1st_half = other.sp["1st_half"].odds;
        }
        if (_1st_half.length) {
            line.first_half = gotLineToOdds(_1st_half);
        }

        //Second Half
        let _2nd_half = [];
        if (main.sp["2nd_half"]) {
            _2nd_half = main.sp["2nd_half"].odds;
        }
        if (_2nd_half.length == 0 && others) {
            let other = others.find(other => other.sp && other.sp["2nd_half"]);
            if (other) _2nd_half = other.sp["2nd_half"].odds;
        }
        if (_2nd_half.length) {
            line.second_half = gotLineToOdds(_2nd_half);
        }

        //First Quarter
        let _1st_quarter = [];
        if (main.sp["1st_quarter"]) {
            _1st_quarter = main.sp["1st_quarter"].odds;
        }
        if (_1st_quarter.length == 0 && others) {
            let other = others.find(other => other.sp && other.sp["1st_quarter"]);
            if (other) _1st_quarter = other.sp["1st_quarter"].odds;
        }
        if (_1st_quarter.length) {
            line.first_quarter = gotLineToOdds(_1st_quarter);
        }

        //Second Quarter
        let _2nd_quarter = [];
        if (main.sp["2nd_quarter"]) {
            _2nd_quarter = main.sp["2nd_quarter"].odds;
        }
        if (_2nd_quarter.length == 0 && others) {
            let other = others.find(other => other.sp && other.sp["2nd_quarter"]);
            if (other) _2nd_quarter = other.sp["2nd_quarter"].odds;
        }
        if (_2nd_quarter.length) {
            line.second_quarter = gotLineToOdds(_2nd_quarter);
        }

        //Third Quarter
        let _3rd_quarter = [];
        if (main.sp["3rd_quarter"]) {
            _3rd_quarter = main.sp["3rd_quarter"].odds;
        }
        if (_3rd_quarter.length == 0 && others) {
            let other = others.find(other => other.sp && other.sp["3rd_quarter"]);
            if (other) _3rd_quarter = other.sp["3rd_quarter"].odds;
        }
        if (_3rd_quarter.length) {
            line.third_quarter = gotLineToOdds(_3rd_quarter);
        }

        //Forth Quarter
        let _4th_quarter = [];
        if (main.sp["4th_quarter"]) {
            _4th_quarter = main.sp["4th_quarter"].odds;
        }
        if (_4th_quarter.length == 0 && others) {
            let other = others.find(other => other.sp && other.sp["4th_quarter"]);
            if (other) _4th_quarter = other.sp["4th_quarter"].odds;
        }
        if (_4th_quarter.length) {
            line.forth_quarter = gotLineToOdds(_4th_quarter);
        }

        // Alternative spreads and totals
        if (others) {
            let other = others.find(other => other.sp && other.sp["alternative_point_spread"]);
            let alternative_point_spread = other ? other.sp["alternative_point_spread"].odds : [];
            while (alternative_point_spread.length > 0) {
                const first = alternative_point_spread[0];
                const second = alternative_point_spread.find(total => Number(total.handicap) == -Number(first.handicap) && total.header != first.header);
                if (!second) continue;
                const home = first.header == '1' ? first : second;
                const away = first.header == '2' ? first : second;
                line.alternative_spreads.push({
                    altLineId: home.id,
                    hdp: Number(home.handicap),
                    over: convertDecimalToAmericanOdds(home.odds),
                    under: convertDecimalToAmericanOdds(away.odds),
                });
                alternative_point_spread = alternative_point_spread.filter(total => total.id != home.id && total.id != away.id);
            }

            other = others.find(other => other.sp && other.sp["alternative_game_total"]);
            let alternative_game_total = other ? other.sp["alternative_game_total"].odds : [];
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
    }

    line.spreads = line.spreads && line.spreads.length ? line.spreads : null;
    line.totals = line.totals && line.totals.length ? line.totals : null;
    line.alternative_spreads = line.alternative_spreads && line.alternative_spreads.length ? line.alternative_spreads : null;
    line.alternative_totals = line.alternative_totals && line.alternative_totals.length ? line.alternative_totals : null;
    return line;
}

module.exports = formatBasketballFixturesOdds;
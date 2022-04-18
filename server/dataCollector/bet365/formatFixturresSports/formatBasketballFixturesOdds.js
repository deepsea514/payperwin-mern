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
        } else if (first.name == 'Spread') {
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

    if (line.moneyline || line.spreads || line.totals) {
        return line;
    }
    return null;
}

const formatBasketballFixturesOdds = (event) => {
    const { main, others, team_props } = event.odds;
    let line = {
        originId: event.id,
        endDate: new Date(parseInt(event.time) * 1000),
        status: 1,
        moneyline: null,
        spreads: [],
        totals: [],
        home_totals: [],
        away_totals: [],
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
            if (whole_line == null) {
                return null;
            }
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
                if (!second) {
                    alternative_point_spread = alternative_point_spread.filter(spread => spread.id != first.id);
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
                alternative_point_spread = alternative_point_spread.filter(spread => spread.id != home.id && spread.id != away.id);
            }

            other = others.find(other => other.sp && other.sp["alternative_game_total"]);
            let alternative_game_total = other ? other.sp["alternative_game_total"].odds : [];
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
    }

    if (team_props && team_props.sp.team_totals) {
        const team_totals = team_props.sp.team_totals.odds;
        let home_totals = team_totals.filter(total => total.header == "1");
        let away_totals = team_totals.filter(total => total.header == "2");
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

    line.spreads = line.spreads && line.spreads.length ? line.spreads : null;
    line.totals = line.totals && line.totals.length ? line.totals : null;
    line.alternative_spreads = line.alternative_spreads && line.alternative_spreads.length ? line.alternative_spreads : null;
    line.alternative_totals = line.alternative_totals && line.alternative_totals.length ? line.alternative_totals : null;
    line.home_totals = line.home_totals && line.home_totals.length ? line.home_totals : null;
    line.away_totals = line.away_totals && line.away_totals.length ? line.away_totals : null;

    if (line.moneyline || line.spreads || line.totals) {
        return line;
    }
    return null;
}

module.exports = formatBasketballFixturesOdds;
const { convertDecimalToAmericanOdds } = require('../convertOdds');

const gotLineToOdds = (game_lines) => {
    let line = {
        moneyline: null,
        spreads: [],
        totals: [],
    }
    const count = game_lines.length / 2;
    for (let i = 0; i < count; i++) {
        if (game_lines[i].name == 'Spread') {
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
        if (game_lines[i].name == 'Money Line') {
            line.moneyline = {
                home: convertDecimalToAmericanOdds(game_lines[i].odds),
                away: convertDecimalToAmericanOdds(game_lines[i + count].odds),
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

const formatAmericanFootballFixturesOdds = (event) => {
    const { main, others } = event.odds;
    // console.log(main);
    // console.log(others);
    let line = {
        originId: event.id,
        endDate: new Date(parseInt(event.time) * 1000),
        status: 1,
        moneyline: null,
        spreads: [],
        totals: [],
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

        if (main.sp["1st_half_lines_2_way"]) {
            let _1st_half_lines_2_way = main.sp["1st_half_lines_2_way"].odds;
            if (_1st_half_lines_2_way.length == 0) {
                let other = others.find(other => other.sp && other.sp["1st_half_lines_2_way"]);
                if (other) _1st_half_lines_2_way = other.sp["1st_half_lines_2_way"].odds;
            }
            if (_1st_half_lines_2_way.length) {
                line.first_half = gotLineToOdds(_1st_half_lines_2_way);
            }
        }

        if (main.sp["2nd_half_lines_2_way"]) {
            let _2nd_half_lines_2_way = main.sp["2nd_half_lines_2_way"].odds;
            if (_2nd_half_lines_2_way.length == 0) {
                let other = others.find(other => other.sp && other.sp["2nd_half_lines_2_way"]);
                if (other) _2nd_half_lines_2_way = other.sp["2nd_half_lines_2_way"].odds;
            }
            if (_2nd_half_lines_2_way.length) {
                line.second_half = gotLineToOdds(_2nd_half_lines_2_way);
            }
        }

        if (main.sp["1st_quarter_lines_2_way"]) {
            let _1st_quarter_lines_2_way = main.sp["1st_quarter_lines_2_way"].odds;
            if (_1st_quarter_lines_2_way.length == 0) {
                let other = others.find(other => other.sp && other.sp["1st_quarter_lines_2_way"]);
                if (other) _1st_quarter_lines_2_way = other.sp["1st_quarter_lines_2_way"].odds;
            }
            if (_1st_quarter_lines_2_way.length) {
                line.first_quarter = gotLineToOdds(_1st_quarter_lines_2_way);
            }
        }

        if (main.sp["2nd_quarter_lines_2_way"]) {
            let _2nd_quarter_lines_2_way = main.sp["2nd_quarter_lines_2_way"].odds;
            if (_2nd_quarter_lines_2_way.length == 0) {
                let other = others.find(other => other.sp && other.sp["2nd_quarter_lines_2_way"]);
                if (other) _2nd_quarter_lines_2_way = other.sp["2nd_quarter_lines_2_way"].odds;
            }
            if (_2nd_quarter_lines_2_way.length) {
                line.second_quarter = gotLineToOdds(_2nd_quarter_lines_2_way);
            }
        }

        if (main.sp["3rd_quarter_lines_2_way"]) {
            let _3rd_quarter_lines_2_way = main.sp["3rd_quarter_lines_2_way"].odds;
            if (_3rd_quarter_lines_2_way.length == 0) {
                let other = others.find(other => other.sp && other.sp["3rd_quarter_lines_2_way"]);
                if (other) _3rd_quarter_lines_2_way = other.sp["3rd_quarter_lines_2_way"].odds;
            }
            if (_3rd_quarter_lines_2_way.length) {
                line.third_quarter = gotLineToOdds(_3rd_quarter_lines_2_way);
            }
        }

        if (main.sp["4th_quarter_lines_2_way"]) {
            let _4th_quarter_lines_2_way = main.sp["4th_quarter_lines_2_way"].odds;
            if (_4th_quarter_lines_2_way.length == 0) {
                let other = others.find(other => other.sp && other.sp["4th_quarter_lines_2_way"]);
                if (other) _4th_quarter_lines_2_way = other.sp["4th_quarter_lines_2_way"].odds;
            }
            if (_4th_quarter_lines_2_way.length) {
                line.forth_quarter = gotLineToOdds(_4th_quarter_lines_2_way);
            }
        }
    }

    line.spreads = line.spreads.length ? line.spreads : null;
    line.totals = line.totals.length ? line.totals : null;
    return line;

}

module.exports = formatAmericanFootballFixturesOdds;
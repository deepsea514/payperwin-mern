const { convertDecimalToAmericanOdds } = require('../convertOdds');
function formatBaseballFixturesOdds(event) {
    const { main, schedule } = event.odds;
    let line = {
        originId: event.id,
        endDate: new Date(parseInt(event.time) * 1000),
        status: 1,
        moneyline: {},
        spreads: [],
        totals: [],
    }

    if (schedule && schedule.sp.main) {
        const moneyline = schedule.sp.main;
        line.moneyline.home = parseInt(convertDecimalToAmericanOdds(moneyline[0].odds));
        line.moneyline.away = parseInt(convertDecimalToAmericanOdds(moneyline[1].odds));
    }

    if (main && Object.keys(main.sp).length > 0) {
        const game_lines = main.sp.game_lines;
        if (game_lines) {
            const count = game_lines.length / 3;
            for (let i = 0; i < count; i++) {
                if (game_lines[i].name == 'Run Line') {
                    line.spreads.push({
                        altLineId: game_lines[i + count].id,
                        hdp: Number(game_lines[i + count].handicap),
                        home: parseInt(convertDecimalToAmericanOdds(game_lines[i + count].odds)),
                        away: parseInt(convertDecimalToAmericanOdds(game_lines[i + count * 2].odds)),
                    });
                }
                if (game_lines[i].name == 'Total') {
                    line.totals.push({
                        altLineId: game_lines[i + count].id,
                        points: Number(game_lines[i + count].handicap),
                        over: parseInt(convertDecimalToAmericanOdds(game_lines[i + count].odds)),
                        under: parseInt(convertDecimalToAmericanOdds(game_lines[i + count * 2].odds)),
                    })
                }
                if (game_lines[i].name == 'Money Line' && !line.moneyline) {
                    line.moneyline.home = parseInt(convertDecimalToAmericanOdds(game_lines[i + count].odds));
                    line.moneyline.away = parseInt(convertDecimalToAmericanOdds(game_lines[i + count * 2].odds));
                }
            }
        }
    }

    // if (!(line.moneyline.home > 0 && line.moneyline.away < 0) && !(line.moneyline.home < 0 && line.moneyline.away > 0)) {
    //     line.moneyline = null;
    // }

    // const filteredSpreads = line.spreads.filter(spread => {
    //     if (spread && (spread.home > 0 && spread.away < 0) || (spread.home < 0 && spread.away > 0))
    //         return true;
    //     return false;
    // });
    // line.spreads = filteredSpreads.length ? filteredSpreads : null;

    // const filteredTotals = line.totals.filter(total => {
    //     if (total && (total.over > 0 && total.under < 0) || (total.over < 0 && total.under > 0))
    //         return true;
    //     return false;
    // });
    // line.totals = filteredTotals.length ? filteredTotals : null;

    if (line.moneyline)
        return line;
    return null;
}

module.exports = formatBaseballFixturesOdds;
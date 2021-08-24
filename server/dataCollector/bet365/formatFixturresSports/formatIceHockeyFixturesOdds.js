const { convertDecimalToAmericanOdds } = require('../convertOdds');
function formatIceHockeyFixturesOdds(event) {
    const { main, schedule } = event.odds;
    let line = {
        originId: event.id,
        endDate: new Date(parseInt(event.time) * 1000),
        status: 1,
        moneyline: null,
        spreads: [],
        totals: [],
    }

    if (schedule) {
        const moneyline = schedule.sp.main;
        line.moneyline = {
            home: convertDecimalToAmericanOdds(moneyline[0].odds),
            away: convertDecimalToAmericanOdds(moneyline[1].odds)
        };
    }

    if (main && Object.keys(main.sp).length > 0) {
        const game_lines = main.sp.game_lines;
        if (game_lines) {
            const count = game_lines.length / 3;
            for (let i = 0; i < count; i++) {
                if (game_lines[i].name == 'Line') {
                    line.spreads.push({
                        altLineId: game_lines[i + count].id,
                        hdp: Number(game_lines[i + count].handicap),
                        home: convertDecimalToAmericanOdds(game_lines[i + count].odds),
                        away: convertDecimalToAmericanOdds(game_lines[i + count * 2].odds),
                    });
                }
                if (game_lines[i].name == 'Total') {
                    line.totals.push({
                        altLineId: game_lines[i + count].id,
                        points: Number(game_lines[i + count].handicap),
                        over: convertDecimalToAmericanOdds(game_lines[i + count].odds),
                        under: convertDecimalToAmericanOdds(game_lines[i + count * 2].odds),
                    })
                }
                if (game_lines[i].name == 'Money Line' && line.moneyline == null) {
                    line.moneyline = {
                        home: convertDecimalToAmericanOdds(game_lines[i + count].odds),
                        away: convertDecimalToAmericanOdds(game_lines[i + count * 2].odds)
                    };
                }
            }
        }
    }

    // if (line.moneyline && !(line.moneyline.home > 0 && line.moneyline.away < 0) && !(line.moneyline.home < 0 && line.moneyline.away > 0)) {
    //     line.moneyline = null;
    // }

    // const filteredSpreads = line.spreads.filter(spread => {
    //     if (spread && (spread.home > 0 && spread.away < 0) || (spread.home < 0 && spread.away > 0))
    //         return true;
    //     return false;
    // });
    // line.spreads = filteredSpreads;

    // const filteredTotals = line.totals.filter(total => {
    //     if (total && (total.over > 0 && total.under < 0) || (total.over < 0 && total.under > 0))
    //         return true;
    //     return false;
    // });
    // line.totals = filteredTotals;

    if (line.moneyline)
        return line;
    return null;
}

module.exports = formatIceHockeyFixturesOdds;
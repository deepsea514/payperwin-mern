const { convertDecimalToAmericanOdds } = require('../convertOdds');
const TestEvent = require('../../../models/testEvent');
function formatFloorballFixturesOdds(event) {
    const { main, schedule } = event.odds;
    let line = {
        originId: event.id,
        endDate: new Date(parseInt(event.time) * 1000),
        status: 1,
        moneyline: null,
        spreads: [],
        totals: [],
    }

    if (main && main.sp['3_way_betting']) {
        const _3_way_betting = main.sp['3_way_betting'];
        const line_count = _3_way_betting.length / 4;
        for (let i = 0; i < line_count; i++) {
            if (_3_way_betting[i].name == "Money Line") {
                line.moneyline = {
                    home: convertDecimalToAmericanOdds(Number(_3_way_betting[i + line_count].odds)),
                    away: convertDecimalToAmericanOdds(Number(_3_way_betting[i + line_count * 3].odds))
                }
            } else if (_3_way_betting[i].name == "Handicap") {
                line.spreads.push({
                    hdp: -Number(_3_way_betting[i + line_count].handicap),
                    home: convertDecimalToAmericanOdds(Number(_3_way_betting[i + line_count].odds)),
                    away: convertDecimalToAmericanOdds(Number(_3_way_betting[i + line_count * 3].odds)),
                })
            } else if (_3_way_betting[i].name == "Total") {
                line.totals.push({
                    points: Number(_3_way_betting[i + line_count].handicap),
                    over: convertDecimalToAmericanOdds(Number(_3_way_betting[i + line_count].odds)),
                    under: convertDecimalToAmericanOdds(Number(_3_way_betting[i + line_count * 3].odds)),
                })
            }
        }
    }

    // if (!line.moneyline && schedule) {
    //     line.moneyline = {
    //         home: convertDecimalToAmericanOdds(Number(schedule.sp.main[0].odds)),
    //         away: convertDecimalToAmericanOdds(Number(schedule.sp.main[1].odds))
    //     };
    // }

    if (line.moneyline && !(line.moneyline.home > 0 && line.moneyline.away < 0) && !(line.moneyline.home < 0 && line.moneyline.away > 0)) {
        line.moneyline = null;
    }

    const filteredSpreads = line.spreads.filter(spread => {
        if (spread && (spread.home > 0 && spread.away < 0) || (spread.home < 0 && spread.away > 0))
            return true;
        return false;
    });
    line.spreads = filteredSpreads.length ? filteredSpreads : null;

    const filteredTotals = line.totals.filter(total => {
        if (total && (total.over > 0 && total.under < 0) || (total.over < 0 && total.under > 0))
            return true;
        return false;
    });
    line.totals = filteredTotals.length ? filteredTotals : null;

    if (line.moneyline)
        return line;
    return null;
}

module.exports = formatFloorballFixturesOdds;
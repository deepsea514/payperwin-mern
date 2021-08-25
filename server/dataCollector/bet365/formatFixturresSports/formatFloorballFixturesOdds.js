const { convertDecimalToAmericanOdds } = require('../convertOdds');
const TestEvent = require('../../../models/testEvent');
function formatFloorballFixturesOdds(event) {
    TestEvent.create({ event, name: 'floorball' });
    const { main } = event.odds;
    let line = {
        originId: event.id,
        endDate: new Date(parseInt(event.time) * 1000),
        status: 1,
        moneyline: null,
        spreads: [],
        totals: [],
    }

    // if (main && main.sp['3_way_betting']) {
    //     const _3_way_betting = main.sp['3_way_betting'];
    //     const line_count = _3_way_betting.length / 4;
    //     for (let i = 0; i < line_count; i++) {
    //         if (_3_way_betting[i].name == "Money Line") {
    //             line.moneyline = {
    //                 home: convertDecimalToAmericanOdds(_3_way_betting[i + line_count].odds),
    //                 away: convertDecimalToAmericanOdds(_3_way_betting[i + line_count * 3].odds)
    //             }
    //         } else if (_3_way_betting[i].name == "Handicap") {
    //             line.spreads.push({
    //                 hdp: Number(_3_way_betting[i + line_count].handicap),
    //                 home: convertDecimalToAmericanOdds(_3_way_betting[i + line_count].odds),
    //                 away: convertDecimalToAmericanOdds(_3_way_betting[i + line_count * 3].odds),
    //             })
    //         } else if (_3_way_betting[i].name == "Total") {
    //             line.totals.push({
    //                 points: Number(_3_way_betting[i + line_count].handicap),
    //                 over: convertDecimalToAmericanOdds(_3_way_betting[i + line_count].odds),
    //                 under: convertDecimalToAmericanOdds(_3_way_betting[i + line_count * 3].odds),
    //             })
    //         }
    //     }
    // }

    if (line.moneyline && (!line.moneyline.home || !line.moneyline.away)) {
        line.moneyline = null
    }
    line.spreads = line.spreads.length ? line.spreads : null;
    line.totals = line.totals.length ? line.totals : null;

    if (line.moneyline || line.spreads || line.totals)
        return line;
    return null;
}

module.exports = formatFloorballFixturesOdds;
const { convertDecimalToAmericanOdds } = require('../convertOdds');
function formatSoccerFixturesOdds(event) {
    const { goals, schedule: { sp: { main: moneyline } } } = event.odds;
    let line = {
        originId: event.id,
        endDate: new Date(parseInt(event.time) * 1000),
        status: 1,
        moneyline: {},
        spreads: [],
        totals: [],
    }

    line.moneyline.home = convertDecimalToAmericanOdds(moneyline[0].odds);
    line.moneyline.draw = convertDecimalToAmericanOdds(moneyline[1].odds);
    line.moneyline.away = convertDecimalToAmericanOdds(moneyline[2].odds);

    if (goals) {
        const { handicap_result, goals_over_under } = goals.sp;
        if (handicap_result && handicap_result.length) {
            let handicap_count = handicap_result.length / 3;
            for (let i = 0; i < handicap_count; i++) {
                line.spreads.push({
                    altLineId: handicap_result[i * 3].id,
                    hdp: Number(handicap_result[i * 3].opp),
                    home: convertDecimalToAmericanOdds(handicap_result[i * 3].odds),
                    away: convertDecimalToAmericanOdds(handicap_result[i * 3 + 2].odds),
                })
            }
        }
        if (goals_over_under && goals_over_under.length) {
            let total_count = goals_over_under.length / 3;

            for (let i = 0; i < total_count; i++) {
                line.totals.push({
                    altLineId: goals_over_under[i + total_count].id,
                    points: Number(goals_over_under[i].name),
                    over: convertDecimalToAmericanOdds(goals_over_under[i + total_count].odds),
                    under: convertDecimalToAmericanOdds(goals_over_under[i + 2 * total_count].odds),
                })
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

module.exports = formatSoccerFixturesOdds;
const { convertDecimalToAmericanOdds } = require('../convertOdds');
function formatSoccerFixturesOdds(event) {
    const { goals, schedule } = event.odds;
    let line = {
        originId: event.id,
        endDate: new Date(parseInt(event.time) * 1000),
        status: 1,
        moneyline: null,
        spreads: [],
        totals: [],
    }

    if (schedule && schedule.sp.main) {
        moneyline = schedule.sp.main;
        line.moneyline = {
            home: convertDecimalToAmericanOdds(moneyline[0].odds),
            draw: convertDecimalToAmericanOdds(moneyline[1].odds),
            away: convertDecimalToAmericanOdds(moneyline[2].odds)
        }
    }

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

    if (line.moneyline && (!line.moneyline.home || !line.moneyline.away)) {
        line.moneyline = null
    }
    line.spreads = line.spreads.length ? line.spreads : null;
    line.totals = line.totals.length ? line.totals : null;

    if (line.moneyline || line.spreads || line.totals)
        return line;
    return null;
}

module.exports = formatSoccerFixturesOdds;
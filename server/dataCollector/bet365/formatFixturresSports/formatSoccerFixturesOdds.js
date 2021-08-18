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

    line.moneyline.home = convertDecimalToAmericanOdds(Number(moneyline[0].odds));
    line.moneyline.draw = convertDecimalToAmericanOdds(Number(moneyline[1].odds));
    line.moneyline.away = convertDecimalToAmericanOdds(Number(moneyline[2].odds));

    if (goals) {
        const { alternative_handicap_result, alternative_total_goals } = goals.sp;
        if (alternative_handicap_result && alternative_handicap_result.length) {
            let handicap_count = alternative_handicap_result.length / 3;
            for (let i = 0; i < handicap_count; i++) {
                line.spreads.push({
                    hdp: -Number(alternative_handicap_result[i * 3 + handicap_count].opp),
                    home: convertDecimalToAmericanOdds(Number(alternative_handicap_result[i * 3 + handicap_count].odds)),
                    away: convertDecimalToAmericanOdds(Number(alternative_handicap_result[i * 3 + 2 + handicap_count].odds)),
                })
            }
        }
        if (alternative_total_goals && alternative_total_goals.length) {
            let total_count = alternative_total_goals.length / 3;

            for (let i = 0; i < total_count; i++) {
                line.totals.push({
                    points: Number(alternative_total_goals[i].name),
                    over: convertDecimalToAmericanOdds(Number(alternative_total_goals[i + total_count].odds)),
                    under: convertDecimalToAmericanOdds(Number(alternative_total_goals[i + total_count * 2].odds)),
                })
            }
        }
    }

    if (!(line.moneyline.home > 0 && line.moneyline.away < 0) && !(line.moneyline.home < 0 && line.moneyline.away > 0)) {
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

module.exports = formatSoccerFixturesOdds;
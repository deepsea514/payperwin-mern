const { convertDecimalToAmericanOdds } = require('../convertOdds');
const formatSoccerFixturesOdds = (event) => {
    const { goals, main, others } = event.odds;
    let line = {
        originId: event.id,
        endDate: new Date(parseInt(event.time) * 1000),
        status: 1,
        moneyline: null,
        spreads: [],
        totals: [],
        home_totals: [],
        away_totals: [],
    }

    if (main && main.sp.full_time_result) {
        const moneyline = main.sp.full_time_result.odds;
        if (moneyline.length >= 3) {
            line.moneyline = {
                home: convertDecimalToAmericanOdds(moneyline[0].odds),
                draw: convertDecimalToAmericanOdds(moneyline[1].odds),
                away: convertDecimalToAmericanOdds(moneyline[2].odds)
            }
        }
    }

    if (goals) {
        const { goals_over_under, result_total_goals } = goals.sp;
        if (goals_over_under && goals_over_under.odds && goals_over_under.odds.length) {
            let total_count = goals_over_under.odds.length / 2;

            for (let i = 0; i < total_count; i++) {
                line.totals.push({
                    altLineId: goals_over_under.odds[i].id,
                    points: Number(goals_over_under.odds[i].name),
                    over: convertDecimalToAmericanOdds(goals_over_under.odds[i].odds),
                    under: convertDecimalToAmericanOdds(goals_over_under.odds[i + total_count].odds),
                })
            }
        }

        if (result_total_goals) {
            const _result_total_goals = result_total_goals.odds;
            let home_totals = _result_total_goals.filter(total => total.name == "1");
            let away_totals = _result_total_goals.filter(total => total.name == "2");

            while (home_totals.length > 0) {
                const first = home_totals[0];
                const second = home_totals.find(total => Number(total.handicap) == Number(first.handicap) && total.header != first.header);
                if (!second) {
                    home_totals = home_totals.filter(total => total.id != first.id);
                    continue;
                }
                const over = first.header == 'Over' ? first : second;
                const under = first.header == 'Under' ? first : second;
                line.home_totals.push({
                    altLineId: over.id,
                    points: Number(over.handicap),
                    over: convertDecimalToAmericanOdds(over.odds),
                    under: convertDecimalToAmericanOdds(under.odds),
                });
                home_totals = home_totals.filter(total => total.id != over.id && total.id != under.id);
            }

            while (away_totals.length > 0) {
                const first = away_totals[0];
                const second = away_totals.find(total => Number(total.handicap) == Number(first.handicap) && total.header != first.header);
                if (!second) {
                    away_totals = away_totals.filter(total => total.id != first.id);
                    continue;
                }
                const over = first.header == 'Over' ? first : second;
                const under = first.header == 'Under' ? first : second;
                line.away_totals.push({
                    altLineId: over.id,
                    points: Number(over.handicap),
                    over: convertDecimalToAmericanOdds(over.odds),
                    under: convertDecimalToAmericanOdds(under.odds),
                });
                away_totals = away_totals.filter(total => total.id != over.id && total.id != under.id);
            }
        }
    }

    if (others && others.length) {
        const handicap = others.find((other => {
            if (other.sp && other.sp.handicap_result) {
                return true;
            }
            return false;
        }));
        if (handicap && handicap.sp.handicap_result && handicap.sp.handicap_result.odds.length) {
            let total_count = handicap.sp.handicap_result.odds.length / 3;
            for (let i = 0; i < total_count; i++) {
                line.spreads.push({
                    altLineId: handicap.sp.handicap_result.odds[i].id,
                    hdp: Number(handicap.sp.handicap_result.odds[i].handicap),
                    home: convertDecimalToAmericanOdds(handicap.sp.handicap_result.odds[i].odds),
                    away: convertDecimalToAmericanOdds(handicap.sp.handicap_result.odds[i + 2 * total_count].odds),
                })
            }
        }
    }

    if (line.moneyline && (!line.moneyline.home || !line.moneyline.away)) {
        line.moneyline = null
    }
    line.spreads = line.spreads && line.spreads.length ? line.spreads : null;
    line.totals = line.totals && line.totals.length ? line.totals : null;
    line.home_totals = line.home_totals && line.home_totals.length ? line.home_totals : null;
    line.away_totals = line.away_totals && line.away_totals.length ? line.away_totals : null;

    if (line.moneyline || line.spreads || line.totals) {
        return line;
    }
    return null;
}

module.exports = formatSoccerFixturesOdds;
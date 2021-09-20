const { convertDecimalToAmericanOdds } = require('../convertOdds');
const formatSoccerFixturesOdds = (event) => {
    const { goals, main, others, half } = event.odds;
    let line = {
        originId: event.id,
        endDate: new Date(parseInt(event.time) * 1000),
        status: 1,
        moneyline: null,
        spreads: [],
        totals: [],
        half: {},
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
        const { goals_over_under } = goals.sp;
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

    if (half) {

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

module.exports = formatSoccerFixturesOdds;
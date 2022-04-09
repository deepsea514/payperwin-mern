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
        if (goals_over_under && goals_over_under.odds) {
            let goals_over_under_ = goals_over_under.odds;
            while (goals_over_under_.length > 0) {
                const first = goals_over_under_[0];
                const second = goals_over_under_.find(total => Number(total.name) == Number(first.name) && total.header != first.header);
                if (!second) {
                    goals_over_under_ = goals_over_under_.filter(total => total.id != first.id);
                    continue;
                }
                const over = first.header == 'Over' ? first : second;
                const under = first.header == 'Under' ? first : second;
                line.totals.push({
                    altLineId: over.id,
                    points: Number(over.name),
                    over: convertDecimalToAmericanOdds(over.odds),
                    under: convertDecimalToAmericanOdds(under.odds),
                });
                goals_over_under_ = goals_over_under_.filter(total => total.id != over.id && total.id != under.id);
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
        if (handicap && handicap.sp.handicap_result && handicap.sp.handicap_result.odds) {
            let handicap_result = handicap.sp.handicap_result.odds;
            while (handicap_result.length) {
                const first = handicap_result[0];
                const second = handicap_result.find(spread => Number(spread.handicap) == -Number(first.handicap) && spread.header != first.header && spread.header != 'Tie');
                if (!second) {
                    handicap_result = handicap_result.filter(spread => spread.id != first.id);
                    continue;
                }
                const home = first.header == '1' ? first : second;
                const away = first.header == '2' ? first : second;
                line.spreads.push({
                    altLineId: home.id,
                    hdp: Number(home.handicap),
                    home: convertDecimalToAmericanOdds(home.odds),
                    away: convertDecimalToAmericanOdds(away.odds),
                });
                handicap_result = handicap_result.filter(spread => spread.id != home.id && spread.id != away.id);
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
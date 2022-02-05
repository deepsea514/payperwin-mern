const { convertDecimalToAmericanOdds } = require('../convertOdds');
const formatTennisFixturesOdds = (event) => {
    const { main } = event.odds;
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

    if (main) {
        const to_win_match = main.sp.to_win_match;
        if (to_win_match) {
            const moneyline = main.sp.to_win_match.odds;
            if (moneyline.length >= 2)
                line.moneyline = {
                    home: convertDecimalToAmericanOdds(moneyline[0].odds),
                    away: convertDecimalToAmericanOdds(moneyline[1].odds),
                }
        }

        if (main.sp['match_handicap_(games)']) {
            const match_handicap = main.sp['match_handicap_(games)'].odds;
            const handicap_count = match_handicap.length / 2;
            for (let i = 0; i < handicap_count; i++)
                line.spreads.push({
                    altLineId: match_handicap[i].id,
                    hdp: Number(match_handicap[i].name),
                    home: convertDecimalToAmericanOdds(match_handicap[i].odds),
                    away: convertDecimalToAmericanOdds(match_handicap[i + handicap_count].odds),
                });
        }

        if (main.sp.total_games_2_way) {
            const total_games_2_way = main.sp.total_games_2_way.odds;
            const total_count = total_games_2_way.length / 2;
            for (let i = 0; i < total_count; i++)
                line.totals.push({
                    altLineId: total_games_2_way[i + total_count].id,
                    points: Number(total_games_2_way[i].name),
                    over: convertDecimalToAmericanOdds(total_games_2_way[i].odds),
                    under: convertDecimalToAmericanOdds(total_games_2_way[i + total_count].odds),
                })
        }

        if (main.sp.match_result_and_total_games) {
            const match_result_and_total_games = main.sp.match_result_and_total_games.odds;
            let home_totals = match_result_and_total_games.filter(total => total.name == "1");
            let away_totals = match_result_and_total_games.filter(total => total.name == "2");

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

    if (line.moneyline && (!line.moneyline.home || !line.moneyline.away)) {
        line.moneyline = null
    }
    line.spreads = line.spreads && line.spreads.length ? line.spreads : null;
    line.totals = line.totals && line.totals.length ? line.totals : null;
    line.home_totals = line.home_totals && line.home_totals.length ? line.home_totals : null;
    line.away_totals = line.away_totals && line.away_totals.length ? line.away_totals : null;

    if (line.moneyline || line.spreads || line.totals)
        return line;
    return null;
}

module.exports = formatTennisFixturesOdds;
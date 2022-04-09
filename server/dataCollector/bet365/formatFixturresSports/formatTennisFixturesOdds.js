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
            let match_handicap = main.sp['match_handicap_(games)'].odds;
            while (match_handicap.length) {
                const first = match_handicap[0];
                const second = match_handicap.find(spread => Number(spread.name) == -Number(first.name) && spread.header != first.header);
                if (!second) {
                    match_handicap = match_handicap.filter(spread => spread.id != first.id);
                    continue;
                }
                const home = first.header == '1' ? first : second;
                const away = first.header == '2' ? first : second;
                line.spreads.push({
                    altLineId: home.id,
                    hdp: Number(home.name),
                    home: convertDecimalToAmericanOdds(home.odds),
                    away: convertDecimalToAmericanOdds(away.odds),
                });
                match_handicap = match_handicap.filter(spread => spread.id != home.id && spread.id != away.id);
            }
        }

        if (main.sp.total_games_2_way) {
            let total_games_2_way = main.sp.total_games_2_way.odds;
            while (total_games_2_way.length) {
                const first = total_games_2_way[0];
                const second = total_games_2_way.find(total => Number(total.name) == Number(first.name) && total.header != first.header);
                if (!second) {
                    total_games_2_way = total_games_2_way.filter(total => total.id != first.id);
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
                total_games_2_way = total_games_2_way.filter(total => total.id != over.id && total.id != under.id);
            }
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
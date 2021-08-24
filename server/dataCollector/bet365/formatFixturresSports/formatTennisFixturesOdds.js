const { convertDecimalToAmericanOdds } = require('../convertOdds');
function formatTennisFixturesOdds(event) {
    const { main, schedule } = event.odds;
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
            away: convertDecimalToAmericanOdds(moneyline[1].odds),
        }
    }

    if (main && Object.keys(main.sp).length > 0) {
        const match_handicap = main.sp['match_handicap_(games)'];
        if (match_handicap) {
            const handicap_count = match_handicap.length / 2;
            for (let i = 0; i < handicap_count; i++)
                line.spreads.push({
                    altLineId: match_handicap[i].id,
                    hdp: Number(match_handicap[i].name),
                    home: convertDecimalToAmericanOdds(match_handicap[i].odds),
                    away: convertDecimalToAmericanOdds(match_handicap[i + handicap_count].odds),
                });
        }

        const total_games_2_way = main.sp.total_games_2_way;
        if (total_games_2_way) {
            const total_count = total_games_2_way.length / 3;
            for (let i = 0; i < total_count; i++)
                line.totals.push({
                    altLineId: total_games_2_way[i + total_count].id,
                    points: Number(total_games_2_way[i].name),
                    over: convertDecimalToAmericanOdds(total_games_2_way[i + total_count].odds),
                    under: convertDecimalToAmericanOdds(total_games_2_way[i + 2 * total_count].odds),
                })
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

module.exports = formatTennisFixturesOdds;
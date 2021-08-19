const { convertDecimalToAmericanOdds } = require('../convertOdds');
function formatTennisFixturesOdds(event) {
    const { main, schedule: { sp: { main: moneyline } } } = event.odds;
    let line = {
        originId: event.id,
        endDate: new Date(parseInt(event.time) * 1000),
        status: 1,
        moneyline: {},
        spreads: [],
        totals: [],
    }

    line.moneyline.home = convertDecimalToAmericanOdds(parseInt(moneyline[0].odds));
    line.moneyline.away = convertDecimalToAmericanOdds(parseInt(moneyline[1].odds));

    if (main && Object.keys(main.sp).length > 0) {
        const match_handicap = main.sp['match_handicap_(games)'];
        if (match_handicap) {
            const handicap_count = match_handicap.length / 2;
            for (let i = 0; i < handicap_count; i++)
                line.spreads.push({
                    altLineId: match_handicap[i].id,
                    hdp: -Number(match_handicap[i].name),
                    home: convertDecimalToAmericanOdds(parseInt(match_handicap[i].odds)),
                    away: convertDecimalToAmericanOdds(parseInt(match_handicap[i + handicap_count].odds)),
                });
        }

        const match_result_and_total_games = main.sp.match_result_and_total_games;
        if (match_result_and_total_games) {
            const total_count = match_result_and_total_games.length / 2 - 1;
            for (let i = 0; i < total_count; i++)
                line.totals.push({
                    altLineId: match_result_and_total_games[i + 2].id,
                    points: Number(match_result_and_total_games[i + 2].handicap),
                    over: convertDecimalToAmericanOdds(parseInt(match_result_and_total_games[i + 2].odds)),
                    under: convertDecimalToAmericanOdds(parseInt(match_result_and_total_games[i + 2 + total_count].odds)),
                })
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

module.exports = formatTennisFixturesOdds;
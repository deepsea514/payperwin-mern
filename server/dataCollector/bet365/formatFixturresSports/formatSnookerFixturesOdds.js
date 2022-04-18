const { convertDecimalToAmericanOdds } = require('../convertOdds');
const formatSnookerFixturesOdds = (event) => {
    const { main, schedule } = event.odds;
    let line = {
        originId: event.id,
        endDate: new Date(parseInt(event.time) * 1000),
        status: 1,
        moneyline: null,
        spreads: [],
        totals: [],
    }

    if (main) {
        if (main.sp.to_win_match) {
            const moneyline = main.sp.to_win_match.odds
            if (moneyline.length > 1) {
                line.moneyline = {
                    home: convertDecimalToAmericanOdds(moneyline[0].odds),
                    away: convertDecimalToAmericanOdds(moneyline[1].odds)
                };
            }
        }

        if (main.sp.match_handicap) {
            let match_handicap = main.sp.match_handicap.odds;
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

        if (main.sp.total_frames_2_way) {
            let total_frames_2_way = main.sp.total_frames_2_way.odds;
            while (total_frames_2_way.length > 0) {
                const first = total_frames_2_way[0];
                const second = total_frames_2_way.find(total => Number(total.name) == Number(first.name) && total.header != first.header);
                if (!second) {
                    total_frames_2_way = total_frames_2_way.filter(total => total.id != first.id);
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
                total_frames_2_way = total_frames_2_way.filter(total => total.id != over.id && total.id != under.id);
            }
        }
    }

    if (line.moneyline && (!line.moneyline.home || !line.moneyline.away)) {
        line.moneyline = null
    }
    line.spreads = line.spreads && line.spreads.length ? line.spreads : null;
    line.totals = line.totals && line.totals.length ? line.totals : null;

    if (line.moneyline || line.spreads || line.totals)
        return line;
    return null;
}

module.exports = formatSnookerFixturesOdds;
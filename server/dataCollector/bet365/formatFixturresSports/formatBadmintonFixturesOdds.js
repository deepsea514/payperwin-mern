const { convertDecimalToAmericanOdds } = require('../convertOdds');

const gotLineToOdds = (game_lines) => {
    let line = {
        moneyline: null,
        spreads: [],
        totals: [],
    }
    while (game_lines.length) {
        const first = game_lines[0];

        if (first.name == 'To Win') {
            const second = game_lines.find(game_line => game_line.header != first.header && game_line.name == first.name);
            if (!second) {
                game_lines = game_lines.filter(game_line => game_line.id != first.id);
                continue;
            }
            const home = first.header == '1' ? first : second;
            const away = first.header == '2' ? first : second;
            line.moneyline = {
                home: convertDecimalToAmericanOdds(home.odds),
                away: convertDecimalToAmericanOdds(away.odds),
            }
            game_lines = game_lines.filter(game_line => game_line.id != first.id && game_line.id != second.id);
        } else if (first.name == 'Handicap') {
            const second = game_lines.find(game_line => Number(game_line.handicap) == -Number(first.handicap) && game_line.header != first.header);
            if (!second) {
                game_lines = game_lines.filter(game_line => game_line.id != first.id);
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
            game_lines = game_lines.filter(game_line => game_line.id != first.id && game_line.id != second.id);
        } else if (first.name == 'Total') {
            const points = first.handicap.slice(2, first.handicap.length);
            const second = game_lines.find(game_line => game_line.name == first.name &&
                game_line.handicap != first.handicap &&
                game_line.handicap.slice(2, game_line.handicap.length) == points);
            if (!second) {
                game_lines = game_lines.filter(game_line => game_line.id != first.id);
                continue;
            }
            const over = first.header == '1' ? first : second;
            const under = first.header == '2' ? first : second;
            line.totals.push({
                altLineId: over.id,
                points: Number(points),
                over: convertDecimalToAmericanOdds(over.odds),
                under: convertDecimalToAmericanOdds(under.odds),
            });
            game_lines = game_lines.filter(game_line => game_line.id != first.id && game_line.id != second.id);
        } else {
            game_lines = game_lines.filter(game_line => game_line.id != first.id);
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

const formatBadmintonFixturesOdds = (event) => {
    const { main, match } = event.odds;
    let line = {
        originId: event.id,
        endDate: new Date(parseInt(event.time) * 1000),
        status: 1,
        moneyline: null,
        spreads: [],
        totals: [],
    }

    if (main && main.sp.match_lines) {
        const match_lines = main.sp.match_lines.odds;
        const whole_line = gotLineToOdds(match_lines);
        if (whole_line == null) return null;
        line = { ...line, ...whole_line };
    } else if (match && match.sp.match_lines) {
        const match_lines = match.sp.match_lines.odds;
        const whole_line = gotLineToOdds(match_lines);
        if (whole_line == null) return null;
        line = { ...line, ...whole_line };
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

module.exports = formatBadmintonFixturesOdds;
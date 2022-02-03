const getBadmintonMatchScores = (type, subtype, ss, scores, time_status) => {
    if (time_status == "1") return 'inplay';
    const matchResult = {
        homeScore: 0,
        awayScore: 0,
    }
    try {
        const sets = Object.keys(scores);
        for (let i = 0; i < sets.length; i++) {
            if (['total', 'alternative_total', 'home_total', 'away_total'].includes(type)) {
                matchResult.homeScore += parseInt(scores[sets[i]].home);
                matchResult.awayScore += parseInt(scores[sets[i]].away);
            } else if (type == 'moneyline') {
                if (parseInt(scores[sets[i]].home) > parseInt(scores[sets[i]].away))
                    matchResult.homeScore++;
                if (parseInt(scores[sets[i]].home) < parseInt(scores[sets[i]].away))
                    matchResult.awayScore++;
            } else if (['spread', 'alternative_spread'].includes(type)) {
                matchResult.homeScore += parseInt(scores[sets[i]].home);
                matchResult.awayScore += parseInt(scores[sets[i]].away);
            }
        }
        return matchResult;
    } catch (error) {
        console.error(error);
        return null;
    }
}

module.exports = getBadmintonMatchScores;
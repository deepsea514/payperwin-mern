const getTableTennisMatchScores = (type, subtype, ss, scores, time_status) => {
    if (time_status == "1") return 'inplay';
    const matchResult = {
        homeScore: 0,
        awayScore: 0,
    }
    try {
        const sets = Object.keys(scores);
        for (let i = 0; i < sets.length; i++) {
            if (type == 'total') {
                matchResult.homeScore += parseInt(scores[sets[i]].home);
                matchResult.awayScore += parseInt(scores[sets[i]].away);
            } else if (type == 'moneyline') {
                if (parseInt(scores[sets[i]].home) > parseInt(scores[sets[i]].away))
                    matchResult.homeScore++;
                if (parseInt(scores[sets[i]].home) < parseInt(scores[sets[i]].away))
                    matchResult.awayScore++;
            } else if (type == 'handicap') {
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

module.exports = getTableTennisMatchScores;
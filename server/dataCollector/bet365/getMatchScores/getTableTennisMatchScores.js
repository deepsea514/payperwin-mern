const getTableTennisMatchScores = (type, subtype, ss, scores) => {
    const matchResult = {
        homeScore: 0,
        awayScore: 0,
    }
    try {
        if (type == 'total') {
            const sets = Object.keys(scores);
            for (let i = 0; i < sets.length; i++) {
                matchResult.homeScore += scores[sets].home;
                matchResult.awayScore += scores[sets].away;
            }
            return matchResult;
        }
        const matchScores = ss.split(',');
        for (let match = 0; match < matchScores.length; match++) {
            const scores = matchScores[match].split('-');
            if (type == 'moneyline') {
                if (Number(scores[0]) > Number(scores[1]))
                    matchResult.homeScore++;
                if (Number(scores[1]) > Number(scores[0]))
                    matchResult.awayScore++;
            } else {
                matchResult.homeScore += Number(scores[0]);
                matchResult.awayScore += Number(scores[1]);
            }
        }
        return matchResult;
    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = getTableTennisMatchScores;
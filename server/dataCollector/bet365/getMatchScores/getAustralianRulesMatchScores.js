const getTotal = (score) => {
    return score.slice(score.indexOf('(') + 1, score.indexOf(')'));
}

const getAustralianRulesMatchScores = (type, subtype, ss, scores, time_status) => {
    if (time_status == "1") return 'inplay';
    const matchResult = {
        homeScore: 0,
        awayScore: 0,
    }
    try {
        const scores = ss.split('-');
        matchResult.homeScore += Number(getTotal(scores[0]));
        matchResult.awayScore += Number(getTotal(scores[1]));
        return matchResult;
    } catch (error) {
        console.error(error);
        return null;
    }
}

module.exports = getAustralianRulesMatchScores;
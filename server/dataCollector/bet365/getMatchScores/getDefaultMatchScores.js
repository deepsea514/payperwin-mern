const getDefaultMatchScores = (type, subtype, ss, scores, time_status) => {
    if (time_status == "1") return 'inplay';
    const matchResult = {
        homeScore: 0,
        awayScore: 0,
    }
    try {
        const scores = ss.split('-');
        matchResult.homeScore += Number(scores[0]);
        matchResult.awayScore += Number(scores[1]);
        return matchResult;
    } catch (error) {
        console.error(error);
        return null;
    }
}

module.exports = getDefaultMatchScores;
const getSoccerMatchScores = (type, subtype, ss, scores, timer, time_status) => {
    if (time_status == "1") return 'inplay';
    const matchResult = {
        homeScore: 0,
        awayScore: 0,
    }
    try {
        const finalScores = ss.split('-');
        matchResult.homeScore += Number(finalScores[0]);
        matchResult.awayScore += Number(finalScores[1]);
        return matchResult;
    } catch (error) {
        console.error(error);
        return null;
    }
}

module.exports = getSoccerMatchScores;
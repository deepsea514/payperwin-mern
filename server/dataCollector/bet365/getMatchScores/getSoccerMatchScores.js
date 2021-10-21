const getSoccerMatchScores = (type, subtype, ss, scores, timer, time_status) => {
    if (time_status == "1") return 'inplay';
    const matchResult = {
        homeScore: 0,
        awayScore: 0,
    }
    try {
        matchResult.homeScore = parseInt(scores["2"].home);
        matchResult.awayScore = parseInt(scores["2"].away);
        return matchResult;
    } catch (error) {
        console.error(error);
        return null;
    }
}

module.exports = getSoccerMatchScores;
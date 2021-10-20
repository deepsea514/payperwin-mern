const getHandballMatchScores = (type, subtype, ss, scores, timer, time_status) => {
    if (time_status == "1") return 'inplay';
    const matchResult = {
        homeScore: 0,
        awayScore: 0,
    }
    try {
        matchResult.homeScore = parseInt(scores["4"].home);
        matchResult.awayScore = parseInt(scores["4"].away);
        return matchResult;
    } catch (error) {
        console.error(error);
        return null;
    }
}

module.exports = getHandballMatchScores;
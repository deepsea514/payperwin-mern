const getIceHockeyMatchScores = (type, subtype, ss, scores, timer, time_status) => {
    if (time_status == "1") return 'inplay';
    const matchResult = {
        homeScore: 0,
        awayScore: 0,
    }
    try {
        matchResult.homeScore = parseInt(scores["5"].home);
        matchResult.awayScore = parseInt(scores["5"].away);
        return matchResult;
    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = getIceHockeyMatchScores;
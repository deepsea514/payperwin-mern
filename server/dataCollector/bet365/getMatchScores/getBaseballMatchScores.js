const getBaseballMatchScores = (type, subtype, ss, scores, timer, time_status) => {
    if (time_status == "1") return 'inplay';
    const matchResult = {
        homeScore: 0,
        awayScore: 0,
    }
    try {
        switch (subtype) {
            case 'fifth_innings':
                for (const key of ["1", "2", "3", "4", "5"]) {
                    matchResult.homeScore += parseInt(scores[key].home);
                    matchResult.awayScore += parseInt(scores[key].away);
                }
                break;
            default:
                matchResult.homeScore = parseInt(scores["run"].home);
                matchResult.awayScore = parseInt(scores["run"].away);
                break;
        }
        return matchResult;
    } catch (error) {
        console.error(error);
        return null;
    }
}

module.exports = getBaseballMatchScores;
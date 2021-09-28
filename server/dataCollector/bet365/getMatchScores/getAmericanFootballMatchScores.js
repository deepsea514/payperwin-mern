const getAmericanFootballMatchScores = (type, subtype, ss, scores) => {
    const matchResult = {
        homeScore: 0,
        awayScore: 0,
    }
    try {
        switch (subtype) {
            case 'first_half':
                matchResult.homeScore = parseInt(scores["3"].home);
                matchResult.awayScore = parseInt(scores["3"].away);
                break;
            case 'second_half':
                matchResult.homeScore = parseInt(scores["7"].home) - parseInt(scores["3"].home);
                matchResult.awayScore = parseInt(scores["7"].away) - parseInt(scores["3"].away);
                break;
            case 'first_quarter':
                matchResult.homeScore = parseInt(scores["1"].home);
                matchResult.awayScore = parseInt(scores["1"].away);
                break;
            case 'second_quarter':
                matchResult.homeScore = parseInt(scores["2"].home);
                matchResult.awayScore = parseInt(scores["2"].away);
                break;
            case 'third_quarter':
                matchResult.homeScore = parseInt(scores["4"].home);
                matchResult.awayScore = parseInt(scores["4"].away);
                break;
            case 'forth_quarter':
                matchResult.homeScore = parseInt(scores["5"].home);
                matchResult.awayScore = parseInt(scores["5"].away);
                break;
            default:
                matchResult.homeScore = parseInt(scores["7"].home);
                matchResult.awayScore = parseInt(scores["7"].away);
                break;
        }
        return matchResult;
    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = getAmericanFootballMatchScores;
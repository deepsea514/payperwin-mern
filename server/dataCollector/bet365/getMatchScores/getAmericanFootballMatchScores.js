const getAmericanFootballMatchScores = (type, subtype, ss, scores, timer, time_status) => {
    const matchResult = {
        homeScore: 0,
        awayScore: 0,
    }
    try {
        switch (subtype) {
            case 'first_half':
                if (time_status == "1" && timer.q < "3") return 'inplay';
                matchResult.homeScore = parseInt(scores["3"].home);
                matchResult.awayScore = parseInt(scores["3"].away);
                break;
            case 'second_half':
                if (time_status == "1") return 'inplay';
                matchResult.homeScore = parseInt(scores["7"].home) - parseInt(scores["3"].home);
                matchResult.awayScore = parseInt(scores["7"].away) - parseInt(scores["3"].away);
                break;
            case 'first_quarter':
                if (time_status == "1" && timer.q < "2") return 'inplay';
                matchResult.homeScore = parseInt(scores["1"].home);
                matchResult.awayScore = parseInt(scores["1"].away);
                break;
            case 'second_quarter':
                if (time_status == "1" && timer.q < "3") return 'inplay';
                matchResult.homeScore = parseInt(scores["2"].home);
                matchResult.awayScore = parseInt(scores["2"].away);
                break;
            case 'third_quarter':
                if (time_status == "1" && timer.q < "4") return 'inplay';
                matchResult.homeScore = parseInt(scores["4"].home);
                matchResult.awayScore = parseInt(scores["4"].away);
                break;
            case 'forth_quarter':
                if (time_status == "1") return 'inplay';
                matchResult.homeScore = parseInt(scores["5"].home);
                matchResult.awayScore = parseInt(scores["5"].away);
                break;
            default:
                if (time_status == "1") return 'inplay';
                const finalScores = ss.split('-');
                matchResult.homeScore += Number(finalScores[0]);
                matchResult.awayScore += Number(finalScores[1]);
                break;
        }
        return matchResult;
    } catch (error) {
        console.error(error);
        return null;
    }
}

module.exports = getAmericanFootballMatchScores;
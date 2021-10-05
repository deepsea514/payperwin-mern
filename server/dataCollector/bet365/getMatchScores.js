const getDefaultMatchScores = require('./getMatchScores/getDefaultMatchScores');
const getAmericanFootballMatchScores = require('./getMatchScores/getAmericanFootballMatchScores');
const getTableTennisMatchScores = require('./getMatchScores/getTableTennisMatchScores');

const getMatchScores = (sport, type, subtype, ss, scores) => {
    try {
        switch (sport) {
            case "American Football":
                return getAmericanFootballMatchScores(type, subtype, ss, scores);
            case "Table Tennis":
                return getTableTennisMatchScores(type, subtype, ss, scores);
            case "Soccer":
            case "Cricket":
            case "Rugby Union":
            case "Boxing-UFC":
            case "Tennis":
            case "Snooker":
            case "Darts":
            case "Baseball":
            case "Ice Hockey":
            case "Basketball":
            case "Rugby League":
            case "Australian Rules":
            case "Bowls":
            case "Gaelic Sports":
            case "Handball":
            case "Futsal":
            case "Floorball":
            case "Volleyball":
            case "Badminton":
            case "Beach Volleyball":
            case "Squash":
            case "Water Polo":
            case "E-sports":
                return getDefaultMatchScores(type, subtype, ss, scores);
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = getMatchScores;
const getDefaultMatchScores = require('./getMatchScores/getDefaultMatchScores');
const getAmericanFootballMatchScores = require('./getMatchScores/getAmericanFootballMatchScores');
const getTableTennisMatchScores = require('./getMatchScores/getTableTennisMatchScores');
const getSoccerMatchScores = require('./getMatchScores/getSoccerMatchScores');
const getRugbyMatchScores = require('./getMatchScores/getRugbyMatchScores');
const getTennisMatchScores = require('./getMatchScores/getTennisMatchScores');
const getIceHockeyMatchScores = require('./getMatchScores/getIceHockeyMatchScores');
const getHandballMatchScores = require('./getMatchScores/getHandballMatchScores');
const getVolleyballMatchScores = require('./getMatchScores/getVolleyballMatchScores');
const getBadmintonMatchScores = require('./getMatchScores/getBadmintonMatchScores');

const getMatchScores = (sport, type, subtype, ss, scores, timer, time_status) => {
    try {
        switch (sport) {
            case "American Football":
                return getAmericanFootballMatchScores(type, subtype, ss, scores, timer, time_status);
            case "Table Tennis":
                return getTableTennisMatchScores(type, subtype, ss, scores, time_status);
            case "Soccer":
                return getSoccerMatchScores(type, subtype, ss, scores, time_status);
            case "Rugby Union":
                return getRugbyMatchScores(type, subtype, ss, scores, time_status);
            case "Tennis":
                return getTennisMatchScores(type, subtype, ss, scores, time_status);
            case "Ice Hockey":
                return getIceHockeyMatchScores(type, subtype, ss, scores, time_status);
            case "Handball":
                return getHandballMatchScores(type, subtype, ss, scores, time_status);
            case "Volleyball":
                return getVolleyballMatchScores(type, subtype, ss, scores, time_status);
            case "Badminton":
                return getBadmintonMatchScores(type, subtype, ss, scores, time_status);
            case "Basketball":
            case "Rugby League":
            case "Australian Rules":
            case "Bowls":
            case "Gaelic Sports":
            case "Snooker":
            case "Beach Volleyball":
            case "Squash":
            case "Water Polo":
            // Match Result
            case "E-sports":
            case "Floorball":
            case "Futsal":
            case "Darts":
            case "Cricket":
            case "Boxing-UFC":
            // Not sure
            case "Baseball":
                return getDefaultMatchScores(type, subtype, ss, scores, time_status);
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = getMatchScores;
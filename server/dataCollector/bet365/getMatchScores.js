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
const getAustralianRulesMatchScores = require('./getMatchScores/getAustralianRulesMatchScores');
const getGaelicSportsMatchScores = require('./getMatchScores/getGaelicSportsMatchScores');

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
            // return getIceHockeyMatchScores(type, subtype, ss, scores, time_status);
            case "Handball":
                return getHandballMatchScores(type, subtype, ss, scores, time_status);
            case "Volleyball":
                return getVolleyballMatchScores(type, subtype, ss, scores, time_status);
            case "Badminton":
                return getBadmintonMatchScores(type, subtype, ss, scores, time_status);
            case "Australian Rules":
                return getAustralianRulesMatchScores(type, subtype, ss, scores, time_status);
            case "Gaelic Sports":
                return getGaelicSportsMatchScores(type, subtype, ss, scores, time_status);
            case "Basketball":
            case "Rugby League":
            case "Bowls":
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
            case "Ice Hockey":
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
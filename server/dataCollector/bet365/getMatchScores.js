const getDefaultMatchScores = require('./getMatchScores/getDefaultMatchScores');
const getAmericanFootballMatchScores = require('./getMatchScores/getAmericanFootballMatchScores');
const getTableTennisMatchScores = require('./getMatchScores/getTableTennisMatchScores');
const getSoccerMatchScores = require('./getMatchScores/getSoccerMatchScores');
const getRugbyMatchScores = require('./getMatchScores/getRugbyMatchScores');
const getTennisMatchScores = require('./getMatchScores/getTennisMatchScores');
const getHandballMatchScores = require('./getMatchScores/getHandballMatchScores');
const getVolleyballMatchScores = require('./getMatchScores/getVolleyballMatchScores');
const getBadmintonMatchScores = require('./getMatchScores/getBadmintonMatchScores');
const getAustralianRulesMatchScores = require('./getMatchScores/getAustralianRulesMatchScores');
const getGaelicSportsMatchScores = require('./getMatchScores/getGaelicSportsMatchScores');
const getCricketMatchScores = require('./getMatchScores/getCricketMatchScores');
const getBasketballMatchScores = require('./getMatchScores/getBasketballMatchScores');
const getBaseballMatchScores = require('./getMatchScores/getBaseballMatchScores');

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
            case "Cricket":
                return getCricketMatchScores(type, subtype, ss, scores, time_status);
            case "Basketball":
                return getBasketballMatchScores(type, subtype, ss, scores, time_status);
            case "Baseball":
                return getBaseballMatchScores(type, subtype, ss, scores, time_status);
            case "Rugby League":
            case "Bowls":
            case "Beach Volleyball":
            case "Squash":
            // Match Result
            case "Water Polo":
            case "Snooker":
            case "E-sports":
            case "Floorball":
            case "Futsal":
            case "Darts":
            case "Boxing-UFC":
            case "Boxing/MMA":
            case "Ice Hockey":
                return getDefaultMatchScores(type, subtype, ss, scores, time_status);
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

module.exports = getMatchScores;
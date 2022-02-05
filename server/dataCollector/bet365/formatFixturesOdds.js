const formatSoccerFixturesOdds = require('./formatFixturresSports/formatSoccerFixturesOdds');
const formatCricketFixturesOdds = require('./formatFixturresSports/formatCricketFixturesOdds');
const formatRugbyUnionFixturesOdds = require('./formatFixturresSports/formatRugbyLeagueFixturesOdds');
const formatBoxingUFCFixturesOdds = require('./formatFixturresSports/formatBoxingUFCFixturesOdds');
const formatAmericanFootballFixturesOdds = require('./formatFixturresSports/formatAmericanFootballFixturesOdds');
const formatTennisFixturesOdds = require('./formatFixturresSports/formatTennisFixturesOdds');
const formatSnookerFixturesOdds = require('./formatFixturresSports/formatSnookerFixturesOdds');
const formatDartsFixturesOdds = require('./formatFixturresSports/formatDartsFixturesOdds');
const formatBaseballFixturesOdds = require('./formatFixturresSports/formatBaseballFixturesOdds');
const formatIceHockeyFixturesOdds = require('./formatFixturresSports/formatIceHockeyFixturesOdds');
const formatBasketballFixturesOdds = require('./formatFixturresSports/formatBasketballFixturesOdds');
const formatRugbyLeagueFixturesOdds = require('./formatFixturresSports/formatRugbyLeagueFixturesOdds');
const formatAustralianRulesFixturesOdds = require('./formatFixturresSports/formatAustralianRulesFixturesOdds');
const formatBowlsFixturesOdds = require('./formatFixturresSports/formatBowlsFixturesOdds');
const formatGaelicSportsFixturesOdds = require('./formatFixturresSports/formatGaelicSportsFixturesOdds');
const formatHandballFixturesOdds = require('./formatFixturresSports/formatHandballFixturesOdds');
const formatFutsalFixturesOdds = require('./formatFixturresSports/formatFutsalFixturesOdds');
const formatFloorballFixturesOdds = require('./formatFixturresSports/formatFloorballFixturesOdds');
const formatVolleyballFixturesOdds = require('./formatFixturresSports/formatVolleyballFixturesOdds');
const formatTableTennisFixturesOdds = require('./formatFixturresSports/formatTableTennisFixturesOdds');
const formatBadmintonFixturesOdds = require('./formatFixturresSports/formatBadmintonFixturesOdds');
const formatBeachVolleyballFixturesOdds = require('./formatFixturresSports/formatBeachVolleyballFixturesOdds');
const formatSquashFixturesOdds = require('./formatFixturresSports/formatSquashFixturesOdds');
const formatWaterPoloFixturesOdds = require('./formatFixturresSports/formatWaterPoloFixturesOdds');
const formatESportsFixturesOdds = require('./formatFixturresSports/formatESportsFixturesOdds');

const formatFixturesOdds = (event, sport) => {
    if (!event.odds) return null;
    try {
        switch (sport) {
            case "Soccer":
                return formatSoccerFixturesOdds(event);
            case "Cricket":
                return formatCricketFixturesOdds(event);
            case "Rugby Union":
                return formatRugbyUnionFixturesOdds(event);
            case "Boxing-UFC":
            case "Boxing/MMA":
                return formatBoxingUFCFixturesOdds(event);
            case "American Football":
                return formatAmericanFootballFixturesOdds(event);
            case "Tennis":
                return formatTennisFixturesOdds(event);
            case "Snooker":
                return formatSnookerFixturesOdds(event);
            case "Darts":
                return formatDartsFixturesOdds(event);
            case "Baseball":
                return formatBaseballFixturesOdds(event);
            case "Ice Hockey":
                return formatIceHockeyFixturesOdds(event);
            case "Basketball":
                return formatBasketballFixturesOdds(event);
            case "Rugby League":
                return formatRugbyLeagueFixturesOdds(event);
            case "Australian Rules":
                return formatAustralianRulesFixturesOdds(event);
            case "Bowls":
                return formatBowlsFixturesOdds(event);
            case "Gaelic Sports":
                return formatGaelicSportsFixturesOdds(event);
            case "Handball":
                return formatHandballFixturesOdds(event);
            case "Futsal":
                return formatFutsalFixturesOdds(event);
            case "Floorball":
                return formatFloorballFixturesOdds(event);
            case "Volleyball":
                return formatVolleyballFixturesOdds(event);
            case "Table Tennis":
                return formatTableTennisFixturesOdds(event);
            case "Badminton":
                return formatBadmintonFixturesOdds(event);
            case "Beach Volleyball":
                return formatBeachVolleyballFixturesOdds(event);
            case "Squash":
                return formatSquashFixturesOdds(event);
            case "Water Polo":
                return formatWaterPoloFixturesOdds(event);
            case "E-sports":
                return formatESportsFixturesOdds(event);
        }
    } catch (error) {
        console.error(error, event.id);
        return null;
    }
}

module.exports = formatFixturesOdds;
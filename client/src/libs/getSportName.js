const sportsData = require('../libs/sports.json');

const getSportName = (shortName) => {
    const sport = sportsData.find(sport => sport.shortName == shortName);
    return sport ? sport.name : '';
}

const getShortSportName = (name) => {
    const sport = sportsData.find(sport => sport.name == name);
    return sport ? sport.shortName : '';
}

module.exports = {
    getSportName,
    getShortSportName,
}
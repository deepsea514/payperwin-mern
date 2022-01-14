import sportsData from '../libs/sports.json';

export const getSportName = (shortName) => {
    const sport = sportsData.find(sport => sport.shortName == shortName);
    return sport?.name;
}

export const getShortSportName = (name) => {
    const sport = sportsData.find(sport => sport.name == name);
    return sport?.shortName;
}
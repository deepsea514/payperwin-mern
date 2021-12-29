const sportImages = {
    'Soccer': '/images/icons/soccer.png',
    'Baseball': '/images/icons/baseball.png',
    'Tennis': '/images/icons/tennis.png',
    'Cricket': '/images/icons/cricket.png',
    'Rugby Union': '/images/icons/rugby.png',
    'Boxing-UFC': '/images/icons/boxing.png',
    'American Football': '/images/icons/football.png',
    'Snooker': '/images/icons/snooker.png',
    'Darts': '/images/icons/darts.png',
    'Ice Hockey': '/images/icons/hockey.png',
    'Basketball': '/images/icons/basketball.png',
    'Rugby League': '/images/icons/rugby.png',
    'Australian Rules': '/images/icons/australian_rules.png',
    'Bowls': '/images/icons/bowls.png',
    'Gaelic Sports': '/images/icons/gaelic_sports.png',
    'Handball': '/images/icons/handball.png',
    'Futsal': '/images/icons/futsal.png',
    'Floorball': '/images/icons/floorball.png',
    'Volleyball': '/images/icons/volleyball.png',
    'Table Tennis': '/images/icons/table_tennis.png',
    'Badminton': '/images/icons/badminton.png',
    'Beach Volleyball': '/images/icons/beach_volleyball.png',
    'Squash': '/images/icons/squash.png',
    'Water Polo': '/images/icons/water_polo.png',
    'E-sports': '/images/icons/esports.png',

    'Football': '/images/icons/football.png',
    'Other': '/images/icons/other.png'
};

const leagueImages = {
    'NFL': '/images/sports/nfl.png',
    'NBA': '/images/sports/nba.png',
    'MLB': '/images/sports/mlb.png',
    'NHL': '/images/sports/nhl.png',
}

function sportNameImage(name, leagueName) {
    if (leagueName) {
        if (leagueImages[leagueName]) {
            return leagueImages[leagueName];
        }
    }
    return sportImages[name.replace("_", " ")];
}

module.exports = sportNameImage;
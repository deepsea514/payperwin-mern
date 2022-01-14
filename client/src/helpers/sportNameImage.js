const sportImages = {
    'Soccer': '/images/sports/soccer.png',
    'Baseball': '/images/sports/baseball.png',
    'Tennis': '/images/sports/tennis.png',
    'Cricket': '/images/sports/cricket.png',
    'Rugby Union': '/images/sports/rugby.png',
    'Boxing-UFC': '/images/sports/boxing.png',
    'American Football': '/images/sports/football.png',
    'Ice Hockey': '/images/sports/hockey.png',
    'Basketball': '/images/sports/basketball.png',
    'Rugby League': '/images/sports/rugby.png',
    'Volleyball': '/images/sports/volleyball.png',
    'Table Tennis': '/images/sports/pingpong.png',
    'Badminton': '/images/sports/badminton.png',
    'E-sports': '/images/sports/esports.png',
    'Football': '/images/sports/football.png',
    'Other': '/images/sports/other.png'
};

const leagueImages = {
    'NFL': '/images/sports/nfl.png',
    'NBA': '/images/sports/nba.png',
    'MLB': '/images/sports/mlb.png',
    'NHL': '/images/sports/nhl.png',
    'UFC': '/images/sports/ufc.png',
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
const getTopLeagueInSport = (sport) => {
    try {
        switch (sport) {
            case "American Football":
                return 'NFL';
            case "Baseball":
                return 'MLB'
            case 'Basketball':
                return 'NBA';
            case "Soccer":
            case "Cricket":
            case "Rugby Union":
            case "Boxing-UFC":
            case "Tennis":
            case "Snooker":
            case "Darts":
            case "Ice Hockey":
                return 'NHL'
            case "Rugby League":
            case "Australian Rules":
            case "Bowls":
            case "Gaelic Sports":
            case "Handball":
            case "Futsal":
            case "Floorball":
            case "Volleyball":
            case "Table Tennis":
            case "Badminton":
            case "Beach Volleyball":
            case "Squash":
            case "Water Polo":
            case "E-sports":
                return null;
        }
    } catch (error) {
        console.log(error);
    }
}

const arrangeLeagues = (leagues, sport) => {
    const topLeague = getTopLeagueInSport(sport);
    if (!topLeague) return;
    for (let i = 0; i < leagues.length; i++) {
        if (leagues[i].name == topLeague) {
            if (i == 0) return;
            const mid = leagues[0];
            leagues[0] = leagues[i];
            leagues[i] = mid;
        }
    }
}

module.exports = arrangeLeagues;
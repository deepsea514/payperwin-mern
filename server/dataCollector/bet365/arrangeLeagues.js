const getTopLeagueInSport = (sport) => {
    try {
        switch (sport) {
            case "American Football":
                return 'NFL';
            case "Baseball":
                return 'MLB'
            case 'Basketball':
                return 'NBA';
            case "Ice Hockey":
                return 'NHL'
            case "Boxing-UFC":
            case "Boxing/MMA":
                return 'UFC';
            case "Soccer":
            case "Cricket":
            case "Rugby Union":
            case "Tennis":
            case "Snooker":
            case "Darts":
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
        console.error(error);
    }
}

const arrangeLeagues = (leagues, sport) => {
    if (sport == 'Boxing/MMA') {
        const league = leagues.find(league => league.name == 'UFC');
        if (league) {
            league.events.reverse();
        }
    }
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
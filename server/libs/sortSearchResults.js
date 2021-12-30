const sortsOrder = {
    "American Football": {
        order: 0,
        leagues: {
            '10037219': { order: 0 }
        }
    },
    "Basketball": {
        order: 1,
        leagues: {
            '10041830': { order: 0 }
        }
    },
    "Baseball": {
        order: 2,
        leagues: {
            '10037485': { order: 0 }
        }
    },
    "Ice Hockey": {
        order: 3,
        leagues: {
            '10037477': { order: 0 }
        }
    },
    "Soccer": {
        order: 4,
        leagues: {
            '10041809': { order: 0 },
            '10041957': { order: 1 },
        }
    }
}

const sortSearchResults = (results) => {
    return results.sort((a, b) => {
        if (a.sportName == b.sportName) {
            const sport = sortsOrder[a.sportName];
            if (!sport) return 0;
            const orderA = sport.leagues[a.leagueId];
            const orderB = sport.leagues[b.leagueId];
            if (orderA && orderB) {
                return orderA.order - orderB.order;
            } else if (orderB) {
                return 1;
            }
            return -1;
        } else {
            const orderA = sortsOrder[a.sportName];
            const orderB = sortsOrder[b.sportName];
            if (orderA && orderB) {
                return orderA.order - orderB.order;
            } else if (orderB) {
                return 1;
            }
            return -1;
        }
    });
}

module.exports = sortSearchResults;
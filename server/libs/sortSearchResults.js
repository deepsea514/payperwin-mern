const leaguesOrder = {
    '10041830': { order: 0 }, // NBA
    '10037477': { order: 1 }, // NHL
    '10037219': { order: 3 }, // NFL
    '10037485': { order: 4 }, // MLB
    '10036983': { order: 5 }, // UFC
    '10041809': { order: 6 }, // UEFA C
    '10041957': { order: 7 }, // UEFA L
}

const sortsOrder = {
    "American Football": {
        order: 0
    },
    "Basketball": {
        order: 1
    },
    "Baseball": {
        order: 2,
    },
    "Ice Hockey": {
        order: 3,
    },
    "Boxing/MMA": {
        order: 4,
    },
    "Soccer": {
        order: 5,
    }
}

const sortSearchResults = (results) => {
    return results.sort((a, b) => {
        if (a.sportName != b.sportName) {
            const leagueOrderA = leaguesOrder[a.leagueId ? a.leagueId : a.originId];
            const leagueOrderB = leaguesOrder[b.leagueId ? b.leagueId : b.originId];
            if (leagueOrderA && leagueOrderB) {
                return leagueOrderA.order - leagueOrderB.order;
            } else if (leagueOrderA) {
                return -1;
            } else if (leagueOrderB) {
                return 1;
            }

            const orderA = sortsOrder[a.sportName];
            const orderB = sortsOrder[b.sportName];
            if (orderA && orderB) {
                return orderA.order - orderB.order;
            } else if (orderB) {
                return 1;
            }
            return -1;
        } else {
            const sport = sortsOrder[a.sportName];
            if (!sport) return 0;
            const leagueOrderA = leaguesOrder[a.leagueId ? a.leagueId : a.originId];
            const leagueOrderB = leaguesOrder[b.leagueId ? b.leagueId : b.originId];
            if (leagueOrderA && leagueOrderB) {
                return leagueOrderA.order - leagueOrderB.order;
            } else if (leagueOrderB) {
                return 1;
            }
            return -1;
        }
    });
}

module.exports = {
    sortSearchResults
};
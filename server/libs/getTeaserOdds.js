const teaserOdds = {
    'American Football': {
        "6": {  // Teaser Point
            "2": -110,   // Teams
            "3": 180,
            "4": 300
        },
        "6.5": {
            "2": -120,
            "3": 160,
            "4": 200
        },
        "7": {
            "2": -130,
            "3": 140,
            "4": 200
        }
    },
    'Basketball': {
        "4": {  // Teaser Point
            "2": 100,   // Teams
            "3": 180,
            "4": 300
        },
        "4.5": {
            "2": -110,
            "3": 160,
            "4": 200
        },
        "5": {
            "2": -120,
            "3": 140,
            "4": 200
        }
    }
}

const getTeaserOdds = (sportName, teaserPoint, count) => {
    return teaserOdds[sportName][teaserPoint.toString()][count.toString()];
}

module.exports = getTeaserOdds;
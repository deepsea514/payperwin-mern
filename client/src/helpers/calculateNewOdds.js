function calculateNewOdds(home, away, type, subtype = null) {
    if (subtype || subtype != null && ['alternative_total', 'alternative_spread', 'home_total', 'away_total'].includes(type)) {
        return {
            newHome: parseInt(home),
            newAway: parseInt(away),
        }
    }
    const moneylineDifference = Math.abs(Math.abs(home) - Math.abs(away)) / 2;
    let bigHome = 1;

    if (home == away && home < 0) {
        if (home + 11 > -100) {
            return {
                newHome: 200 + parseInt(home) + 11,
                newAway: 200 + parseInt(away) + 11,
            }
        }
        return {
            newHome: parseInt(home) + 11,
            newAway: parseInt(away) + 11,
        }
    }

    if (home > 0 && away > 0 || home < 0 && away < 0) {
        const newHome = (home + away) / 2;
        const newAway = (home + away) / 2;
        return {
            newHome: parseInt(newHome),
            newAway: parseInt(newAway),
        }
    }

    if (home > 0) {
        if (Math.abs(away) > Math.abs(home)) bigHome = 1;
        else bigHome = -1;
    }
    if (home < 0) {
        if (Math.abs(away) > Math.abs(home)) bigHome = -1;
        else bigHome = 1;
    }
    const newHome = home + moneylineDifference * bigHome;
    const newAway = away + moneylineDifference * bigHome;
    if (newHome < home) {
        return {
            newHome: parseInt(home),
            newAway: parseInt(away),
        }
    }
    return {
        newHome: parseInt(newHome),
        newAway: parseInt(newAway),
    }
}

module.exports = calculateNewOdds;
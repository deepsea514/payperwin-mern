function calculateNewOdds(home, away) {
    const moneylineDifference = Math.abs(Math.abs(home) - Math.abs(away)) / 2;
    let bigHome = 1;
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
            newHome: home,
            newAway: away,
        }
    }
    return {
        newHome: newHome,
        newAway: newAway,
    }

}

module.exports = calculateNewOdds;
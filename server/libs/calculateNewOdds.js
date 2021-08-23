function calculateNewOdds(home, away, pick) {
    const moneylineDifference = Math.abs(Math.abs(home) - Math.abs(away)) / 2;
    let bigHome = 1;
    if (home > 0 && away > 0 || home < 0 && away < 0) {
        return parseInt((home + away) / 2);
    }
    if (home > 0) {
        if (Math.abs(away) > Math.abs(home)) bigHome = 1;
        else bigHome = -1;
    }
    if (home < 0) {
        if (Math.abs(away) > Math.abs(home)) bigHome = -1;
        else bigHome = 1;
    }
    let newHome = parseInt(home + moneylineDifference * bigHome);
    let newAway = parseInt(away + moneylineDifference * bigHome);

    if (newHome < home) {
        newHome = 0;
        newAway = 0;
    }
    if (pick == 'home' || pick == 'over') {
        return newHome;
    }
    return newAway;
}

module.exports = calculateNewOdds;
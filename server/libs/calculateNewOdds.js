function calculateNewOdds(home, away, pick) {
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
    let newHome = home + moneylineDifference * bigHome;
    let newAway = away + moneylineDifference * bigHome;
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
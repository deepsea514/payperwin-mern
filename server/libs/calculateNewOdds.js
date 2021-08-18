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
    let newHome = Number((home + moneylineDifference * bigHome).toFixed(2));
    let newAway = Number((away + moneylineDifference * bigHome).toFixed(2));

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
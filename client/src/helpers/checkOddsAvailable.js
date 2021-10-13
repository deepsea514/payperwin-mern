function checkOddsAvailable(odds, newOdds, pick, type, subtype = null) {
    if (subtype) return false;
    if (type == 'moneyline') {
        if (odds.home > 0 && odds.away > 0 || odds.home < 0 && odds.away < 0)
            return false;
        if (odds[pick] == newOdds[pick])
            return false;
        return true;
    }
    if (type == 'spread' || type == 'total') {
        if (odds.home > 0 && odds.away > 0 || odds.home < 0 && odds.away < 0) {
            if (odds.home == odds.away)
                return true;
            return false;
        }
        if (odds[pick] == newOdds[pick])
            return false;
        return true;
    }
    return false;
}

module.exports = checkOddsAvailable;
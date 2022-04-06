export const convertOddsFromAmerican = (odds, oddsFormat) => {
    switch (oddsFormat) {
        case 'decimal':
            if (odds > 0)
                return Number(1 + odds / 100).toFixed(2);
            return Number(1 - 100 / odds).toFixed(2);
        case 'american':
            if (odds > 0)
                return '+' + odds;
            return odds;
        default:
            return odds;
    }
}

export const convertOddsToAmerican = (odds, oddsFormat) => {
    if (oddsFormat == 'american') {
        return parseInt(odds);
    } else {
        if (odds >= 2) {
            return parseInt((odds - 1) * 100)
        }
        return parseInt(-100 / (odds - 1))
    }
}
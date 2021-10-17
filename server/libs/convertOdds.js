function convertOdds(odd, oddsFormat) {
    switch (oddsFormat) {
        case 'decimal':
            if (odd > 0)
                return Number(1 + odd / 100).toFixed(2);
            return Number(1 - 100 / odd).toFixed(2);
        case 'american':
            if (odd > 0)
                return '+' + odd;
            return odd;
        default:
            return odd;
    }
}

module.exports = convertOdds;
function convertDecimalToAmericanOdds(decimal) {
    if (decimal >= 2.0) {
        return Math.round((decimal - 1) * 100);
    }
    return Math.round(-100 / (decimal - 1));
}

module.exports = {
    convertDecimalToAmericanOdds,
}
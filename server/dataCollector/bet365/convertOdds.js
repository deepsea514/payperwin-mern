function convertDecimalToAmericanOdds(decimal) {
    if (decimal >= 2.0) {
        return parseInt((decimal - 1) * 100);
    }
    return parseInt(-100 / (decimal - 1));
}

module.exports = {
    convertDecimalToAmericanOdds,
}
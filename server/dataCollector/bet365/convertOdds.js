function convertDecimalToAmericanOdds(decimal) {
    if (decimal >= 2.0) {
        return (decimal - 1) * 100;
    }
    return -100 / (decimal - 1);
}

module.exports = {
    convertDecimalToAmericanOdds,
}
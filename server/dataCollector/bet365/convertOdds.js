function convertDecimalToAmericanOdds(decimal) {
    if (decimal >= 2.0) {
        return Number(((decimal - 1) * 100).toFixed(2));
    }
    return Number(((-100) / (decimal - 1)).toFixed(2));
}

module.exports = {
    convertDecimalToAmericanOdds,
}
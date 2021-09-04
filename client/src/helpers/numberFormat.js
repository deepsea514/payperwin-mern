const numberFormat = (number) => {
    return new Intl.NumberFormat().format(Number(number));
}

module.exports = numberFormat;
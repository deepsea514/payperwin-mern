const getLineCount = (line, timer) => {
    let lineCount = 0;
    const {
        moneyline, spreads, totals, alternative_spreads, alternative_totals,
        first_half, second_half, fifth_innings,
        first_quarter, second_quarter, third_quarter, forth_quarter
    } = line;
    let lines = [];
    if (timer) {
        if (timer.q < "4") {
            lines.push(forth_quarter);
        }
        if (timer.q < "3") {
            lines.push(third_quarter);
            lines.push(second_half);
        }
        if (timer.q < "2") {
            lines.push(second_quarter);
        }
    } else {
        lines = [
            { moneyline, spreads, totals, alternative_spreads, alternative_totals },
            first_half,
            second_half,
            first_quarter,
            second_quarter,
            third_quarter,
            forth_quarter,
            fifth_innings
        ];
    }
    lines.forEach(line => {
        if (!line) return;
        const { moneyline, spreads, totals, alternative_spreads, alternative_totals } = line;
        if (moneyline) {
            lineCount++;
        }
        if (spreads) {
            lineCount += spreads.length;
        }
        if (totals) {
            lineCount += totals.length;
        }
        if (alternative_spreads) {
            lineCount += alternative_spreads.length;
        }
        if (alternative_totals) {
            lineCount += alternative_totals.length;
        }
    });
    return lineCount;
}

module.exports = getLineCount;
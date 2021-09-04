const rouletteSelection = (pool) => {
    var sumScore = 0, lowestScore = 0;
    pool.forEach((obj) => {
        sumScore += obj.Score;
        if (obj.Score < lowestScore)
            lowestScore = obj.Score;
    })
    sumScore += Math.abs(lowestScore * pool.length);

    var rouletteSum = 0;
    var random = Math.random() * sumScore << 0;
    for (let i = 0; i < pool.length; i++) {
        rouletteSum += pool[i].Score + lowestScore;
        if (random < rouletteSum)
            return i;
    }

    return Math.round(Math.random() * pool.length);
};

module.exports = rouletteSelection;
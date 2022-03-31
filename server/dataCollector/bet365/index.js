const { getLiveSportsLines } = require('./getLiveSportsLines');
const { getAllSportsLines } = require('./getAllSportsLines');
const { matchResults } = require('./matchResults');

const getSportsLine = () => {
    const lineInterval = 1000 * 60 * 10;
    getAllSportsLines();
    setInterval(getAllSportsLines, lineInterval);

    const liveInterval = 10 * 1000;
    getLiveSportsLines();
    setInterval(getLiveSportsLines, liveInterval);

    const resultInterval = 1000 * 60 * 10;
    matchResults();
    setInterval(matchResults, resultInterval);
}

module.exports = { getSportsLine };
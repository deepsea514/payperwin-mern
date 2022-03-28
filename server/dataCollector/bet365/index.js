const getLiveSportsLines = require('./getLiveSportsLines');
const { getAllSportsLines } = require('./getAllSportsLines');

const getSportsLine = () => {
    const lineInterval = 1000 * 60 * 10;
    getAllSportsLines();
    setInterval(getAllSportsLines, lineInterval);

    const liveInterval = 10 * 1000;
    getLiveSportsLines();
    setInterval(getLiveSportsLines, liveInterval);
}

module.exports = { getSportsLine };
//Models
const Addon = require('../../models/addon');
//Functions
const matchResultsP2PAndSB = require('./matchResultsP2PAndSB');
const matchResultsParlay = require('./matchResultsParlay');

const matchResults = async () => {
    const bet365Addon = await Addon.findOne({ name: 'bet365' });
    if (!bet365Addon || !bet365Addon.value || !bet365Addon.value.bet365ApiKey) {
        console.warn("Bet365 Api Key is not set");
        return;
    }
    const { bet365ApiKey } = bet365Addon.value;

    matchResultsP2PAndSB(bet365ApiKey);
    matchResultsParlay(bet365ApiKey);
}

module.exports = { matchResults };
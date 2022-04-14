const sportsData = require('./sports.json');
const config = require('../../../config.json');

const Team = require('../../models/team');
const Addon = require('../../models/addon');

const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

const per_page = 100;
Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}
// Database
mongoose.Promise = global.Promise;
// const databaseName = 'PayPerWinDev';
const databaseName = process.env.NODE_ENV === 'development' ? 'PayPerWinDev' : 'PayPerWin';
mongoose.connect(`mongodb://${config.mongo.host}/${databaseName}`, {
    authSource: "admin",
    user: config.mongo.username,
    pass: config.mongo.password,
    useMongoClient: true,
}).then(async () => {
    console.info('Using database:', databaseName);
});

const getTeams = async () => {
    const bet365Addon = await Addon.findOne({ name: 'bet365' });
    if (!bet365Addon || !bet365Addon.value || !bet365Addon.value.bet365ApiKey) {
        console.warn("Bet365 Api Key is not set");
        return;
    }
    const { bet365ApiKey } = bet365Addon.value;

    for (const sport of sportsData) {
        try {
            let page = 1;
            while (true) {
                let success = false;
                let results = [];
                let total = 0;
                try {
                    const { data: { success: success_result, results: results_result, pager } } = await axios
                        .get(`https://api.b365api.com/v1/team`, {
                            params: {
                                sport_id: sport.id,
                                token: bet365ApiKey,
                                page: page,
                                per_page: per_page,
                            }
                        });
                    success = success_result;
                    results = results_result;
                    if (pager)
                        total = pager.total;
                }
                catch (error) {
                    console.error(error);
                }
                for (const result of results) {
                    await Team.findOneAndUpdate({ id: result.id }, { sport, ...result }, { upsert: true });
                }
                if (total == 0 || Math.ceil(total / per_page) <= page) break;
                page++;
            }
        } catch (error) {
            console.error(error);
        }
    }
    console.log(new Date(), 'All done')
}

getTeams();
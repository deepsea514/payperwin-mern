//define router
const widgetRouter = require('express').Router();
//Models
const Sport = require('./models/sport');

//local helpers
// const generatePPWShopSignature = require('./libs/generatePPWShopSignature');

const signatureCheck = async (req, res, next) => {
    next();
}

widgetRouter.get('/',
    signatureCheck,
    async (req, res) => {
        const filterSports = [
            'Basketball',
            'Ice Hockey'
        ]
        try {
            const sportDatas = await Sport.find({ name: { $in: filterSports } });
            let NBAEvents = [], NHLEvents = [];
            sportDatas.map(sportData => {
                if (sportData.name == filterSports[0]) {
                    const leagues = sportData.leagues.find(league => league.name == 'NBA')
                    if (leagues)
                        NBAEvents = leagues.events.filter(event => new Date(event.startDate).getTime() >= new Date().getTime())
                }
                if (sportData.name == filterSports[1]) {
                    const leagues = sportData.leagues.find(league => league.name == 'NHL')
                    if (leagues)
                        NHLEvents = leagues.events.filter(event => new Date(event.startDate).getTime() >= new Date().getTime())
                }
            });
            
            return res.json({ success: true, NBAEvents, NHLEvents });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                error: error,
            })
        }
    }
);

module.exports = widgetRouter;
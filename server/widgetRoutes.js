//define router
const widgetRouter = require('express').Router();
//Models
const Sport = require('./models/sport');

widgetRouter.get('/',
    async (req, res) => {
        const { sport, league: league_id } = req.query;
        try {
            const sportData = await Sport.findOne({ shortName: sport });
            let events = [];
            if (sportData) {
                const leagues = sportData.leagues.find(league => league.originId == league_id)
                if (leagues)
                    events = leagues.events.filter(event => new Date(event.startDate).getTime() >= new Date().getTime())
            }

            return res.json({ success: true, events });
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
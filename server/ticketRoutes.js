//define router
const ticketRouter = require('express').Router();
//Models
const TicketCategory = require('./models/ticket_category');
const TicketEvent = require('./models/ticket_event');
const TicketVenue = require('./models/ticket_venue');
//local helpers

ticketRouter.get('/venues',
    async (req, res) => {
        try {
            let { region, locality, query, page } = req.query;
            if (!page) page = 1;
            page = parseInt(page);
            const perPage = 20;
            const searchObj = {
                "address.country_code": "CA",
                name: { "$regex": query, "$options": "i" }
            }
            region && (searchObj["address.region"] = region);
            locality && (searchObj["address.locality"] = locality);
            const venues = await TicketVenue
                .find(searchObj)
                .skip((page - 1) * perPage)
                .limit(perPage);
            return res.json({ success: true, venues: venues });
        } catch (error) {
            return res.json({ success: false, error: 'Internal Server Error.' });
        }
    }
);

module.exports = ticketRouter;
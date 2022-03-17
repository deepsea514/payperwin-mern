//define router
const ticketRouter = require('express').Router();
//Models
const TicketCategory = require('./models/ticket_category');
const TicketEvent = require('./models/ticket_event');
const TicketVenue = require('./models/ticket_venue');
//local helpers
const perPage = 20;

ticketRouter.get(
    '/venues',
    async (req, res) => {
        try {
            let { region, locality, query, page } = req.query;
            if (!page) page = 1;
            page = parseInt(page);
            const searchObj = {
                "address.country_code": "CA",
            }
            query && (searchObj['name'] = { "$regex": query, "$options": "i" });
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

ticketRouter.get(
    '/events/:event_id',
    async (req, res) => {
        try {
            let { event_id } = req.params;
            const event = await TicketEvent.findOne({ id: event_id })
            return res.json({ success: true, event: event });
        } catch (error) {
            return res.json({ success: false, error: 'Internal Server Error.' });
        }
    }
);

ticketRouter.get(
    '/events',
    async (req, res) => {
        try {
            let { region, locality, query, page, venue, category } = req.query;
            if (!page) page = 1;
            page = parseInt(page);
            const searchObj = {
                // "venue.country_code": "CA",
                occurs_at: { $gte: new Date() }
            }
            query && (searchObj['name'] = { "$regex": query, "$options": "i" });
            region && (searchObj["venue.region"] = region);
            locality && (searchObj["venue.locality"] = locality);
            venue && (searchObj["venue.slug"] = venue);
            category && (searchObj["categories.slug"] = category);

            const total = await TicketEvent.find(searchObj).count();
            const events = await TicketEvent
                .find(searchObj)
                .skip((page - 1) * perPage)
                .limit(perPage);

            return res.json({ success: true, events: events, page: page, total: total });
        } catch (error) {
            return res.json({ success: false, error: 'Internal Server Error.' });
        }
    }
);

module.exports = ticketRouter;
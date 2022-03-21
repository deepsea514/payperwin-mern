//define router
const ticketRouter = require('express').Router();
//Models
const TicketEvent = require('./models/ticket_event');
const TicketVenue = require('./models/ticket_venue');
const Frontend = require('./models/frontend');
//local helpers
const perPage = 20;

ticketRouter.get(
    '/venues/:venue_slug',
    async (req, res) => {
        try {
            const { venue_slug } = req.params;
            const venue = await TicketVenue.findOne({ slug: venue_slug });
            if (!venue) {
                return res.json({ success: false, error: 'Venue Not Found.' });
            }
            return res.json({ success: true, venue: venue });
        } catch (error) {
            console.error(error);
            return res.json({ success: false, error: 'Cannot get Venue Detail. Internal Server Error.' });
        }
    }
)

ticketRouter.get(
    '/venues',
    async (req, res) => {
        try {
            let { country, region, locality, query, page } = req.query;
            if (!page) page = 1;
            page = parseInt(page);
            const searchObj = {};
            country && (searchObj["address.country_code"] = country.toUpperCase());
            query && (searchObj['name'] = { "$regex": query, "$options": "i" });
            region && (searchObj["address.region"] = region);
            locality && (searchObj["address.locality"] = locality);
            const total = await TicketVenue.find(searchObj).count();
            const venues = await TicketVenue
                .find(searchObj)
                .skip((page - 1) * perPage)
                .limit(perPage);
            return res.json({ success: true, venues: venues, page: page, total: total });
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
                .select(['id', 'categories', 'configuration', 'name', 'occurs_at', 'performances', 'venue'])
                .skip((page - 1) * perPage)
                .limit(perPage);

            return res.json({ success: true, events: events, page: page, total: total });
        } catch (error) {
            return res.json({ success: false, error: 'Internal Server Error.' });
        }
    }
);

ticketRouter.get(
    '/cad_rate',
    async (req, res) => {
        const defaultRate = 1.2601734;
        try {
            const setting = await Frontend.findOne({ name: 'currency_rate' });
            if (setting) {
                const rate = setting.value.CAD / setting.value.USD;
                return res.json({ rate: rate });
            }
            return res.json({ rate: defaultRate });
        } catch (error) {
            console.error(error);
            return res.json({ rate: defaultRate });
        }
    }
)

module.exports = ticketRouter;
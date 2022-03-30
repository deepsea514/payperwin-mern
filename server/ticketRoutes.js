//define router
const ticketRouter = require('express').Router();
//Models
const TevoEvent = require('./models/tevo_event');
const TevoVenue = require('./models/tevo_venue');
const TevoPerformer = require('./models/tevo_performer');
const Frontend = require('./models/frontend');
//local helpers
const perPage = 20;

ticketRouter.get(
    '/performers/:performer_slug',
    async (req, res) => {
        try {
            const { performer_slug } = req.params;
            const performer = await TevoPerformer.findOne({ slug: performer_slug });
            if (!performer) {
                return res.json({ success: false, error: 'Performer Not Found.' });
            }
            return res.json({ success: true, performer: performer });
        } catch (error) {
            console.error(error);
            return res.json({ success: false, error: 'Cannot get Performer Detail. Internal Server Error.' });
        }
    }
)

ticketRouter.get(
    '/performers',
    async (req, res) => {
        try {
            let { category, query, page } = req.query;
            if (!page) page = 1;
            page = parseInt(page);
            const searchObj = {};
            category && (searchObj["categories.slug"] = category);
            query && (searchObj['name'] = { "$regex": query, "$options": "i" });
            const total = await TevoPerformer.find(searchObj).count();
            const performers = await TevoPerformer
                .find(searchObj)
                .skip((page - 1) * perPage)
                .limit(perPage);
            return res.json({ success: true, performers: performers, page: page, total: total });
        } catch (error) {
            console.error(error);
            return res.json({ success: false, error: 'Internal Server Error.' });
        }
    }
);

ticketRouter.get(
    '/venues/:venue_slug',
    async (req, res) => {
        try {
            const { venue_slug } = req.params;
            const venue = await TevoVenue.findOne({ slug: venue_slug });
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
            const total = await TevoVenue.find(searchObj).count();
            const venues = await TevoVenue
                .find(searchObj)
                .skip((page - 1) * perPage)
                .limit(perPage);
            return res.json({ success: true, venues: venues, page: page, total: total });
        } catch (error) {
            console.error(error);
            return res.json({ success: false, error: 'Internal Server Error.' });
        }
    }
);

ticketRouter.get(
    '/events/:event_id',
    async (req, res) => {
        try {
            let { event_id } = req.params;
            const event = await TevoEvent.findOne({ id: event_id })
            return res.json({ success: true, event: event });
        } catch (error) {
            console.error(error);
            return res.json({ success: false, error: 'Internal Server Error.' });
        }
    }
);

ticketRouter.get(
    '/events',
    async (req, res) => {
        try {
            let { region, locality, query, page, venue, category, performer } = req.query;
            if (!page) page = 1;
            page = parseInt(page);
            const searchObj = {
                occurs_at: { $gte: new Date() }
            }
            query && (searchObj['name'] = { "$regex": query, "$options": "i" });
            region && (searchObj["venue.region"] = region);
            locality && (searchObj["venue.locality"] = locality);
            venue && (searchObj["venue.slug"] = venue);
            category && (searchObj["categories.slug"] = category);
            performer && (searchObj["performances.performer.slug"] = performer);

            const total = await TevoEvent.find(searchObj).count();
            const events = await TevoEvent
                .find(searchObj)
                .select(['id', 'categories', 'configuration', 'name', 'occurs_at', 'performances', 'venue'])
                .skip((page - 1) * perPage)
                .sort({ occurs_at: 1 })
                .limit(perPage);

            return res.json({ success: true, events: events, page: page, total: total });
        } catch (error) {
            console.error(error);
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
                const rate = Number(setting.value.CAD.rate) + 0.01;
                return res.json({ rate: rate });
            }
            return res.json({ rate: defaultRate });
        } catch (error) {
            console.error(error);
            return res.json({ rate: defaultRate });
        }
    }
)

ticketRouter.get(
    '/homedata',
    async (req, res) => {
        try {
            const total_events = await TevoEvent.find().count();
            const total_venues = await TevoVenue.find().count();
            const total_performers = await TevoPerformer.find().count();
            return res.json({
                success: true,
                total_events: total_events,
                total_venues: total_venues,
                total_performers: total_performers,
            })
        } catch (error) {
            console.error(error);
            return res.json({ success: false, error: 'Internal Server Error.' });
        }
    }
)

module.exports = ticketRouter;
//define router
const ticketRouter = require('express').Router();
const TevoClientAPI = require('ticketevolution-node');
//Models
const TevoEvent = require('./models/tevo_event');
const TevoVenue = require('./models/tevo_venue');
const TevoPerformer = require('./models/tevo_performer');
const TevoClient = require('./models/tevo_client');
const Frontend = require('./models/frontend');
const Addon = require('./models/addon');
//local helpers
const perPage = 20;

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        const { user, session } = req;
        if (user.roles.enable_2fa) {
            //TODO check 2fa
            if (session._2fa_code) {
                return res.status(403).send('2 Factor Authentication Required.');
            }
        }
        return next();
    }
    res.status(403).send('Authentication Required.');
}

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

ticketRouter.post(
    '/checkout',
    isAuthenticated,
    async (req, res) => {
        const {
            email, firstname, lastname, address, address2, city, country, region, zipcode, phone,
            card_holder, card_number, card_expiry, card_cvc,
            cart, session_id
        } = req.body;
        try {
            const ticketAddon = await Addon.findOne({ name: 'ticketevolution' });
            if (!ticketAddon || !ticketAddon.value || !ticketAddon.value.api_token) {
                return res.json({ success: false, error: 'Cannot create an order. Ticket Integration is not set.' })
            }
            const API_TOKEN = ticketAddon.value.api_token;
            const API_SECRET = ticketAddon.value.api_secret;
            const office_id = ticketAddon.value.office_id;

            const tevoClientAPI = new TevoClientAPI({
                apiToken: API_TOKEN,
                apiSecretKey: API_SECRET,
            });

            let tevo_client = await TevoClient.findOne({ user_id: req.user._id });
            if (!tevo_client) {
                const newClient = [{
                    name: firstname + ' ' + lastname,
                    office_id: office_id,
                    addresses: [{
                        street_address: address,
                        extended_address: address2,
                        locality: city,
                        region: region,
                        postal_code: zipcode,
                        country_code: 'CA',
                        primary: true,
                        is_primary_shipping: true,
                        is_primary_billing: true,
                    }],
                    phone_numbers: [{
                        number: phone
                    }],
                    email_addresses: [{
                        address: email
                    }]
                }]
                try {
                    const response = await tevoClientAPI.postJSON('http://api.sandbox.ticketevolution.com/v9/clients', newClient)
                    if (response && response.clients && response.clients.length) {
                        tevo_client = await TevoClient.create(response.clients[0]);
                    } else {
                        return res.json({ success: false, error: 'Cannot create an order. Creating Client failed.' })
                    }
                } catch (error) {
                    return res.json({ success: false, error: 'Cannot create an order. Creating Client failed.' })
                }
            }
            return res.json({ success: false, error: 'Final Step' });
        } catch (error) {
            console.error(error);
            return res.json({ success: false, error: 'Cannot create an order. Internal Server Error.' })
        }
    }
)

module.exports = ticketRouter;
//define router
const ticketRouter = require('express').Router();
//Models
const TicketCategory = require('./models/ticket_category');
const TicketEvent = require('./models/ticket_event');
const TucketVenue = require('./models/ticket_venue');
//local helpers

ticketRouter.get('/categories',
    async (req, res) => {
        try {
            const categories = await TicketCategory.find();
            return res.json({ success: true, categories: categories });
        } catch (error) {
            return res.json({ success: false, error: 'Internal Server Error.' });
        }
    }
);

module.exports = ticketRouter;
const TevoClient = require('ticketevolution-node');
const TicketEvent = require('../../models/ticket_event');
const TicketVenue = require('../../models/ticket_venue');

const arrangeCategories = (categories, category) => {
    if (category.parent) {
        arrangeCategories(categories, category.parent);
        category.parent = null;
    }
    categories.push(category);
}

const getEvents = async (API_TOKEN, API_SECRET) => {
    const tevoClient = new TevoClient({
        apiToken: API_TOKEN,
        apiSecretKey: API_SECRET,
    });
    try {
        let page = 1;
        do {
            const response = await tevoClient.getJSON('http://api.sandbox.ticketevolution.com/v9/events?per_page=100&page=' + page);
            if (response.events && response.events.length) {
                const events_res = response.events;
                for (const event of events_res) {
                    const venue = await TicketVenue.findOne({ id: event.venue.id });
                    if (venue) {
                        const event_ = {
                            name: event.name,
                            id: event.id,
                            products_eticket_count: event.products_eticket_count,
                            products_count: event.products_count,
                            owned_by_office: event.owned_by_office,
                            long_term_popularity_score: event.long_term_popularity_score,
                            venue: {
                                id: venue.id,
                                location: venue.location,
                                name: venue.name,
                                slug_url: venue.slug_url,
                                url: venue.url,
                                slug: venue.slug,
                            },
                            configuration: event.configuration,
                            popularity_score: event.popularity_score,
                            state: event.state,
                            url: event.url,
                            notes: event.notes,
                            occurs_at: event.occurs_at,
                            performances: event.performances,
                            categories: [],
                        }
                        arrangeCategories(event_.categories, event.category);
                        await TicketEvent.findOneAndUpdate({ id: event.id }, event_, { upsert: true });
                    }
                }
            } else {
                break;
            }
            console.log('Got Events, Page => ', page, response.total_entries);
            page++;
            if (response.total_entries && response.total_entries < response.current_page * response.per_page)
                break;
        } while (true);
        console.log('Got Events.');
    } catch (error) {
        console.error(error);
    }
}

module.exports = { getEvents };
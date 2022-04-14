const TevoClient = require('ticketevolution-node');
const TevoEvent = require('../../models/tevo_event');
const TevoVenue = require('../../models/tevo_venue');
const TevoPerformer = require('../../models/tevo_performer');
const { getPerformers } = require('./getPerformers');

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
                    const venue = await TevoVenue.findOne({ id: event.venue.id });
                    if (venue) {
                        let listings = null;
                        try {
                            listings = await tevoClient.getJSON('http://api.sandbox.ticketevolution.com/v9/listings?event_id=' + event.id);
                        } catch (error) {
                            console.error(error);
                        }

                        const event_ = {
                            name: event.name,
                            id: event.id,
                            products_eticket_count: event.products_eticket_count,
                            products_count: event.products_count,
                            owned_by_office: event.owned_by_office,
                            long_term_popularity_score: event.long_term_popularity_score,
                            venue: {
                                id: venue.id,
                                address: venue.address,
                                country_code: venue.address.country_code,
                                location: venue.location,
                                name: venue.name,
                                slug_url: venue.slug_url,
                                url: venue.url,
                                slug: venue.slug,
                                region: venue.address.region,
                                locality: venue.address.locality,
                            },
                            configuration: event.configuration,
                            popularity_score: event.popularity_score,
                            state: event.state,
                            url: event.url,
                            notes: event.notes,
                            occurs_at: event.occurs_at,
                            performances: event.performances,
                            categories: [],
                            listings: listings
                        }
                        arrangeCategories(event_.categories, event.category);
                        await TevoEvent.findOneAndUpdate({ id: event.id }, event_, { upsert: true });
                        if (event.performances && event.performances.length) {
                            for (const performer of event.performances) {
                                await TevoPerformer.findOneAndUpdate(
                                    { id: performer.performer.id },
                                    performer.performer,
                                    { upsert: true }
                                );
                            }
                        }
                    }
                }
            } else {
                break;
            }
            console.log(new Date(), 'Got Events, Page => ', page, response.total_entries);
            page++;
            if (response.total_entries && response.total_entries < response.current_page * response.per_page)
                break;
        } while (true);
        console.log(new Date(), 'Got Events.');

        await getPerformers(API_TOKEN, API_SECRET);
    } catch (error) {
        console.error(error);
    }
}

module.exports = { getEvents };
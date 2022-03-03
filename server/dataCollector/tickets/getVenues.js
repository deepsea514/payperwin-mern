const TevoClient = require('ticketevolution-node');
const TicketVenue = require('../../models/ticket_venue');

const getVenues = async (API_TOKEN, API_SECRET) => {
    const tevoClient = new TevoClient({
        apiToken: API_TOKEN,
        apiSecretKey: API_SECRET,
    });
    try {
        let page = 1;
        do {
            const response = await tevoClient.getJSON('http://api.sandbox.ticketevolution.com/v9/venues?per_page=1000&page=' + page);
            if (response.venues && response.venues.length) {
                const venues_res = response.venues;
                for (const venue of venues_res) {
                    await TicketVenue.findOneAndUpdate({ id: venue.id }, venue, { upsert: true });
                }
            } else {
                break;
            }
            console.log('Got Venues, Page => ', page, response.total_entries);
            page++;
            if (response.total_entries && response.total_entries < response.current_page * response.per_page)
                break;
        } while (true);
        console.log('Got Venues.');
    } catch (error) {
        console.error(error);
    }
}

module.exports = { getVenues };
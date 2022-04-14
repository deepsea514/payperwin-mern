const TevoClient = require('ticketevolution-node');
const fs = require('fs');
const TevoVenue = require('../../models/tevo_venue');
const caVenues = require('./venues_ca.json');
const usVenues = require('./venues_us.json');
const GET_FROM_API = false;

const getVenues = async (API_TOKEN, API_SECRET) => {
    if (GET_FROM_API) {
        const tevoClient = new TevoClient({
            apiToken: API_TOKEN,
            apiSecretKey: API_SECRET,
        });
        try {
            let venues = [];
            let page = 1;
            do {
                const response = await tevoClient.getJSON('http://api.sandbox.ticketevolution.com/v9/venues?per_page=1000&page=' + page);
                if (response.venues && response.venues.length) {
                    const venues_res = response.venues;
                    venues = [...venues, ...venues_res]
                } else {
                    break;
                }
                console.log(new Date(), 'Got Venues, Page => ', page, response.total_entries);
                page++;
                if (response.total_entries && response.total_entries < response.current_page * response.per_page)
                    break;
            } while (true);
            fs.writeFileSync('venues.json', JSON.stringify(venues));
            console.log(new Date(), 'Got all Venues.');
        } catch (error) {
            console.error(error);
        }
    } else {
        for (const venue of [...caVenues, ...usVenues]) {
            try {
                await TevoVenue.findOneAndUpdate({ id: venue.id }, venue, { upsert: true });
            } catch (error) {
                console.error(error);
            }
            delete venue._id;
        }
        console.log(new Date(), 'Got all Venues.');
    }
}

module.exports = { getVenues };
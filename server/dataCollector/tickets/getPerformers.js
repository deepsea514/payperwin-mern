const TevoClient = require('ticketevolution-node');
const TevoPerformer = require('../../models/tevo_performer');

const arrangeCategories = (categories, category) => {
    if (category.parent) {
        arrangeCategories(categories, category.parent);
        category.parent = null;
    }
    categories.push(category);
}

const getPerformers = async (API_TOKEN, API_SECRET) => {
    const tevoClient = new TevoClient({
        apiToken: API_TOKEN,
        apiSecretKey: API_SECRET,
    });
    try {
        const performersToUpdate = await TevoPerformer.find({ gotFullData: { $ne: true } });
        for (const performerToUpdate of performersToUpdate) {
            const response = await tevoClient.getJSON('http://api.sandbox.ticketevolution.com/v9/performers/' + performerToUpdate.id);
            const performer = {
                id: response.id,
                name: response.name,
                keywords: response.keywords,
                popularity_score: response.popularity_score,
                url: response.url,
                slug_url: response.slug_url,
                upcoming_events: response.upcoming_events,
                meta: response.meta,
                slug: response.slug,
                categories: [],
                gotFullData: true
            }
            arrangeCategories(performer.categories, response.category);
            await performerToUpdate.update(performer);
        }
        console.log(new Date(), 'Got Performers.');
    } catch (error) {
        console.error(error);
    }
}

module.exports = { getPerformers };
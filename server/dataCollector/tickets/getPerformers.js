const TevoClient = require('ticketevolution-node');
const TicketPerformer = require('../../models/ticket_performer');

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
        let page = 1;
        do {
            const response = await tevoClient.getJSON('http://api.sandbox.ticketevolution.com/v9/performers?category_id=1&category_tree=true&per_page=1000&page=' + page);
            if (response.performers && response.performers.length) {
                const performers_res = response.performers;
                for (const performer of performers_res) {
                    const performer_ = {
                        id: performer.id,
                        name: performer.name,
                        keywords: performer.keywords,
                        popularity_score: performer.popularity_score,
                        url: performer.url,
                        slug_url: performer.slug_url,
                        upcoming_events: performer.upcoming_events,
                        meta: performer.meta,
                        slug: performer.slug,
                        categories: []
                    }
                    arrangeCategories(performer_.categories, performer.category)
                    await TicketPerformer.findOneAndUpdate({ id: performer_.id }, performer_, { upsert: true });
                }
            } else {
                break;
            }
            console.log('Got Performers, Page => ', page, response.total_entries);
            page++;
            if (response.total_entries && response.total_entries < response.current_page * response.per_page)
                break;
        } while (true);
        console.log('Got Performers.');
    } catch (error) {
        console.error(error);
    }
}

module.exports = { getPerformers };
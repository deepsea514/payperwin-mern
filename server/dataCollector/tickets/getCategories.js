const TevoClient = require('ticketevolution-node');
const TicketCategory = require('../../models/ticket_category');

const findCategory = (categories, category) => {
    for (const category_s of categories) {
        if (category_s.id == category.id) return category_s;
        const sub_category = findCategory(category_s.sub_categories, category)
        if (sub_category) return sub_category;
    }
    return null;
}

const addCategories = (categories, category) => {
    const existing = categories.find(category_s => category_s.id == category.id);
    if (existing) return;
    if (category.parent == null) {
        categories.push({
            name: category.name,
            id: category.id,
            slug: category.slug,
            url: category.url,
            slug_url: category.slug_url,
            sub_categories: []
        })
        return;
    }

    addCategories(categories, category.parent);
    const parent = findCategory(categories, category.parent);
    if (parent) {
        category.parent = null;
        addCategories(parent.sub_categories, category)
    }
}

const getCategories = async (API_TOKEN, API_SECRET) => {
    const tevoClient = new TevoClient({
        apiToken: API_TOKEN,
        apiSecretKey: API_SECRET,
    });
    try {
        const response = await tevoClient.getJSON('http://api.sandbox.ticketevolution.com/v9/categories');
        const categories = [];
        if (response.categories && response.categories.length) {
            const categories_res = response.categories;
            categories_res.map(category => addCategories(categories, category));
        }
        for (const category of categories) {
            await TicketCategory.findOneAndUpdate({ id: category.id }, category, { upsert: true });
        }
        console.log('Got Categories.');
    } catch (error) {
        console.error(error);
    }
}

module.exports = { getCategories };
export function getCategoryOptions(categories, options) {
    for (const category of categories) {
        options.push({ label: category.name, value: category.slug });
        if (category.sub_categories && category.sub_categories.length) {
            getCategoryOptions(category.sub_categories, options);
        }
    }
}
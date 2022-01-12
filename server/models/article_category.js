const mongoose = require('mongoose');
const { Schema } = mongoose;

const ArticleCategorySchema = new Schema(
    {
        title: { type: String, required: true, unique: true },
    },
    {
        timestamps: true,
    }
);

const ArticleCategory = mongoose.model('ArticleCategory', ArticleCategorySchema);

module.exports = ArticleCategory;

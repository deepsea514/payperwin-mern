const mongoose = require('mongoose');
const { Schema } = mongoose;

const ArticleSchema = new Schema(
    {
        logo: { type: String, required: true, default: null },
        title: { type: String, required: true },
        subtitle: { type: String, required: true },
        content: { type: String, required: true },
        categories: [{ type: String, required: true }],
        authors: [{ name: String, logo: String }],
        permalink: { type: String, required: true, index: { unique: true } },
        meta_title: { type: String, },
        meta_description: { type: String, },
        meta_keywords: { type: String, },
        published_at: { type: Date, default: null },
        posted_at: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

const Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;

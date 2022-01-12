const mongoose = require('mongoose');
const { Schema } = mongoose;

const ArticleAuthorSchema = new Schema(
    {
        logo: { type: String, required: true, default: null },
        name: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

const ArticleAuthor = mongoose.model('ArticleAuthor', ArticleAuthorSchema);

module.exports = ArticleAuthor;

const mongoose = require('mongoose');
const { Schema } = mongoose;

const FavoritesSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, res: 'User' },
        name: { type: String, required: true },
        type: { type: String, required: true },
        originId: { type: String, required: true },
        sport: { type: String, required: true },
        index: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    },
);

const Favorites = mongoose.model('Favorites', FavoritesSchema);

module.exports = Favorites;

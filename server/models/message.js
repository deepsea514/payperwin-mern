const mongoose = require('mongoose');

const { Schema } = mongoose;

const MessageSchema = new Schema(
    {
        userFor: [{
            type: Schema.Types.ObjectId,
            ref: "User"
        }],
        title: String,
        type: String,
        content: String,
        is_greater_balance: Boolean,
        greater_balance: Number,
        is_last_online_before: Boolean,
        last_online_before: Date,
        is_last_online_after: Boolean,
        last_online_after: Date,
        is_wager_more: Boolean,
        wager_more: Number,
        is_user_from: Boolean,
        user_from: String,
        published_at: { type: Date, default: null }
    },
    {
        timestamps: true,
    },
);

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;

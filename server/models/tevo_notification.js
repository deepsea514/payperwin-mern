const mongoose = require('mongoose');
const { Schema } = mongoose;

const TevoNotificationsSchema = new Schema(
    {
        data: Object
    },
    { timestamps: true, },
);

const TevoNotifications = mongoose.model('TevoNotifications', TevoNotificationsSchema);

module.exports = TevoNotifications;

const mongoose = require('mongoose');

const { Schema } = mongoose;

const LoginLogSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        ip_address: String,
    },
    {
        timestamps: true,
    },
);

const LoginLog = mongoose.model('LoginLog', LoginLogSchema);

module.exports = LoginLog;

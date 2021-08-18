const mongoose = require('mongoose');

const { Schema } = mongoose;

const TestEventSchema = new Schema(
    {
        name: String,
        event: Object
    },
    {
        timestamps: true,
    },
);

const TestEvent = mongoose.model('TestEvent', TestEventSchema);

module.exports = TestEvent;

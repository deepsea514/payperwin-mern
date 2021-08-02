const mongoose = require('mongoose');

const { Schema } = mongoose;

const TicketSchema = new Schema(
    {
        email: { type: String, required: true },
        phone: { type: String, required: true },
        subject: { type: String, required: true },
        department: { type: String, required: true },
        description: { type: String, required: true },
        file: { type: Object, default: null },
        repliedAt: { type: Date, default: null },
    },
    {
        timestamps: true,
    },
);

const Ticket = mongoose.model('Ticket', TicketSchema);

module.exports = Ticket;

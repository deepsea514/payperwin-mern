const mongoose = require('mongoose');
const User = require('./user');
const ErrorLog = require('./errorlog');
const simpleresponsive = require('../emailtemplates/simpleresponsive');
const sgMail = require('@sendgrid/mail');
const config = require('../../config.json');
const fromEmailName = 'PAYPER WIN';
const fromEmailAddress = 'donotreply@payperwin.com';
const { Schema } = mongoose;

const EventSchema = new Schema(
    {
        name: { type: String, index: { unique: true }, required: true },
        uniqueid: { type: String, index: { unique: true }, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        maximumRisk: { type: Number, required: true },
        options: { type: Array, required: true },
        odds_type: { type: String, default: 'american' },
        votes: { type: Array, default: [] },
        approved: { type: Boolean, default: true },
        public: { type: Boolean, default: true },
        status: { type: Number, default: config.EventStatus.pending.value },
        user: { type: Schema.Types.ObjectId, ref: 'User', default: null },
        allowAdditional: { type: Boolean, default: false },
        participants: [{
            user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
            amount: { type: Number, required: true }
        }]
    },
    { timestamps: true },
);

EventSchema.pre('save', async function (next) { // eslint-disable-line func-names
    const event = this;
    // check if approved.
    if (event.isModified('approved') && event.approved && event.creator == 'User' && event.user) {
        const { name } = event;
        const user = await User.findById(event.user);
        if (!user) return next();

        const betLink = `https://www.payperwin.com/side-bet/${event.uniqueid}`;
        const msg = {
            from: `${fromEmailName} <${fromEmailAddress}>`,
            to: user.email,
            subject: 'Side Bet Approved - ' + name,
            text: 'Side Bet Approved - ' + name,
            html: simpleresponsive(
                `Hi <b>${user.email}</b>.
                <br><br>
                Your customer bet for ${name} has been approved. Please <a target="_blank" href="${betLink}">click here</a> to view your Side bet. 
                <br><br>`,
                { href: betLink, name: 'View Side Bet' }
            ),
        };
        sgMail.send(msg).catch(error => {
            ErrorLog.findOneAndUpdate(
                {
                    name: 'Send Grid Error',
                    "error.stack": error.stack
                },
                {
                    name: 'Send Grid Error',
                    error: {
                        name: error.name,
                        message: error.message,
                        stack: error.stack
                    }
                },
                { upsert: true }
            );
        });
    }
    next();
});

const Event = mongoose.model('Event', EventSchema);
module.exports = Event;
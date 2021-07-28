//Models
const Addon = require("../../models/addon");
const Preference = require('../../models/preference');
const Bet = require('../../models/bet');
const User = require('../../models/user');
//local helpers
const config = require('../../../config.json');
const simpleresponsive = require('../../emailtemplates/simpleresponsive');
const { convertTimeLineDate } = require('../../libs/timehelper');
const fromEmailName = 'PAYPER WIN';
const fromEmailAddress = 'donotreply@payperwin.co';
//external libraries
const mongoose = require('mongoose');
const sgMail = require('@sendgrid/mail');

Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}

// Database
mongoose.Promise = global.Promise;
const databaseName = 'PayPerWinDev'
mongoose.connect(`mongodb://localhost/${databaseName}`, {
    authSource: "admin",
    user: config.mongo.username,
    pass: config.mongo.password,
    useMongoClient: true,
}).then(async () => {
    console.info('Using database:', databaseName);

    const lineInterval = 1000 * 60 * 60;
    checkMatchStatus();
    setInterval(checkMatchStatus, lineInterval);

    const sendGridAddon = await Addon.findOne({ name: 'sendgrid' });
    if (!sendGridAddon || !sendGridAddon.value || !sendGridAddon.value.sendgridApiKey) {
        console.warn('Send Grid Key is not set');
        return;
    }
    sgMail.setApiKey(sendGridAddon.value.sendgridApiKey);
});

async function checkMatchStatus() {
    const bets = await Bet.find(
        {
            matchStartDate: { $lt: new Date().addHours(5) },
            notifySent: { $exists: false },
            matchingStatus: ['Pending', 'Partial Match']
        }
    );
    console.log(`${bets.length} of Unmatched bets.`);
    for (const bet of bets) {
        const user = await User.findById(bet.userId);
        let eventName = '';
        if (bet.origin == 'other') {
            eventName = bet.lineQuery.eventName;
        } else {
            eventName = `${bet.teamA.name} vs ${bet.teamB.name} (${bet.lineQuery.sportName})`;
        }

        const preference = await Preference.findOne({ user: user._id });
        let timezone = "00:00";
        if (preference && preference.timezone) {
            timezone = preference.timezone;
        }
        const timeString = convertTimeLineDate(new Date(bet.matchStartDate), timezone);

        const msg = {
            from: `${fromEmailName} <${fromEmailAddress}>`,
            to: user.email,
            subject: 'We couldn’t find you a match for your bet',
            text: `We couldn’t find you a match for your bet`,
            html: simpleresponsive(
                `Hi <b>${user.email}</b>.
                <br><br>
                Unfortunately we are still unable to match your bet with another player for <b>${eventName}</b> on ${timeString}. 
                <br><br>
                You can forward your bet to our sportsbook for an instant bet.
            `, { href: "https://www.payperwin.co/bets", name: 'View Open Bets' }),
        };
        sgMail.send(msg);

        await bet.update({ notifySent: new Date() });
    }
    console.log("Sent mails.")
}
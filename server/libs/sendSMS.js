const Addon = require("../models/addon");
const twilio = require('twilio');

const sendSMS = async (message, phone) => {
    const twilioAddon = await Addon.findOne({ name: 'twilio' });
    if (!twilioAddon || !twilioAddon.value || !twilioAddon.value.accountSid) {
        console.warn('Twilio Key is not set');
        return;
    }
    const twilioClient = twilio(twilioAddon.value.accountSid, twilioAddon.value.authToken);

    try {
        await twilioClient.messages.create({
            body: message,
            from: '+16475594828',
            to: phone
        })
    } catch (error) {
        console.log("error => ", error);
    }
}

module.exports = sendSMS;
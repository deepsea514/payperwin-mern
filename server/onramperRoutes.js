//define router
const onramperRouter = require('express').Router();
//external libraries
const sgMail = require('@sendgrid/mail');
//Models
const OnramperDeposit = require("./models/onramper_deposit");
//local helpers
// const generatePPWShopSignature = require('./libs/generatePPWShopSignature');

const signatureCheck = async (req, res, next) => {
    next();
}

onramperRouter.post('/deposit',
    signatureCheck,
    async (req, res) => {
        const body = req.body;
        // if (!card_number || !amount) {
        //     return res.json({
        //         success: false,
        //         error: 'Card Number and Amount is required.'
        //     })
        // }
        try {
            await OnramperDeposit.create({ data: body });
            return res.json({ success: true });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                error: error,
            })
        }

    }
);

module.exports = onramperRouter;
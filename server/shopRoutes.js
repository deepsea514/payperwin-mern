//define router
const shopRouter = require('express').Router();
//external libraries
const sgMail = require('@sendgrid/mail');
//Models
const GiftCard = require("./models/giftcard");
//local helpers
const generatePPWShopSignature = require('./libs/generatePPWShopSignature');

const signatureCheck = async (req, res, next) => {
    if (req.body) {
        const data = req.body;
        const signature = await generatePPWShopSignature(data.card_number, data.amount)
        if (signature == data.signature) {
            return next();
        }
        else {
            return res.json({
                success: false,
                error: "Signature mismatch"
            });
        }
    }
    else {
        return res.json({
            success: false,
            error: "Signature mismatch"
        });
    }
}

shopRouter.post('/giftcard/purchase',
    signatureCheck,
    async (req, res) => {
        const { card_number, amount } = req.body;
        if (!card_number || !amount) {
            return res.json({
                success: false,
                error: 'Card Number and Amount is required.'
            })
        }
        try {
            const existing = await GiftCard.findOne({ card_number: card_number });
            if (existing) {
                return res.json({
                    success: false,
                    error: 'The card with same number already exists.'
                })
            }
            await GiftCard.create({
                card_number: card_number,
                amount: amount,
                usedAt: null,
            })
            return res.json({ success: true });
        } catch (error) {
            console.error(error);
            return res.json({
                success: false,
                error: 'Internal Server Error.',
            })
        }

    }
);

module.exports = shopRouter;
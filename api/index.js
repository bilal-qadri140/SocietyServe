const express = require('express')
const app = express()
const port = 3000

const stripe = require('stripe')('sk_test_51PdX2BRvPGnkwL180yvUEGuEjFkmkmsqZ8d0i8RVmmauUdQjRSFQH34DJMkGrxV1nwzLObZR4ZK4aEs3SeqCqf4300gDRKnQoA');


app.post('/payment-sheet', async (req, res) => {
    // Use an existing Customer ID if this is a returning customer.
    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
        { customer: customer.id },
        { apiVersion: '2024-06-20' }
    );
    console.log('in server');
    const paymentIntent = await stripe.paymentIntents.create({
        amount: 10,
        currency: 'eur',
        customer: customer.id,
        automatic_payment_methods: {
            enabled: true,
        },
    });

    return res.json({
        paymentIntent: paymentIntent.client_secret,
        ephemeralKey: ephemeralKey.secret,
        customer: customer.id,
        publishableKey: 'pk_test_51PdX2BRvPGnkwL1861wnudYQVNjlKjKy8N1uou7UkQEK0dBWc693GLF4F6yfuXnlj8JQErIDvFfpJj29VxsKJtMo00vhamBZXK'
    });
});
app.get('/', async (req, res) => {
    return res.json({ status: "Good" })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
const stripeSecretKey = "sk_test_51MkRVpSCtHJAlS4TcfXytlauKP5AsXjzsT3BFNYVtkEfSKDPygfcLk4MvtLxClzMC0EFhQktMcNxRr3FJzCt1Smd00ipQO8x6o"
const stripe = require('stripe')(stripeSecretKey)
const stripeAPIkey = "pk_test_51MkRVpSCtHJAlS4TBzpVhToTPh3Xa7Qd8Gs9D9wys2nEqSnWITQgj4FUXfqUo4Jeb7q45SxM964Yru1NVA6ttWYY00wJcDwlD9"
const processPayment = async function (req, res, next) {
    try {
        const myPayment = await stripe.paymentIntents.create({
            amount: req.body.amount,
            currency: "inr",
            metadata: {
                company: "VShaal",

            }
        })
        res.status(200).send({ success: true, client_secret: myPayment.client_secret })
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error })
        console.log(error)
    }
}

const sendStripeApikey = async function (req, res, next) {
    try {
        res.status(200).send({ stripeApikey: stripeAPIkey })
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error })
        console.log(error)
    }
}

module.exports = { processPayment, sendStripeApikey }
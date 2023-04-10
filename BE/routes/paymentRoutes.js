const express = require('express')
var router = express.Router()
const paymentControllers = require('../controllers/paymentControllers')
const auth = require("../common/auth")

router.post('/payment/process', auth.validate, paymentControllers.processPayment)

router.get('/stripeapikey', auth.validate, paymentControllers.sendStripeApikey)

module.exports = router;
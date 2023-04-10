const express = require('express')
var router = express.Router()
const orderControllers = require('../controllers/orderControllers')
const auth = require("../common/auth")

router.post('/order/new', auth.validate, orderControllers.placeOrder)

router.get('/order/:id', auth.validate, orderControllers.individualOrder)

router.get('/orders/user', auth.validate, orderControllers.usersOrder)

router.get('/admin/orders', auth.validate, auth.roleAdmin, orderControllers.getAllOrders)

router.put('/admin/order/:id', auth.validate, auth.roleAdmin, orderControllers.updateOrder)

router.delete('/admin/order/:id', auth.validate, auth.roleAdmin, orderControllers.deleteOrder)
module.exports = router;
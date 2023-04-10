const express = require('express')
var router = express.Router()
const productControllers = require('../controllers/productControllers')
const auth = require("../common/auth")

// add new product
router.post('/add-product', auth.validate, auth.roleAdmin, productControllers.createProduct)

// get all products
router.get('/all-products', productControllers.getAllProducts)

// get all products for admin
router.get('/admin/products', auth.validate, auth.roleAdmin, productControllers.getAllProductsAdmin)

//update product
router.put('/product/:id', auth.validate, auth.roleAdmin, productControllers.updateProduct)

// remove product
router.delete('/remove-product/:id', auth.validate, auth.roleAdmin, productControllers.removeProduct)

// get product by id
router.get('/product/:id', productControllers.getproductbyId)

router.put('/product-review', auth.validate, productControllers.createReview)

router.get('/get-product-reviews', auth.validate, productControllers.getAllReviews)

router.delete('/delete-review', auth.validate, auth.roleAdmin, productControllers.deleteReviews)
router
module.exports = router
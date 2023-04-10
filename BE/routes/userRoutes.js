const express = require('express')
var router = express.Router()
const auth = require("../common/auth")


const userControllers = require('../controllers/userControllers')

router.post('/signup', userControllers.signUp)

router.post('/user/login', userControllers.logIn)

router.get('/logout', userControllers.logOut)

router.post('/password/reset', userControllers.forgotPassword)

router.put('/resetpassword/:token', userControllers.resetPassword)

router.get('/profile', auth.validate, userControllers.userDetails)

router.put('/change-password', auth.validate, userControllers.changePassword)

router.put('/profile/update', auth.validate, userControllers.updateProfile)

router.get('/admin/users', userControllers.allUser)

router.get('/admin/user/:id', auth.validate, auth.roleAdmin, userControllers.individualUser)

router.put('/admin/user/:id', auth.validate, auth.roleAdmin, userControllers.updateuserRole)

router.delete('/admin/user/:id', auth.validate, auth.roleAdmin, userControllers.deleteUser)
module.exports = router
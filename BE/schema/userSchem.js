const mongoose = require('mongoose')
const validator = require('validator')
const crypto = require('crypto')
const userSchem = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Enter Name'],
        minLength: [3, "Name should have atlest 3 characters"]
    },
    email: {
        type: String,
        required: [true, 'Please Enter Email'],
        unique: true,
        validate: [validator.isEmail, "Invalid Email"]

    },
    password: {
        type: String,
        required: true,
        minLength: [6, "Password should be greater than 6 characters "],
        select: false,
    },
    profile_img: {
        img_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: "user"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    restPasswordToken: String,
    restPasswordExpire: Date
},
    {
        collection: 'users',
        versionKey: false
    })

//  create password reset token
userSchem.methods.passwordResetToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex')
    const tokenCrypto = crypto.createHash('sha256').update(resetToken).digest('hex')
    //adding reset token to userSchem
    this.restPasswordToken = tokenCrypto
    this.restPasswordExpire = Date.now() + 20 * 60 * 1000
    return resetToken
}

const usersModel = mongoose.model('users', userSchem)
module.exports = { usersModel }
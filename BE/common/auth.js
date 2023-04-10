const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser')
const SALT = 10;
// for web token first install>> npm install jsonwebtoken
const jwt = require('jsonwebtoken')
const secret = 'bodjsldivjoyts)-I'


const HashPassword = async function (password) {
    let salt = await bcrypt.genSalt(SALT)
    // console.log(salt)
    let hash = await bcrypt.hash(password, salt)
    // console.log(hash)
    return hash
}
const hashCompare = async function (password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword)
}

//to create token 
const createToken = async function (payload) {
    let token = await jwt.sign(payload, secret, { expiresIn: '1d' })
    return token
}
const decodeToken = async function (token) {
    let data = await jwt.decode(token)
    return data
}
//validate is middleware to validate token
const validate = async function (req, res, next) {
    // const { token } = req.cookies
    if (req.cookies.token) {
        let data = await decodeToken(req.cookies.token)
        if (Math.round(Date.now() / 1000) <= data.exp) {
            req.user = data
            // console.log(data)
            next()
        }
        else {
            res.status(401).send({ message: "session Expired" })
        }
    }
    else {
        res.status(400).send({ message: "Please Login" })
    }

}
const roleAdmin = async function (req, res, next) {
    if (req.cookies.token) {
        let data = await decodeToken(req.cookies.token)
        if (data.role === 'admin') {
            next()
        }
        else {
            res.status(401).send({ message: "Only Admin can access" })
        }
    }
    else {
        res.status(400).send({ message: 'Please Login ' })
    }

}
module.exports = { HashPassword, hashCompare, createToken, decodeToken, validate, roleAdmin }

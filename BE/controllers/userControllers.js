const { sign } = require('jsonwebtoken')
const { usersModel, passwordResetToken } = require('../schema/userSchem')
const auth = require('../common/auth')
const Sendmail = require('../utils/sendMail')
const crypto = require('crypto')
const { productsModel } = require('../schema/productSchema')
const cloudinary = require('cloudinary').v2
// signUp User
const signUp = async function (req, res, next) {
    try {
        const exist_user = await usersModel.findOne({ email: req.body.email })
        if (!exist_user) {
            const myCloud = await cloudinary.uploader.upload(req.body.avatar, {
                folder: "avatars",
                width: 150,
                crop: "scale",

            })
            req.body.password = await auth.HashPassword(req.body.password)
            const { name, email, password } = req.body
            const user = await usersModel.create({
                name,
                email,
                password,
                profile_img: {
                    img_id: myCloud.public_id,
                    url: myCloud.secure_url
                }
            });
            const token = await auth.createToken({ id: user._id, name: user.name, email: user.email, password: user.password })
            res.status(201).send({
                message: "user added successful", token, user
            })
        } else {
            res.status(400).send({ message: `User with ${req.body.email} already exist` })
        }
        // console.log(token)
    } catch (error) {
        res.status(500).send({ message: "intenal server error", error })
        console.log(error)
    }
}

const logIn = async function (req, res, next) {
    try {
        if (req.body.email && req.body.password) {
            const user = await usersModel.findOne({ email: req.body.email }, "+password")
            // console.log(user)
            // console.log(user.password, req.body.password)
            if (user) {
                if (await auth.hashCompare(req.body.password, user.password)) {
                    //need to create a token
                    let token = await auth.createToken({
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        password: user.password,
                        role: user.role
                    })

                    res.status(200).cookie("token", token).send({ message: "User Login successfull", token, user })


                }
                else {
                    res.status(401).send({ message: "Invalid Password" })
                }
            }
            else {
                res.status(401).send({ message: `User with email ${req.body.email} does not exist` })
            }
        } else {
            res.status(400).send({ message: "Email And Passord Is Required" })
        }


    } catch (error) {
        res.status(500).send({ error, message: "Internal Server Error" })

        console.log(error)
    }
}

const logOut = async function (req, res, next) {
    try {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true
        })

        res.status(200).send({ message: "Logged Out" })
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error })
        console.log(error)
    }
}

const forgotPassword = async function (req, res, next) {
    try {
        const user = await usersModel.findOne({ email: req.body.email })

        if (user) {
            const resetToken = user.passwordResetToken();
            await user.save({ validateBeforeSave: false })

            // const restPasswordUrl = `${req.protocol}://${req.get('host')}/users/resetpassword/${resetToken}`
            const restPasswordUrl = `http://localhost:3000/users/resetpassword/${resetToken}`

            const message = `Your password token is temp:- \n\n ${restPasswordUrl} \n\n If you have not request for reset password then plz ignore this mail.`
            try {
                await Sendmail({
                    email: user.email,
                    subject: "E-commerce password reset",
                    message,
                });

                res.status(200).send({ message: `Email sent to ${user.email} successfully `, success: true })
            } catch (error) {
                user.restPasswordToken = undefined
                user.restPasswordExpire = undefined
                await user.save({ validateBeforeSave: false });
                res.status(500).send({ error })
            }
        } else {
            res.status(404).send({ message: `User with id ${req.body.email} not exist` })
        }
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error })
        console.log(error)
    }
}

const resetPassword = async function (req, res, next) {

    try {
        const restPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

        const user = await usersModel.findOne({ restPasswordToken, restPasswordExpire: { $gt: Date.now() }, })

        if (user) {
            if (req.body.password == req.body.confirmPassword) {
                user.password = await auth.HashPassword(req.body.password)
                user.restPasswordToken = undefined
                user.restPasswordExpire = undefined
                await user.save()
                let token = await auth.createToken({
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    role: user.role
                })

                res.status(200).cookie("token", token).send({ message: "User Login successfull", token, success: true })

            } else {
                res.status(400).send({ message: "Passwords not match" })
            }
        } else {
            res.status(404).send({ message: "Reset Password Token Expired" })
        }
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error })
        console.log(error)
    }
}

const userDetails = async function (req, res, next) {
    try {
        const user = await usersModel.findById(req.user.id)
        res.status(200).send({ user })
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error })
        console.log(error)
    }
}

const changePassword = async function (req, res, next) {
    try {
        const user = await usersModel.findById(req.user.id).select("+password")
        if (await auth.hashCompare(req.body.oldPassword, user.password)) {
            if (req.body.newPassword === req.body.confirmPassword) {
                user.password = await auth.HashPassword(req.body.newPassword)
                user.save()
                let token = await auth.createToken({
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    role: user.role
                })

                res.status(200).cookie("token", token).send({ message: "Password change successfull", success: true })
            } else {
                res.status(400).send({ message: "Password not match" })
            }
        } else {
            res.status(404).send({ message: "Old Password is incorrect" })
        }

    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error })
        console.log(error)
    }
}

const updateProfile = async function (req, res, next) {
    try {
        const newUserDetails = {
            name: req.body.name,
            email: req.body.email,
        }


        if (req.body.avatar !== "") {

            const user = await usersModel.findById(req.user.id);

            const imageId = user.profile_img.img_id;


            await cloudinary.uploader.destroy(imageId);

            const myCloud = await cloudinary.uploader.upload(req.body.avatar, {
                folder: "avatars",
                width: 150,
                crop: "scale",

            })

            newUserDetails.profile_img = {
                img_id: myCloud.public_id,
                url: myCloud.secure_url,

            }




        }


        const user = await usersModel.findByIdAndUpdate(req.user.id, newUserDetails, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        })
        res.status(200).send({
            success: true,
            message: "Profile Updated successfully"
        })
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error })
        console.log(error)
    }
}

// all user list --admin
const allUser = async function (req, res, next) {
    try {
        const users = await usersModel.find()
        res.status(200).send({ TotalUsers: users.length, users })
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error })
        console.log(error)
    }
}

// individual user details --admin
const individualUser = async function (req, res, next) {
    try {
        const user = await usersModel.findById(req.params.id)
        if (user) {
            res.status(200).send({ user })
        } else {
            res.status(400).send({ message: `User with id ${req.params.id} not exist` })
        }

    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error })
        console.log(error)
    }
}

//update role of user by admin
const updateuserRole = async function (req, res, next) {
    try {
        const newUserDetails = {
            name: req.body.name,
            email: req.body.email,
            role: req.body.role
        }

        const user = await usersModel.findByIdAndUpdate(req.params.id, newUserDetails, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        })
        res.status(200).send({ message: "User Role Changed successfully", success: true })
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error })
        console.log(error)
    }
}

//delete user
const deleteUser = async function (req, res, next) {
    try {
        const user = await usersModel.findById(req.params.id)
        if (user) {
            const imageId = user.profile_img.img_id;
            await cloudinary.uploader.destroy(imageId);
            await user.remove()
            res.status(200).send({ message: "User Deleted successfully", success: true })
        } else {
            res.status(400).send({ message: `User with id ${req.params.id} not exist` })
        }
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error })
        console.log(error)
    }
}


module.exports = {
    signUp, logIn, logOut, forgotPassword, resetPassword, userDetails, changePassword, updateProfile, allUser, individualUser, updateuserRole, deleteUser,
}
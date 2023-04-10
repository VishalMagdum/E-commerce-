const { productsModel } = require('../schema/productSchema')
const Webfeatures = require('../utils/webfeatures')
const cloudinary = require('cloudinary').v2
// add new product 
const createProduct = async function (req, res, next) {
    try {

        let image = []

        image = req.body.image



        const imagesLink = []

        for (let index = 0; index < image.length; index++) {
            // console.log("entered")
            const imagestring = image[index]
            const result = await cloudinary.uploader.upload(imagestring, {
                folder: "products",
            })
            // console.log("imageurl", result.url)
            imagesLink.push({
                img_id: result.public_id,
                url: result.secure_url,
            })
        }
        req.body.image = imagesLink
        // console.log(req.body.image)
        req.body.user = req.user.id
        const product = await productsModel.create(req.body);
        res.status(201).send({
            success: true, message: "Product Added successful",
            product
        })
    } catch (error) {
        res.status(500).send({ massege: "Internal Server Error", error })
        console.log(error)
    }
}

// fetch all product
const getAllProducts = async function (req, res, next) {
    try {
        const rows = 8
        const TotalProduct = await productsModel.countDocuments()
        const webFeature = new Webfeatures(productsModel.find(), req.query)
            .search()
            .filter();

        let products = await webFeature.query;
        let filteredProductCount = products.length
        webFeature.pagination(rows)
        products = await webFeature.query.clone()
        res.status(200).send({
            filteredProductCount,
            TotalProduct,
            products,
            rows
        })
    } catch (error) {
        console.log(error)
    }
}

// fetch all product
const getAllProductsAdmin = async function (req, res, next) {
    try {
        const products = await productsModel.find()
        res.status(200).send({
            products, success: true
        })
    } catch (error) {
        console.log(error)
    }
}


//update-product-details
const updateProduct = async function (req, res, next) {

    let productD = await productsModel.findById(req.params.id);
    if (productD) {
        let image = []

        image = req.body.image

        // console.log(image)
        if (image !== undefined) {
            for (let index = 0; index < productD.image.length; index++) {
                await cloudinary.uploader.destroy(
                    productD.image[index].img_id
                )
            }
            const imagesLink = []

            for (let index = 0; index < image.length; index++) {
                const result = await cloudinary.uploader.upload(image[index], {
                    folder: "products",
                })
                imagesLink.push({
                    img_id: result.public_id,
                    url: result.secure_url,
                })
            }

            req.body.image = imagesLink
        }



        let product = await productsModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        })

        return res.status(200).send({ message: "Update Successful", product, success: true })
    }
    else {
        res.status(400).send({ message: "Product Not Found" })
    }

}

//remove-product
const removeProduct = async function (req, res, next) {
    try {
        let productD = await productsModel.findById(req.params.id);
        if (productD) {
            for (let index = 0; index < productD.image.length; index++) {
                await cloudinary.uploader.destroy(
                    productD.image[index].img_id
                )
            }
            let product = await productsModel.findByIdAndDelete(req.params.id)


            return res.status(200).send({ message: "Delete Successful", product, success: true })
        }
        else {
            res.status(400).send({ message: "Product Not Found" })
        }

    } catch (error) {

        res.status(500).send({ message: "Internal Server Error", error })
        console.log(error)
    }

}

const getproductbyId = async function (req, res, next) {
    try {
        let product = await productsModel.findById(req.params.id)
        if (product) {
            return res.status(200).send({ product })
        } else {
            res.status(400).send({ message: "Product Not Found" })
        }
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error })
    }
}

// reviews
const createReview = async function (req, res, next) {
    try {
        const { rating, comment, productId } = req.body

        const review = {
            user: req.user.id,
            name: req.user.name,
            rating: Number(rating),
            comment,
        }
        // console.log(review)
        const product = await productsModel.findById(productId)
        // console.log(product)
        // console.log(product.reviews);
        const isReviewed = product.reviews.find(
            (el) => el.user.toString() === req.user.id.toString()
        );
        // console.log(isReviewed)
        if (isReviewed) {
            product.reviews.forEach((el) => {
                if (el.user.toString() === req.user.id.toString()) {
                    (el.rating = rating),
                        (el.comment = comment);
                }
            })
        } else {
            product.reviews.push(review)

        }
        let sum = 0
        product.reviews.forEach((el) => {
            sum += el.rating
        })
        product.ratings = sum /
            product.reviews.length
        await product.save({ validateBeforeSave: false });

        res.status(200).send({ message: "rating added", success: true })
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error })
        console.log(error)
    }
}

const getAllReviews = async function (req, res, next) {
    try {
        const product = await productsModel.findById(req.query.id)

        if (product) {
            res.status(200).send({ reviews: product.reviews, totalReviews: product.reviews.length })
        } else {
            res.status(400).send({ message: "Product Not Found" })
        }
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error })
    }
}

const deleteReviews = async function (req, res, next) {
    try {
        const product = await productsModel.findById(req.query.productId);
        console.log(product)
        if (product) {
            const reviews = product.reviews.filter(
                (el) => el._id.toString() !== req.query.id.toString()
            );
            let sum = 0;
            reviews.forEach((el) =>
                sum += el.rating
            )
            const ratings = sum / reviews.length;

            await productsModel.findByIdAndUpdate(req.query.productId, {
                reviews,
                ratings,
            }, {
                new: true,
                runValidators: true,
                useFindAndModify: false
            })

            res.status(200).send({ message: "Review Deleted" })
        } else {
            res.status(400).send({ message: "Product Not Found" })
        }
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error })
        console.log(error)
    }
}

module.exports = { getAllProducts, createProduct, updateProduct, removeProduct, getproductbyId, createReview, getAllReviews, deleteReviews, getAllProductsAdmin }




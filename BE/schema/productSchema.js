const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name Required"],
        trim: true
    },
    image: [
        {
            img_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    description: {
        type: String,
        required: [true, "Description Required"]
    },
    category: {
        type: String,
        required: [true, "Catagory Required"]

    },
    price: {
        type: Number,
        required: [true, "Price Required"]
    },
    stock: {
        type: Number,
        required: [true, "Stock Required"],
        default: 1
    },
    ratings: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "users",
                required: true
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "users",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

},
    {
        collection: 'products',
        versionKey: false
    }
)

const productsModel = mongoose.model('products', productSchema)
module.exports = { productsModel }
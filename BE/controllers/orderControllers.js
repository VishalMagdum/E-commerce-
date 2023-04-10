
const { productsModel } = require('../schema/productSchema')
const auth = require('../common/auth');
const { ordersModel } = require('../schema/orderSchema');


const placeOrder = async function (req, res, next) {
    try {
        const { shippingInfo,
            orderProducts,
            paymentInfo,
            productsPrice,
            taxPrice,
            shippingPrice,
            totalPrice, } = req.body;
        const order = await ordersModel.create({
            shippingInfo,
            orderProducts,
            paymentInfo,
            productsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paidAt: Date.now(),
            user: req.user.id,
        });
        res.status(201).send({ message: "Order Placed successfully", order, success: true })
    } catch (error) {
        res.status(500).send({ message: "Interal Server Error", error })
        console.log(error)
    }
}

// get individual order details
const individualOrder = async function (req, res, next) {
    try {
        const order = await ordersModel.findById(req.params.id).populate("user", "name email")
        if (!order) {
            return res.status(400).send({ message: "Order Not Found" })
        }
        res.status(200).send({ order })
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error })
        console.log(error)
    }
}

// get users order details
const usersOrder = async function (req, res, next) {
    try {
        const orders = await ordersModel.find({ user: req.user.id })

        res.status(200).send({ orders })
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error })
        console.log(error)
    }
}
// all orders for admin
const getAllOrders = async function (req, res, next) {
    try {
        const orders = await ordersModel.find();
        let totalAmount = 0;
        orders.forEach((el) =>
            totalAmount += el.totalPrice)
        res.status(200).send({ orders, totalAmount })
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error })
        console.log(error)
    }
}

//update order status
const updateOrder = async function (req, res, next) {
    try {
        const order = await ordersModel.findById(req.params.id);
        if (!order) {
            return res.status(400).send({ message: "Order Not Found" })
        }
        if (order.orderStatus === "Delivered") {
            return res.status(400).send({ message: "Order Delivered Already" })
        }
        if (req.body.status === "Shipped") {
            order.orderProducts.forEach(async (el) => {
                await updateStock(el.product, el.quantity)
            })
        }

        order.orderStatus = req.body.status;
        if (req.body.status === "Delivered") {
            order.deliveredAt = Date.now();
        }
        await order.save({ validateBeforeSave: false })
        res.status(200).send({ order, success: true })
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error })
        console.log(error)
    }
}

async function updateStock(id, quantity) {
    const product = await productsModel.findById(id);
    // console.log(product)
    product.stock = product.stock - quantity;
    await product.save({ validateBeforeSave: false })
}


// delete order for admin
const deleteOrder = async function (req, res, next) {
    try {
        const order = await ordersModel.findById(req.params.id)
        if (!order) {
            return res.status(400).send({ message: "Order Not Found" })
        }
        await order.remove()
        res.status(200).send({ message: "order deleted", success: true })
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error })
        console.log(error)
    }
}
module.exports = { placeOrder, individualOrder, usersOrder, getAllOrders, updateOrder, deleteOrder }
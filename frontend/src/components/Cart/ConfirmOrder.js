import React from 'react'
import ChechoutSteps from './ChechoutSteps'
import { useSelector } from 'react-redux'
import Metadata from '../layout/Metadata'
import './ConfirmOrder.css'
import { Link, useNavigate } from 'react-router-dom'
import { Typography } from '@material-ui/core'
function ConfirmOrder() {
    const navigate = useNavigate()
    const { shippingInfo, cartItems } = useSelector((state) => state.cart)
    const { user } = useSelector((state) => state.user)

    const subtotal = cartItems.reduce(
        (acc, item) => acc + item.quantity * item.price, 0
    )
    const tax = subtotal * 0.18
    const shippingCharhes = Number(subtotal > 1000 ? 0 : 100)
    const totalPrice = subtotal + shippingCharhes + tax
    const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pincode}, ${shippingInfo.country}`
    const proceedToPayment = () => {
        const data = {
            subtotal,
            shippingCharhes,
            tax,
            totalPrice,
        };
        sessionStorage.setItem("orderInfo", JSON.stringify(data))
        navigate("/process/payment")
    }
    return (
        <>
            <Metadata title="Confirm Order" />
            <ChechoutSteps activeStep={1} />
            <div className='confirmOrderPage'>
                <div>
                    <div className='confirmshippingArea'>
                        <Typography>Shipping Info</Typography>
                        <div className='confirmshippingAreaBox'>
                            <div>
                                <p>Name:</p>
                                <span>{user.name}</span>
                            </div>
                            <div>
                                <p>Phone:</p>
                                <span>{shippingInfo.phoneNo}</span>
                            </div>
                            <div>
                                <p>Address:</p>
                                <span>{address}</span>
                            </div>
                        </div>
                    </div>
                    <div className='confirmCartItems'>
                        <Typography>Your Cart Item:</Typography>
                        <div className='confirmCartItemsContainer'>
                            {cartItems && cartItems.map((item) => (
                                <div key={item.product}>
                                    <img src={item.image} alt="Product" />
                                    <Link to={`/product/${item.product}`}>
                                        {item.name}</Link>
                                    <span>{item.quantity} X ₹{item.price}={""}
                                        <b>₹{item.price * item.quantity}</b>
                                    </span>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
                <div>
                    <div className='orderSummary'>
                        <Typography>Order Summery</Typography>
                        <div>
                            <div>
                                <p>Subtotal:</p>
                                <span>₹{subtotal}</span>
                            </div>
                            <div>
                                <p>Shipping Charges:</p>
                                <span>₹{shippingCharhes}</span>
                            </div>
                            <div>
                                <p>GST:</p>
                                <span>₹{tax}</span>
                            </div>
                        </div>

                        <div className='orderSummaryTotal'>
                            <p>
                                <b>Total:</b>
                            </p>
                            <span>₹{totalPrice}</span>
                        </div>
                        <button onClick={proceedToPayment}>Proceed To Payment</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ConfirmOrder
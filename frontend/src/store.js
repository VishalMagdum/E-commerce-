import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import {
    newProductReducer,
    productReducer,
    productsReducer,
    productDetailsReducer,
    newReviewReducer
} from './reducers/productReducer';

import { cartReducer } from "./reducers/cartReducer"

import {
    userReducer,
    allUsersReducer,
    profileReducer,
    forgotPasswordReducer,
    userDetailsReducer,
} from './reducers/userReducer'
import { allOrdersReducer, myOrdersReducer, newOrderReducer, orderDetailsReducer, ordersReducer } from './reducers/orderReducer';
const reducer = combineReducers({
    products: productsReducer,
    productDetails: productDetailsReducer,
    user: userReducer,
    allUsers: allUsersReducer,
    profile: profileReducer,
    forgotPassword: forgotPasswordReducer,
    cart: cartReducer,
    newOrder: newOrderReducer,
    myOrders: myOrdersReducer,
    orderDetails: orderDetailsReducer,
    newReview: newReviewReducer,
    newProduct: newProductReducer,
    product: productReducer,
    allOrders: allOrdersReducer,
    order: ordersReducer,
    userDetails: userDetailsReducer,

});

let initialState = {
    cart: {
        cartItems: localStorage.getItem("cartItems") ?
            JSON.parse(localStorage.getItem("cartItems"))
            : [],
        shippingInfo: localStorage.getItem('shippingInfo') ? JSON.parse(localStorage.getItem("shippingInfo")) : {}
    }
}

const middlerware = [thunk];
const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middlerware))
);
export default store;

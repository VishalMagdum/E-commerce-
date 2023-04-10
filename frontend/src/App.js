import './App.css';
import React from 'react';
import Header from "./components/layout/Header/Header";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WebFont from 'webfontloader';
import Footer from './components/layout/Footer/Footer.js'
import Home from './components/Home/Home';
import ProductDetails from './components/Product/ProductDetails'
import Products from './components/Product/Products';
import Search from './components/Product/Search';
import LoginSignUp from './components/User/LoginSignUp';
import store from './store'
import { loadUser } from './actions/userAction';
import UserOptions from './components/layout/Header/UserOptions';
import { useSelector } from 'react-redux';
import Profile from './components/User/Profile';
import ProtectedRoute from './components/Route/ProtectedRoute';
import UpdateProfile from './components/User/UpdateProfile';
import UpdatePassword from './components/User/UpdatePassword';
import ForgotPassword from './components/User/ForgotPassword';
import ResetPassword from './components/User/ResetPassword';
import Cart from './components/Cart/Cart';
import Shipping from './components/Cart/Shipping';
import ConfirmOrder from './components/Cart/ConfirmOrder';
import Payment from './components/Cart/Payment';
import axios from 'axios';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import OrderSuccess from './components/Cart/OrderSuccess';
import MyOrders from './components/Order/MyOrders';
import OrderDetails from './components/Order/OrderDetails';
import Dashboard from './components/Admin/Dashboard';
import ProductList from './components/Admin/ProductList';
import NewProduct from './components/Admin/NewProduct';
import UpdateProduct from './components/Admin/UpdateProduct';
import OrderList from './components/Admin/OrderList';
import ProcessOrder from './components/Admin/ProcessOrder';
import UsersList from './components/Admin/UsersList';
import UpdateUser from './components/Admin/UpdateUser';
import ProductReviews from './components/Admin/ProductReviews';
function App() {

  const { isAuthenticated, user } = useSelector(state => state.user)

  const [stripeApikey, setStripeApikey] = React.useState("")
  async function getStripeApikey() {
    const { data } = await axios.get("/payment/stripeapikey");
    setStripeApikey(data.stripeApikey)
    console.log("stripe key ", data.stripeApikey)

  }
  React.useEffect(() => {

    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"]
      }
    });
    store.dispatch(loadUser())
    getStripeApikey()
  }, []);

  // // Disable right-click
  // document.addEventListener('contextmenu', (e) => e.preventDefault());

  // function ctrlShiftKey(e, keyCode) {
  //   return e.ctrlKey && e.shiftKey && e.keyCode === keyCode.charCodeAt(0);
  // }

  // document.onkeydown = (e) => {
  //   // Disable F12, Ctrl + Shift + I, Ctrl + Shift + J, Ctrl + U
  //   if (
  //     e.keyCode === 123 ||
  //     ctrlShiftKey(e, 'I') ||
  //     ctrlShiftKey(e, 'J') ||
  //     ctrlShiftKey(e, 'C') ||
  //     (e.ctrlKey && e.keyCode === 'U'.charCodeAt(0))
  //   )
  //     return false;
  // };
  return (
    <BrowserRouter>


      <Header />
      {isAuthenticated && <UserOptions user={user} />}
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/product/:id" element={<ProductDetails />} />
        <Route exact path="/products/product/:id" element={<ProductDetails />} />
        <Route exact path="/products" element={<Products />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route path="/account" element={<ProtectedRoute />}>
          <Route path="/account" element={<Profile />} />
        </Route>
        <Route exact path="/search" element={<Search />} />
        <Route exact path="/login" element={<LoginSignUp />} />

        <Route path="/me/update" element={<ProtectedRoute />}>
          <Route path="/me/update" element={<UpdateProfile />} />
        </Route>

        <Route path="/password/update" element={<ProtectedRoute />}>
          <Route path="/password/update" element={<UpdatePassword />} />
        </Route>

        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/users/resetpassword/:token" element={<ResetPassword />} />
        <Route path="/cart" element={<Cart />} />

        <Route path='/login/shipping' element={<ProtectedRoute />}>
          <Route path='/login/shipping' element={<Shipping />} />
        </Route>

        <Route path='/order/confirm' element={<ProtectedRoute />}>
          <Route path='/order/confirm' element={<ConfirmOrder />} />
        </Route>




        {stripeApikey && (
          <Route path='/process/payment' element={<ProtectedRoute />}>
            <Route path='/process/payment' element={
              <Elements stripe={loadStripe(stripeApikey)}><Payment /> </Elements>
            } />

          </Route>)}

        <Route path='/success' element={<ProtectedRoute />}>
          <Route path='/success' element={<OrderSuccess />} />
        </Route>

        <Route path='/orders' element={<ProtectedRoute />}>
          <Route path='/orders' element={< MyOrders />} />
        </Route>

        <Route path='/order/:id' element={<ProtectedRoute />}>
          <Route path='/order/:id' element={< OrderDetails />} />
        </Route>

        <Route isAdmin={true} path='/admin/dashboard' element={<ProtectedRoute />}>
          <Route path='/admin/dashboard' element={< Dashboard />} />
        </Route>

        <Route isAdmin={true} path='/admin/products' element={<ProtectedRoute />}>
          <Route path='/admin/products' element={< ProductList />} />
        </Route>

        <Route isAdmin={true} path='/admin/product' element={<ProtectedRoute />}>
          <Route path='/admin/product' element={< NewProduct />} />
        </Route>

        <Route isAdmin={true} path='/admin/product/:id' element={<ProtectedRoute />}>
          <Route path='/admin/product/:id' element={< UpdateProduct />} />
        </Route>

        <Route isAdmin={true} path='/admin/orders' element={<ProtectedRoute />}>
          <Route path='/admin/orders' element={< OrderList />} />
        </Route>

        <Route isAdmin={true} path='/admin/order/:id' element={<ProtectedRoute />}>
          <Route path='/admin/order/:id' element={< ProcessOrder />} />
        </Route>

        <Route isAdmin={true} path='/admin/users' element={<ProtectedRoute />}>
          <Route path='/admin/users' element={< UsersList />} />
        </Route>

        <Route isAdmin={true} path='/admin/user/:id' element={<ProtectedRoute />}>
          <Route path='/admin/user/:id' element={< UpdateUser />} />
        </Route>

        {/* <Route isAdmin={true} path='/admin/reviews' element={<ProtectedRoute />}> */}
        <Route path='/admin/reviews' element={< ProductReviews />} />
        {/* </Route> */}


      </Routes>
      <Footer />
    </BrowserRouter>
  );


}

export default App;

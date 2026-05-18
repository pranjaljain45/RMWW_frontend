import React from 'react';
import { Router, Routes, Route } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';


//Footer sections
import Aboutww from './pages/FooterLinks/AboutCompany';
import ContactUs from './pages/FooterLinks/ContactUs';
import Faqs from './pages/FooterLinks/Faqs';
import TnC from './pages/FooterLinks/TnC';
import PrivacyPolicies from './pages/FooterLinks/PrivacyPolicy';


// user dashboard
import UserAccount from './pages/UserDashboard/Dashboard';
import UserProfile from './pages/UserDashboard/UserProfile';
import UserAddress from './pages/UserDashboard/UserAddress';
import UserOrders from './pages/UserDashboard/UserOrders';


import RentWear from './pages/RentWear';
import ProductDisplay from './pages/ProductDisplay';
import RelatedProductDisplay from './components/RelatedProductDisplay';


import CartSummary from './pages/CartSummary';
import Checkout from './pages/Checkout';
import OrderSummary from './pages/OrderSummary';

const App = () => {

  return (

    <>
      <ToastContainer />

      <Routes>

        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />

        <Route path="/myaccount" element={<UserAccount />}>
          <Route path="profile" element={<UserProfile />} />
          <Route path="address" element={<UserAddress />} />
          <Route path="orders" element={<UserOrders />} />
        </Route>

        <Route path="/:gender/:category/:subcategory" element={<RentWear />} />
        <Route path="/product/:id" element={<ProductDisplay />} />
        <Route path="/:gender/:category/:subcategory/:id" element={<RelatedProductDisplay />} />

        <Route path='/cartsummary' element={<CartSummary />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route path='/orderSummary' element={<OrderSummary />} />

        {/* footer link */}
        <Route path='/AboutCompany' element={<Aboutww />} />
        <Route path='/ContactUs' element={<ContactUs />} />
        <Route path='/Faqs' element={<Faqs />} />
        <Route path='/privacypolicies' element={<PrivacyPolicies />} />
        <Route path='/TnC' element={<TnC />} />

      </Routes>

    </>
  );
}

export default App;
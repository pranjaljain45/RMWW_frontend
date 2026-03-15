import React from 'react';
import { Router, Routes, Route } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from './pages/Home';
import Search from './components/SeachOverlay';
import Login from './pages/Login';
import Signup from './pages/Signup';


// Footer section
import AboutWedsWardrobe from './pages/FooterLinks/OurProfile';
import ContactUs from './pages/FooterLinks/ContactUs';
import Faqs from './pages/FooterLinks/Faqs';
import TnC from './pages/FooterLinks/TnC';
import PrivacyPolicies from './pages/FooterLinks/PrivacyPolicies'


// user dashboard
import MyAccount from './pages/UserDashboard/Dashboard';
import Profile from './pages/UserDashboard/Profile';
import Address from './pages/UserDashboard/Address';
import Orders from './pages/UserDashboard/Orders';


import ProductDisplay from './pages/ProductDisplay';
import GenderRedirect from './pages/GenderRedirect';
import RentWear from './pages/RentWear';
import RelatedProductDisplay from './components/RelatedProductDiplay';

import Cart from './pages/Cart';
import PlaceOrder from './pages/PlaceOrder';
import OrderSummary from './pages/OrderSummary';


const App = () => {

  return (

    <>
      <ToastContainer />

      <Routes>

        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/Search' element={Search} />

        <Route path="/:gender/:category/:subcategory" element={<RentWear />} />
        <Route path='/:gender/:category/:subcategory/:id' element={<RelatedProductDisplay />} />

        <Route path="/myaccount" element={<MyAccount />}>
          <Route path="profile" element={<Profile />} />
          <Route path="address" element={<Address />} />
          <Route path="orders" element={<Orders />} />
        </Route>

        <Route path='/productDisplay' element={<ProductDisplay />} />

        <Route path='/cart' element={<Cart />} />
        <Route path='/placeorder' element={<PlaceOrder />} />
        <Route path='/orderSummary' element={<OrderSummary />} />


        {/* footer link */}
        <Route path='/OurProfile' element={<AboutWedsWardrobe />} />
        <Route path='/ContactUs' element={<ContactUs />} />
        <Route path='/Faqs' element={<Faqs />} />
        <Route path='/privacypolicies' element={<PrivacyPolicies />} />
        <Route path='/TnC' element={<TnC />} />

      </Routes>

    </>
  );
}

export default App;
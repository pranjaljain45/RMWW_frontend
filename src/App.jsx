import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';



// General Pages
import Home from './pages/Home';
import ProductDisplay from './pages/ProductDisplay/ProductDisplay';
import GenderRedirect from './pages/GenderRedirect';
import MyAccount from './pages/UserDashboard/Dashboard';
import Profile from './pages/UserDashboard/Profile';
import Address from './pages/UserDashboard/Address';
import Orders from './pages/UserDashboard/Orders';


import ViewBag from './pages/ViewBag/ViewBag';
import OrderSummary from './pages/OrderSummary/OrderSummary';

// Men
// Men Accessories
import MenTiesBowTies from './pages/Men/Accessories/TiesBowTies';
import MenNecklace from './pages/Men/Accessories/Necklaces';

// Men Dresses
import Bandhgalas from './pages/Men/Dresses/Bandhgalas';
import KurtaPajamas from './pages/Men/Dresses/KurtaPajamas';
import Suits from './pages/Men/Dresses/Suits';
import IndoWesterns from './pages/Men/Dresses/IndoWesterns';

// Men Occasions
import MenEngagement from './pages/Men/Occasions/Engagement';
import MenCocktail from './pages/Men/Occasions/Cocktail';
import MenHaldi from './pages/Men/Occasions/Haldi';
import MenMehendi from './pages/Men/Occasions/Mehendi';
import MenReception from './pages/Men/Occasions/Reception';
import MenSangeet from './pages/Men/Occasions/Sangeet';
import MenWedding from './pages/Men/Occasions/Wedding';


// Women
// Women Accessories
import WomenBags from './pages/Women/Accessories/Bags';
import WomenBanglesBracelets from './pages/Women/Accessories/BanglesBracelets'
import WomenEarrings from './pages/Women/Accessories/Earrings';
import WomenNecklaces from './pages/Women/Accessories/Necklaces';
import WomenRings from './pages/Women/Accessories/Rings';

// Women Dresses
import WomenLehengas from './pages/Women/Dresses/Lehengas';
import WomenGowns from './pages/Women/Dresses/Gowns';
import WomenSareesBlouses from './pages/Women/Dresses/SareesBlouses';
import WomenIndoWestern from './pages/Women/Dresses/IndoWestern';
import WomenAnarkali from './pages/Women/Dresses/Anarkalis';


// Women Occasions
import WomenCocktail from './pages/Women/WomenOccasions/Cocktail';
import WomenEngagement from './pages/Women/WomenOccasions/Engagement';
import WomenHaldi from './pages/Women/WomenOccasions/Haldi';
import WomenMehendi from './pages/Women/WomenOccasions/Mehendi';
import WomenReception from './pages/Women/WomenOccasions/Reception';
import WomenSangeet from './pages/Women/WomenOccasions/Sangeet';
import WomenWedding from './pages/Women/WomenOccasions/Wedding';


//authentication
import LoginPage from './pages/LoginPage/Login';
import SignupPage from './pages/SignupPage/Signup';
import ResetPassword from './pages/ResetPassword';


//about us section
import CompanyProfile from './pages/FooterSection/CompanyProfile/CompanyProfile';
import ContactUs from './pages/FooterSection/ContactUs/Contactus';
import Faqs from './pages/FooterSection/Faqs/Faqs';
import PrivacyPolicies from './pages/FooterSection/PrivacyPolicies/PrivacyPolicies';
import TermsAndConditions from './pages/FooterSection/TermsAndConditions/TermsAndConditions';



const App = () => {

  return (
    <Routes>
      {/* General Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/productDisplay" element={<ProductDisplay />} />
      <Route path="/women" element={<GenderRedirect />} />
      <Route path="/men" element={<GenderRedirect />} />

      <Route path="/myaccount" element={<MyAccount />}>
        <Route path="profile" element={<Profile />} />
        <Route path="address" element={<Address />} />
        <Route path="orders" element={<Orders />} />
      </Route>


      <Route path='/viewbag' element={<ViewBag />} />
      <Route path='/ordersummary' element={<OrderSummary />} />



      {/* footer link */}
      <Route path='/companyprofile' element={<CompanyProfile />} />
      <Route path='/contactus' element={<ContactUs />} />
      <Route path='/faqs' element={<Faqs />} />
      <Route path='/privacypolicies' element={<PrivacyPolicies />} />
      <Route path='/termsandconditions' element={<TermsAndConditions />} />


      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path='/signup' element={<SignupPage />} />
      <Route path='/resetpassword' element={<ResetPassword />} />


      {/* Men's Routes */}
      {/* Men's Dresses */}
      <Route path="/men/dresses/bandhgalas" element={<Bandhgalas />} />
      <Route path="/men/dresses/KurtaPajamas" element={<KurtaPajamas />} />
      <Route path="/men/dresses/suits" element={<Suits />} />
      <Route path='/men/dresses/indo-westerns' element={<IndoWesterns />} />;


      {/* Men's Accessories */}
      <Route path="/men/accessories/ties-bow-ties" element={<MenTiesBowTies />} />
      <Route path="/men/accessories/necklace" element={<MenNecklace />} />

      {/* Men's Occasions */}
      <Route path="/men/occasions/engagement" element={<MenEngagement />} />
      <Route path="/men/occasions/cocktail" element={<MenCocktail />} />
      <Route path="/men/occasions/haldi" element={<MenHaldi />} />
      <Route path="/men/occasions/mehendi" element={<MenMehendi />} />
      <Route path="/men/occasions/reception" element={<MenReception />} />
      <Route path="/men/occasions/sangeet" element={<MenSangeet />} />
      <Route path="/men/occasions/wedding" element={<MenWedding />} />


      {/* Women's Routes */}
      {/* Women's Dresses */}
      <Route path="/women/dresses/lehengas" element={<WomenLehengas />} />
      <Route path="/women/dresses/gowns" element={<WomenGowns />} />
      <Route path="/women/dresses/sarees-blouses" element={<WomenSareesBlouses />} />
      <Route path="/women/dresses/indo-western" element={<WomenIndoWestern />} />
      <Route path="/women/dresses/anarkalis" element={<WomenAnarkali />} />


      {/* Women's Accessories */}
      <Route path="/women/accessories/bags" element={<WomenBags />} />
      <Route path="/women/accessories/bangles-bracelets" element={<WomenBanglesBracelets />} />
      <Route path="/women/accessories/earrings" element={<WomenEarrings />} />
      <Route path="/women/accessories/necklaces" element={<WomenNecklaces />} />
      <Route path="/women/accessories/rings" element={<WomenRings />} />


      {/* Women's Occasions */}
      <Route path="/women/occasions/cocktail" element={<WomenCocktail />} />
      <Route path="/women/occasions/engagement" element={<WomenEngagement />} />
      <Route path="/women/occasions/haldi" element={<WomenHaldi />} />
      <Route path="/women/occasions/mehendi" element={<WomenMehendi />} />
      <Route path="/women/occasions/reception" element={<WomenReception />} />
      <Route path="/women/occasions/sangeet" element={<WomenSangeet />} />
      <Route path="/women/occasions/wedding" element={<WomenWedding />} />


    </Routes>
  );
}

export default App;
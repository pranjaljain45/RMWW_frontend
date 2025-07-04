import React, { useState, useEffect, useRef, useContext } from 'react';
import img from '../../assets/headerimg.jpg';
import './Header.css';
import { useNavigate, Link } from 'react-router-dom';
import SearchOverlay from '../SearchOverlay/SearchOverlay';
import CartDrawer from '../SideCart/CartDrawer';
import { CartContext } from '../CartContext/CartContext';
import { getAuth } from "firebase/auth";

const Header = () => {
    const [showSearch, setShowSearch] = useState(false);
    const [showCart, setShowCart] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 800);

    const { cartItems } = useContext(CartContext);
    const cartCount = cartItems.length;

    const navigate = useNavigate();

    const dropdownRef = useRef(null);
    const menuRef = useRef(null);

    const handleRedirect = (path) => {
        if (path === '/search') setShowSearch(true);
        else if (path === '/cart') setShowCart(true);
        else navigate(path);
    };

    const toggleDropdown = (menuName) => {
        if (isMobileView) {
            setOpenDropdown(prev => (prev === menuName ? null : menuName));
        }
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth <= 800);
            setOpenDropdown(null);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                isMobileView &&
                dropdownRef.current &&
                menuRef.current &&
                !dropdownRef.current.contains(e.target) &&
                !menuRef.current.contains(e.target)
            ) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isMobileView]);

    return (
        <>
            {/* Banner */}
            <div className="headerBanner">
                <img src={img} alt="Header Background" className="backgroundImage" />
                <div className="centeredQuote">
                    <h1 className="brandName">RentMyWeddingWear</h1>
                    <p className="tagline">Style. Smile. Send Back.</p>
                </div>
            </div>

            {/* Navigation */}
            <div className="div1">
                {/* Logo */}
                <div className="nameOfWebsite">
                    <h3>RentMy</h3>
                    <h2>Wedding</h2>
                    <h3>Wear</h3>
                </div>

                {/* Categories */}
                <div className="categories">

                    <div className="dropdown" ref={dropdownRef}>
                        <span className="dropbtn" onClick={() => toggleDropdown('women')}>
                            WomenWear
                        </span>
                        <div
                            className={`mega-menu ${openDropdown === 'women' ? 'show clicked' : ''}`}
                            ref={menuRef}
                        >
                            <div className="column">
                                <h4>CLOTHING</h4>
                                <p onClick={() => handleRedirect('/women/dresses/lehengas')}>Lehengas</p>
                                <p onClick={() => handleRedirect('/women/dresses/gowns')}>Gowns</p>
                                <p onClick={() => handleRedirect('/women/dresses/anarkalis')}>Anarkalis</p>
                                <p onClick={() => handleRedirect('/women/dresses/sarees-blouses')}>Sarees & Blouses</p>
                                <p onClick={() => handleRedirect('/women/dresses/indo-western')}>Indo-Western</p>
                            </div>
                            <div className="column">
                                <h4>ACCESSORIES</h4>
                                <p onClick={() => handleRedirect('/women/accessories/earrings')}>Earrings</p>
                                <p onClick={() => handleRedirect('/women/accessories/necklaces')}>Necklaces</p>
                                <p onClick={() => handleRedirect('/women/accessories/bangles-bracelets')}>Bangles & Bracelets</p>
                                <p onClick={() => handleRedirect('/women/accessories/rings')}>Rings</p>
                                <p onClick={() => handleRedirect('/women/accessories/bags')}>Bags</p>
                            </div>
                            <div className="column">
                                <h4>OCCASIONS</h4>
                                <p onClick={() => handleRedirect('/women/occasions/engagement')}>Engagement</p>
                                <p onClick={() => handleRedirect('/women/occasions/mehendi')}>Mehendi</p>
                                <p onClick={() => handleRedirect('/women/occasions/haldi')}>Haldi</p>
                                <p onClick={() => handleRedirect('/women/occasions/sangeet')}>Sangeet</p>
                                <p onClick={() => handleRedirect('/women/occasions/cocktail')}>Cocktail</p>
                                <p onClick={() => handleRedirect('/women/occasions/wedding')}>Wedding</p>
                                <p onClick={() => handleRedirect('/women/occasions/reception')}>Reception</p>
                            </div>
                        </div>
                    </div>

                    {/* MenWear */}
                    <div className="dropdown">
                        <span className="dropbtn" onClick={() => toggleDropdown('men')}>
                            MenWear
                        </span>
                        <div className={`mega-menu ${openDropdown === 'men' ? 'show clicked' : ''}`}>
                            <div className="column">
                                <h4>CLOTHING</h4>
                                <p onClick={() => handleRedirect('/men/dresses/bandhgalas')}>Bandhgalas</p>
                                <p onClick={() => handleRedirect('/men/dresses/KurtaPajamas')}>Kurta Pajamas</p>
                                <p onClick={() => handleRedirect('/men/dresses/suits')}>Suits</p>
                                <p onClick={() => handleRedirect('/men/dresses/indo-westerns')}>IndoWesterns</p>
                            </div>
                            <div className="column">
                                <h4>ACCESSORIES</h4>
                                <p onClick={() => handleRedirect('/men/accessories/ties-bow-ties')}>Ties & Bow Ties</p>
                                <p onClick={() => handleRedirect('/men/accessories/necklace')}>Necklace</p>
                            </div>
                            <div className="column">
                                <h4>OCCASIONS</h4>
                                <p onClick={() => handleRedirect('/men/occasions/engagement')}>Engagement</p>
                                <p onClick={() => handleRedirect('/men/occasions/mehendi')}>Mehendi</p>
                                <p onClick={() => handleRedirect('/men/occasions/haldi')}>Haldi</p>
                                <p onClick={() => handleRedirect('/men/occasions/sangeet')}>Sangeet</p>
                                <p onClick={() => handleRedirect('/men/occasions/cocktail')}>Cocktail</p>
                                <p onClick={() => handleRedirect('/men/occasions/wedding')}>Wedding</p>
                                <p onClick={() => handleRedirect('/men/occasions/reception')}>Reception</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Icons */}
                <div className="iconContainer">
                    <i className="fas fa-search icon" onClick={() => handleRedirect('/search')} title="Search"></i>
                    <i
                        className="far fa-user icon1"
                        title="My Account"
                        onClick={() => {
                            const auth = getAuth();
                            const user = auth.currentUser;
                            if (user) navigate("/myaccount");
                            else navigate("/login");
                        }}
                    ></i>
                    <Link to="#" onClick={() => setShowCart(true)} className="cart-icon">
                        <i className="fas fa-shopping-bag icon" title="Cart"></i>
                        {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                    </Link>
                </div>
            </div>

            {/* Overlays */}
            {showSearch && <SearchOverlay onClose={() => setShowSearch(false)} />}
            {showCart && <CartDrawer onClose={() => setShowCart(false)} />}
        </>
    );
};

export default Header;

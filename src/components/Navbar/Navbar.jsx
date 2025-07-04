import React, { useState, useEffect, useRef, useContext } from 'react';
import './Navbar.css';
import { useNavigate, Link } from 'react-router-dom';
import SearchOverlay from '../SearchOverlay/SearchOverlay';
import CartDrawer from '../SideCart/CartDrawer';
import { CartContext } from '../CartContext/CartContext';
import { getAuth } from "firebase/auth";

const Navbar = () => {
    const [showSearch, setShowSearch] = useState(false);
    const [showCart, setShowCart] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 800);


    const { cartItems } = useContext(CartContext);
    const cartCount = JSON.parse(localStorage.getItem("cart"))?.length || 0;

    const navigate = useNavigate();

    const handleRedirect = (path) => {
        if (path === '/search') setShowSearch(true);
        else if (path === '/cart') setShowCart(true);
        // else if (path === '/login') setShowCart(true);
        else navigate(path);
    };


    const womenDropdownRef = useRef(null);
    const womenMenuRef = useRef(null);
    const menDropdownRef = useRef(null);
    const menMenuRef = useRef(null);


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
            if (isMobileView) {
                if (
                    openDropdown === 'women' &&
                    womenDropdownRef.current &&
                    womenMenuRef.current &&
                    !womenDropdownRef.current.contains(e.target) &&
                    !womenMenuRef.current.contains(e.target)
                ) {
                    setOpenDropdown(null);
                }
                if (
                    openDropdown === 'men' &&
                    menDropdownRef.current &&
                    menMenuRef.current &&
                    !menDropdownRef.current.contains(e.target) &&
                    !menMenuRef.current.contains(e.target)
                ) {
                    setOpenDropdown(null);
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMobileView, openDropdown]);


    return (
        <>
            <div className="navbar">
                <div className="Websitename">
                    <h3>RentMy</h3>
                    <h2>Wedding</h2>
                    <h3>Wear</h3>
                </div>

                <div className="nav-links">

                    <div className="dropdown1" ref={womenDropdownRef}>
                        <span className="dropHead" onClick={() => toggleDropdown('women')}>
                            WomenWear
                        </span>
                        <div
                            className={`megamenu ${openDropdown === 'women' ? 'show clicked' : ''}`}
                            ref={womenMenuRef}
                        >

                            <div className="againcolumn">
                                <h4>CLOTHING</h4>
                                <p onClick={() => handleRedirect('/women/dresses/lehengas')}>Lehengas</p>
                                <p onClick={() => handleRedirect('/women/dresses/gowns')}>Gowns</p>
                                <p onClick={() => handleRedirect('/women/dresses/anarkalis')}>Anarkalis</p>
                                <p onClick={() => handleRedirect('/women/dresses/sarees-blouses')}>Sarees & Blouses</p>
                                <p onClick={() => handleRedirect('/women/dresses/indo-western')}>Indo-Western</p>
                            </div>

                            <div className="againcolumn">
                                <h4>ACCESSORIES</h4>
                                <p onClick={() => handleRedirect('/women/accessories/earrings')}>Earrings</p>
                                <p onClick={() => handleRedirect('/women/accessories/necklaces')}>Necklaces</p>
                                <p onClick={() => handleRedirect('/women/accessories/bangles-bracelets')}>Bangles & Bracelets</p>
                                <p onClick={() => handleRedirect('/women/accessories/rings')}>Rings</p>
                                <p onClick={() => handleRedirect('/women/accessories/bags')}>Bags</p>
                            </div>

                            <div className="againcolumn">
                                <h4>OCCASIONS</h4>
                                <p onClick={() => handleRedirect('/women/occasions/engagement')}>Engagement</p>
                                <p onClick={() => handleRedirect('/women/occasions/mehendi')}>Mehendi</p>
                                <p onClick={() => handleRedirect('/women/occasions/haldi')}>Haldi </p>
                                <p onClick={() => handleRedirect('/women/occasions/sangeet')}>Sangeet</p>
                                <p onClick={() => handleRedirect('/women/occasions/cocktail')}>Cocktail</p>
                                <p onClick={() => handleRedirect('/women/occasions/wedding')}>Wedding</p>
                                <p onClick={() => handleRedirect('/women/occasions/reception')}>Reception</p>
                            </div>
                        </div>
                    </div>


                    <div className="dropdown1" ref={menDropdownRef}>
                        <span className="dropHead" onClick={() => toggleDropdown('men')}>
                            MenWear
                        </span>
                        <div
                            className={`megamenu ${openDropdown === 'men' ? 'show clicked' : ''}`}
                            ref={menMenuRef}
                        >
                            <div className="againcolumn">
                                <h4>CLOTHING</h4>
                                <p onClick={() => handleRedirect('/men/dresses/bandhgalas')}>Bandhgalas</p>
                                <p onClick={() => handleRedirect('/men/dresses/KurtaPajamas')}>Kurta Pajamas</p>
                                <p onClick={() => handleRedirect('/men/dresses/indo-westerns')}>IndoWesterns</p>
                                <p onClick={() => handleRedirect('/men/dresses/suits')}>Suits</p>
                            </div>

                            <div className="againcolumn">
                                <h4>ACCESSORIES</h4>
                                <p onClick={() => handleRedirect('/men/accessories/ties-bow-ties')}>Ties & Bow Ties</p>
                                <p onClick={() => handleRedirect('/men/accessories/necklace')}>Necklace</p>
                            </div>

                            <div className="againcolumn">
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


                <div className="iconContainer1">

                    <i className="fas fa-search icon1" onClick={() => handleRedirect('/search')} title="Search"
                    ></i>
                    {/* <i className="far fa-user icon1" onClick={() => handleRedirect('/login')} title="Login"
                    ></i> */}

                    <i
                        className="far fa-user icon1"
                        title="My Account"
                        onClick={() => {
                            const auth = getAuth();
                            const user = auth.currentUser;
                            if (user) {
                                navigate("/myaccount");
                            } else {
                                navigate("/login");
                            }
                        }}
                    ></i>


                    <Link to="#" className="cart-icon" onClick={() => setShowCart(true)}>
                        <i className="fas fa-shopping-bag icon1" title="Cart"></i>
                        {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                    </Link>


                </div>

            </div >

            {showSearch && <SearchOverlay onClose={() => setShowSearch(false)} />
            }
            {showCart && <CartDrawer onClose={() => setShowCart(false)} />}

        </>
    );
};

export default Navbar;



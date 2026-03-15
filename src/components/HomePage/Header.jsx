import React, { useState, useEffect, useRef, useContext } from 'react';
import img from '../../assets/headerimg.jpg';
import { useNavigate, Link } from 'react-router-dom';
import SearchOverlay from '../SeachOverlay';
import CartDrawer from '../CartDrawer';
import { CartContext } from '../../context/CartContext';
import { getAuth } from "firebase/auth";



const Header = () => {

    const [showSearch, setShowSearch] = useState(false);
    const [showCart, setShowCart] = useState(false);

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [menuLevel, setMenuLevel] = useState('main'); // top of menu level
    const [selectedWear, setSelectedWear] = useState(null); // items
    const [selectedCategory, setSelectedCategory] = useState(null); // category


    const { cartItems } = useContext(CartContext);
    const cartCount = JSON.parse(localStorage.getItem("cart"))?.length || 0;

    const navigate = useNavigate();

    const handleRedirect = (path) => {
        if (path === '/search') setShowSearch(true);
        else if (path === '/cart') setShowCart(true);
        else navigate(path);
    };

    return (
        <>


            <div className="hidden lg:flex w-full bg-white/95 absolute top-0 left-0 z-10 px-5 py-6 items-center justify-between text-[#603969]">

                <div className="pl-[5vw] font-['Times_New_Roman',_Times,_serif] font-bold cursor-pointer text-[35px] text-[rgba(92,34,116,0.83)] mt-3">
                    WedsWardrobe
                </div>

                <div className=" mt-4 flex gap-12">

                    {/* WomenWear */}
                    <div className="relative group">
                        <span className=" font-['Times_New_Roman',_Times,_serif] text-[rgba(85,38,105,0.834)] text-[1.7rem] font-bold cursor-pointer">
                            WomenWear
                        </span>

                        <div className="absolute top-full left-0 bg-white/95 pt-[2rem] pb-[3rem] px-[4rem] shadow-[0_4px_12px_rgba(0,0,0,0.1)] z-50 min-w-[300px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-row gap-[4rem] -translate-x-[40%]">
                            <div className="flex flex-col gap-[0.3rem]">
                                <h4 className="text-[1.2rem] mb-[0.6rem] font-semibold text-[#5c1d75] uppercase">Clothing</h4>
                                <p className="text-[1rem] text-[#504f4f] my-[5px] cursor-pointer hover:text-[#63456f] hover:font-bold" onClick={() => handleRedirect('/women/clothing/anarkalis')}>Anarkalis</p>
                                <p className="text-[1rem] text-[#504f4f] my-[5px] cursor-pointer hover:text-[#63456f] hover:font-bold" onClick={() => handleRedirect('/women/clothing/gowns')}>Gowns</p>
                                <p className="text-[1rem] text-[#504f4f] my-[5px] cursor-pointer hover:text-[#63456f] hover:font-bold" onClick={() => handleRedirect('/women/clothing/indoWesterns')}>Indo-Western</p>
                                <p className="text-[1rem] text-[#504f4f] my-[5px] cursor-pointer hover:text-[#63456f] hover:font-bold" onClick={() => handleRedirect('/women/clothing/lehengas')}>Lehengas</p>
                                <p className="text-[1rem] text-[#504f4f] my-[5px] cursor-pointer hover:text-[#63456f] hover:font-bold" onClick={() => handleRedirect('/women/clothing/sarees')}>Sarees</p>
                            </div>

                            <div className="flex flex-col gap-[0.3rem]">
                                <h4 className="text-[1.2rem] mb-[0.6rem] font-semibold text-[#5c1d75] uppercase">ACCESSORIES</h4>
                                <p className="text-[1rem] text-[#504f4f] my-[5px] cursor-pointer hover:text-[#63456f] hover:font-bold" onClick={() => handleRedirect('/women/accessories/bags')}>Bags</p>
                                <p className="text-[1rem] text-[#504f4f] my-[5px] cursor-pointer hover:text-[#63456f] hover:font-bold" onClick={() => handleRedirect('/women/accessories/banglesbracelets')}>Bangles & Bracelets</p>
                                <p className="text-[1rem] text-[#504f4f] my-[5px] cursor-pointer hover:text-[#63456f] hover:font-bold" onClick={() => handleRedirect('/women/accessories/earrings')}>Earrings</p>
                                <p className="text-[1rem] text-[#504f4f] my-[5px] cursor-pointer hover:text-[#63456f] hover:font-bold" onClick={() => handleRedirect('/women/accessories/necklaces')}>Necklaces</p>
                                <p className="text-[1rem] text-[#504f4f] my-[5px] cursor-pointer hover:text-[#63456f] hover:font-bold" onClick={() => handleRedirect('/women/accessories/rings')}>Rings</p>
                            </div>

                            <div className="flex flex-col gap-[0.3rem]">
                                <h4 className="text-[1.2rem] mb-[0.6rem] font-semibold text-[#5c1d75] uppercase">OCCASIONS</h4>
                                <p className="text-[1rem] text-[#504f4f] my-[5px] cursor-pointer hover:text-[#63456f] hover:font-bold" onClick={() => handleRedirect('/women/occasions/engagement')}>Engagement</p>
                                <p className="text-[1rem] text-[#504f4f] my-[5px] cursor-pointer hover:text-[#63456f] hover:font-bold" onClick={() => handleRedirect('/women/occasions/mehendi')}>Mehendi</p>
                                <p className="text-[1rem] text-[#504f4f] my-[5px] cursor-pointer hover:text-[#63456f] hover:font-bold" onClick={() => handleRedirect('/women/occasions/haldi')}>Haldi</p>
                                <p className="text-[1rem] text-[#504f4f] my-[5px] cursor-pointer hover:text-[#63456f] hover:font-bold" onClick={() => handleRedirect('/women/occasions/sangeet')}>Sangeet</p>
                                <p className="text-[1rem] text-[#504f4f] my-[5px] cursor-pointer hover:text-[#63456f] hover:font-bold" onClick={() => handleRedirect('/women/occasions/cocktail')}>Cocktail</p>
                                <p className="text-[1rem] text-[#504f4f] my-[5px] cursor-pointer hover:text-[#63456f] hover:font-bold" onClick={() => handleRedirect('/women/occasions/wedding')}>Wedding</p>
                                <p className="text-[1rem] text-[#504f4f] my-[5px] cursor-pointer hover:text-[#63456f] hover:font-bold" onClick={() => handleRedirect('/women/occasions/reception')}>Reception</p>
                            </div>


                        </div>
                    </div>

                    {/* MenWear */}
                    <div className="relative group">
                        <span className=" font-['Times_New_Roman',_Times,_serif] text-[rgba(85,38,105,0.834)] text-[1.7rem] font-bold cursor-pointer">
                            MenWear
                        </span>

                        <div className="absolute top-full left-0 bg-white/95 pt-[2rem] pb-[3rem] px-[4rem] shadow-[0_4px_12px_rgba(0,0,0,0.1)] z-50 min-w-[300px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-row gap-[4rem] -translate-x-[40%]">
                            <div className="flex flex-col gap-[0.2rem]">
                                <h4 className="text-[1.2rem] mb-[0.6rem] font-semibold text-[#5c1d75] uppercase">Clothing</h4>
                                <p className="text-[1rem] text-[#504f4f] my-[5px] cursor-pointer hover:text-[#63456f] hover:font-bold" onClick={() => handleRedirect('/men/clothing/bandhgalas')}>Bandhgalas</p>
                                <p className="text-[1rem] text-[#504f4f] my-[5px] cursor-pointer hover:text-[#63456f] hover:font-bold" onClick={() => handleRedirect('/men/clothing/kurtapajamas')}>Kurta Pajamas</p>
                                <p className="text-[1rem] text-[#504f4f] my-[5px] cursor-pointer hover:text-[#63456f] hover:font-bold" onClick={() => handleRedirect('/men/clothing/indowesterns')}>IndoWesterns</p>
                                <p className="text-[1rem] text-[#504f4f] my-[5px] cursor-pointer hover:text-[#63456f] hover:font-bold" onClick={() => handleRedirect('/men/clothing/suits')}>Suits</p>
                            </div>

                            <div className="flex flex-col gap-[0.3rem]">
                                <h4 className="text-[1.2rem] mb-[0.6rem] font-semibold text-[#5c1d75] uppercase">ACCESSORIES</h4>
                                <p className="text-[1rem] text-[#504f4f] my-[5px] cursor-pointer hover:text-[#63456f] hover:font-bold" onClick={() => handleRedirect('/men/accessories/tiesBowTies')}>Ties & Bow Ties</p>
                                <p className="text-[1rem] text-[#504f4f] my-[5px] cursor-pointer hover:text-[#63456f] hover:font-bold" onClick={() => handleRedirect('/men/accessories/necklaces')}>Necklace</p>
                            </div>

                            <div className="flex flex-col gap-[0.3rem]">
                                <h4 className="text-[1.2rem] mb-[0.6rem] font-semibold text-[#5c1d75] uppercase">OCCASIONS</h4>
                                <p className="text-[1rem] text-[#504f4f] my-[5px] cursor-pointer hover:text-[#63456f] hover:font-bold" onClick={() => handleRedirect('/men/occasions/engagement')}>Engagement</p>
                                <p className="text-[1rem] text-[#504f4f] my-[5px] cursor-pointer hover:text-[#63456f] hover:font-bold" onClick={() => handleRedirect('/men/occasions/mehendi')}>Mehendi</p>
                                <p className="text-[1rem] text-[#504f4f] my-[5px] cursor-pointer hover:text-[#63456f] hover:font-bold" onClick={() => handleRedirect('/men/occasions/haldi')}>Haldi</p>
                                <p className="text-[1rem] text-[#504f4f] my-[5px] cursor-pointer hover:text-[#63456f] hover:font-bold" onClick={() => handleRedirect('/men/occasions/sangeet')}>Sangeet</p>
                                <p className="text-[1rem] text-[#504f4f] my-[5px] cursor-pointer hover:text-[#63456f] hover:font-bold" onClick={() => handleRedirect('/men/occasions/cocktail')}>Cocktail</p>
                                <p className="text-[1rem] text-[#504f4f] my-[5px] cursor-pointer hover:text-[#63456f] hover:font-bold" onClick={() => handleRedirect('/men/occasions/wedding')}>Wedding</p>
                                <p className="text-[1rem] text-[#504f4f] my-[5px] cursor-pointer hover:text-[#63456f] hover:font-bold" onClick={() => handleRedirect('/men/occasions/reception')}>Reception</p>
                            </div>
                        </div>

                    </div>
                </div>


                {/* Icons */}
                <div className="flex gap-[15px] mt-[20px] pr-[6vw]">

                    {/* <i className="fas fa-home text-[21px] cursor-pointer text-[rgba(85,38,105,0.834)] hover:scale-104 transition-transform duration-200"
                        title="Home"
                        onClick={() => navigate("/")}
                    ></i> */}

                    <i className="fas fa-search text-[21px] cursor-pointer text-[rgba(85,38,105,0.834)] hover:scale-104 transition-transform duration-200" onClick={() => handleRedirect('/search')} title="Search"></i>


                    <i className="far fa-user text-[21px] cursor-pointer text-[rgba(85,38,105,0.834)] hover:scale-104 transition-transform duration-200"
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
                        <i className="fas fa-shopping-bag text-[21px] cursor-pointer text-[rgba(85,38,105,0.834)] hover:scale-104 transition-transform duration-200" title="Cart"></i>
                        {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                    </Link>

                </div>

            </div >


            {/* Mobile Navbar */}
            < div className="w-full bg-white/95 flex justify-between items-center px-5 py-3 mt-5 top-0 z-[100] sm:px-10 lg:hidden" >

                <i className="fas fa-bars text-xl text-[#5d356d] cursor-pointer" onClick={() => {
                    setMobileMenuOpen(true);
                    setMenuLevel('main');
                }}></i>

                <span className="font-['Times_New_Roman',_Times,_serif] text-xl font-semibold text-[#603969] sm:text-2xl ">
                    WedsWardrobe
                </span>


                <div className='flex gap-2 '>
                    <i className="hidden sm:block far fa-user text-[21px] cursor-pointer text-[rgba(85,38,105,0.834)] hover:scale-105 transition-transform duration-200"
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

                    <i className="fas fa-search cursor-pointer text-xl text-[rgba(85,38,105,0.834)] hover:scale-110 transition-transform duration-200" onClick={() => handleRedirect('/search')} title="Search"></i>
                    <Link to="/Cart" className="cart-icon" title="Cart">
                        <i className="fas fa-shopping-bag cursor-pointer text-xl text-[rgba(85,38,105,0.834)] hover:scale-110 transition-transform duration-200"></i>
                        {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                    </Link>
                </div>

            </div >


            {mobileMenuOpen && (
                <div className="fixed top-0 left-0 w-[80%] max-w-[400px] h-full bg-white z-[999] flex flex-col pt-20 px-6 pb-50 ">

                    {/* LEVEL 1 - Main Menu */}
                    {menuLevel === 'main' && (
                        <div className="flex flex-col text-md text-[#5d2e72] cursor-pointer">
                            <button
                                className="absolute top-6 right-10 text-4xl hover:text-[#888] cursor-pointer"
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    setMenuLevel('main');
                                    setSelectedCategory(null);
                                    setSelectedWear(null);
                                }}
                            >
                                &times;
                            </button>

                            <div className='flex flex-col justify-start gap-3 pl-6 pt-5'>
                                <p onClick={() => { navigate('/'); setMobileMenuOpen(false); }}>
                                    Home
                                </p>

                                {/* Wear Categories */}
                                <p onClick={() => { setMenuLevel('wear'); setSelectedWear('women'); }} > WomenWear </p>
                                <p onClick={() => { setMenuLevel('wear'); setSelectedWear('men'); }} >  MenWear</p>

                                <p onClick={() => {
                                    const auth = getAuth();
                                    const user = auth.currentUser;
                                    if (user) {
                                        navigate('/myaccount');
                                    } else {
                                        navigate('/login');
                                    }
                                }}  >
                                    Login
                                </p>

                            </div>

                        </div>
                    )}

                    {/* LEVEL 2 - Wear -> Category */}
                    {menuLevel === 'wear' && (
                        <div className="flex flex-col">

                            <button
                                className="absolute top-6 right-10 text-4xl hover:text-[#888] text-[#5c1d75] cursor-pointer"

                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    setMenuLevel('main');
                                    setSelectedCategory(null);
                                    setSelectedWear(null);
                                }}
                            >
                                &times;
                            </button>


                            <div className='pt-5 pl-6'>
                                <p className="text-md text-[#5c1d75] mb-4">Categories</p>
                                {['Clothing', 'Accessories', 'Occasions'].map((cat) => (
                                    <p
                                        key={cat}
                                        className="text-sm text-[#504f4f] cursor-pointer hover:underline underline-offset-4"

                                        onClick={() => {
                                            setSelectedCategory(cat);
                                            setMenuLevel('category');
                                        }}
                                    >
                                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                    </p>
                                ))}
                            </div>

                            <button
                                className="mt-6 text-sm text-gray-500 underline"
                                onClick={() => setMenuLevel('main')}
                            >
                                ← Back
                            </button>
                        </div>
                    )}

                    {/* LEVEL 3 - Category -> Items */}
                    {menuLevel === 'category' && (

                        <div className="flex flex-col gap-4 ">

                            <button
                                className="absolute top-6 right-10 text-4xl hover:text-[#888] text-[#5c1d75] cursor-pointer"
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    setMenuLevel('main');
                                    setSelectedCategory(null);
                                    setSelectedWear(null);
                                }}
                            >
                                &times;
                            </button>

                            <div className='pt-5 pl-6 text-xl'>
                                <p className="text-md  text-[#5c1d75] mb-4">
                                    {selectedCategory}
                                </p>

                                <div className='text-sm cursor-pointer hover:underline underline-offset-4 text-[#504f4f] hover:text-[#63456f]'>

                                    {(selectedWear === 'women' && selectedCategory === 'Clothing') && (
                                        <>
                                            <p onClick={() => handleRedirect('/women/clothing/anarkalis')}>  Anarkalis </p>
                                            <p onClick={() => handleRedirect('/women/clothing/gowns')}>  Gowns  </p>
                                            <p onClick={() => handleRedirect('/women/clothing/indoWesterns')}> Indo-Western  </p>
                                            <p onClick={() => handleRedirect('/women/clothing/lehengas')}> Lehengas  </p>
                                            <p onClick={() => handleRedirect('/women/clothing/sarees')} >  Sarees </p>
                                        </>
                                    )}

                                    {(selectedWear === 'women' && selectedCategory === 'Accessories') && (
                                        <>
                                            <p onClick={() => handleRedirect('/women/accessories/bags')}>Bags</p>
                                            <p onClick={() => handleRedirect('/women/accessories/banglesbracelets')}>Bangles & Bracelets</p>
                                            <p onClick={() => handleRedirect('/women/accessories/earrings')}>Earrings</p>
                                            <p onClick={() => handleRedirect('/women/accessories/necklaces')}>Necklaces</p>
                                            <p onClick={() => handleRedirect('/women/accessories/rings')}>Rings</p>
                                        </>
                                    )}

                                    {(selectedWear === 'women' && selectedCategory === 'Occasions') && (
                                        <>
                                            <p onClick={() => handleRedirect('/women/occasions/engagement')}>Engagement</p>
                                            <p onClick={() => handleRedirect('/women/occasions/mehendi')}>Mehendi</p>
                                            <p onClick={() => handleRedirect('/women/occasions/haldi')}>Haldi</p>
                                            <p onClick={() => handleRedirect('women/occasions/sangeet')}>Sangeet</p>
                                            <p onClick={() => handleRedirect('women/occasions/cocktail')}>Cocktail</p>
                                            <p onClick={() => handleRedirect('women/occasions/wedding')}>Wedding</p>
                                            <p onClick={() => handleRedirect('women/occasions/reception')}>Reception</p>
                                        </>)}

                                    {(selectedWear === 'men' && selectedCategory === 'Clothing') && (
                                        <>
                                            <p onClick={() => handleRedirect('men/clothing/bandhgalas')}>Bandhgalas</p>
                                            <p onClick={() => handleRedirect('men/clothing/kurtapajamas')}>Kurta Pajamas</p>
                                            <p onClick={() => handleRedirect('men/clothing/indowesterns')}>IndoWesterns</p>
                                            <p onClick={() => handleRedirect('men/clothing/suits')}>Suits</p>
                                        </>)}

                                    {(selectedWear === 'men' && selectedCategory === 'Accessories') && (
                                        <>
                                            <p onClick={() => handleRedirect('/men/accessories/tiesBowTies')}>Ties & Bow Ties</p>
                                            <p onClick={() => handleRedirect('/men/accessories/necklaces')}>Necklace</p>
                                        </>
                                    )}

                                    {(selectedWear === 'men' && selectedCategory === 'Occasions') && (
                                        <>
                                            <p onClick={() => handleRedirect('/men/occasions/engagement')}>Engagement</p>
                                            <p onClick={() => handleRedirect('/men/occasions/mehendi')}>Mehendi</p>
                                            <p onClick={() => handleRedirect('/men/occasions/haldi')}>Haldi</p>
                                            <p onClick={() => handleRedirect('/men/occasions/sangeet')}>Sangeet</p>
                                            <p onClick={() => handleRedirect('/men/occasions/cocktail')}>Cocktail</p>
                                            <p onClick={() => handleRedirect('/men/occasions/wedding')}>Wedding</p>
                                            <p onClick={() => handleRedirect('/men/occasions/reception')}>Reception</p>
                                        </>
                                    )}

                                </div>


                            </div>

                            <button
                                className="mt-6 text-sm text-gray-500 underline"
                                onClick={() => setMenuLevel('wear')}
                            >
                                ← Back
                            </button>
                        </div>
                    )}
                </div >
            )}


            <div className="hidden lg:flex justify-center items-center relative w-full h-[70vh] mt-[9rem]  xl:mt-[13rem] mx-6 ">
                <img
                    src={img}
                    alt="Wedding Banner"
                    className="w-[80%] h-auto"
                />

                <div className="absolute top-[65%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 text-center w-[85%] bg-white/85  py-6  xl:top-[75%]">
                    <h1 className="font-['Times_New_Roman',_Times,_serif] text-[2.5rem] font-bold tracking-[0.2rem] text-[#705578] m-0">
                        WedsWardrobe
                    </h1>
                    <p className="text-[1.4rem] font-medium tracking-[0.1rem] mt-2 text-[#444444]">
                        Style. Smile. Send Back.
                    </p>
                </div>

            </div>


            <div className="block lg:hidden justify-center relative w-full h-auto mt-10 sm:px-10">
                <img
                    src={img}
                    alt="Header Background"
                    className="w-[95%] pl-9"
                />

                <div className="absolute  left-4 right-4  sm:px-6 py-3 text-center bg-white/85 top-[55%] md:py-6">
                    <h1 className=" hidden font-['Times_New_Roman',_Times,_serif] sm:block text-[1.5rem]  font-bold tracking-[0.2rem] text-[#705578]">
                        WedsWardrobe
                    </h1>
                    <p className=" text-[1rem] font-medium tracking-[0.1rem] sm:text-[1.1rem] text-[#444444]">
                        Style. Smile. Send Back.
                    </p>
                </div>
            </div>

            {showSearch && <SearchOverlay onClose={() => setShowSearch(false)} />}
            {showCart && <CartDrawer onClose={() => setShowCart(false)} />}


        </>
    )
}

export default Header

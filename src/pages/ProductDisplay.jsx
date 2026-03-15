import React, { useState, useEffect, useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { CartContext } from '../context/CartContext';
import RelatedProduct from '../components/RelatedProducts';

const formatCategory = (str) =>
    str ? str.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : '';

const ProductDisplay = () => {
    const location = useLocation();
    const [product, setProduct] = useState(null);
    const [imageURL, setImageURL] = useState('');
    const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
    const { cartItems, setCartItems } = useContext(CartContext);
    const today = new Date().toISOString().split('T')[0]; //date in yyyy-mm-dd


    const [eventDate, setEventDate] = useState("");
    const [deliveryWindow, setDeliveryWindow] = useState("");
    const [returnDate, setReturnDate] = useState("");
    const [pickupWindow, setPickupWindow] = useState("");
    const [rentalDuration, setRentalDuration] = useState(3);

    const [isAdded, setIsAdded] = useState(false);
    const [existingCartItem, setExistingCartItem] = useState(null); // store the cart item if exists



    // load the product data and store in localStorage
    useEffect(() => {
        if (location.state?.product) {
            setProduct(location.state.product);
            localStorage.setItem('selectedProduct', JSON.stringify(location.state.product));
        } else {
            const storedProduct = localStorage.getItem('selectedProduct');
            if (storedProduct) setProduct(JSON.parse(storedProduct));
        }
    }, [location.state]);



    // When product loads, restore existing cart item values
    useEffect(() => {
        if (!product) return;

        const cartItem = cartItems.find(item => item.id === product.id);
        setExistingCartItem(cartItem || null);

        if (cartItem) {
            setEventDate(cartItem.eventDate);
            setRentalDuration(cartItem.rentalDuration);
            setReturnDate(cartItem.returnDate);
            setPickupWindow(cartItem.pickupWindow);
            setIsAdded(true);
        } else {
            setEventDate('');
            setRentalDuration(3);
            setReturnDate('');
            setPickupWindow('');
            setIsAdded(false);
        }
    }, [product, cartItems]);


    //load image
    useEffect(() => {
        if (!product) return;

        const base = import.meta.env.VITE_BACKEND_URL;
        const url2 = `${base}/images/${product.gender}/${product.category}/${product.subcategory}/${product.imageUrl}`;
        const url1 = `${base}/images/${product.gender}/${product.category}/${product.subcategory}s/${product.imageUrl}`;

        fetch(url1, { method: 'HEAD' }).then((res) => {
            if (res.ok) { setImageURL(url1); }
            else {
                return fetch(url2, { method: 'HEAD' }).then((res2) => {
                    if (res2.ok) setImageURL(url2);
                    else setImageURL('');
                });
            }
        }).catch(() => setImageURL(''));

    }, [product]);


    useEffect(() => {
        if (!eventDate) return;

        const event = new Date(eventDate);

        // format DD-MM-YYYY
        const formatDate = (date) => {
            const d = new Date(date);
            const day = String(d.getDate()).padStart(2, "0");
            const month = String(d.getMonth() + 1).padStart(2, "0");
            const year = d.getFullYear();
            return `${day}-${month}-${year}`;
        };

        // Delivery ends: before event  day
        const endDelivery = new Date(event);
        endDelivery.setDate(event.getDate() - 1);
        setDeliveryWindow(` ${formatDate(endDelivery)}`);

        //  Calculate return date (based on rentalDuration) 
        const ret = new Date(event);
        ret.setDate(ret.getDate() + rentalDuration - 1);
        setReturnDate(ret.toISOString().split("T")[0]);

        // Pickup  day AFTER return date 
        const pickupEnd = new Date(ret);
        pickupEnd.setDate(ret.getDate() + 2);
        setPickupWindow(pickupEnd.toISOString().split("T")[0]);

        if (existingCartItem) {
            if (existingCartItem.eventDate === eventDate && existingCartItem.rentalDuration === rentalDuration) {
                setIsAdded(true);
            } else {
                setIsAdded(false); // enable button
            }
        }
    }, [eventDate, rentalDuration, existingCartItem]);


    const handleAddToCart = () => {
        const finalEventDate = eventDate || existingCartItem?.eventDate;

        if (!finalEventDate) {
            setAlert({ show: true, message: 'Please select your event date.', type: 'error' });
            return;
        }

        if (new Date(finalEventDate) < new Date(today)) {
            setAlert({ show: true, message: 'Event date cannot be in the past.', type: 'warning' });
            return;
        }

        // Prevent selecting event date less than 5 days from today
        const minEventDate = new Date();
        minEventDate.setDate(minEventDate.getDate() + 5);

        if (new Date(finalEventDate) < minEventDate) {
            setAlert({
                show: true,
                message: 'Event date must be at least 5 days from today.',
                type: 'warning'
            });
            return;
        }

        if (isAdded) return; //no duplicates


        const cartItemIndex = cartItems.findIndex(item => item.id === product.id);

        const newCartItem = {
            ...product,
            eventDate: finalEventDate,    // user-selected event date
            returnDate,             // auto-generated return date
            pickupWindow,
            rentalDuration
        };


        //add the current product in the prev array of products
        const updatedCart = [...cartItems];

        if (cartItemIndex > -1) {
            // Update existing cart item with new dates/duration
            updatedCart[cartItemIndex] = newCartItem;
        } else {
            // Add new product
            updatedCart.push(newCartItem);
        }


        setCartItems(updatedCart);
        //even if page refresh it should store
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setIsAdded(true);

        setAlert({ show: true, message: 'Added to cart!', type: 'success' });
        setTimeout(() => setAlert((a) => ({ ...a, show: false })), 2000);
    };


    if (!product) return <div className="text-center py-20">Product not found!</div>;

    return (
        <>
            <Navbar />

            <div className="hidden lg:flex lg:flex-col">

                <div className="flex gap-16 p-12 bg-white font-sans my-8 mx-24">

                    {/*  Product Image */}
                    <div className="flex-none w-full lg:w-2/5 max-w-lg h-[300px]">
                        <img
                            src={imageURL}
                            alt={product.name}
                            className="w-full h-full object-contain rounded-lg"
                        />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col gap-4">

                        {/* Breadcrumb */}

                        <nav className="text-gray-600 text-sm flex space-x-2">
                            <Link to="/" className="hover:text-gray-900 font-medium">Home</Link>
                            <span>/</span>

                            <Link to={`/${product.gender}/${product.category}/${product.subcategory}`}
                                className="hover:text-gray-900 font-medium" >
                                {formatCategory(product.subcategory)}
                            </Link>

                        </nav>

                        <div>
                            <p className="text-gray-800 font-semibold text-xl">{product.ownerName}</p>
                            <h1 className="text-xl font-semibold text-gray-900 mt-1">{product.name}</h1>
                            <p className="text-md font-bold text-gray-900 mt-1">Rent: ₹{product.price}</p>
                            <p className="text-md text-gray-600">Refundable Deposit: ₹{product.price - 700}</p>
                        </div>


                        {/* Event Date & Delivery Duration Selection */}
                        <div className="flex flex-col mt-1 space-y-6">

                            {/* Event Date */}
                            <div className="flex flex-col">
                                <label htmlFor="eventDate" className="font-semibold text-gray-700 text-md">
                                    Select Your Event Date:
                                </label>

                                <input
                                    type="date"
                                    id="eventDate"
                                    className="border-b border-gray-400  w-60 focus:outline-none"
                                    value={eventDate || existingCartItem?.eventDate || ''}
                                    onChange={(e) => { setEventDate(e.target.value); }}
                                />

                                <p className="text-sm text-gray-700 mt-3 italic">
                                    📦 Please book at least <b>5 days before your event</b>. We deliver within this period.
                                </p>

                            </div>


                            {/* Delivery Duration Dropdown */}
                            <div className="flex flex-col">
                                <label className="font-semibold text-gray-700 mb-1">Choose Delivery Duration:</label>
                                <select
                                    value={rentalDuration}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        setRentalDuration(val); // update the rental duration

                                        // Recalculate return date and pickup window if eventDate is set
                                        if (eventDate) {
                                            const ret = new Date(eventDate);
                                            ret.setDate(ret.getDate() + val - 1);
                                            setReturnDate(ret.toISOString().split("T")[0]);

                                            const pickupEnd = new Date(ret);
                                            pickupEnd.setDate(ret.getDate() + 2);
                                            setPickupWindow(pickupEnd.toISOString().split("T")[0]);
                                        }

                                        // Enable Add to Cart button if user changes duration
                                        if (existingCartItem) {
                                            if (
                                                existingCartItem.eventDate === eventDate &&
                                                existingCartItem.rentalDuration === val
                                            ) {
                                                setIsAdded(true);
                                            } else {
                                                setIsAdded(false);
                                            }
                                        }
                                    }}
                                    className="border border-gray-400 py-2 w-40 rounded-md focus:outline-none"
                                >
                                    <option value={3}>3 Days</option>
                                    <option value={5}>5 Days</option>
                                    <option value={7}>7 Days</option>
                                </select>
                            </div>


                            {/* Expected Delivery Window */}
                            {eventDate && (
                                <p className="text-gray-700 mt-1 text-mb mb-0">
                                    <b>Expected delivery: {deliveryWindow}</b>
                                </p>
                            )}

                            {/* Return Date Display */}
                            {returnDate && (
                                <p className="text-gray-700 mt-1 text-mb mb-0">
                                    <b> Return Date: {returnDate.split("-").reverse().join("-")}</b>
                                </p>
                            )}

                            {/* Expected Pickup Window */}
                            {pickupWindow && (
                                <p className="text-gray-700 mt-1 text-mb mb-0">
                                    <b>Expected pickup: {pickupWindow.split("-").reverse().join("-")}</b>
                                </p>
                            )}

                        </div>



                        {/* Add to Cart */}
                        <button
                            onClick={handleAddToCart}
                            disabled={isAdded}
                            className={`mt-8 w-[10rem] px-6 py-3 rounded bg-[#602e74] text-white font-semibold hover:bg-[#6b4e7f] lg:w-[20rem]`}
                        >
                            {isAdded ? 'Added' : 'Add To CheckOut'}
                        </button>

                        {/* Extra Info */}
                        <div className="mt-10 space-y-4 text-gray-700 text-sm leading-relaxed">
                            <div><span className="font-semibold">Description:</span> {product.description}</div>
                            <div><span className="font-semibold">Stylist Notes:</span> {product.stylistNotes}</div>
                            <div><span className="font-semibold">Material & Care:</span> {product.materialCare}</div>
                        </div>
                    </div>
                </div>


                {/* related product */}
                <RelatedProduct
                    gender={product.gender}
                    category={product.category}
                    subcategory={product.subcategory}
                />

            </div >

            {/* alert Message */}
            {
                alert.show && (
                    <div
                        className={` fixed top-20 right-5 z-50 px-6 py-3 rounded-l-lg  
                                ${alert.type === 'error' ? 'bg-red-200 text-red-800' : ''} 
                                ${alert.type === 'warning' ? 'bg-yellow-200 text-yellow-800' : ''}
                                ${alert.type === 'success' ? 'bg-green-200 text-green-800' : ''}  shadow-lg animate-slideIn animate-fadeOut `}  >
                        {alert.message}
                    </div>
                )
            }

            {/* mobile view */}

            <div className='flex flex-col lg:hidden '>

                <div className="flex flex-col justify-items-center p-15 pt-5 pb-0 bg-white font-sans my-8 mb-0 sm:flex-row sm:gap-5">
                    {/*  Product Image */}
                    <div className=" h-[15rem]">
                        <img
                            src={imageURL}
                            alt={product.name}
                            className="w-2xl h-full object-contain object-left rounded-lg sm:pl-15"
                        />
                    </div>

                    {/* Product Details */}
                    <div className="w-full flex flex-col mt-1 gap-4 sm:mt-0">

                        {/* Breadcrumb */}
                        <nav className="text-gray-600 text-sm flex space-x-2">
                            <Link to="/" className="hover:text-gray-900 font-medium">Home</Link>
                            <span>/</span>
                            <Link
                                to={`/${product.gender}/${product.category}/${product.subcategory}`}
                                className="hover:text-gray-900 font-medium"
                            >
                                {formatCategory(product.subcategory)}
                            </Link>
                        </nav>

                        <div>
                            <p className="text-gray-800">{product.ownerName}</p>
                            <h1 className="text-md font-semibold text-gray-900 mt-1">{product.name}</h1>
                            <p className="text-sm mt-2 text-gray-900">Rent: ₹{product.price}</p>
                            <p className="text-sm text-gray-600">Refundable Deposit: ₹{product.price - 500}</p>
                        </div>


                        <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-700">Size:</span>
                            <div className="text-gray-900 text-sm">{product.size}</div>
                        </div>


                        {/* Event Date Selection */}
                        <div className="flex flex-col">
                            <label htmlFor="eventDate" className="font-semibold text-gray-700 text-md">
                                Select Your Event Date:
                            </label>
                            <input
                                type="date"
                                id="eventDate"
                                min={new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                                className="border-b border-gray-400 py-1 w-60 focus:outline-none text-md"
                                value={eventDate || existingCartItem?.eventDate || ''}
                                onChange={(e) => setEventDate(e.target.value)}
                            />
                            <p className="text-sm text-gray-700 mt-3 italic">
                                📦 Please book at least <b>5 days before your event</b>. We deliver within this period.
                            </p>

                            {/* Delivery Duration Dropdown */}
                            <div className="flex flex-col mt-5">
                                <label className="font-semibold text-gray-700 mb-1">Choose Delivery Duration:</label>
                                <select
                                    value={rentalDuration}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        setRentalDuration(val);

                                        // Calculate return date if event date is already selected
                                        if (eventDate) {
                                            const ret = new Date(eventDate);
                                            ret.setDate(ret.getDate() + val - 1);
                                            setReturnDate(ret.toISOString().split("T")[0]);

                                            const pickupEnd = new Date(ret);
                                            pickupEnd.setDate(ret.getDate() + 2);
                                            setPickupWindow(pickupEnd.toISOString().split("T")[0]);
                                        }


                                        if (existingCartItem) {
                                            if (
                                                existingCartItem.eventDate === eventDate &&
                                                existingCartItem.rentalDuration === val
                                            ) {
                                                setIsAdded(true);
                                            } else {
                                                setIsAdded(false);
                                            }
                                        }
                                    }}
                                    className="border border-gray-400 py-2 w-40 rounded-md focus:outline-none"
                                >
                                    <option value={3}>3 Days</option>
                                    <option value={5}>5 Days</option>
                                    <option value={7}>7 Days</option>
                                </select>
                            </div>

                            {deliveryWindow && (
                                <p className="text-gray-700 mt-5 text-sm font-semibold">
                                    Expected delivery: {deliveryWindow}
                                </p>
                            )}

                            {/* Return Date  Display */}
                            {returnDate && (
                                <p className="text-gray-700 mt-2 text-sm font-semibold">
                                    Return Date: {returnDate.split("-").reverse().join("-")}
                                </p>
                            )}


                            {/* pickup date */}

                            {pickupWindow && (
                                <p className="text-gray-700 mt-2 text-sm font-semibold">
                                    Expected pickup: {pickupWindow.split("-").reverse().join("-")}
                                </p>
                            )}
                        </div>

                        {/* Add to Cart */}
                        <button
                            onClick={handleAddToCart}
                            disabled={isAdded}
                            className={`mt-3 w-[15rem] px-6 py-3 rounded bg-[#602e74] text-white font-semibold hover:bg-[#6b4e7f] `}
                        >
                            {isAdded ? 'Added' : 'Add To CheckOut'}
                        </button>


                    </div>

                </div>


                {/* related product */}
                <RelatedProduct
                    gender={product.gender}
                    category={product.category}
                    subcategory={product.subcategory}
                />

            </div>

            <Footer />
        </>
    );
};


export default ProductDisplay;
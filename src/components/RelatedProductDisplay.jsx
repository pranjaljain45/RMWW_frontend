import React, { useState, useEffect, useContext } from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';
import { CartContext } from '../context/CartContext';
import RelatedProduct from './RelatedProducts';

const formatCategory = (str) =>
    str ? str.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : '';

const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};

const RelatedProductDisplay = () => {
    const location = useLocation();
    const [product, setProduct] = useState(null);
    const [imageURL, setImageURL] = useState('');
    const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
    const { cartItems, setCartItems } = useContext(CartContext);
    const today = formatDate(new Date());

    const [eventDate, setEventDate] = useState("");
    const [deliveryWindow, setDeliveryWindow] = useState("");
    const [pickupWindow, setPickupWindow] = useState("");
    const [rentalDuration, setRentalDuration] = useState(2);
    const [returnDate, setReturnDate] = useState("");


    const [isAdded, setIsAdded] = useState(false);
    const [existingCartItem, setExistingCartItem] = useState(null); // store the cart item if exists

    const totalPrice = product ? rentalDuration * product.price : 0;

    const { gender, category, subcategory, id } = useParams();


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

        // Check for this specific product in cart using both id and _id
        const productId = product.id || product._id;
        const cartItem = cartItems.find(item => {
            const cartItemId = item.id || item._id;
            return cartItemId === productId;
        });
        
        setExistingCartItem(cartItem || null);

        if (cartItem) {
            // This specific product is in cart, restore its values
            setEventDate(cartItem.eventDate);
            setRentalDuration(cartItem.rentalDuration);
            setReturnDate(cartItem.returnDate);
            setPickupWindow(cartItem.pickupWindow);
            setIsAdded(true);
        } else {
            // This product is NOT in cart, reset to defaults
            setEventDate('');
            setRentalDuration(2);
            setReturnDate('');
            setPickupWindow('');
            setIsAdded(false);
        }
    }, [product, cartItems]);


    useEffect(() => {
        if (!eventDate) return;

        const event = new Date(eventDate);

        const endDelivery = new Date(event);
        endDelivery.setDate(event.getDate() - 1);
         setDeliveryWindow(endDelivery.toISOString());

        const returnDt = new Date(event);
        returnDt.setDate(returnDt.getDate() + rentalDuration - 1);
        setReturnDate(returnDt.toISOString());  // Store as ISO string

        // Pickup is 2 days AFTER return date
        const pickupEnd = new Date(returnDt);
        pickupEnd.setDate(returnDt.getDate() + 2);
        setPickupWindow(pickupEnd.toISOString());  // Store as ISO string

        if (existingCartItem) {
            if (existingCartItem.eventDate === eventDate && existingCartItem.rentalDuration === rentalDuration) {
                setIsAdded(true); //disable added to checkout
            } else {
                setIsAdded(false); // enable add to checkout
            }
        }
    }, [eventDate, rentalDuration, existingCartItem]);


    // Set product from localStorage
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/products/${gender}/${category}/${subcategory}`
                );
                const data = await res.json();

                const found = data.find(
                    (item) => String(item._id) === String(id)
                );

                if (found) {
                    setProduct(found);
                }
            } catch (err) {
                console.error("Error fetching product:", err);
            }
        };

        fetchProduct();
    }, [gender, category, subcategory, id]);



    useEffect(() => {
        if (!product) return;
        // imageUrl is already a Cloudinary URL
        setImageURL(product.imageUrl);
    }, [product]);


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

        const productId = product.id || product._id;

        const newCartItem = {
            ...product,
            id: productId,  // Ensure id is set
            size: product.size, // Explicitly include size
            eventDate: finalEventDate,    // user-selected event date (YYYY-MM-DD format)
            returnDate,             // ISO string
            pickupWindow,           // ISO string
            rentalDuration,
            totalPrice: totalPrice,  // calculated total price
        };

        //add the current product in the prev array of products
        const updatedCart = [...cartItems];
        const cartItemIndex = cartItems.findIndex(item => {
            const cartItemId = item.id || item._id;
            return cartItemId === productId;
        });

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

                <div className="hidden lg:flex gap-16 lg:p-12 p-6 bg-white font-sans my-8 lg:mx-24">

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

                            <Link
                                to={`/${product.gender}/${product.category}/${product.subcategory}`}
                                className="hover:text-gray-900 font-medium"
                            >
                                {formatCategory(product.subcategory)}
                            </Link>

                        </nav>

                        <div>
                            <p className="text-gray-800 font-semibold text-xl">{product.ownerName}</p>
                            <h1 className="text-xl font-semibold text-gray-900 mt-1">{product.name}</h1>
                            <p className="text-md font-bold text-gray-900 mt-1">Rent: Rs.{product.price} / day</p>
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
                                    min={new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                                    value={eventDate}
                                    onChange={(e) => setEventDate(e.target.value)}
                                />

                                <p className="text-sm text-gray-700 mt-3 italic">
                                    Please book at least <b>5 days before your event</b>. We deliver within this period.
                                </p>
                            </div>



                            {/* Delivery Duration Dropdown */}
                            <div className="flex flex-col">
                                <label className="font-semibold text-gray-700 mb-1">Choose Delivery Duration:</label>
                                <select
                                    value={rentalDuration}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        setRentalDuration(val);

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
                                    <option value={2}>2 Days</option>
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
                                    <b> Return Date: {formatDate(returnDate)}</b>
                                </p>
                            )}

                            {/* Expected Pickup Window */}
                            {pickupWindow && (
                                <p className="text-gray-700 mt-1 text-mb mb-0">
                                    <b>Expected pickup: {formatDate(pickupWindow)}</b>
                                </p>
                            )}

                            <p className="text-mb font-bold mt-2">
                                Rs.{product.price} × {rentalDuration} days = ₹{totalPrice}
                            </p>

                        </div>


                        {/* Add to Cart */}
                        <button
                            onClick={handleAddToCart}
                            disabled={isAdded}
                            className={` w-[10rem] px-6 py-3 rounded bg-[#602e74] text-white font-semibold hover:bg-[#6b4e7f] lg:w-[20rem]`}
                        >
                            {isAdded ? 'Added' : 'Add To CheckOut'}
                        </button>

                        {/* Extra Info */}
                        <div className="mt-4 space-y-1 text-gray-700 text-sm leading-relaxed">
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

            </div>

            {/* alert Message */}
            {alert.show && (
                <div
                    className={` fixed top-20 right-5 z-50 px-6 py-3 rounded-l-lg  ${alert.type === 'error' ? 'bg-red-200 text-red-800' : ''}  ${alert.type === 'warning' ? 'bg-yellow-200 text-yellow-800' : ''}
                                ${alert.type === 'success' ? 'bg-green-200 text-green-800' : ''}  shadow-lg animate-slideIn animate-fadeOut `}  >
                    {alert.message}
                </div>
            )}


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
                            <p className="text-sm mt-2 text-gray-900">Rent: Rs.{product.price} / day</p>
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
                                className="border-b border-gray-400 py-1 w-60 focus:outline-none text-md"
                                min={new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                                value={eventDate}
                                onChange={(e) => setEventDate(e.target.value)}
                            />
                            <p className="text-sm text-gray-700 mt-3 italic">
                                Please book at least <b>5 days before your event</b>. We deliver within this period.
                            </p>

                            {/* Delivery Duration Dropdown */}
                            <div className="flex flex-col mt-5">
                                <label className="font-semibold text-gray-700 mb-1">Choose Delivery Duration:</label>
                                <select
                                    value={rentalDuration}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        setRentalDuration(val);

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
                                    <option value={2}>2 Days</option>
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

                            {returnDate && (
                                <p className="text-gray-700 mt-2 text-sm font-semibold">
                                    Return Date: {formatDate(returnDate)}
                                </p>
                            )}

                            {pickupWindow && (
                                <p className="text-gray-700 mt-2 text-sm font-semibold">
                                    Expected pickup: {formatDate(pickupWindow)}
                                </p>
                            )}

                            <p className="text-sm font-semibold mt-2">
                                Rs.{product.price} × {rentalDuration} days = ₹{totalPrice}
                            </p>
                        </div>

                        {/* Add to Cart */}
                        <button
                            onClick={handleAddToCart}
                            disabled={isAdded}
                            className={`mt-3 w-[15rem] px-6 py-3 rounded bg-[#602e74] text-white font-semibold hover:bg-[#6b4e7f] `}
                        >
                            {isAdded ? 'Added' : 'Add To CheckOut'}
                        </button>

                        <div className="mt-4 space-y-1 text-gray-700 text-sm leading-relaxed">
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

            </div>

            <Footer />
        </>
    );
};

export default RelatedProductDisplay;





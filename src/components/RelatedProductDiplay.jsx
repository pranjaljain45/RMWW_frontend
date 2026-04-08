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
    const [isAdded, setIsAdded] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
    const { cartItems, setCartItems } = useContext(CartContext);
    const today = formatDate(new Date());
    
    const [eventDate, setEventDate] = useState("");
    const [deliveryWindow, setDeliveryWindow] = useState("");
    const [returnDate, setReturnDate] = useState("");
    const [pickupWindow, setPickupWindow] = useState("");
    const [rentalDuration, setRentalDuration] = useState(3);

    const { gender, category, subcategory, id } = useParams();


    useEffect(() => {
        if (eventDate) {
            const event = new Date(eventDate);

            // Delivery ends: before event day
            const endDelivery = new Date(event);
            endDelivery.setDate(event.getDate() - 1);

            setDeliveryWindow(` ${formatDate(endDelivery)}`);

            //  Calculate return date (based on rentalDuration) 
            const ret = new Date(event);
            ret.setDate(ret.getDate() + rentalDuration - 1);
            setReturnDate((`${formatDate(ret)}`));

            // Pickup  day AFTER return date 
            const pickupEnd = new Date(ret);
            pickupEnd.setDate(ret.getDate() + 2);
            setPickupWindow(` ${formatDate(pickupEnd)}`);

        }
    }, [eventDate, rentalDuration]);



    // Set product from localStorage
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/products/${gender}/${category}/${subcategory}`
                );
                const data = await res.json();

                const found = data.find(
                    (item) => String(item.id) === String(id) || String(item._id) === String(id)
                );

                if (found) {
                    setProduct(found);
                    localStorage.setItem("selectedProduct", JSON.stringify(found));
                }
            } catch (err) {
                console.error("Error fetching product:", err);
            }
        };

        if (location.state?.product) {
            setProduct(location.state.product);
            localStorage.setItem("selectedProduct", JSON.stringify(location.state.product));
        } else {
            const storedProduct = localStorage.getItem("selectedProduct");
            if (storedProduct) {
                const parsed = JSON.parse(storedProduct);
                if (parsed.id === id || parsed._id === id) {
                    setProduct(parsed);
                } else {
                    fetchProduct();
                }
            } else {
                fetchProduct();
            }
        }
    }, [gender, category, subcategory, id, location.state]);


    useEffect(() => {
        if (!product) return;
        const base = import.meta.env.VITE_BACKEND_URL;
        const url2 = `${base}/images/${product.gender}/${product.category}/${product.subcategory}/${product.imageUrl}/${product.id}`;
        const url1 = `${base}/images/${product.gender}/${product.category}/${product.subcategory}s/${product.imageUrl}/${product.id}`;

        fetch(url1, { method: 'HEAD' }).then((res) => {
            if (res.ok) { setImageURL(url1); } else {
                return fetch(url2, { method: 'HEAD' }).then((res2) => {
                    if (res2.ok) setImageURL(url2);
                    else setImageURL('');
                });
            }
        }).catch(() => setImageURL(''));
    }, [product]);


    const handleAddToCart = () => {
        if (!eventDate) {
            setAlert({ show: true, message: 'Please select your event date.', type: 'error' });
        } else if (new Date(eventDate) < new Date(today)) {
            setAlert({ show: true, message: 'Event date cannot be in the past.', type: 'warning' });
        } else {
            const cartItem = {
                ...product,
                eventDate,             // user-selected event date
                returnDate,            // auto-generated return date
            };

            const updated = [...cartItems, cartItem];
            setCartItems(updated);
            localStorage.setItem('cart', JSON.stringify(updated));
            setIsAdded(true);
            setAlert({ show: true, message: 'Added to cart!', type: 'success' });
        }

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
                            <p className="text-md font-bold text-gray-900 mt-1">Rent: Rs.{product.price}</p>
                            {/* <p className="text-md text-gray-600">Refundable Deposit: ₹{product.price - 700}</p> */}
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
                                   // min={new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                                    value={eventDate || existingCartItem?.eventDate || ''}
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

                                        // Calculate return date if event date is already selected
                                        if (eventDate) {
                                            const returnD = new Date(eventDate);
                                            returnD.setDate(returnD.getDate() + val - 1);
                                            setReturnDate(` ${formatDate(returnD)}`);
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
                                    <b> Return Date: {returnDate.split("-").reverse().join("-")}</b>
                                </p>
                            )}

                            {/* Expected Pickup Window */}
                            {pickupWindow && (
                                <p className="text-gray-700 mt-1 text-mb mb-0">
                                    <b>Expected pickup: {pickupWindow}</b>
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
                            <p className="text-sm mt-2 text-gray-900">Rent: Rs.{product.price}</p>
                            <p className="text-sm text-gray-600">Refundable Deposit: Rs.{product.price - 500}</p> 
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

                                        // Calculate return date if event date is already selected
                                        if (eventDate) {
                                            const returnD = new Date(eventDate);
                                            returnD.setDate(returnD.getDate() + val - 1);
                                            setReturnDate(`${formatDate(returnD)}`);
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

                            {/* Return Date  Display */}
                            {returnDate && (
                                <p className="text-gray-700 mt-2 text-sm font-semibold">
                                    Return Date: {returnDate}
                                </p>
                            )}


                            {/* pickup date */}

                            {pickupWindow && (
                                <p className="text-gray-700 mt-2 text-sm font-semibold">
                                    Expected pickup: {pickupWindow}
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

export default RelatedProductDisplay;

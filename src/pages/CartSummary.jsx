import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { CartContext } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const CartSummary = () => {
    const { cartItems, setCartItems } = useContext(CartContext);
    const navigate = useNavigate();
    const auth = getAuth();

    // imageUrl is a Cloudinary URL
    const [imgSrcs, setImgSrcs] = useState(
        cartItems.map((item) => item.imageUrl)
    );

    // Track availability status for each cart item
    const [availabilityStatus, setAvailabilityStatus] = useState([]);
    const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

    useEffect(() => {
        setImgSrcs(cartItems.map((item) => item.imageUrl));
        checkCartAvailability();
    }, [cartItems]);

    // Check availability for all cart items
    const checkCartAvailability = async () => {
        if (cartItems.length === 0) {
            setAvailabilityStatus([]);
            return;
        }

        setIsCheckingAvailability(true);

        try {
            // Prepare items for availability check
            const itemsToCheck = cartItems.map(item => ({
                productId: item.id || item._id,
                size: item.size,
                rentalStartDate: item.eventDate,
                rentalEndDate: item.returnDate
            }));


            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/bookings/check-cart-availability`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ items: itemsToCheck })
            });

            const data = await response.json();

            if (data.success) {
               
                setAvailabilityStatus(data.results);

                // Show toast for unavailable items
                const unavailableItems = data.results.filter(result => !result.available);
                if (unavailableItems.length > 0) {
                    toast.error(`${unavailableItems.length} item(s) in your cart are not available for the selected dates`, {
                        position: 'top-right',
                        autoClose: 5000,
                    });
                }
            } else {
                console.error('Failed to check availability:', data.message);
                toast.error('Failed to check product availability', {
                    position: 'top-right',
                    autoClose: 3000,
                });

                // Set empty availability status so items don't show as unavailable
                setAvailabilityStatus(cartItems.map(() => ({ available: true })));
            }
        } catch (error) {
            console.error('Error checking cart availability:', error);
            toast.error('Error checking product availability. Please refresh the page.', {
                position: 'top-right',
                autoClose: 3000,
            });
            
            // Set empty availability status so items don't show as unavailable
            setAvailabilityStatus(cartItems.map(() => ({ available: true })));
        } finally {
            setIsCheckingAvailability(false);
        }
    };

    const handleRemoveItem = (index) => {
        const updated = cartItems.filter((_, i) => i !== index);
        setCartItems(updated);
        localStorage.setItem('cart', JSON.stringify(updated));
    };

    const handleProductClick = (item) => {
        const itemId = item.id || item._id;
        navigate(`/${item.gender}/${item.category}/${item.subcategory}/${itemId}`, {
            state: { product: item }
        });
    };

    const handleProceedToCheckout = async () => {
        // First check availability for all items
        if (cartItems.length === 0) {
            toast.error('Your cart is empty!', {
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }

        // Check availability before proceeding
        setIsCheckingAvailability(true);
        try {
            const itemsToCheck = cartItems.map(item => ({
                productId: item.id || item._id,
                size: item.size,
                rentalStartDate: item.eventDate,
                rentalEndDate: item.returnDate
            }));

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/bookings/check-cart-availability`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ items: itemsToCheck })
            });

            const data = await response.json();

            if (!data.success || !data.allAvailable) {
                const unavailableItems = data.results?.filter(r => !r.available) || [];
                toast.error('Some items are not available. Please remove them from cart.', {
                    position: 'top-right',
                    autoClose: 4000,
                });
                setAvailabilityStatus(data.results || []);
                setIsCheckingAvailability(false);
                return;
            }

            // All items available, now check login
            const user = auth.currentUser;

            if (!user) {
                toast.error('Please login to proceed to checkout', {
                    position: 'top-right',
                    autoClose: 3000,
                });
                setIsCheckingAvailability(false);
                setTimeout(() => {
                    navigate('/login');
                }, 1500);
                return;
            }

            // All good, proceed to checkout
            setIsCheckingAvailability(false);
            navigate('/checkout');

        } catch (error) {
            console.error('Error checking availability:', error);
            toast.error('Error checking product availability. Please try again.', {
                position: 'top-right',
                autoClose: 3000,
            });
            setIsCheckingAvailability(false);
        }
    };

    const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    };

    // Check if any items are unavailable
    const hasUnavailableItems = availabilityStatus.some(status => !status.available);

    const total = cartItems.reduce((a, i) => a + (Number(i.totalPrice) || (Number(i.price) * Number(i.rentalDuration))), 0);
    const refundable = cartItems.reduce((a, i) => a + ((Number(i.totalPrice) || (Number(i.price) * Number(i.rentalDuration))) - 300), 0);

    return (
        <>
            <Navbar />

            <div className="p-12 ">
                <h1 className="text-3xl font-normal mb-8 mt-5 text-center">Your Shopping Cart!</h1>

                {cartItems.length === 0 ? (
                    <div className="text-center mt-20">
                        <p className="font-semibold text-lg text-gray-600">Your bag is empty. Go shop something beautiful!</p>
                        <button
                            onClick={() => navigate('/')}
                            className="mt-8 bg-[#602e74] text-white px-6 py-2 rounded font-bold hover:bg-[#602e74dd]"
                        >
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <div className="max-w-3xl mx-auto space-y-8 ">
                        {isCheckingAvailability && (
                            <div className="text-center py-4">
                                <p className="text-gray-600">Checking product availability...</p>
                            </div>
                        )}

                        {cartItems.map((item, idx) => {
                            const itemAvailability = availabilityStatus.find(
                                status =>
                                    status.productId === (item.id || item._id) &&
                                    status.size === item.size
                            );

                            // If no availability status found, assume available (check hasn't completed yet)
                            // If status found, use the explicit available value
                            const isAvailable = !itemAvailability || itemAvailability.available === true;
                            const availabilityMessage = itemAvailability?.message;

                            return (
                                <div
                                    key={idx}
                                    className={`flex flex-row sm:flex-row justify-between px-10 py-5 gap-4 sm:col border-t border-gray-500 ${!isAvailable ? 'bg-red-50 opacity-75' : ''
                                        }`}
                                    onClick={() => isAvailable && handleProductClick(item)}
                                    style={{ cursor: isAvailable ? 'pointer' : 'not-allowed' }}
                                >
                                    <img
                                        src={imgSrcs[idx]}
                                        alt={item.name}
                                        className={`w-[80px] h-[100px] object-cover rounded ${!isAvailable ? 'grayscale' : ''
                                            }`}
                                    />

                                    <div className="flex-1">
                                        <div className="flex items-start gap-2">
                                            <h3 className={`text-md font-medium`}>
                                                {item.name}
                                            </h3>

                                        </div>

                                        {!isAvailable && (
                                            <p className="text-sm text-red-600 font-semibold mt-1">
                                                Not Available - {availabilityMessage}
                                            </p>
                                        )}

                                        <p className="text-sm text-gray-600">
                                            <span className='text-black font-semibold'> Size: </span> {item.size}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="text-black font-semibold">Start Date:</span> {formatDate(item.eventDate)}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="text-black font-semibold">Return Date:</span> {formatDate(item.returnDate)}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="text-black font-semibold">Expected pickup by:</span> {formatDate(item.pickupWindow)}
                                        </p>

                                        <p className={`sm:hidden text-sm font-semibold mt-1 `}>
                                            Rs. {item.totalPrice || (item.price * item.rentalDuration)}
                                        </p>
                                    </div>

                                    <div className="flex gap-5">
                                        <p className={`hidden sm:block text-md font-semibold mt-1 ${!isAvailable ? 'text-red-600' : ''}`}>
                                            Rs. {item.totalPrice || (item.price * item.rentalDuration)}
                                        </p>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveItem(idx);
                                            }}
                                            className="text-xl text-gray-600 self-start hover:text-red-600"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}


                        <div className="flex flex-row  border-b border-t border-gray-500 justify-between items-center p-4 w">
                            <div>
                                <p className="font-medium">Refundable Deposit</p>
                                <p className="text-sm text-gray-600">
                                    This amount will be refunded when the rental products are returned
                                </p>
                            </div>
                            <p className="text-xl font-semibold">Rs. {refundable}.00</p>
                        </div>


                        <div className="text-right">
                            <p className="text-gray-600">Subtotal</p>
                            <h3 className="text-2xl font-bold">Rs. {total}.00</h3>
                            <p className="text-sm text-gray-500">Excluding Tax & Shipping</p>
                        </div>



                        <div className="flex justify-end gap-5">
                            <button
                                onClick={() => navigate('/')}
                                className="bg-[#602e74] text-white px-6 py-2 rounded font-semibold hover:bg-[#602e74dd]"
                            >
                                Continue Shopping
                            </button>

                            <button
                                onClick={handleProceedToCheckout}
                                disabled={hasUnavailableItems || isCheckingAvailability}
                                className={`px-6 py-2 rounded font-semibold ${hasUnavailableItems || isCheckingAvailability
                                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                    : 'bg-[#602e74] text-white hover:bg-[#602e74dd]'
                                    }`}
                            >
                                {isCheckingAvailability ? 'Checking...' : 'Proceed to Checkout'}
                            </button>
                        </div>
                    </div>
                )}

            </div >

            <ToastContainer />
            <Footer />
        </>
    );
};

export default CartSummary;
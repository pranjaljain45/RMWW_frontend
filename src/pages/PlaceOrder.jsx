import React, { useState, useEffect, useContext } from 'react';
import { getAuth } from 'firebase/auth';
import { CartContext } from '../context/CartContext';
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import axios from "axios";
import razorpaylogo from '../assets/razorpay_logo.png';



const PlaceOrder = () => {
    const { cartItems, clearCart } = useContext(CartContext);
    const [userEmail, setUserEmail] = useState('');
    const [method, setMethod] = useState('cod');
    const [name, setName] = useState("");
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [phone, setPhone] = useState("");


    const navigate = useNavigate();

    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            toast.error("Please login to place an order!", {
                position: "top-right"
            });
            navigate("/login");
            return;
        }

        setUserEmail(user.email);

    }, []);


    const subtotal = cartItems.reduce((acc, item) => acc + Number(item.price), 0);
    const refundableDeposit = cartItems.reduce((acc, item) => {
        const refund = Number(item.price) - 400;
        return acc + (refund > 0 ? refund : 0);
    }, 0);
    const estimatedTaxes = 700;
    const deliveryFee = 100;
    const total = subtotal + estimatedTaxes + deliveryFee;


    const handlePlaceOrder = async () => {
        const auth = getAuth();

        // Use onAuthStateChanged to reliably get user
        const user = auth.currentUser;

        // console.log("SENDING PRODUCT IDS:", cartItems.map(i => i.id));


        if (!user) {
            toast.error("Please login to continue!", { position: "top-right" });
            navigate("/login");
            return;
        }

        // address fields
        if (!name || !street || !city || !state || !zipcode || !phone) {
            toast.error("Please fill all delivery information fields!", { position: "top-right" });
            return;
        }

        if (!/^\d{10}$/.test(phone)) {
            toast.error("Phone number must be 10 digits!", { position: "top-right" });
            return;
        }

        if (!/^\d{6}$/.test(zipcode)) {
            toast.error("Zipcode must be a 6-digit number!", { position: "top-right" });
            return;
        }

        if (!userEmail) {
            toast.error("Email not found. Please login again!", { position: "top-right" });
            return;
        }

        if (!cartItems.length) {
            toast.error("Your cart is empty!", { position: "top-right" });
            return;
        }

        // Calculate totals
        const subtotal = cartItems.reduce((acc, item) => acc + Number(item.price), 0);
        const refundableDeposit = cartItems.reduce((acc, item) => {
            const refund = Number(item.price) - 400;
            return acc + (refund > 0 ? refund : 0);
        }, 0);
        const estimatedTaxes = 700;
        const deliveryFee = 100;
        const total = subtotal + estimatedTaxes + deliveryFee;

        const base = import.meta.env.VITE_BACKEND_URL;

        // Prepare order data
        const orderData = {
            uid: user.uid,
            items: cartItems.map(item => ({
                productId: item._id || item.id || item.productId,
                name: item.name,
                price: Number(item.price),

                gender: item.gender,
                category: item.category,
                subcategory: item.subcategory,

                imageUrl: item.imageUrl,
                size: item.size,
                rentalStartDate: item.eventDate,
                rentalEndDate: item.returnDate
            })),
            totalAmount: total,
            refundableDeposit,
            address: { name, street, city, state, zipcode, phone, email: userEmail },
            paymentMethod: method
            // pickupDate: pickupDate,
            // expectedDeliveryDate: expectedDeliveryDate
        };

        try {
            const res = await axios.post(
                `${base}/api/orders/place-order`,
                orderData
            );

            if (res.data.order) {
                toast.success("Order placed successfully!", { position: "top-right" });

                // Clear cart in context and localStorage
                clearCart();

                // Redirect to orders page
                navigate("/orderSummary");
            } else {
                toast.error("Could not place order!");
            }
        } catch (error) {
            if (error.response) {
                console.error("Server responded with error:", error.response.data);
                toast.error(`Server error: ${error.response.data.message}`);
            } else if (error.request) {
                console.error("No response received:", error.request);
                toast.error("No response from server. Please try again.");
            } else {
                console.error("Error setting up request:", error.message);
                toast.error(`Error: ${error.message}`);
            }
        }
    };


    return (
        <>
            <Navbar />

            <div className="flex flex-col p-20 pb-0 mt-5 sm:mt-0 md:flex-row justify-around gap-10 pt-5 sm:pt-20 min-h-[70vh] sm:px-20">
                <div className="flex flex-col gap-4 w-full md:max-w-[350px] lg:max-w-[480px]">

                    <div className="text-xl sm:text-4xl my-3 font-semibold text-[#76378f]">Delivery Information   </div>

                    <div className="flex gap-3">
                        <input
                            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
                            placeholder='Name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <input
                        className='border border-gray-300 rounded py-1.5 px-3.5 w-full bg-gray-100 cursor-not-allowed'
                        type="email"
                        placeholder='Email Address'
                        value={userEmail}
                        disabled
                    />


                    <input
                        className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
                        placeholder='Street'
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                    />


                    <div className="flex gap-3">
                        <input
                            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
                            placeholder='City'
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                        <input
                            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
                            placeholder='State'
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                        />
                        <input
                            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
                            placeholder='Zipcode'
                            value={zipcode}
                            onChange={(e) => setZipcode(e.target.value)}
                        />
                    </div>

                    <input
                        className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
                        type="number"
                        placeholder='Phone'
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />

                </div>


                <div className="mt-8">

                    <div className=" min-w-[300px] lg:min-w-15">
                        <div className=' w-full lg:w-[480px] flex flex-col gap-2'>
                            <div className="text-xl sm:text-4xl my-3 font-semibold text-[#76378f]">Cart Total </div>

                            <div className="flex justify-between">
                                <p>Subtotal</p>
                                <p>Rs.{subtotal}.00</p>
                            </div>

                            <hr className="border-gray-400 " />

                            <div className='flex justify-between'>
                                <p>Refundable Amount</p>
                                <p>Rs.{refundableDeposit}.00</p>
                            </div>

                            <hr className="border-gray-400" />

                            <div className='flex justify-between'>
                                <p>Estimated taxes</p>
                                <p>Rs.{estimatedTaxes}.00</p>
                            </div>

                            <hr className="border-gray-400" />

                            <div className='flex justify-between'>
                                <p>Shipping Fee</p>
                                <p>Rs.{deliveryFee}.00</p>
                            </div>

                            <hr className="border-gray-400" />

                            <div className='flex justify-between'>
                                <b>Total</b>
                                <b>Rs. {subtotal === 0 ? 0 : total}.00</b>
                            </div>
                        </div>
                    </div>


                    <div className='mt-6'>

                        <div className='text-xl my-3  text-black font-semibold'>Payment Method  </div>

                        <div className="flex flex-col gap-3 lg:flex-row">

                            <div onClick={() => setMethod('razorpay')} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
                                <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-400' : ''}`}></p>
                                <img className='h-5 mx-4' src={razorpaylogo} alt="Razorpay Logo" />
                            </div>

                            <div onClick={() => setMethod('cod')} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
                                <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}> </p>
                                <p>Cash On Delivery</p>
                            </div>
                        </div>

                        <div className="w-full text-end mt-8 ">
                            <button
                                // onClick={handleTestPlaceOrder}
                                onClick={handlePlaceOrder}
                                className='bg-[#602e74] text-white px-16 py-3 text-md font-semibold'
                            >
                                PLACE ORDER
                            </button>

                        </div>

                    </div>
                </div >

            </div >


            <Footer />
        </>
    )
}

export default PlaceOrder

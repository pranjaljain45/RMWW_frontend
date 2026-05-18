import React, { useState, useEffect, useContext } from 'react';
import { getAuth } from 'firebase/auth';
import { CartContext } from '../context/CartContext';
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import axios from "axios";
import razorpaylogo from '../assets/razorpay_logo.png';


const Checkout = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const [userEmail, setUserEmail] = useState('');
  const [method, setMethod] = useState('cod');
  const [name, setName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [phone, setPhone] = useState("");
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState([]);


  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      setUserEmail(user.email);
    }
  }, []);

  // Check availability for all cart items
  const checkCartAvailability = async () => {
    if (cartItems.length === 0) {
      setAvailabilityStatus([]);
      return;
    }

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

      if (data.success) {
        setAvailabilityStatus(data.results);

        const unavailableItems = data.results.filter(result => !result.available);
        if (unavailableItems.length > 0) {
          toast.error(`${unavailableItems.length} item(s) are not available. Please go back to cart.`, {
            position: 'top-right',
            autoClose: 5000,
          });
        }
      } else {
        console.error('Failed to check availability:', data.message);
        setAvailabilityStatus(cartItems.map(() => ({ available: true })));
      }
    } catch (error) {
      console.error('Error checking cart availability:', error);
      setAvailabilityStatus(cartItems.map(() => ({ available: true })));
    } finally {
      setIsCheckingAvailability(false);
    }
  };


  const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.totalPrice) || (Number(item.price) * Number(item.rentalDuration))), 0);
  const refundableDeposit = cartItems.reduce((acc, item) => {
    const itemTotal = Number(item.totalPrice) || (Number(item.price) * Number(item.rentalDuration));
    const refund = itemTotal - 300;
    return acc + (refund > 0 ? refund : 0);
  }, 0);
  const estimatedTaxes = 700;
  const deliveryFee = 200;
  const total = subtotal + estimatedTaxes + deliveryFee;


  const handlePlaceOrder = async () => {
    if (!currentUser) {
      toast.error("Please login to place an order!", { position: "top-right" });
      navigate('/login');
      return;
    }
    
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

    // Check if any items are unavailable - redirect to cart
    const hasUnavailableItems = availabilityStatus.some(status => !status.available);
    if (hasUnavailableItems) {
      toast.error("Some items are not available. Redirecting to cart...", {
        position: "top-right",
        autoClose: 2000
      });
      setTimeout(() => {
        navigate('/cart-summary');
      }, 2000);
      return;
    }

    // Prepare order data
    const orderData = {
      uid: currentUser.uid,
      email: userEmail,
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
        rentalEndDate: item.returnDate,
        pickupDate: item.pickupWindow,
        expectedDeliveryDate: item.deliveryWindow
      })),
      totalAmount: total,
      refundableDeposit,
      address: { name, street, city, state, zipcode, phone, email: userEmail },
      paymentMethod: method
    };


    const base = import.meta.env.VITE_BACKEND_URL;
    try {
      const res = await axios.post(
        `${base}/api/orders/place-order`,
        orderData
      );

      if (res.data.order) {
        toast.success("Order placed successfully!", { position: "top-right" });
        clearCart();
        navigate("/orderSummary");
      } else {
        toast.error("Could not place order!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
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
                onClick={handlePlaceOrder}
                disabled={isCheckingAvailability}
                className={`px-16 py-3 text-md font-semibold ${isCheckingAvailability
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-[#602e74] text-white'
                  }`}
              >
                {isCheckingAvailability ? 'CHECKING AVAILABILITY...' : 'PLACE ORDER'}
              </button>

            </div>

          </div>
        </div >

      </div >


      <Footer />
    </>
  )
}

export default Checkout

import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaTimes } from 'react-icons/fa';


const cart = () => {
  const { cartItems, setCartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const getUrlPair = (item) => {
    const base = import.meta.env.VITE_BACKEND_URL;
    return [
      `${base}/images/${item.gender}/${item.category}/${item.subcategory}s/${item.imageUrl}`,
      `${base}/images/${item.gender}/${item.category}/${item.subcategory}/${item.imageUrl}`,
    ];
  };


  const [imgSrcs, setImgSrcs] = useState(
    cartItems.map((item) => getUrlPair(item)[0])
  );


  useEffect(() => {
    setImgSrcs(cartItems.map((item) => getUrlPair(item)[0]));
  }, [cartItems]);

  const handleError = (idx) => {
    const [, fallback] = getUrlPair(cartItems[idx]);
    setImgSrcs((srcs) => {
      const newSrcs = [...srcs];
      newSrcs[idx] = fallback;
      return newSrcs;
    });
  };

  const handleRemoveItem = (index) => {
    const updated = cartItems.filter((_, i) => i !== index);
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const handleProductClick = (item) => {
    localStorage.setItem('selectedProduct', JSON.stringify(item));
    navigate('/productDisplay');
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  };


  const total = cartItems.reduce((a, i) => a + Number(i.price), 0);
  const refundable = cartItems.reduce((a, i) => a + (Number(i.price) - 300), 0);

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
            {cartItems.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-row sm:flex-row justify-between px-10 py-5 gap-4 sm:col  border-t  border-gray-500"
                onClick={() => handleProductClick(item)}
              >
                <img
                  src={imgSrcs[idx]}
                  onError={() => handleError(idx)}
                  alt={item.name}
                  className="w-[80px] h-[100px] object-cover rounded"
                />

                <div className="flex-1">
                  <h3 className="text-md font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-600"><span className='text-black font-semibold'> Size: </span> {item.size}</p>
                  <p className="text-sm text-gray-600"> <span className="text-black font-semibold">Start Date:</span> {formatDate(item.eventDate)} </p>
                  <p className="text-sm text-gray-600"> <span className="text-black font-semibold">Return Date:</span> {formatDate(item.returnDate)}</p>
                  <p className="text-sm text-gray-600">  <span className="text-black font-semibold">Expected pickup by:</span> {formatDate(item.pickupWindow)}</p>
                 

                  <p className=" sm:hidden text-sm font-semibold mt-1">Rs. {item.price}</p>
                </div>

                <div className="flex gap-5">
                  <p className=" hidden sm:block text-md font-semibold mt-1">Rs. {item.price}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveItem(idx);
                    }}
                    className="text-xl text-gray-600 self-start"
                  >
                    <FaTimes />
                  </button>
                </div>

              </div>
            ))}


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
                onClick={() => navigate('/placeorder')}
                className="bg-[#602e74] text-white px-6 py-2 rounded font-semibold hover:bg-[#602e74dd]"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}

      </div >

      <Footer />
    </>
  );
};

export default cart;

import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { FaTimes } from 'react-icons/fa';

const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};


const CartDrawer = ({ onClose }) => {
    const navigate = useNavigate();
    const { cartItems, setCartItems } = useContext(CartContext);

    const handleContinueShopping = () => {
        onClose();
        navigate('/');
    };

    const handleProductClick = (item) => {
        const itemId =  item._id;
        onClose();
        navigate(`/${item.gender}/${item.category}/${item.subcategory}/${itemId}`, {
            state: { product: item }
        });
    };

    const handleRemoveItem = (indexToRemove) => {
        const updated = cartItems.filter((_, i) => i !== indexToRemove);
        setCartItems(updated);
        localStorage.setItem('cart', JSON.stringify(updated));
    };

    const CartItem = ({ item, onClick, onRemove }) => {
        // imageUrl is already a Cloudinary URL
        const imageUrl = item.imageUrl;

        return (
            <div
                className="flex items-start gap-4 px-2 cursor-pointer"
                onClick={onClick}
            >
                <img
                    src={imageUrl}
                    alt={item.name}
                    className="w-[70px] h-[90px] object-cover rounded"
                />

                <div className="flex flex-col flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-sm text-gray-800">Size: {item.size}</p>
                    <p className="text-sm text-gray-800"> Duration: {formatDate(item.eventDate)} - {formatDate(item.returnDate)}</p>
                    <p className="text-sm text-gray-800">Total Price : Rs.{item.totalPrice || (item.price * item.rentalDuration)}</p>
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    className="text-lg hover:text-red-500"
                >
                    <FaTimes />
                </button>
            </div>
        );
    };

    return (
        <div className=" fixed inset-0 bg-white/30 backdrop-blur-[1px] z-[999] sm:flex justify-end">

            <div className="bg-white w-[400px] h-full shadow-lg px-8 py-6  flex flex-col md:w-[450px]" >
                <div className="flex text-center items-center justify-around pt-7 mb-6 ">
                    <h2 className="text-2xl font-semibold underline">
                        {cartItems.length > 0
                            ? `${cartItems.length} ITEM${cartItems.length > 1 ? 'S' : ''} IN YOUR BAG`
                            : 'Your Shopping Cart'}
                    </h2>
                    <button onClick={onClose} className="text-2xl">
                        <FaTimes />
                    </button>
                </div>

                {cartItems.length === 0 ? (
                    <div className="text-center mt-20 flex-1">
                        <p className="text-xl font-semibold">
                            No items?! Even your bag’s starting to feel lonely.
                        </p>
                        <p className="mt-4 text-gray-600">Let’s give it some company!</p>
                        <button
                            onClick={handleContinueShopping}
                            className="bg-[#602e74] text-white mt-16 px-6 py-2 rounded font-bold"
                        >
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto no-scrollbar pr-1 space-y-4 mt-5 px-5">
                            {cartItems.map((item, index) => (
                                <CartItem
                                    key={index}
                                    item={item}
                                    onClick={() => handleProductClick(item)}
                                    onRemove={() => handleRemoveItem(index)}
                                />
                            ))}
                        </div>

                        <button
                            onClick={() => {
                                onClose();
                                navigate('/CartSummary');
                            }}
                            className="bg-[#602e74] text-white mt-6 py-2 rounded font-semibold"
                        >
                            VIEW BAG
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default CartDrawer;
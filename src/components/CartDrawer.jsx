import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { FaTimes } from 'react-icons/fa';

const CartDrawer = ({ onClose }) => {
    const navigate = useNavigate();
    const { cartItems, setCartItems } = useContext(CartContext);

    const handleContinueShopping = () => {
        onClose();
        navigate('/');
    };

    const handleProductClick = (item) => {
        localStorage.setItem('selectedProduct', JSON.stringify(item));
        onClose();
        navigate('/productDisplay');
    };

    const handleRemoveItem = (indexToRemove) => {
        const updated = cartItems.filter((_, i) => i !== indexToRemove);
        setCartItems(updated);
        localStorage.setItem('cart', JSON.stringify(updated));
    };

    //  CartItem Component
    const CartItem = ({ item, onClick, onRemove }) => {
        const initialUrl = `${import.meta.env.VITE_BACKEND_URL}/images/${item.gender}/${item.category}/${item.subcategory}s/${item.imageUrl}`;
        const fallbackUrl = `${import.meta.env.VITE_BACKEND_URL}/images/${item.gender}/${item.category}/${item.subcategory}/${item.imageUrl}`;
        const [imgSrc, setImgSrc] = React.useState(initialUrl);

        return (
            <div
                className="flex items-start gap-4 px-2 cursor-pointer"
                onClick={onClick}
            >
                <img
                    src={imgSrc}
                    alt={item.name}
                    onError={() => setImgSrc(fallbackUrl)}
                    className="w-[70px] h-[90px] object-cover rounded"
                />

                <div className="flex flex-col flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-sm text-gray-700">{item.ownerName}</p>
                    <p className="text-sm text-gray-600">SIZE: {item.size}</p>
                    <p className="text-sm font-medium">Rs. {item.price}</p>
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
        <div className=" hidden fixed inset-0 bg-white/30 backdrop-blur-[1px] z-[999] sm:flex justify-end">

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
                                navigate('/Cart');
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

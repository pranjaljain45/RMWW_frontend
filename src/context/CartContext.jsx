import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    // Load from localStorage
    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(storedCart);
    }, []);

    // Update localStorage on change
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (item) => {
        const updated = [...cartItems, item];
        setCartItems(updated);
    };

    const removeFromCart = (index) => {
        const updated = cartItems.filter((_, i) => i !== index);
        setCartItems(updated);
    };


    const clearCart = () => {
        setCartItems([]);
        localStorage.setItem('cart', JSON.stringify([]));
    };

    return (
        <CartContext.Provider value={{
            cartItems, setCartItems, addToCart, removeFromCart, clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
};

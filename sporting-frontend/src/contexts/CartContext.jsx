import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('clothing_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('clothing_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (productToAdd) => {
    setCartItems((prevItems) => {
      // So sánh theo id và size (chuỗi: "S", "M"...)
      const existingItemIndex = prevItems.findIndex(
        (item) => 
          item.id === productToAdd.id && 
          item.selectedSize?.size === productToAdd.selectedSize?.size
      );

      if (existingItemIndex > -1) {
        const newItems = [...prevItems];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + productToAdd.quantity
        };
        return newItems;
      } else {
        return [...prevItems, productToAdd];
      }
    });
  };

  const removeFromCart = (productId, sizeName) => {
    setCartItems((prevItems) => 
      prevItems.filter((item) => 
        !(item.id === productId && item.selectedSize?.size === sizeName)
      )
    );
  };

  const updateQuantity = (productId, sizeName, newQuantity) => {
    setCartItems((prevItems) => 
      prevItems.map((item) => 
        (item.id === productId && item.selectedSize?.size === sizeName)
          ? { ...item, quantity: Math.max(1, newQuantity) } 
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('clothing_cart');
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getTotalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
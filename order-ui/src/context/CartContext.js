import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    // Очищаем корзину если пользователь не авторизован
    if (!user) {
      setCart([]);
      return;
    }

    // Загружаем корзину только для авторизованных пользователей
    const savedCart = localStorage.getItem(`cart_${user.email}`);
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, [user]);

  const addToCart = (publication, subscriptionPeriod) => {
    // Запрещаем добавление в корзину для неавторизованных пользователей
    if (!user) return;

    const existingItemIndex = cart.findIndex(
      item => item.id === publication.id
    );

    let updatedCart;
    if (existingItemIndex > -1) {
      updatedCart = cart.map((item, index) => 
        index === existingItemIndex 
          ? { ...item, period: subscriptionPeriod } 
          : item
      );
    } else {
      updatedCart = [
        ...cart, 
        { 
          ...publication, 
          period: subscriptionPeriod,
          totalPrice: publication.pricePerMonth * subscriptionPeriod
        }
      ];
    }

    setCart(updatedCart);
    localStorage.setItem(`cart_${user.email}`, JSON.stringify(updatedCart));
  };

  const removeFromCart = (publicationId, period) => {
    if (!user) return;

    const updatedCart = cart.filter(
      item => !(item.id === publicationId && item.period === period)
    );
    
    setCart(updatedCart);
    localStorage.setItem(`cart_${user.email}`, JSON.stringify(updatedCart));
  };

  const updateCart = (publicationId, newPeriod) => {
    if (!user) return;

    const updatedCart = cart.map(item => {
      if (item.id === publicationId) {
        return { ...item, period: newPeriod, totalPrice: item.pricePerMonth * newPeriod };
      }
      return item;
    });
    setCart(updatedCart);
    localStorage.setItem(`cart_${user.email}`, JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    if (!user) return;
    
    setCart([]);
    localStorage.removeItem(`cart_${user.email}`);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => 
      total + (item.pricePerMonth * item.period), 0
    ).toFixed(2);
  };

  const getCartItemsCount = () => {
    return cart.length;
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateCart,
      clearCart,
      getTotalPrice,
      getCartItemsCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart должен использоваться внутри CartProvider');
  }
  return context;
};

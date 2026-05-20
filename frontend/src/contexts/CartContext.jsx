import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('meditrust_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('meditrust_cart', JSON.stringify(cart));
  }, [cart]);

  const MAX_QTY = 99;
  const MAX_ITEMS = 20;

  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        const newQty = Math.min(existing.qty + qty, MAX_QTY);
        if (newQty === existing.qty) { toast.info(`Maximum quantity reached for ${product.name}`); return prev; }
        toast.success(`Updated ${product.name} quantity in cart`);
        return prev.map(item => item.id === product.id ? { ...item, qty: newQty } : item);
      }
      if (prev.length >= MAX_ITEMS) { toast.warn('Cart is full (max 20 items)'); return prev; }
      toast.success(`${product.name} added to cart`);
      return [...prev, { id: product.id, name: product.name, price: product.price, image: product.image, qty: Math.min(qty, MAX_QTY) }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQty = (productId, qty) => {
    if (qty < 1) { removeFromCart(productId); return; }
    setCart(prev => prev.map(item =>
      item.id === productId ? { ...item, qty: Math.min(qty, MAX_QTY) } : item
    ));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price || 0) * item.qty, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

import { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../lib/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Load cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      setCart([]);
      setTotal(0);
      setItemCount(0);
    }
  }, [isAuthenticated]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      const { cart, total, itemCount } = response.data;
      setCart(cart);
      setTotal(total);
      setItemCount(itemCount);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (itemId, quantity = 1) => {
    try {
      setLoading(true);
      const response = await cartAPI.addToCart(itemId, quantity);
      const { cart, total } = response.data;
      setCart(cart);
      setTotal(total);
      setItemCount(cart.reduce((sum, item) => sum + item.quantity, 0));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to add item to cart' 
      };
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (cartItemId, quantity) => {
    try {
      setLoading(true);
      const response = await cartAPI.updateCartItem(cartItemId, quantity);
      const { cart, total } = response.data;
      setCart(cart);
      setTotal(total);
      setItemCount(cart.reduce((sum, item) => sum + item.quantity, 0));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update cart item' 
      };
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      setLoading(true);
      const response = await cartAPI.removeFromCart(cartItemId);
      const { cart, total } = response.data;
      setCart(cart);
      setTotal(total);
      setItemCount(cart.reduce((sum, item) => sum + item.quantity, 0));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to remove item from cart' 
      };
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      await cartAPI.clearCart();
      setCart([]);
      setTotal(0);
      setItemCount(0);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to clear cart' 
      };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    cart,
    total,
    itemCount,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    loadCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

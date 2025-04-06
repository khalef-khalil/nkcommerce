"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  fetchCart, 
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  removeCartItem as apiRemoveCartItem,
  clearCartItems as apiClearCartItems
} from '../services/api';
import { Cart, CartItem, Product } from '../types';
import { toast } from 'react-hot-toast';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateCartItem: (itemId: number, quantity: number) => Promise<void>;
  removeCartItem: (itemId: number) => Promise<void>;
  clearCartItems: () => Promise<void>;
  clearCart: () => void;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();
  
  const refreshCart = async () => {
    try {
      setIsLoading(true);
      const cartData = await fetchCart();
      setCart(cartData);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      toast.error("Impossible de récupérer le panier");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [token]); // Refresh cart when auth token changes

  const addToCart = async (productId: number, quantity: number) => {
    try {
      setIsLoading(true);
      const updatedCart = await apiAddToCart(productId, quantity);
      setCart(updatedCart);
      toast.success(`Produit ajouté au panier`);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error("Impossible d'ajouter au panier");
    } finally {
      setIsLoading(false);
    }
  };

  const updateCartItem = async (itemId: number, quantity: number) => {
    try {
      setIsLoading(true);
      const updatedCart = await apiUpdateCartItem(itemId, quantity);
      setCart(updatedCart);
    } catch (error) {
      console.error('Failed to update cart item:', error);
      toast.error("Impossible de mettre à jour le panier");
    } finally {
      setIsLoading(false);
    }
  };

  const removeCartItem = async (itemId: number) => {
    try {
      setIsLoading(true);
      const updatedCart = await apiRemoveCartItem(itemId);
      setCart(updatedCart);
      toast.success("Produit retiré du panier");
    } catch (error) {
      console.error('Failed to remove cart item:', error);
      toast.error("Impossible de retirer du panier");
    } finally {
      setIsLoading(false);
    }
  };

  const clearCartItems = async () => {
    try {
      setIsLoading(true);
      const updatedCart = await apiClearCartItems();
      setCart(updatedCart);
      toast.success("Panier vidé");
    } catch (error) {
      console.error('Failed to clear cart:', error);
      toast.error("Impossible de vider le panier");
    } finally {
      setIsLoading(false);
    }
  };

  // Used to clear the cart state locally (not on the server)
  const clearCart = () => {
    setCart(null);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        addToCart,
        updateCartItem,
        removeCartItem,
        clearCartItems,
        clearCart,
        refreshCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 
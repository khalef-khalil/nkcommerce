"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import CartItem from '../../components/CartItem';
import { ShoppingCart, ArrowRight, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const CartPage = () => {
  const { cart, isLoading, clearCartItems } = useCart();

  if (isLoading) {
    return (
      <div className="container-custom py-12">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="w-12 h-12 border-4 border-t-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500">Chargement du panier...</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.articles.length === 0) {
    return (
      <div className="container-custom py-12">
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <div className="flex flex-col items-center justify-center py-16">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
            >
              <ShoppingCart size={80} className="text-gray-300 mb-6" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Votre panier est vide</h2>
            <p className="text-gray-500 mb-8 text-center max-w-md">
              Visitez notre catalogue pour découvrir nos parfums de luxe et ajouter des produits à votre panier.
            </p>
            <Link href="/catalogue">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary text-white py-3 px-6 rounded-md flex items-center gap-2"
              >
                Découvrir nos produits
                <ArrowRight size={16} />
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <div className="flex justify-between items-center mb-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-800"
        >
          Votre Panier
        </motion.h1>
        
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={clearCartItems}
          className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50"
        >
          <Trash2 size={16} />
          Vider le panier
        </motion.button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-grow">
          <AnimatePresence>
            {cart.articles.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-1/3 bg-white p-6 rounded-lg shadow-sm h-fit"
        >
          <h2 className="text-xl font-bold mb-4 pb-4 border-b">Récapitulatif</h2>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Sous-total</span>
              <span>{cart.montant_total.toFixed(2)} MRU</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Livraison</span>
              <span>Gratuite</span>
            </div>
            <div className="flex justify-between pt-4 border-t font-bold">
              <span>Total</span>
              <span className="text-xl text-primary">{cart.montant_total.toFixed(2)} MRU</span>
            </div>
          </div>
          <Link href="/commande">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3 bg-secondary text-white rounded-md flex items-center justify-center gap-2"
            >
              Passer la commande
              <ArrowRight size={16} />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default CartPage; 
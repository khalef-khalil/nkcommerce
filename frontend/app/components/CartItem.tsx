"use client";

import React from 'react';
import Image from 'next/image';
import { Trash2, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { CartItem as CartItemType } from '../types';
import { useCart } from '../context/CartContext';

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const { updateCartItem, removeCartItem } = useCart();
  const { produit, quantite, montant_total } = item;

  const handleIncrement = () => {
    if (produit.stock > quantite) {
      updateCartItem(item.id, quantite + 1);
    }
  };

  const handleDecrement = () => {
    if (quantite > 1) {
      updateCartItem(item.id, quantite - 1);
    } else {
      handleRemove();
    }
  };

  const handleRemove = () => {
    removeCartItem(item.id);
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white rounded-lg shadow-sm mb-4"
    >
      <div className="relative w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
        {produit.image_principale ? (
          <Image
            src={produit.image_principale}
            alt={produit.nom}
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            Image non disponible
          </div>
        )}
      </div>

      <div className="flex-grow flex flex-col sm:flex-row items-center sm:items-start sm:justify-between w-full">
        <div className="text-center sm:text-left mb-2 sm:mb-0">
          <h3 className="font-medium text-gray-800">{produit.nom}</h3>
          <p className="text-sm text-gray-500 mt-1">{produit.marque} · {produit.volume}</p>
          <p className="text-sm font-medium text-primary mt-1">{Number(produit.prix).toFixed(2)} MRU</p>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              className="p-1 bg-gray-100 hover:bg-gray-200 rounded-l"
              onClick={handleDecrement}
              aria-label="Diminuer la quantité"
            >
              <Minus size={16} />
            </motion.button>
            <span className="w-10 text-center">{quantite}</span>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              className="p-1 bg-gray-100 hover:bg-gray-200 rounded-r"
              onClick={handleIncrement}
              aria-label="Augmenter la quantité"
              disabled={produit.stock <= quantite}
            >
              <Plus size={16} />
            </motion.button>
          </div>

          <div className="font-semibold text-gray-800">
            {montant_total.toFixed(2)} MRU
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            className="text-red-500 hover:text-red-600 p-1"
            onClick={handleRemove}
            aria-label="Supprimer l'article"
          >
            <Trash2 size={18} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem; 
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Product } from "../types";
import { useCart } from "../context/CartContext";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product page
    addToCart(product.id, 1);
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
    >
      <Link href={`/produit/${product.slug}`}>
        <div className="relative aspect-[4/3] bg-gray-100">
          {product.image_principale ? (
            <Image
              src={product.image_principale}
              alt={product.nom}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <span>Image non disponible</span>
            </div>
          )}
          {!product.disponible && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <span className="text-white font-semibold px-3 py-1 rounded">Non disponible</span>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="text-sm text-gray-500 mb-1">{product.marque}</div>
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">{product.nom}</h3>
          <div className="flex justify-between items-center">
            <span className="text-primary font-bold">{Number(product.prix).toFixed(2)} MRU</span>
            <span className="text-sm text-gray-500">{product.volume}</span>
          </div>
          <div className="mt-4">
            <motion.button 
              className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-secondary text-white rounded-md hover:bg-secondary/90 transition-colors"
              disabled={!product.disponible}
              onClick={handleAddToCart}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart size={16} /> 
              <span>Ajouter au panier</span>
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard; 
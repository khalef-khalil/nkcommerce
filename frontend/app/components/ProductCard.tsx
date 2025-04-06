"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Product } from "../types";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  // Temp placeholder image while we don't have real images
  const imageUrl = product.image_principale || "/images/placeholder-perfume.jpg";

  return (
    <motion.div
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="card"
    >
      <Link href={`/produit/${product.slug}`} className="block h-full">
        <div className="relative h-64 bg-gray-100">
          {product.image_principale ? (
            <Image
              src={imageUrl}
              alt={product.nom}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-100">
              <span className="text-gray-400 text-4xl">NK</span>
            </div>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded">
              Stock limité
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              Indisponible
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
            <button 
              className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-secondary text-white rounded-md hover:bg-secondary/90 transition-colors"
              disabled={!product.disponible}
            >
              <ShoppingCart size={16} /> 
              <span>Ajouter au panier</span>
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard; 
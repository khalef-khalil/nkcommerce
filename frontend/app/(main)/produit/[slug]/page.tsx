"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart, Star, Minus, Plus, ArrowLeft, ArrowRight } from "lucide-react";
import { fetchProductBySlug, fetchProducts } from "../../../services/api";
import { Product } from "../../../types";
import { notFound } from "next/navigation";
import toast from "react-hot-toast";
import { useCart } from "../../../context/CartContext";

interface ProductDetailPageProps {
  params: {
    slug: string;
  };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = params;
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadData = async () => {
      try {
        const productData = await fetchProductBySlug(slug);
        setProduct(productData);
        setSelectedImage(productData.image_principale);

        // Load related products (same category)
        const allProducts = await fetchProducts();
        const related = allProducts
          .filter(
            (p: Product) => 
              p.categorie.id === productData.categorie.id && 
              p.id !== productData.id
          )
          .slice(0, 4);
        setRelatedProducts(related);
      } catch (error) {
        console.error("Error loading product:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product.id, quantity);
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    } else {
      toast.error("Quantité maximale atteinte");
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return notFound();
  }

  // Placeholder image handling
  const mainImage = selectedImage || product.image_principale || "/images/placeholder-perfume.jpg";
  const productImages = product.images.length > 0 
    ? [product.image_principale, ...product.images].filter(Boolean) 
    : ["/images/placeholder-perfume.jpg"];

  return (
    <div className="min-h-screen">
      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex flex-wrap">
            <Link href="/" className="text-gray-500 hover:text-primary">
              Accueil
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/catalogue" className="text-gray-500 hover:text-primary">
              Catalogue
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link 
              href={`/categories/${product.categorie.slug}`} 
              className="text-gray-500 hover:text-primary"
            >
              {product.categorie.nom}
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-primary">{product.nom}</span>
          </nav>
        </div>

        {/* Product Info */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Product Images */}
            <div>
              <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden mb-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mainImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative h-full w-full"
                  >
                    <Image
                      src={mainImage}
                      alt={product.nom}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
              
              {/* Thumbnail Images */}
              {productImages.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {productImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(img)}
                      className={`relative h-20 w-20 rounded border-2 flex-shrink-0 ${
                        img === selectedImage ? "border-primary" : "border-transparent"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.nom} - image ${index + 1}`}
                        fill
                        className="object-cover rounded"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-sm text-gray-500 mb-1">{product.marque}</div>
                <h1 className="text-3xl font-bold mb-2">{product.nom}</h1>
                
                <div className="flex items-center mb-4">
                  <div className="flex mr-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className={star <= 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">(12 avis)</span>
                </div>
                
                <div className="text-2xl font-bold text-primary mb-4">
                  {Number(product.prix).toFixed(2)} MRU
                </div>
                
                <div className="border-t border-b border-gray-200 py-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Volume</span>
                    <span className="font-medium">{product.volume}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Disponibilité</span>
                    <span className={`font-medium ${product.disponible ? "text-green-600" : "text-red-600"}`}>
                      {product.disponible ? (
                        product.stock > 5 ? "En stock" : "Stock limité"
                      ) : (
                        "Épuisé"
                      )}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6">{product.description}</p>
                
                {product.disponible && (
                  <>
                    <div className="flex items-center space-x-4 mb-6">
                      <span className="text-gray-700">Quantité:</span>
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button
                          onClick={decrementQuantity}
                          className="px-3 py-1 border-r border-gray-300"
                          disabled={quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 py-1">{quantity}</span>
                        <button
                          onClick={incrementQuantity}
                          className="px-3 py-1 border-l border-gray-300"
                          disabled={quantity >= product.stock}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex space-x-4">
                      <button
                        onClick={handleAddToCart}
                        className="flex-1 btn-primary flex items-center justify-center gap-2"
                      >
                        <ShoppingCart size={18} />
                        <span>Ajouter au panier</span>
                      </button>
                      <button className="p-3 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
                        <Heart size={18} />
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Produits similaires</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <motion.div
                  key={relatedProduct.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3 }}
                >
                  <Link href={`/produit/${relatedProduct.slug}`} className="block">
                    <div className="card">
                      <div className="relative h-64 bg-gray-100">
                        {relatedProduct.image_principale ? (
                          <Image
                            src={relatedProduct.image_principale}
                            alt={relatedProduct.nom}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <span className="text-gray-400 text-4xl">NK</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="text-sm text-gray-500 mb-1">{relatedProduct.marque}</div>
                        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{relatedProduct.nom}</h3>
                        <div className="flex justify-between items-center">
                          <span className="text-primary font-bold">{Number(relatedProduct.prix).toFixed(2)} MRU</span>
                          <span className="text-sm text-gray-500">{relatedProduct.volume}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
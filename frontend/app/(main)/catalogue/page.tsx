"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchProducts, fetchCategories } from "../../services/api";
import ProductCard from "../../components/ProductCard";
import { Product, Category } from "../../types";
import { Search, Filter, X } from "lucide-react";

export default function CataloguePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts(),
          fetchCategories()
        ]);
        setProducts(productsData);
        setFilteredProducts(productsData);
        setCategories(categoriesData);

        // Set max price range based on product data
        const maxPrice = Math.max(...productsData.map((p: Product) => Number(p.prix)));
        setPriceRange([0, Math.ceil(maxPrice)]);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    // Filter products based on search query, category, and price
    let filtered = [...products];

    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.marque.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.categorie.id === selectedCategory
      );
    }

    filtered = filtered.filter(
      (product) => 
        Number(product.prix) >= priceRange[0] && 
        Number(product.prix) <= priceRange[1]
    );

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, priceRange, products]);

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = Number(event.target.value);
    const newPriceRange = [...priceRange] as [number, number];
    newPriceRange[index] = newValue;
    setPriceRange(newPriceRange);
  };

  const handleReset = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setPriceRange([0, Math.max(...products.map((p: Product) => Number(p.prix)))]);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-primary text-white py-12">
        <div className="container-custom text-center">
          <h1 className="text-4xl font-bold mb-4">Catalogue de Parfums</h1>
          <p className="text-lg max-w-2xl mx-auto">
            Découvrez notre collection exclusive de parfums pour hommes et femmes
          </p>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-md"
          >
            {isFilterOpen ? <X size={18} /> : <Filter size={18} />}
            {isFilterOpen ? "Fermer les filtres" : "Filtres"}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar */}
          <motion.aside
            className={`${
              isFilterOpen ? "block" : "hidden"
            } md:block w-full md:w-1/4 bg-white p-4 rounded-lg shadow-sm`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3">Recherche</h3>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-full p-2 pl-10 border border-gray-300 rounded-md"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3">Catégories</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="all-categories"
                    name="category"
                    checked={selectedCategory === null}
                    onChange={() => handleCategoryChange(null)}
                    className="mr-2"
                  />
                  <label htmlFor="all-categories">Toutes les catégories</label>
                </div>
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center">
                    <input
                      type="radio"
                      id={`category-${category.id}`}
                      name="category"
                      checked={selectedCategory === category.id}
                      onChange={() => handleCategoryChange(category.id)}
                      className="mr-2"
                    />
                    <label htmlFor={`category-${category.id}`}>{category.nom}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3">Prix</h3>
              <div className="flex justify-between mb-2">
                <span>{priceRange[0]} MRU</span>
                <span>{priceRange[1]} MRU</span>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="min-price" className="block text-sm text-gray-600">Min</label>
                  <input
                    type="range"
                    id="min-price"
                    min={0}
                    max={Math.max(...products.map((p: Product) => Number(p.prix)))}
                    value={priceRange[0]}
                    onChange={(e) => handlePriceChange(e, 0)}
                    className="w-full"
                  />
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceChange(e, 0)}
                    className="w-full p-2 border border-gray-300 rounded-md mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="max-price" className="block text-sm text-gray-600">Max</label>
                  <input
                    type="range"
                    id="max-price"
                    min={0}
                    max={Math.max(...products.map((p: Product) => Number(p.prix)))}
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange(e, 1)}
                    className="w-full"
                  />
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange(e, 1)}
                    className="w-full p-2 border border-gray-300 rounded-md mt-1"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </motion.aside>

          {/* Product Grid */}
          <div className="w-full md:w-3/4">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-lg text-center">
                <h3 className="text-xl font-semibold mb-2">Aucun produit trouvé</h3>
                <p className="text-gray-600 mb-4">
                  Aucun produit ne correspond à vos critères de recherche.
                </p>
                <button
                  onClick={handleReset}
                  className="btn-primary"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
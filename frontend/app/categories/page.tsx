import { fetchCategories } from "../services/api";
import CategoryCard from "../components/CategoryCard";
import { motion } from "framer-motion";

export default async function CategoriesPage() {
  const categories = await fetchCategories();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-primary text-white py-12">
        <div className="container-custom text-center">
          <h1 className="text-4xl font-bold mb-4">Catégories de Parfums</h1>
          <p className="text-lg max-w-2xl mx-auto">
            Explorez notre collection par catégories
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
} 
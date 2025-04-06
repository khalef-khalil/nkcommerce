"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Category } from "../types";

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  const imageUrl = category.image || "/images/placeholder-category.jpg";

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-lg shadow-md"
    >
      <Link href={`/categories/${category.slug}`}>
        <div className="relative h-48 w-full">
          <Image
            src={imageUrl}
            alt={category.nom}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-xl font-bold text-white">{category.nom}</h3>
              {category.description && (
                <p className="text-white/80 text-sm mt-1 line-clamp-2">
                  {category.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard; 
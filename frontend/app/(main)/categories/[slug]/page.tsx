import { fetchProducts, fetchCategories } from "../../../services/api";
import ProductCard from "../../../components/ProductCard";
import Link from "next/link";
import { notFound } from "next/navigation";

interface CategoryDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function CategoryDetailPage({ params }: CategoryDetailPageProps) {
  const { slug } = params;
  
  // Fetch all categories and products
  const [categories, allProducts] = await Promise.all([
    fetchCategories(),
    fetchProducts(),
  ]);

  // Find the current category
  const category = categories.find((cat) => cat.slug === slug);
  
  // If category doesn't exist, show 404
  if (!category) {
    notFound();
  }

  // Filter products for this category
  const products = allProducts.filter(
    (product) => product.categorie.id === category.id
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-primary text-white py-12">
        <div className="container-custom text-center">
          <h1 className="text-4xl font-bold mb-4">{category.nom}</h1>
          {category.description && (
            <p className="text-lg max-w-2xl mx-auto">{category.description}</p>
          )}
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex">
            <Link href="/" className="text-gray-500 hover:text-primary">
              Accueil
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/categories" className="text-gray-500 hover:text-primary">
              Catégories
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-primary">{category.nom}</span>
          </nav>
        </div>

        {/* Products */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg text-center">
            <h3 className="text-xl font-semibold mb-2">Aucun produit trouvé</h3>
            <p className="text-gray-600 mb-4">
              Cette catégorie ne contient aucun produit pour le moment.
            </p>
            <Link href="/catalogue" className="btn-primary">
              Voir tout le catalogue
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 
import Image from "next/image";
import Link from "next/link";
import Carousel from "../components/Carousel";
import { fetchProducts, fetchCategories } from "../services/api";
import ProductCard from "../components/ProductCard";
import CategoryCard from "../components/CategoryCard";

export default async function Home() {
  // Fetch data
  const products = await fetchProducts();
  const categories = await fetchCategories();

  // Featured products (first 4)
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Carousel */}
      <Carousel />

      {/* Featured Categories */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-8 text-center">Catégories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-8 text-center">Produits Populaires</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/catalogue" className="btn-primary">
              Voir tout le catalogue
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 bg-primary text-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3h18v18H3z"></path>
                  <path d="m16 10-4 4-4-4"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Livraison Gratuite</h3>
              <p className="text-white/80">Livraison gratuite pour toutes les commandes à Nouakchott</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Produits Authentiques</h3>
              <p className="text-white/80">Tous nos parfums sont 100% authentiques et certifiés</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect>
                  <path d="M9 14l2 2 4-4"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Service Client</h3>
              <p className="text-white/80">Notre équipe est à votre disposition 7j/7</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">À Propos de NK Commerce</h2>
              <p className="mb-4">
                NK Commerce est votre boutique en ligne mauritanienne spécialisée dans la vente de parfums de luxe. Nous proposons une large gamme de parfums pour hommes et femmes des plus grandes marques internationales.
              </p>
              <p className="mb-6">
                Notre mission est de vous offrir des produits authentiques à des prix compétitifs, avec un service client exceptionnel.
              </p>
              <Link href="/a-propos" className="btn-secondary">
                En savoir plus
              </Link>
            </div>
            <div className="relative h-80 md:h-96">
              <Image
                src="/images/about-image.jpg"
                alt="NK Commerce"
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

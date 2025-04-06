"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, ShoppingCart, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              NK Commerce
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary transition-colors">
              Accueil
            </Link>
            <Link href="/catalogue" className="text-gray-700 hover:text-primary transition-colors">
              Catalogue
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-primary transition-colors">
              Catégories
            </Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <button aria-label="Rechercher" className="p-2 text-gray-700 hover:text-primary transition-colors">
              <Search size={20} />
            </button>
            <Link href="/panier" className="p-2 text-gray-700 hover:text-primary transition-colors relative">
              <ShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Link>
            <button 
              aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"} 
              className="p-2 text-gray-700 md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4"
          >
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-primary transition-colors py-2 border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link 
                href="/catalogue" 
                className="text-gray-700 hover:text-primary transition-colors py-2 border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Catalogue
              </Link>
              <Link 
                href="/categories" 
                className="text-gray-700 hover:text-primary transition-colors py-2 border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Catégories
              </Link>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Navbar; 
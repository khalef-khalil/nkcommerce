"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logoutUser } = useAuth();
  const { cart } = useCart();

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
              {cart && cart.nombre_articles > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-secondary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                >
                  {cart.nombre_articles}
                </motion.span>
              )}
            </Link>

            {/* User Authentication */}
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  aria-label="Profil utilisateur" 
                  className="p-2 text-gray-700 hover:text-primary transition-colors relative"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center"
                  >
                    <User size={20} />
                    <span className="ml-2 hidden sm:inline">{user?.username}</span>
                  </motion.div>
                </button>
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
                    >
                      <Link 
                        href="/profil" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Mon profil
                      </Link>
                      <Link 
                        href="/commandes" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Mes commandes
                      </Link>
                      <button 
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logoutUser();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <div className="flex items-center">
                          <LogOut size={16} className="mr-2" />
                          Déconnexion
                        </div>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Link 
                  href="/connexion"
                  className="text-gray-700 hover:text-primary transition-colors"
                >
                  Connexion
                </Link>
                <span className="text-gray-400">|</span>
                <Link 
                  href="/inscription"
                  className="text-gray-700 hover:text-primary transition-colors"
                >
                  Inscription
                </Link>
              </div>
            )}
            
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
        <AnimatePresence>
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
                {!isAuthenticated ? (
                  <>
                    <Link 
                      href="/connexion" 
                      className="text-gray-700 hover:text-primary transition-colors py-2 border-b border-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Connexion
                    </Link>
                    <Link 
                      href="/inscription" 
                      className="text-gray-700 hover:text-primary transition-colors py-2 border-b border-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Inscription
                    </Link>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/profil" 
                      className="text-gray-700 hover:text-primary transition-colors py-2 border-b border-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Mon profil
                    </Link>
                    <Link 
                      href="/commandes" 
                      className="text-gray-700 hover:text-primary transition-colors py-2 border-b border-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Mes commandes
                    </Link>
                    <button 
                      onClick={() => {
                        setIsMenuOpen(false);
                        logoutUser();
                      }}
                      className="text-left text-gray-700 hover:text-primary transition-colors py-2 border-b border-gray-100"
                    >
                      <div className="flex items-center">
                        <LogOut size={16} className="mr-2" />
                        Déconnexion
                      </div>
                    </button>
                  </>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar; 
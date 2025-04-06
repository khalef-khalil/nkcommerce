"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-4">NK Commerce</h3>
            <p className="text-gray-300">
              Votre boutique en ligne mauritanienne spécialisée dans la vente de parfums de qualité.
            </p>
          </motion.div>

          {/* Links Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/catalogue" className="text-gray-300 hover:text-white transition-colors">
                  Catalogue
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-300 hover:text-white transition-colors">
                  Catégories
                </Link>
              </li>
              <li>
                <Link href="/a-propos" className="text-gray-300 hover:text-white transition-colors">
                  À Propos
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <address className="not-italic text-gray-300 space-y-2">
              <p>Nouakchott, Mauritanie</p>
              <p>Email: contact@nkcommerce.mr</p>
              <p>Téléphone: +222 XX XX XX XX</p>
            </address>
          </motion.div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} NK Commerce. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
"use client";

import { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 flex flex-col">
      <div className="container-custom py-6">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-primary transition-colors"
          >
            <ChevronLeft size={16} className="mr-1" />
            Retour à l'accueil
          </Link>
        </motion.div>
      </div>

      <main className="flex-grow flex items-center justify-center">
        {children}
      </main>

      <footer className="py-6 text-center text-gray-500 text-sm">
        <div className="container-custom">
          <p>© {new Date().getFullYear()} NK Commerce. Tous droits réservés.</p>
        </div>
      </footer>

      <Toaster position="top-center" />
    </div>
  );
} 
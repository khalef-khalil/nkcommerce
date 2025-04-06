"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { BellIcon, SearchIcon } from "lucide-react";
import { useState } from "react";

// Map paths to titles in French
const pathTitles: Record<string, string> = {
  "/admin/tableau-de-bord": "Tableau de Bord",
  "/admin/tableau-de-bord/produits": "Gestion des Produits",
  "/admin/tableau-de-bord/commandes": "Gestion des Commandes",
  "/admin/tableau-de-bord/statistiques": "Statistiques",
};

export default function AdminHeader() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get the current page title
  const pageTitle = pathTitles[pathname] || "Administration";
  
  // Current date in French format
  const currentDate = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  // Capitalize first letter of the date
  const formattedDate = currentDate.charAt(0).toUpperCase() + currentDate.slice(1);

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white py-4 px-6 shadow-sm flex items-center justify-between"
    >
      <div>
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-bold text-gray-800"
        >
          {pageTitle}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-gray-500"
        >
          {formattedDate}
        </motion.p>
      </div>
      
      <div className="flex items-center space-x-4">
        <motion.div 
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "auto" }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher..."
            className="py-2 pl-9 pr-4 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 w-64"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors relative">
            <BellIcon className="h-6 w-6 text-gray-600" />
            <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white" />
          </button>
        </motion.div>
      </div>
    </motion.header>
  );
} 
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBagIcon, PackageIcon, LayoutDashboardIcon, BarChart3Icon, LogOutIcon } from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuthContext";

// Navigation items with French labels
const navItems = [
  {
    path: "/admin/tableau-de-bord",
    name: "Tableau de bord",
    icon: <LayoutDashboardIcon className="h-5 w-5" />,
  },
  {
    path: "/admin/produits",
    name: "Produits",
    icon: <PackageIcon className="h-5 w-5" />,
  },
  {
    path: "/admin/commandes",
    name: "Commandes",
    icon: <ShoppingBagIcon className="h-5 w-5" />,
  },
  {
    path: "/admin/statistiques",
    name: "Statistiques",
    icon: <BarChart3Icon className="h-5 w-5" />,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logoutAdmin, admin } = useAdminAuth();

  return (
    <motion.div 
      initial={{ x: -100, opacity: 0 }} 
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-64 h-screen bg-white shadow-lg flex flex-col"
    >
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <h1 className="text-xl font-bold text-indigo-900">NK Commerce</h1>
          <p className="text-sm text-gray-500 mt-1">Administration</p>
        </motion.div>
      </div>
      
      <div className="p-4 flex-1">
        <nav className="space-y-1">
          {navItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Link href={item.path}>
                <div 
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    pathname === item.path
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                  
                  {pathname === item.path && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="w-1 h-full absolute right-0 bg-indigo-600 rounded-l"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-4"
        >
          <div className="flex items-center px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold">
              {admin?.username?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">{admin?.username || 'Admin'}</p>
              <p className="text-xs text-gray-500">{admin?.email}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          onClick={logoutAdmin}
          className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOutIcon className="h-5 w-5 mr-3" />
          <span className="font-medium">Déconnexion</span>
        </motion.button>
      </div>
    </motion.div>
  );
} 
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ShoppingBagIcon, PackageIcon, LayoutDashboardIcon, BarChart3Icon, LogOutIcon } from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuthContext";

const navItems = [
  {
    path: "/admin/tableau-de-bord",
    icon: <LayoutDashboardIcon className="h-6 w-6" />,
  },
  {
    path: "/admin/produits",
    icon: <PackageIcon className="h-6 w-6" />,
  },
  {
    path: "/admin/commandes",
    icon: <ShoppingBagIcon className="h-6 w-6" />,
  },
  {
    path: "/admin/statistiques",
    icon: <BarChart3Icon className="h-6 w-6" />,
  },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { logoutAdmin } = useAdminAuth();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center justify-center w-full h-full ${
              pathname === item.path
                ? "text-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {item.icon}
          </Link>
        ))}
        <button
          onClick={logoutAdmin}
          className="flex items-center justify-center w-full h-full text-gray-500 hover:text-red-600"
        >
          <LogOutIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
} 
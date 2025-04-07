"use client";

import { usePathname } from "next/navigation";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Don't show navbar and footer on auth pages or admin pages
  const isAuthPage = pathname === "/connexion" || pathname === "/inscription";
  const isAdminPage = pathname.startsWith("/admin");
  
  if (isAuthPage || isAdminPage) {
    return <>{children}</>;
  }
  
  // For all other pages, show navbar and footer
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
} 
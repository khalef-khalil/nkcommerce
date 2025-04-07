"use client";

import React from 'react';
import { AdminAuthProvider } from '../context/AdminAuthContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import AdminSidebar from '../components/admin/Sidebar';
import AdminHeader from '../components/admin/Header';
import { Loader2 } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { usePathname } from 'next/navigation';
import '../globals.css';

function AdminDashboardWrapper({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useAdminAuth();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // If not authenticated and not loading, the middleware should redirect
  if (!isAuthenticated && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-xl font-bold text-center text-red-600 mb-4">
            Accès non autorisé
          </h1>
          <p className="text-gray-600 text-center">
            Vous n&apos;êtes pas autorisé à accéder à cette section. Veuillez vous connecter en tant qu&apos;administrateur.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Special case for login or unauthorized routes
  const isAuthRoute = pathname === '/admin/connexion' || pathname === '/admin/deconnexion';

  return (
    <AdminAuthProvider>
      <Toaster position="top-right" />
      {isAuthRoute ? (
        <div className="min-h-screen bg-gray-100">
          {children}
        </div>
      ) : (
        <AdminDashboardWrapper>{children}</AdminDashboardWrapper>
      )}
    </AdminAuthProvider>
  );
} 
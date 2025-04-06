"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Loader2 } from 'lucide-react';

export default function AdminLogoutPage() {
  const { logoutAdmin } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      try {
        logoutAdmin();
      } catch (error) {
        console.error("Erreur lors de la déconnexion:", error);
      }
    };

    performLogout();
  }, [logoutAdmin, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center">
        <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
        <p className="mt-4 text-gray-600">Déconnexion en cours...</p>
      </div>
    </div>
  );
} 
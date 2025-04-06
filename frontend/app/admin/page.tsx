"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AdminRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the admin dashboard
    router.push('/admin/tableau-de-bord');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center">
        <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
        <p className="mt-4 text-gray-600">Redirection vers le tableau de bord...</p>
      </div>
    </div>
  );
} 
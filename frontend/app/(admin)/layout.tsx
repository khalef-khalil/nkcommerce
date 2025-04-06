"use client";

import React from 'react';
import { AdminAuthProvider } from '../context/AdminAuthContext';
import { Toaster } from 'react-hot-toast';
import '../globals.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <div className="min-h-screen bg-gray-100">
        <Toaster position="top-right" />
        {children}
      </div>
    </AdminAuthProvider>
  );
} 
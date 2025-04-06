"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function LogoutPage() {
  const { logoutUser, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      if (isAuthenticated) {
        logoutUser();
      } else {
        // If not authenticated, redirect to home
        setTimeout(() => {
          router.push("/");
        }, 1500);
      }
    };

    performLogout();
  }, [logoutUser, router, isAuthenticated]);

  return (
    <div className="container-custom py-10 min-h-screen flex items-center justify-center">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="mb-6 text-primary"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <svg
            className="w-16 h-16 mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        </motion.div>
        <h1 className="text-2xl font-bold text-primary mb-2">Déconnexion en cours</h1>
        <p className="text-gray-600">Vous allez être redirigé vers la page d'accueil...</p>
      </motion.div>
    </div>
  );
} 
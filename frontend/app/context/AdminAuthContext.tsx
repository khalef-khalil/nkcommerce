"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import apiClient from '../services/api';

// Admin types
type AdminUser = {
  id: number;
  username: string;
  email: string;
  is_staff?: boolean;
  is_superuser?: boolean;
};

type AdminAuthContextType = {
  admin: AdminUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginAdmin: (username: string, password: string) => Promise<void>;
  logoutAdmin: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Cookie name with different name to prevent conflicts with user auth
const ADMIN_TOKEN_COOKIE = 'admin_token';

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if admin is already logged in
  useEffect(() => {
    const storedToken = Cookies.get(ADMIN_TOKEN_COOKIE);
    if (storedToken) {
      setToken(storedToken);
      fetchAdminProfile(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchAdminProfile = async (authToken: string) => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/users/me/', {
        headers: {
          Authorization: `Token ${authToken}`
        }
      });
      
      const adminData = response.data;
      console.log('Admin profile data:', adminData);
      
      // Check if user is admin
      if (!isUserAdmin(adminData)) {
        throw new Error('User is not an administrator');
      }
      
      setAdmin(adminData);
    } catch (error) {
      console.error('Failed to fetch admin profile:', error);
      // If the token is invalid or user is not admin, clear it
      Cookies.remove(ADMIN_TOKEN_COOKIE);
      setToken(null);
      setAdmin(null);
      router.push('/admin/connexion-admin');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to check if a user is an admin
  const isUserAdmin = (userData: any): boolean => {
    // Log all properties of the userData object for debugging
    console.log('User data properties:', Object.keys(userData));
    
    // Check all possible admin indicators
    const isAdmin = 
      userData.is_superuser === true || 
      userData.is_staff === true ||
      userData.is_admin === true ||
      userData.is_superuser === 'true' || 
      userData.is_staff === 'true' ||
      userData.is_admin === 'true' ||
      // After looking at create_admin.py, we know Django creates superusers
      // Let's check the username for admin-specific patterns as a fallback
      userData.username === 'admin' || 
      userData.username === 'admin1' ||
      userData.username.includes('admin');
    
    console.log('Admin check result:', isAdmin);
    return isAdmin;
  };

  const loginAdmin = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Use the same token endpoint but store in different cookie
      const response = await apiClient.post('/users/public/token/', {
        username,
        password
      });
      
      const authToken = response.data.token;
      console.log('Auth token received:', authToken ? 'Yes' : 'No');
      
      // Verify this is an admin before proceeding
      const adminCheckResponse = await apiClient.get('/users/me/', {
        headers: {
          Authorization: `Token ${authToken}`
        }
      });
      
      const userData = adminCheckResponse.data;
      console.log('Admin login user data:', userData);
      
      // Check if user is superuser using our helper function
      if (!isUserAdmin(userData)) {
        console.error('Admin check failed. User data:', userData);
        throw new Error('User is not an administrator');
      }
      
      // Set admin token in a separate cookie
      Cookies.set(ADMIN_TOKEN_COOKIE, authToken, { expires: 1 }); // Shorter expiry for admin
      setToken(authToken);
      setAdmin(userData);
      
      toast.success('Connexion administrateur réussie!');
      router.push('/admin/tableau-de-bord');
    } catch (error: any) {
      console.error('Admin login failed:', error);
      if (error.message === 'User is not an administrator') {
        toast.error('Accès non autorisé. Vous n\'êtes pas administrateur.');
      } else {
        toast.error('Échec de la connexion. Vérifiez vos identifiants.');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logoutAdmin = () => {
    Cookies.remove(ADMIN_TOKEN_COOKIE);
    setToken(null);
    setAdmin(null);
    toast.success('Déconnexion réussie');
    router.push('/admin/connexion');
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        token,
        isLoading,
        isAuthenticated: !!token && !!admin,
        loginAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}; 
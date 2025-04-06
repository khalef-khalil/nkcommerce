"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { register, login, getUserProfile } from '../services/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

type User = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  profil?: {
    telephone: string;
    adresse: string;
    ville: string;
    photo: string | null;
  };
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginUser: (username: string, password: string) => Promise<void>;
  registerUser: (username: string, email: string, password: string) => Promise<void>;
  logoutUser: () => void;
  refreshUserProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const storedToken = Cookies.get('token');
    if (storedToken) {
      setToken(storedToken);
      fetchUserProfile();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const userData = await getUserProfile();
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      // If the token is invalid, clear it
      Cookies.remove('token');
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const loginUser = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      const data = await login(username, password);
      
      // The token endpoint only returns { token: "..." }
      Cookies.set('token', data.token, { expires: 7 }); // expires in 7 days
      setToken(data.token);
      
      // After getting the token, fetch the user profile
      await fetchUserProfile();
      
      toast.success('Connexion réussie!');
      router.push('/profil');
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Échec de la connexion. Vérifiez vos identifiants.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const registerUser = async (username: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const data = await register(username, email, password);
      Cookies.set('token', data.token, { expires: 7 }); // expires in 7 days
      setToken(data.token);
      setUser(data);
      toast.success('Inscription réussie!');
      router.push('/profil');
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error('Échec de l\'inscription. Veuillez réessayer.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logoutUser = () => {
    Cookies.remove('token');
    setToken(null);
    setUser(null);
    toast.success('Déconnexion réussie');
    router.push('/');
  };

  const refreshUserProfile = async () => {
    if (token) {
      await fetchUserProfile();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        loginUser,
        registerUser,
        logoutUser,
        refreshUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
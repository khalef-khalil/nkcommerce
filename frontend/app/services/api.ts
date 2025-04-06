import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to inject token for authorized requests
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication
export const register = async (username: string, email: string, password: string) => {
  const response = await apiClient.post('/users/public/register/', {
    username,
    email,
    password
  });
  return response.data;
};

export const login = async (username: string, password: string) => {
  const response = await apiClient.post('/users/public/token/', {
    username,
    password
  });
  return response.data;
};

export const getUserProfile = async () => {
  const response = await apiClient.get('/users/me/');
  return response.data;
};

type UserUpdateData = {
  first_name?: string;
  last_name?: string;
  telephone?: string;
  adresse?: string;
  ville?: string;
  profil?: {
    telephone?: string;
    adresse?: string;
    ville?: string;
  };
};

export const updateUserProfile = async (userData: UserUpdateData) => {
  try {
    // Handle all updates through the /users/me/ endpoint
    const response = await apiClient.patch('/users/me/', userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Produits
export const fetchProducts = async () => {
  const response = await apiClient.get('/products/');
  return response.data;
};

export const fetchProductBySlug = async (slug: string) => {
  const response = await apiClient.get(`/products/${slug}/`);
  return response.data;
};

// Catégories
export const fetchCategories = async () => {
  const response = await apiClient.get('/products/categories/');
  return response.data;
};

// Commandes
export const fetchCart = async () => {
  const response = await apiClient.get('/orders/panier/');
  return response.data;
};

export const addToCart = async (productId: number, quantity: number) => {
  const response = await apiClient.post('/orders/panier/ajouter_produit/', {
    produit_id: productId,
    quantite: quantity
  });
  return response.data;
};

export const updateCartItem = async (itemId: number, quantity: number) => {
  const response = await apiClient.post('/orders/panier/modifier_quantite/', {
    article_id: itemId,
    quantite: quantity
  });
  return response.data;
};

export const removeCartItem = async (itemId: number) => {
  const response = await apiClient.delete(`/orders/panier/articles/${itemId}/`);
  return response.data;
};

export const convertCartToOrder = async (orderData: any) => {
  const response = await apiClient.post('/orders/panier/convertir_en_commande/', orderData);
  return response.data;
};

export const fetchOrders = async () => {
  const response = await apiClient.get('/orders/commandes/');
  return response.data;
};

export const fetchOrderById = async (orderId: number) => {
  const response = await apiClient.get(`/orders/commandes/${orderId}/`);
  return response.data;
};

export default apiClient; 
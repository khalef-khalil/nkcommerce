import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export default apiClient; 
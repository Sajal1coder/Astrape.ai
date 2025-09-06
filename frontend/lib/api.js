import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('token');
      Cookies.remove('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/me'),
};

// Items API
export const itemsAPI = {
  getItems: (params) => api.get('/items', { params }),
  getItem: (id) => api.get(`/items/${id}`),
  createItem: (itemData) => api.post('/items', itemData),
  updateItem: (id, itemData) => api.put(`/items/${id}`, itemData),
  deleteItem: (id) => api.delete(`/items/${id}`),
  getCategories: () => api.get('/items/meta/categories'),
};

// Cart API
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (itemId, quantity) => api.post('/cart/add', { itemId, quantity }),
  updateCartItem: (cartItemId, quantity) => api.put(`/cart/update/${cartItemId}`, { quantity }),
  removeFromCart: (cartItemId) => api.delete(`/cart/remove/${cartItemId}`),
  clearCart: () => api.delete('/cart/clear'),
};

export default api;

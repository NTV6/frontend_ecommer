import axios from 'axios';
import { auth } from '../lib/firebase';
// Cấu hình axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Cập nhật interceptor để sử dụng Firebase token
api.interceptors.request.use(
  async (config) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error('Error getting Firebase token:', error);
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Service cho sản phẩm
export const productService = {
  getAllProducts: () => api.get('/products'),
  getProduct: (id) => api.get(`/products/${id}`),
  getProductsByCategory: (categoryId) => api.get(`/products/category/${categoryId}`),
  addProduct: (productData) => api.post('/products', productData),
  updateProduct: (id, productData) => api.patch(`/products/${id}`, productData),
  deleteProduct: (productId) => api.delete(`/products/${productId}`),
};

// Service cho user
export const authService = {
  login: (credentials) => api.post('/users/login', credentials),
  signup: (userData) => api.post('/users/signup', userData),
  getProfile: () => api.get('/users/profile')
};

// Service cho đơn hàng
export const orderService = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getUserOrders: () => api.get('/orders')
};

// Service cho danh mục
export const categoryService = {
  getAllCategories: () => api.get('/categories'),
  // getCategories: (id) => api.get(`/categories/${id}`),
  addCategory: (categoryData) => api.post('/categories', categoryData),
  updateCategory: (id, categoryData) => api.patch(`/categories/${id}`, categoryData),
  deleteCategory: (categoryId) => api.delete(`/categories/${categoryId}`),
};

export default api;
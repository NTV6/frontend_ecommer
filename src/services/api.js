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
        console.log('Token:', token);
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

// Service cho user
export const authService = {
  login: (credentials) => api.post('/users/login', credentials),
  signup: (userData) => api.post('/users/signup', userData),
  getProfile: () => api.get('/users/profile')
};

// Service cho sản phẩm
export const productService = {
  getAllProducts: () => api.get('/products'),
  getProduct: (id) => api.get(`/products/${id}`),
  getProductsByCategory: (categoryId) => api.get(`/products/category/${categoryId}`),
  addProduct: (productData) => api.post('/products', productData),
  updateProduct: (id, productData) => api.patch(`/products/${id}`, productData),
  deleteProduct: (productId) => api.delete(`/products/${productId}`)
};

// Service cho danh mục
export const categoryService = {
  getAllCategories: () => api.get('/categories'),
  // getCategories: (id) => api.get(`/categories/${id}`),
  addCategory: (categoryData) => api.post('/categories', categoryData),
  updateCategory: (id, categoryData) => api.patch(`/categories/${id}`, categoryData),
  deleteCategory: (categoryId) => api.delete(`/categories/${categoryId}`)
};

// Service cho giỏ hàng
export const cartService = {
  getCart: () => api.get('/carts'),
  addToCart: (productId, variantId, quantity) => api.post('/carts/add', { productId, variantId, quantity }),
  updateQuantity: (productId, variantId, quantity) => api.patch('/carts/update', { productId, variantId, quantity }),
  removeFromCart: (productId, variantId) => api.delete(`/carts/remove/${productId}/${variantId}`),
  clearCart: () => api.delete('/carts/clear')
};

// Service cho upload hình ảnh
export const uploadService = {
  deleteImage: (public_id) => api.delete('/upload', { data: { public_id } })
};

// Service cho đơn hàng
export const orderService = {
  createCodOrder: (orderData) => api.post('/orders/cod', orderData),
  createVnpayOrder: (orderData) => api.post('/orders/vnpay', orderData),
  getUserOrders: () => api.get('/orders')
};
export default api;
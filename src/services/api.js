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
  getAllUsers: () => api.get('/users'),
  getProfile: () => api.get('/users/profile'),
  signup: (userData) => api.post('/users/signup', userData),
  login: (credentials) => api.post('/users/login', credentials),
  updateUserRole: (userId, data) => api.patch(`/users/${userId}/role`, data),
  updateInfoProfile: (userData) => api.patch('/users/profile/info', userData),
  updateImageProfile: (userData) => api.patch('/users/profile/image', userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
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
  uploadImage: (formData) => api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  deleteImage: (public_id) => api.delete('/upload', { data: { public_id } })
};

// Service cho đơn hàng
export const orderService = {
  getAllOrders: () => api.get('/orders/all'),
  getUserOrders: () => api.get('/orders/myorders'),
  getOrderDetails: (orderId) => api.get(`/orders/${orderId}`),
  createCodOrder: (orderData) => api.post('/orders/cod', orderData),
  createVnpayOrder: (orderData) => api.post('/orders/vnpay', orderData),
  updateOrderStatus: (orderId, status) => api.patch(`/orders/${orderId}/status`, { status }),
  cancelOrder: (orderId) => api.post(`/orders/${orderId}/cancel`),
};

export default api;
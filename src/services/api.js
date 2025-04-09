import axios from 'axios';

// Cấu hình axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Thêm interceptor để thêm token vào header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
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
  deleteProduct: (productId) => api.delete(`/products/${productId}`),
  addProduct: (productData) => api.post('/products', productData),
  updateProduct: (id, productData) => api.patch(`/products/${id}`, productData),
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
  getAllCategories: () => api.get('/categories')
};

export default api;
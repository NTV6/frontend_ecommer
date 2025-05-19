import { configureStore } from '@reduxjs/toolkit';

import cartReducer from './cartSlice';
import authReducer from './authSlice';
import productReducer from './productSlice';
import categoryReducer from './categorySlice';

const store = configureStore({
  reducer: {
    carts: cartReducer,
    auth: authReducer,
    products: productReducer,
    categories: categoryReducer,
  },
});

export default store;
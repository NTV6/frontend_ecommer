import { configureStore } from '@reduxjs/toolkit';

import cartReducer from './cartSlice';
import authReducer from './authSlice';
import productReducer from './productSlice';
import categoryReducer from './categorySlice';
import profileReducer from './profileSlice';
import userReducer from './userSlice';

const store = configureStore({
  reducer: {
    carts: cartReducer,
    auth: authReducer,
    products: productReducer,
    categories: categoryReducer,
    profile: profileReducer,
    users: userReducer,
  },
});

export default store;
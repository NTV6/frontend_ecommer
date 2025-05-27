import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartService } from '../services/api';

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async () => {
    const response = await cartService.getCart();
    return response.data.data.items;
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, variantId, quantity }) => {
    const response = await cartService.addToCart(productId, variantId, quantity);
    return response.data.data.items;
  }
);

export const updateQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async ({ productId, variantId, quantity }) => {
    const response = await cartService.updateQuantity(productId, variantId, quantity);
    return response.data.data.items;
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async ({ productId, variantId }) => {
    const response = await cartService.removeFromCart(productId, variantId);
    return response.data.data.items;
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async () => {
    const response = await cartService.clearCart();
    return response.data.data.items;
  }
);

const cartSlice = createSlice({
  name: 'carts',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {
    resetCart: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.loading = false;
        state.error = null;
      });
  },
});
export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
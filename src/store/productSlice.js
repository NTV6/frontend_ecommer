import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productService } from '../services/api';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getAllProducts();
      return response.data.data.products;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const addProduct = createAsyncThunk(
  'products/addProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await productService.addProduct(productData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await productService.updateProduct(productData.id, productData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Could not update product');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await productService.deleteProduct(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchByCategory',
  async (categoryId) => {
    const response = await productService.getProductsByCategory(categoryId);
    return response.data.data.products;
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    selectedProduct: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(addProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteProduct.pending, (state) => {
        console.log('Delete pending');
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        console.log('Delete fulfilled:', action.payload);
        state.products = state.products.filter(p => p.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        console.log('Delete rejected:', action.payload);
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default productSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { categoryService } from '../services/api';

const priceRanges = [
  { id: 1, name: 'Dưới 500.000₫', min: 0, max: 500000 },
  { id: 2, name: '500.000₫ - 1.000.000₫', min: 500000, max: 1000000 },
  { id: 3, name: 'Trên 1.000.000₫', min: 1000000, max: Infinity }
];
const genderCategories = [
  { id: 1, name: 'Nam', value: 'men' },
  { id: 2, name: 'Nữ', value: 'women' },
  { id: 3, name: 'Trẻ em', value: 'kids' }
];

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async () => {
    const response = await categoryService.getAllCategories();
    return response.data.data.categories;
  }
);

export const addCategory = createAsyncThunk(
  'categories/addCategory',
  async (categoryData) => {
    const response = await categoryService.addCategory(categoryData);
    return response.data.data;
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async (categoryData) => {
    const response = await categoryService.updateCategory(categoryData.id, categoryData);
    return response.data.data;
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id) => {
    await categoryService.deleteCategory(id);
    return id;
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [],
    status: 'idle',
    error: null,
    priceRanges,
    selectedPriceRange: null,  // Thêm này
    genderCategories,
    selectedGender: null,
    selectedCategory: null    // Thêm này
  },
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSelectedPriceRange: (state, action) => {
      state.selectedPriceRange = action.payload;
    },
    setSelectedGender: (state, action) => {
      state.selectedGender = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      .addCase(addCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories.push(action.payload);
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      .addCase(updateCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.categories.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      .addCase(deleteCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = state.categories.filter(p => p.id !== action.payload);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});
export const { setSelectedCategory, setSelectedPriceRange, setSelectedGender } = categorySlice.actions;
export default categorySlice.reducer;
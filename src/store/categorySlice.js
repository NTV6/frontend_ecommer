import { createSlice } from '@reduxjs/toolkit';

const categories = [
  {
    id: 1,
    name: 'Áo',
    slug: 'ao',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80'
  },
  {
    id: 2,
    name: 'Quần',
    slug: 'quan',
    image: 'https://images.unsplash.com/photo-1475180098004-ca77a66827be?q=80'
  },
  {
    id: 3,
    name: 'Váy',
    slug: 'vay',
    image: 'https://images.unsplash.com/photo-1566206091558-7f218b696731?q=80'
  }
];

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

const categorySlice = createSlice({
  name: 'category',
  initialState: {
    categories,
    priceRanges,
    genderCategories,
    selectedCategory: null,
    selectedPriceRange: null,
    selectedGender: null
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
  }
});

export const { setSelectedCategory, setSelectedPriceRange, setSelectedGender } = categorySlice.actions;
export default categorySlice.reducer;
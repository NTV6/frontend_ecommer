import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: true,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
    clearUser: (state) => {
      state.user = null;
      state.loading = false;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;





// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { authService } from '../services/api';

// // Async action để đăng nhập
// export const login = createAsyncThunk(
//   'auth/login',
//   async (credentials, { rejectWithValue }) => {
//     try {
//       const response = await authService.login(credentials);
//       localStorage.setItem('token', response.data.data.token);
//       return response.data.data.user;
//     } catch (error) {
//       return rejectWithValue(error.response.data.message);
//     }
//   }
// );

// // Async action để lấy thông tin profile
// export const getProfile = createAsyncThunk(
//   'auth/getProfile',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await authService.getProfile();
//       return response.data.data.user;
//     } catch (error) {
//       return rejectWithValue(error.response.data.message);
//     }
//   }
// );

// const authSlice = createSlice({
//   name: 'auth',
//   initialState: {
//     user: null,
//     isAuthenticated: false,
//     loading: false,
//     error: null
//   },
//   reducers: {
//     logout: (state) => {
//       localStorage.removeItem('token');
//       state.user = null;
//       state.isAuthenticated = false;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(login.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(login.fulfilled, (state, action) => {
//         state.user = action.payload;
//         state.isAuthenticated = true;
//         state.loading = false;
//       })
//       .addCase(login.rejected, (state, action) => {
//         state.error = action.payload;
//         state.loading = false;
//       })
//       .addCase(getProfile.fulfilled, (state, action) => {
//         state.user = action.payload;
//         state.isAuthenticated = true;
//       });
//   }
// });

// export const { logout } = authSlice.actions;
// export default authSlice.reducer;
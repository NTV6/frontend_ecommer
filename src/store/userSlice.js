import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../services/api';
import { toast } from 'react-toastify';

export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await authService.getAllUsers();
            return response.data.data.users;
        } catch (error) {
            toast.error('Không thể tải danh sách người dùng');
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteUser = createAsyncThunk(
    'users/deleteUser',
    async (userId, { rejectWithValue }) => {
        try {
            await authService.deleteUser(userId);
            toast.success('Xóa người dùng thành công');
            return userId;
        } catch (error) {
            toast.error('Không thể xóa người dùng');
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const userSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
                state.error = null;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter(user => user.id !== action.payload);
            });
    }
});

export default userSlice.reducer;
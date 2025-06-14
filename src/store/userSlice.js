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

export const fetchProfile = createAsyncThunk(
    'users/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await authService.getProfile();
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
        }
    }
);

export const updateUserRole = createAsyncThunk(
    'users/updateRole',
    async ({ userId, role }, { rejectWithValue }) => {
        try {
            const response = await authService.updateUserRole(userId, { role });
            toast.success('Cập nhật vai trò thành công');
            return response.data.data;
        } catch (error) {
            toast.error('Không thể cập nhật vai trò người dùng');
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
    reducers: {
        setProfile: (state, action) => {
            state.users = action.payload;
        },
        updateProfile: (state, action) => {
            state.users = { ...state.users, ...action.payload };
        },
        clearProfile: (state) => {
            state.users = null;
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
                console.log(" .addCase state.users", state.users)
                state.error = null;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(updateUserRole.fulfilled, (state, action) => {
                const updatedUser = action.payload;
                state.users = state.users.map(user =>
                    user.id === updatedUser.id ? updatedUser : user
                );
            })

            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter(user => user.id !== action.payload);
            })

            .addCase(fetchProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
                state.error = null;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setProfile, updateProfile, clearProfile, } = userSlice.actions;
export default userSlice.reducer;
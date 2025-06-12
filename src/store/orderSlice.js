import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { orderService } from '../services/api';

export const fetchOrders = createAsyncThunk(
    'orders/fetchOrders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await orderService.getAllOrders();
            return response.data.data;
        } catch (err) {
            console.error('Error fetching orders:', err);
            toast.error('Không thể tải danh sách đơn hàng');
            return rejectWithValue(err.message);
        }
    }
);

export const updateOrderStatus = createAsyncThunk(
    'orders/updateStatus',
    async ({ orderId, newStatus }, { rejectWithValue }) => {
        try {
            await orderService.updateOrderStatus(orderId, newStatus);
            return { orderId, newStatus };
        } catch (err) {
            console.error('Error updating order status:', err);
            toast.error('Không thể cập nhật trạng thái đơn hàng');
            return rejectWithValue(err.message);
        }
    }
);

const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        orders: [],
        selectedOrder: null,
        loading: false,
        error: null,
    },
    reducers: {
        setSelectedOrder: (state, action) => {
            state.selectedOrder = action.payload;
        },
        clearSelectedOrder: (state) => {
            state.selectedOrder = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.orders = action.payload;
                state.loading = false;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(updateOrderStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                const { orderId, newStatus } = action.payload;
                const order = state.orders.find(o => o.id === orderId);
                if (order) {
                    order.order_status = newStatus;
                }
                if (state.selectedOrder?.id === orderId) {
                    state.selectedOrder.order_status = newStatus;
                }
                state.loading = false;
                toast.success('Cập nhật trạng thái thành công');
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setSelectedOrder, clearSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;
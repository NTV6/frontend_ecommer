import { toast } from 'react-toastify';
import { format } from 'date-fns/format';
import { useState, useEffect } from 'react';

import { orderService } from '../services/api';
import { getStatusBadgeColor } from '../utils';
import OrderModal from '../components/OrderModal';

function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await orderService.getUserOrders();
                setOrders(response.data.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
                toast.error('Không thể tải danh sách đơn hàng');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const cancelOrder = async (orderId) => {
        if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
            return;
        }

        try {
            await orderService.cancelOrder(orderId);
            // Cập nhật lại danh sách đơn hàng
            const response = await orderService.getUserOrders();
            setOrders(response.data.data);
            toast.success('Đã hủy đơn hàng thành công');
        } catch (error) {
            console.error('Error cancelling order:', error);
            toast.error(error.response?.data?.message || 'Không thể hủy đơn hàng');
        }
    };

    const handleViewOrderDetail = (order) => {
        setSelectedOrder(order);
    };

    const handleCloseModal = () => {
        setSelectedOrder(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 mt-20">
            <h1 className="text-2xl font-bold mb-6 dark:text-white">Đơn hàng của tôi</h1>

            {orders.length === 0 ? (
                <div className="text-center py-8 dark:text-white">
                    <p>Bạn chưa có đơn hàng nào.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
                        // onClick={() => handleViewOrderDetail(order)}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Mã đơn hàng: #{order.id}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Ngày đặt: {format(new Date(order.created_at), 'HH:mm - dd/MM/yyyy')}
                                    </p>
                                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                        Đơn hàng gồm {order.total_items} sản phẩm (SL: {order.total_quantity})
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusBadgeColor(order.order_status)}`}>
                                        {order.order_status === 'pending' && 'Chờ xác nhận'}
                                        {order.order_status === 'processing' && 'Đang xử lý'}
                                        {order.order_status === 'shipping' && 'Đang giao hàng'}
                                        {order.order_status === 'delivered' && 'Đã giao hàng'}
                                        {order.order_status === 'cancelled' && 'Đã hủy'}
                                    </span>
                                    {['pending', 'processing'].includes(order.order_status) && (
                                        <button
                                            onClick={() => cancelOrder(order.id)}
                                            className="px-3 py-1 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                        >
                                            Hủy đơn
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleViewOrderDetail(order)}
                                        className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        Chi tiết
                                    </button>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex items-center py-2">
                                        <div className="h-20 w-20 flex-shrink-0">
                                            {item.image && (
                                                <img
                                                    src={item.image}
                                                    alt={item.product_name}
                                                    className="h-full w-full object-cover rounded"
                                                />
                                            )}
                                        </div>
                                        <div className="ml-4 flex-grow">
                                            <p className="font-medium dark:text-white">{item.product_name}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {item.color} - {item.size} x {item.quantity}
                                            </p>
                                        </div>
                                        <p className="font-medium dark:text-white">
                                            {new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND'
                                            }).format(item.price * item.quantity)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Phương thức thanh toán: {order.payment_method}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Trạng thái thanh toán: {order.payment_status}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Tổng cộng</p>
                                        <p className="font-bold text-lg dark:text-white">
                                            {new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND'
                                            }).format(order.total_amount)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {selectedOrder && (
                <OrderModal
                    order={selectedOrder}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
}

export default MyOrders;
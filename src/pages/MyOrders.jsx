import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { orderService } from '../services/api';

function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            shipping: 'bg-purple-100 text-purple-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

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
                        <div key={order.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Mã đơn hàng: #{order.id}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Ngày đặt: {formatDate(order.created_at)}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.order_status)}`}>
                                    {order.order_status === 'pending' && 'Chờ xác nhận'}
                                    {order.order_status === 'processing' && 'Đang xử lý'}
                                    {order.order_status === 'shipping' && 'Đang giao hàng'}
                                    {order.order_status === 'delivered' && 'Đã giao hàng'}
                                    {order.order_status === 'cancelled' && 'Đã hủy'}
                                </span>
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center py-2">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-16 h-16 flex-shrink-0">
                                                {item.image ? (
                                                    <img
                                                        src={item.image}
                                                        alt={item.product_name}
                                                        className="w-full h-full object-cover rounded-md"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                                                        <svg
                                                            className="w-8 h-8 text-gray-400 dark:text-gray-500"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                            />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium dark:text-white">{item.product_name}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {item.color} - {item.size} x {item.quantity}
                                                </p>
                                            </div>
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
                                    <p className="font-medium dark:text-white">Tổng cộng:</p>
                                    <p className="font-bold text-lg dark:text-white">
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }).format(order.total_amount)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyOrders;
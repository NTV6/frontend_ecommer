import { toast } from 'react-toastify';
import { format } from 'date-fns/format';
import { useState, useEffect } from 'react';
import { Calendar, Package, Eye, ShoppingBag, CreditCard, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';

import { orderService } from '../services/api';
import OrderModal from '../components/OrderModal';
import { getStatusBadgeColor, getStatusText, formatCurrency } from '../utils';

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

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <Clock className="w-4 h-4" />;
            case 'processing':
                return <Package className="w-4 h-4" />;
            case 'shipping':
                return <Truck className="w-4 h-4" />;
            case 'delivered':
                return <CheckCircle className="w-4 h-4" />;
            case 'cancelled':
                return <XCircle className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center mt-[74px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-400 text-lg">Đang tải đơn hàng...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 mt-[74px]">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-2">Đơn hàng của tôi</h2>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                        <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                        <h3 className="text-xl font-semibold mb-2">Chưa có đơn hàng nào</h3>
                        <p className="text-gray-400 mb-6">Bạn chưa thực hiện đơn hàng nào. Hãy khám phá sản phẩm và đặt hàng ngay!</p>
                        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                            Khám phá sản phẩm
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-300 dark:border-gray-400 overflow-hidden hover:shadow-md transition-all duration-200"
                            >
                                {/* Order Header */}
                                <div className="p-6 border-b border-gray-200 dark:border-gray-600">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-lg font-semibold">
                                                    Đơn hàng #{order.id}
                                                </h3>
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadgeColor(order.order_status)}`}>
                                                    {getStatusIcon(order.order_status)}
                                                    {getStatusText(order.order_status)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-400">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {format(new Date(order.created_at), 'dd/MM/yyyy - HH:mm')}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Package className="w-4 h-4" />
                                                    {order.total_items} sản phẩm ({order.total_quantity} món)
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {['pending', 'processing'].includes(order.order_status) && (
                                                <button
                                                    onClick={() => cancelOrder(order.id)}
                                                    className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                                >
                                                    Hủy đơn
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleViewOrderDetail(order)}
                                                className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"
                                            >
                                                <Eye className="w-4 h-4" />
                                                Chi tiết
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-6">
                                    <div>
                                        {order.items.map((item, index) => (
                                            <div key={index} className="flex items-center gap-4 p-4 rounded-xl">
                                                <div className="w-16 h-16 flex-shrink-0 bg-white rounded-lg overflow-hidden">
                                                    <img
                                                        src={item.image}
                                                        alt={item.product_name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-grow min-w-0">
                                                    <h4 className="font-medium truncate">{item.product_name}</h4>
                                                    <p className="text-sm text-gray-400">
                                                        {item.color} • {item.size} • Số lượng: {item.quantity}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold">
                                                        {formatCurrency(item.price * item.quantity)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Order Footer */}
                                <div className="p-6 border-t border-gray-200 dark:border-gray-600">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                        <div className="flex items-center gap-6 text-sm text-gray-400">
                                            <div className="flex items-center gap-1">
                                                <CreditCard className="w-4 h-4" />
                                                {order.payment_method}
                                            </div>
                                            <div className={`px-2 py-1 rounded text-xs font-medium ${order.payment_status === 'paid'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {order.payment_status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-400 mb-1">Tổng cộng</p>
                                            <p className="text-2xl font-bold">
                                                {formatCurrency(order.total_amount)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
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
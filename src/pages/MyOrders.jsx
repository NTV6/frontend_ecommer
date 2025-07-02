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
            <div className="min-h-screen flex items-center justify-center pt-[65px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-400 text-lg">Đang tải đơn hàng...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-[65px]">
            <div className="max-w-2xl mx-auto px-4 py-6">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                        <ShoppingBag className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Đơn hàng của bạn</h2>
                    <p className="text-gray-600 dark:text-gray-400">{`Quản lý thông tin đơn hàng của bạn`}</p>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-sm p-12 text-center">
                        <p className="text-xl font-semibold mb-2">Chưa có đơn hàng nào</p>
                        <p className="text-gray-400 mb-6">
                            Bạn chưa thực hiện đơn hàng nào. Hãy khám phá sản phẩm và đặt hàng ngay!
                        </p>
                        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                            Khám phá sản phẩm
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-600"
                            >
                                {/* Header đơn hàng */}
                                <div className="p-4 pb-0 flex justify-between items-center text-sm font-medium">
                                    <div className="text-gray-700 dark:text-gray-200 flex items-center gap-2">
                                        Đơn hàng #{order.id}
                                    </div>
                                    <div className={`px-3 py-1 rounded-full inline-flex items-center gap-1 ${getStatusBadgeColor(order.order_status)}`}>
                                        {getStatusIcon(order.order_status)}
                                        {getStatusText(order.order_status)}
                                    </div>
                                </div>

                                {/* Ngày tạo + tổng sản phẩm */}
                                <div className="px-4 pt-2 pb-4 text-gray-400 flex flex-wrap gap-2 text-sm border-b dark:border-gray-600">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {format(new Date(order.created_at), "dd/MM/yyyy - HH:mm")}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Package className="w-4 h-4" />
                                        {order.total_items} sản phẩm ({order.total_quantity} món)
                                    </div>
                                </div>

                                {/* Sản phẩm */}
                                <div className="divide-y" >
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex p-4 pb-0 gap-4 items-center border-none">
                                            <img
                                                src={item.image}
                                                alt={item.product_name}
                                                className="w-16 object-cover rounded"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{item.product_name}</p>
                                                <p className="text-sm text-gray-500">
                                                    {item.color} • {item.size} • SL: {item.quantity}
                                                </p>
                                            </div>
                                            <p className="text-sm font-semibold whitespace-nowrap">
                                                {formatCurrency(item.price * item.quantity)}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Footer đơn */}
                                <div className="px-4 py-4 mt-4 border-t dark:border-gray-600">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                        <div className="text-sm text-gray-500 flex flex-wrap items-center gap-4">
                                            <div className="flex items-center gap-1">
                                                <CreditCard className="w-4 h-4" />
                                                {order.payment_method}
                                            </div>
                                            <div className={`px-2 py-1 rounded text-xs font-medium ${order.payment_status === "paid"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-yellow-100 text-yellow-800"
                                                }`}
                                            >
                                                {order.payment_status === "paid"
                                                    ? "Đã thanh toán"
                                                    : "Chưa thanh toán"}
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-sm text-gray-700 dark:text-gray-400">Tổng cộng</p>
                                            <p className="text-lg font-bold text-orange-600">
                                                {formatCurrency(order.total_amount)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2 mt-4 flex-wrap">
                                        {["pending", "processing"].includes(order.order_status) && (
                                            <button
                                                onClick={() => cancelOrder(order.id)}
                                                className="text-sm text-red-600 border px-4 py-2 rounded-lg hover:bg-red-50"
                                            >
                                                Hủy đơn
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleViewOrderDetail(order)}
                                            className="text-sm text-blue-600 border px-4 py-2 rounded-lg hover:bg-blue-50 flex items-center gap-2"
                                        >
                                            <Eye className="w-4 h-4" />
                                            Chi tiết
                                        </button>
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
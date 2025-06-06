import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import {
    HiOutlineSearch,
    HiOutlineSwitchVertical,
    HiOutlineCreditCard,
    HiOutlineEye,
    HiOutlineDotsVertical,
    HiOutlineChevronLeft,
    HiOutlineChevronRight
} from 'react-icons/hi';

import { orderService } from '../../services/api';
import { getStatusBadgeColor } from '../../utils';
import OrderModal from '../../components/OrderModal';

function OrderManagement() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await orderService.getAllOrders();
            setOrders(response.data.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching orders:', err);
            toast.error('Không thể tải danh sách đơn hàng');
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await orderService.updateOrderStatus(orderId, newStatus);
            toast.success('Cập nhật trạng thái thành công');

            if (selectedOrder && selectedOrder.order_id === orderId) {
                setSelectedOrder(prev => ({
                    ...prev,
                    order_status: newStatus
                }));
            }

            await fetchOrders();
        } catch (err) {
            console.error('Error updating status:', err);
            toast.error('Không thể cập nhật trạng thái');
        }
    };

    const handleViewDetails = async (orderId) => {
        try {
            const response = await orderService.getOrderDetails(orderId);
            setSelectedOrder(response.data.data);
        } catch (err) {
            console.error('Error fetching order details:', err);
            toast.error('Không thể tải chi tiết đơn hàng');
        }
    };

    if (loading) return <div className="p-6">Đang tải...</div>;

    return (
        <div className="p-6">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Quản lý đơn hàng
                    </h2>
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Tìm kiếm đơn hàng..."
                                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <HiOutlineSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                        <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                            <option>Tất cả trạng thái</option>
                            <option>Đang xử lý</option>
                            <option>Đã xác nhận</option>
                            <option>Đang giao</option>
                            <option>Hoàn thành</option>
                        </select>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        <div className="flex items-center space-x-1">
                                            <span>Mã đơn hàng</span>
                                            <HiOutlineSwitchVertical className="w-4 h-4" />
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        Khách hàng
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        Ngày đặt
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        Tổng tiền
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        Thanh toán
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        Trạng thái
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                                {orders.map((order) => {
                                    return (
                                        <tr
                                            key={order.id}
                                            className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 group"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                                        #{order.id}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {order.user_name}
                                                        </div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            ID: {order.user_id}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-white font-medium">
                                                    {format(new Date(order.created_at), 'dd/MM/yyyy')}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {format(new Date(order.created_at), 'HH:mm')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                                    {Number(order.total_amount)?.toLocaleString()}₫
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="space-y-1">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(order.payment_status)}`}>
                                                        <div className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-75"></div>
                                                        {order.payment_status}
                                                    </span>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                                        <HiOutlineCreditCard className="w-3 h-3 mr-1" />
                                                        {order.payment_method}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(order.order_status)}`}>
                                                    <div className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-75"></div>
                                                    {order.order_status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <button
                                                        onClick={() => handleViewDetails(order.id)}
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 dark:text-blue-400 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 transition-colors duration-200"
                                                    >
                                                        <HiOutlineEye className="w-4 h-4 mr-1" />
                                                        Chi tiết
                                                    </button>
                                                    <button className="inline-flex items-center p-1.5 border border-transparent text-xs font-medium rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200">
                                                        <HiOutlineDotsVertical className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="bg-white dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">10</span> trong tổng số <span className="font-medium">97</span> đơn hàng
                            </div>
                            <div className="flex items-center space-x-2">
                                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <HiOutlineChevronLeft className="h-5 w-5" />
                                </button>
                                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    1
                                </button>
                                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-blue-50 dark:bg-blue-900/20 text-sm font-medium text-blue-600 dark:text-blue-400">
                                    2
                                </button>
                                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    3
                                </button>
                                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <HiOutlineChevronRight className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {selectedOrder && (
                    <OrderModal
                        order={selectedOrder}
                        onClose={() => setSelectedOrder(null)}
                        handleStatusChange={handleStatusChange}
                    />
                )}
            </div>
        </div >
    );
}

export default OrderManagement;
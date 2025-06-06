import { useState, useEffect } from 'react';
import { orderService } from '../../services/api';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import {
    FaUserCircle,
    FaPhoneAlt,
    FaMapMarkedAlt,
    FaTags,
    FaTshirt,
    FaHashtag,
    FaEdit,
    FaChevronDown,
    FaUser
} from 'react-icons/fa';
import { MdClose, MdOutlinePayments } from 'react-icons/md';
import { BsBagCheckFill } from 'react-icons/bs';
import { BiPackage } from 'react-icons/bi';

import {
    HiOutlineSearch,
    HiOutlineSwitchVertical,
    HiOutlineCreditCard,
    HiOutlineEye,
    HiOutlineDotsVertical,
    HiOutlineChevronLeft,
    HiOutlineChevronRight
} from 'react-icons/hi';

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

    const getStatusBadgeColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'shipping':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPaymentStatusBadgeColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
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

    const OrderModal = ({ order, onClose }) => {
        return (
            <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden border border-gray-100 dark:border-gray-700">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                        <div className="relative flex justify-between items-center">
                            <div>
                                <h3 className="text-2xl font-bold mb-1 flex items-center gap-2">
                                    <BsBagCheckFill className="text-white text-xl" />
                                    Chi tiết đơn hàng
                                </h3>
                                <p className="text-blue-100 text-lg">#{order.id}</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="bg-white/20 hover:bg-white/30 transition-all duration-200 rounded-full p-2 backdrop-blur-sm"
                            >
                                <MdClose className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-y-auto max-h-[calc(95vh-100px)]">
                        {/* Customer Info Section */}
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50">
                            <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white flex items-center">
                                <FaUserCircle className="text-blue-600 w-5 h-5 mr-2" />
                                Thông tin khách hàng
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                    <div className="flex items-center mb-2">
                                        <FaUser className="text-blue-500 mr-2 text-xs" />
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Khách hàng</p>
                                    </div>
                                    <p className="font-semibold text-gray-900 dark:text-white text-lg">{order.user_name}</p>
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                    <div className="flex items-center mb-2">
                                        <FaPhoneAlt className="text-green-500 mr-2 text-xs" />
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Số điện thoại</p>
                                    </div>
                                    <p className="font-semibold text-gray-900 dark:text-white text-lg">{order.phone_number}</p>
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 md:col-span-2">
                                    <div className="flex items-center mb-2">
                                        <FaMapMarkedAlt className="text-orange-500 mr-2 text-xs" />
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Địa chỉ giao hàng</p>
                                    </div>
                                    <p className="font-semibold text-gray-900 dark:text-white text-lg">{order.shipping_address}</p>
                                </div>
                            </div>
                        </div>

                        {/* Payment Info Section */}
                        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                            <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white flex items-center">
                                <MdOutlinePayments className="text-green-600 w-5 h-5 mr-2" />
                                Thông tin thanh toán
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 p-4 rounded-xl border border-blue-100 dark:border-gray-600">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Phương thức thanh toán</p>
                                    <p className="font-bold text-blue-700 dark:text-blue-300 text-lg">{order.payment_method}</p>
                                </div>
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 p-4 rounded-xl border border-green-100 dark:border-gray-600">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Trạng thái thanh toán</p>
                                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getPaymentStatusBadgeColor(order.payment_status)}`}>
                                        {order.payment_status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Products Section */}
                        <div className="p-4">
                            <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white flex items-center">
                                <BiPackage className="text-purple-600 w-5 h-5 mr-2" />
                                Sản phẩm đã đặt ({order.items?.length || 0} sản phẩm)
                            </h4>
                            <div className="space-y-4">
                                {order.items && order.items.map((item, index) => (
                                    <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h5 className="font-bold text-gray-900 dark:text-white text-lg mb-2">{item.product_name}</h5>
                                                <div className="flex flex-wrap gap-4 mb-3">
                                                    <div className="flex items-center bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                                                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color?.toLowerCase() || '#6366f1' }}></div>
                                                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                                            <FaTags className="inline-block mr-1" /> Màu: {item.color}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full">
                                                        <FaTshirt className="text-green-600 w-3 h-3 mr-2" />
                                                        <span className="text-sm font-medium text-green-700 dark:text-green-300">Size: {item.size}</span>
                                                    </div>
                                                    <div className="flex items-center bg-orange-50 dark:bg-orange-900/30 px-3 py-1 rounded-full">
                                                        <FaHashtag className="text-orange-600 w-3 h-3 mr-2" />
                                                        <span className="text-sm font-medium text-orange-700 dark:text-orange-300">SL: {item.quantity}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right ml-4">
                                                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Đơn giá</p>
                                                    <p className="font-bold text-gray-900 dark:text-white text-lg">
                                                        {Number(item.price).toLocaleString()}₫
                                                    </p>
                                                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mt-1">
                                                        Tổng: {(item.price * item.quantity).toLocaleString()}₫
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer Section */}
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 p-4 border-t border-gray-100 dark:border-gray-600">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                                <div className="flex-1">
                                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                                        <FaEdit className="w-4 h-4 mr-2" />
                                        Cập nhật trạng thái đơn hàng
                                    </h4>
                                    <div className="relative w-full md:w-64" key={order.id}>
                                        <select
                                            className="w-full outline-none appearance-none md:w-64 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200 font-medium"
                                            value={order.order_status}
                                            onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                                        >
                                            {console.log('order.order_status', order)}
                                            <option value="pending">⏳ Chờ xử lý</option>
                                            <option value="processing">🔄 Đang xử lý</option>
                                            <option value="shipping">🚚 Đang giao</option>
                                            <option value="delivered">✅ Đã giao</option>
                                            <option value="cancelled">❌ Đã hủy</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                            <FaChevronDown />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg border-2 border-blue-100 dark:border-blue-800">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Tổng thanh toán</p>
                                    <p className="font-black text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        {Number(order.total_amount)?.toLocaleString()}₫
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
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
                                {orders.map((order, index) => (
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
                                                {/* <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                                                    {order.user_name?.charAt(0)?.toUpperCase()}
                                                </div> */}
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {order.user_name}
                                                    </div>
                                                    {/* <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        ID: {order.user_id}
                                                    </div> */}
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
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusBadgeColor(order.payment_status)}`}>
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
                                ))}
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
            </div>



            {selectedOrder && (
                <OrderModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                />
            )}
        </div>
    );
}

export default OrderManagement;
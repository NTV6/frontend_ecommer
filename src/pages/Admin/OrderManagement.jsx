import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
    HiOutlineSwitchVertical,
    HiOutlineCreditCard,
    HiOutlineEye,
    HiShoppingCart,
    HiOutlineDownload
} from 'react-icons/hi';

import Search from '../../components/Search';
import DropDown from '../../components/DropDown';
import OrderModal from '../../components/OrderModal';
import Pagination from '../../components/Pagination';
import { orderService } from '../../services/api';
import { getStatusBadgeColor, getStatusText } from '../../utils';
import { usePagination } from '../../../hook/usePagination';
import { useExportExcel } from '../../../hook/useExportExcel';
import { useDebounceSearch } from '../../../hook/useDebounceSearch';
import { fetchOrders, updateOrderStatus } from '../../store/orderSlice';

function OrderManagement() {
    const dispatch = useDispatch();
    const { exportToExcel } = useExportExcel();
    const { orders, loading } = useSelector(state => state.orders);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');

    const orderStatusOptions = [
        { value: 'pending', label: '⏳ Chờ xử lý' },
        { value: 'processing', label: '🔄 Đang xử lý' },
        { value: 'shipping', label: '🚚 Đang giao' },
        { value: 'delivered', label: '✅ Đã giao' },
        { value: 'cancelled', label: '❌ Đã hủy' }
    ];

    const {
        searchTerm,
        setSearchTerm,
        filteredItems: filteredOrders,
        activeFilters,
        setActiveFilters
    } = useDebounceSearch(orders, {
        searchFields: ['id', 'user_id', 'user_name', 'phone_number', 'shipping_address', 'user_email'],
        filters: { order_status: 'all' },
        searchConfig: { searchByDate: true }
    });

    // Sử dụng hook phân trang
    const {
        currentPage,
        setCurrentPage,
        totalPages,
        paginatedItems: currentOrders,
        totalItems
    } = usePagination(filteredOrders);

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    // Thêm useEffect để xử lý statusFilter
    useEffect(() => {
        setActiveFilters(prev => ({
            ...prev,
            order_status: statusFilter
        }));
    }, [statusFilter, setActiveFilters]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await dispatch(updateOrderStatus({ orderId, newStatus })).unwrap();
        } catch (err) {
            console.error('Error updating status:', err);
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

    const handleExportExcel = () => {
        exportToExcel({
            data: filteredOrders,
            fileName: 'orders',
            sheetName: 'Orders',
            mapper: order => ({
                'Mã đơn hàng': order.id,
                'Khách hàng': order.user_name,
                'ID Khách hàng': order.user_id,
                'Ngày đặt': format(new Date(order.created_at), 'dd/MM/yyyy HH:mm'),
                'Tổng tiền': Number(order.total_amount).toLocaleString() + '₫',
                'Phương thức thanh toán': order.payment_method,
                'Trạng thái thanh toán': getStatusText(order.payment_status),
                'Trạng thái đơn hàng': getStatusText(order.order_status),
                'Địa chỉ': order.shipping_address,
                'Số điện thoại': order.phone_number,
                'Email': order.user_email
            })
        });
    };

    if (loading) return <div className="p-6">Đang tải...</div>;

    return (
        <div className="space-y-4">
            <div className="bg-white dark:bg-gray-900 px-6 py-4 mb-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    {/* Tiêu đề */}
                    <div className="flex items-center gap-3">
                        <HiShoppingCart className="w-8 h-8 text-blue-600" />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Quản lý đơn hàng
                        </h2>
                    </div>
                    <button
                        onClick={handleExportExcel}
                        disabled={filteredOrders.length === 0}
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <HiOutlineDownload className="w-5 h-5 mr-2" />
                        Xuất Excel
                    </button>
                </div>

                {/* Tìm kiếm & Lọc – 2 đầu hàng */}
                <div className="flex flex-col sm:flex-row items-stretch justify-between gap-4">
                    <Search
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Tìm kiếm đơn hàng..."
                        className="w-full sm:max-w-60"
                    />

                    <div className='md:w-52'>
                        <DropDown
                            value={statusFilter}
                            onChange={setStatusFilter}
                            options={orderStatusOptions}
                            defaultLabel="📦 Tất cả trạng thái"
                            className="md:w-52"
                        />
                    </div>
                </div>
            </div>

            {/* Hiển thị thông tin về bộ lọc đang áp dụng */}
            {(statusFilter !== 'all' || searchTerm) && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>Bộ lọc:</span>
                    {statusFilter !== 'all' && (
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(statusFilter)}`}>
                            {orderStatusOptions.find(opt => opt.value === statusFilter)?.label}
                        </span>
                    )}
                    {searchTerm && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300">
                            Tìm kiếm: {searchTerm}
                        </span>
                    )}
                    <button
                        onClick={() => {
                            setStatusFilter('all');
                            setSearchTerm('');
                        }}
                        className="text-red-600 hover:text-red-800 ml-2"
                    >
                        Xóa bộ lọc
                    </button>
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    <div className="flex items-center space-x-1">
                                        <span>ID</span>
                                        <HiOutlineSwitchVertical className="w-4 h-4" />
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    Khách hàng
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    Người nhận
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
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-700">
                            {currentOrders.map((order) => {
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
                                            {order.full_name}
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
                                                    {getStatusText(order.payment_status) || order.payment_status}
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
                                                {getStatusText(order.order_status) || order.order_status}
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
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    onPageChange={handlePageChange}
                />

                {/* Add no results message */}
                {filteredOrders.length === 0 && (
                    <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                        {searchTerm || statusFilter !== 'all'
                            ? "Không tìm thấy đơn hàng nào phù hợp với điều kiện tìm kiếm"
                            : "Chưa có đơn hàng nào"
                        }
                    </div>
                )}
            </div>

            {selectedOrder && (
                <OrderModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    handleStatusChange={handleStatusChange}
                    showStatusUpdate={true}
                />
            )}
        </div>
    );
}

export default OrderManagement;
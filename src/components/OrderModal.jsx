import { format } from 'date-fns/format';
import { BiPackage } from 'react-icons/bi';
import { BsBagCheckFill } from 'react-icons/bs';
import { FaPhoneAlt, FaMapMarkerAlt, FaEdit, FaUser, FaTimes, FaCalendarAlt, FaBox, FaMoneyBillAlt, FaClipboardList } from 'react-icons/fa';
import { Package, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';

import Filter from './DropDown';
import { getStatusBadgeColor, getStatusText } from '../utils';

const OrderModal = ({ order, onClose, handleStatusChange, showStatusUpdate = false }) => {
    const orderStatusOptions = [
        { value: 'pending', label: '⏳ Chờ xử lý' },
        { value: 'processing', label: '🔄 Đang xử lý' },
        { value: 'shipping', label: '🚚 Đang giao' },
        { value: 'delivered', label: '✅ Đã giao' },
        { value: 'cancelled', label: '❌ Đã hủy' }
    ];

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
    // console.log(" OrderModal order", order)

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-hidden border border-gray-100 dark:border-gray-700">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 px-6 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                    <div className="relative flex justify-between items-center">
                        <div>
                            <h3 className="text-2xl font-bold flex items-center gap-2">
                                <BsBagCheckFill className="text-white text-xl" />
                                Chi tiết đơn hàng
                            </h3>
                            <p className="text-blue-100 text-lg">#{order.order_id}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
                        >
                            <FaTimes className="w-6 h-6 text-white" />
                        </button>
                    </div>
                </div>

                <div className="overflow-y-auto max-h-[calc(95vh-100px)]">
                    {/* Customer Info Section */}
                    <div className="p-6">
                        <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white flex items-center">
                            <FaClipboardList className="text-green-600 w-5 h-5 mr-2" />
                            Thông tin đơn hàng
                        </h4>
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-300 flex items-center gap-1">
                                    <FaCalendarAlt className="text-xs mr-1" />
                                    Ngày đặt:
                                </span>
                                <span className="font-medium text-gray-800 dark:text-white">
                                    {format(new Date(order.created_at), 'dd/MM/yyyy - HH:mm')}
                                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-300 flex items-center gap-1">
                                    <FaBox className="text-xs mr-1" />
                                    Trạng thái đơn hàng:
                                </span>
                                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(order.order_status)}`}>
                                    {getStatusIcon(order.order_status)}
                                    {getStatusText(order.order_status)}
                                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-300 flex items-center gap-1">
                                    <FaMoneyBillAlt className="text-xs mr-1" />
                                    Phương thức thanh toán:
                                </span>
                                <span className="font-medium text-gray-800 dark:text-white">
                                    {order.payment_method}
                                    <span className={`inline-flex items-center justify-center gap-1.5 px-2 py-1 rounded-full text-sm font-medium ml-3 ${getStatusBadgeColor(order.payment_status)}`}>
                                        {order.payment_status}
                                    </span>
                                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-300 flex items-center gap-1">
                                    <FaUser className="text-xs mr-1" />
                                    Khách hàng:
                                </span>
                                <span className="font-medium text-gray-800 dark:text-white">
                                    {order.user_name}
                                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-300 flex items-center gap-1">
                                    <FaUser className="text-xs mr-1" />
                                    Người nhận:
                                </span>
                                <span className="font-medium text-gray-800 dark:text-white">
                                    {order.full_name}
                                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-300 flex items-center gap-1">
                                    <FaPhoneAlt className="text-xs mr-1" />
                                    Số điện thoại:
                                </span>
                                <span className="font-medium text-gray-800 dark:text-white">
                                    {order.phone_number}
                                </span>
                            </div>

                            <div className="flex justify-between items-start">
                                <span className="text-gray-600 dark:text-gray-300 flex items-center gap-1">
                                    <FaMapMarkerAlt className="text-xs mr-1 mt-0.5" />
                                    Địa chỉ:
                                </span>
                                <span className="font-medium text-right text-gray-800 dark:text-white max-w-[60%] break-words">
                                    {order.shipping_address}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Products Section */}
                    <div className="p-6 pt-0">
                        <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white flex items-center">
                            <BiPackage className="text-purple-600 w-5 h-5 mr-2" />
                            Sản phẩm đã đặt ({order.items?.length || 0} sản phẩm)
                        </h4>
                        <div className="space-y-3">
                            {order.items && order.items.map((item, index) => (
                                <div key={index} className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                                    <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                                        <img
                                            src={item.image}
                                            alt={item.product_name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <h5 className="font-medium text-gray-900 dark:text-white truncate mb-1">
                                            {item.product_name}
                                        </h5>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {item.color} • {item.size} • SL: {item.quantity}
                                        </p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="font-semibold text-gray-900 dark:text-white text-lg">
                                            {Number(item.price * item.quantity).toLocaleString()}đ
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer Section */}
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 p-4 border-t border-gray-100 dark:border-gray-600">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            {showStatusUpdate && (
                                <div className="flex-1">
                                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                                        <FaEdit className="w-4 h-4 mr-2" />
                                        Cập nhật trạng thái đơn hàng
                                    </h4>
                                    <div className='md:w-52'>
                                        <Filter
                                            value={order.order_status}
                                            onChange={(value) => handleStatusChange(order.order_id, value)}
                                            options={orderStatusOptions}
                                            defaultLabel="Chọn trạng thái đơn hàng"
                                        />
                                    </div>
                                </div>
                            )}
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
    );
};

export default OrderModal;
import { BiPackage } from 'react-icons/bi';
import { BsBagCheckFill } from 'react-icons/bs';
import { MdClose, MdOutlinePayments } from 'react-icons/md';
import { FaUserCircle, FaPhoneAlt, FaMapMarkedAlt, FaTags, FaTshirt, FaHashtag, FaEdit, FaChevronDown, FaUser } from 'react-icons/fa';

import { getStatusBadgeColor } from '../utils';

const OrderModal = ({ order, onClose, handleStatusChange }) => {
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
                                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadgeColor(order.payment_status)}`}>
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
    );
};

export default OrderModal;
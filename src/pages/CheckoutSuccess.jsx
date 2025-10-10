import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Package, Truck, User, Phone, MapPin, ShoppingBag } from 'lucide-react';
import { toast } from 'react-toastify';
import { orderService } from '../services/api';

function CheckoutSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const [orderDetails, setOrderDetails] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const vnpayStatus = queryParams.get('vnp_ResponseCode');
    const orderId = queryParams.get('vnp_TxnRef');

    const fetchOrderDetails = async (id) => {
      try {
        setLoading(true);
        const response = await orderService.getOrderDetails(id);
        setOrderDetails(response.data.data);
        setPaymentStatus({
          success: true,
          message: 'Thanh toán thành công',
        });
      } catch (err) {
        console.error('Error fetching order details:', err);
        toast.error('Không thể tải thông tin đơn hàng');
        setError('Không thể tải thông tin đơn hàng. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    if (vnpayStatus === '00' && orderId) {
      // Thanh toán VNPay thành công
      fetchOrderDetails(orderId);
    } else if (location.state?.orderDetails) {
      // COD
      setOrderDetails(location.state.orderDetails);
      setPaymentStatus({
        success: true,
        message: 'Đặt hàng thành công',
      });
      setLoading(false);
    } else {
      setError('Không tìm thấy thông tin đơn hàng');
      setLoading(false);
    }
  }, [location]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg mt-[65px]">
        Đang tải thông tin đơn hàng...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen mt-[65px] flex flex-col justify-center items-center text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <XCircle className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-red-600 mb-4">{error}</h2>
        <div className="space-x-4">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200"
          >
            Thử lại
          </button>
          <button
            onClick={() => navigate('/product')}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200"
          >
            Về trang sản phẩm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-[65px]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto">

          {/* Header Success */}
          <div className="text-center mb-6">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full shadow-lg mb-4 ${paymentStatus?.success
              ? 'bg-gradient-to-r from-green-400 to-green-600'
              : 'bg-gradient-to-r from-red-400 to-red-600'
              } animate-pulse`}>
              {paymentStatus?.success ? (
                <CheckCircle className="w-8 h-8 text-white" />
              ) : (
                <XCircle className="w-8 h-8 text-white" />
              )}
            </div>

            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
              {paymentStatus?.message}
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {paymentStatus?.success
                ? 'Cảm ơn bạn. Đơn hàng của bạn đang được xử lý!'
                : 'Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại sau.'}
            </p>
          </div>

          {/* Invoice Details */}
          {orderDetails && (
            <div className="dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                <div className="flex items-center justify-between text-white">
                  <div>
                    <h2 className="flex items-center text-xl font-bold mb-2">
                      <Package className="w-6 h-6 mr-2" />
                      HÓA ĐƠN
                    </h2>
                    <span className="bg-white text-blue-700 px-2 py-[2px] rounded-full font-semibold">
                      {orderDetails.payment_method?.toUpperCase() || 'COD'}
                    </span>
                    <span className="text-lg font-semibold"> #{orderDetails.order_id}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-indigo-100 mb-3">Ngày đặt</p>
                    <p className="text-lg font-semibold">
                      {format(new Date(orderDetails.created_at), 'dd/MM/yyyy HH:mm')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4">
                {/* Shipping Info */}
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Truck className="w-5 h-5 mr-2 text-indigo-600" />
                    Thông tin giao hàng
                  </h3>

                  <div className="space-y-3">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2 text-gray-500" />
                          <p className="text-gray-600 dark:text-gray-400">Người nhận</p>
                        </div>
                        <p className="font-semibold text-gray-800 dark:text-gray-300 ml-6">
                          {orderDetails.full_name}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-gray-500" />
                          <p className="text-gray-600 dark:text-gray-400">Số điện thoại</p>
                        </div>
                        <p className="font-semibold text-gray-800 dark:text-gray-300 ml-6">
                          {orderDetails.phone_number}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                          <p className="text-gray-600 dark:text-gray-400">Địa chỉ giao hàng</p>
                        </div>
                        <p className="font-semibold text-gray-800 dark:text-gray-300 ml-6">
                          {orderDetails.shipping_address}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <ShoppingBag className="w-5 h-5 mr-2 text-indigo-600" />
                    Chi tiết sản phẩm
                  </h3>

                  <div className="space-y-4">
                    {orderDetails.items?.map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-2">
                        <div className="flex items-center">
                          <img
                            src={item.image}
                            alt={item.product_name}
                            className="w-12 h-full object-cover rounded"
                          />
                          <div className="ml-4">
                            <p className="text-lg text-gray-800 dark:text-gray-200">{item.product_name}</p>
                            <p className="text-gray-600 dark:text-gray-400">
                              {`${item.color} - ${item.size}`}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">Số lượng: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-medium dark:text-white">
                          {Number(item.price).toLocaleString()}₫
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-lg">
                      <span className="text-gray-600 dark:text-gray-400">Phí vận chuyển:</span>
                      <span className="font-semibold text-green-600">Miễn phí</span>
                    </div>
                    <div className="border-t border-gray-300 dark:border-gray-700 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold">TỔNG CỘNG:</span>
                        <span className="text-xl font-bold">
                          {Number(orderDetails.total_amount).toLocaleString()}₫
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center m-6">
                  <button
                    onClick={() => navigate('/product')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    Tiếp tục mua sắm
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CheckoutSuccess;
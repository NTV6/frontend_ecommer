import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Package, Truck, User, Phone, MapPin, ShoppingBag } from 'lucide-react';

function CheckoutSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);

  useEffect(() => {
    // Handle VNPay callback
    const queryParams = new URLSearchParams(location.search);
    const vnpayStatus = queryParams.get('vnp_ResponseCode');

    if (vnpayStatus) {
      // VNPay payment
      const success = vnpayStatus === '00';
      setPaymentStatus({
        success,
        message: success ? 'Thanh toán thành công' : 'Thanh toán thất bại'
      });

      // Nhận thông tin chi tiết về đơn hàng đã lưu trữ
      const storedOrder = localStorage.getItem('pendingOrder');
      if (storedOrder) {
        setOrderDetails(JSON.parse(storedOrder));
        localStorage.removeItem('pendingOrder');
      }
    } else {
      // COD payment
      setOrderDetails(location.state?.orderDetails);
      setPaymentStatus({
        success: true,
        message: 'Đặt hàng thành công'
      });
    }
  }, [location]);

  if (!orderDetails) {
    return (
      <div className="min-h-screen mt-[65px]">
        <div className="bg-white rounded-xl shadow-xl p-8 text-center max-w-md mx-4">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Oops! Có lỗi xảy ra</h2>
          <p className="text-gray-600 mb-6">Không tìm thấy thông tin đơn hàng của bạn</p>
          <button
            onClick={() => navigate('/product')}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 px-6 rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 font-medium"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-[65px]">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">

          {/* Header Success */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-400 to-green-600 rounded-full shadow-lg mb-6 animate-pulse">
              {paymentStatus?.success ? (
                <CheckCircle className="w-12 h-12 text-white" />
              ) : (
                <XCircle className="w-12 h-12 text-white" />
              )}
            </div>

            <h1 className="text-4xl leading-[2.8rem] font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
              {paymentStatus?.message}
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              {paymentStatus?.success
                ? 'Cảm ơn bạn đã tin tượng và mua sắm tại cửa hàng chúng tôi. Đơn hàng của bạn đang được xử lý!'
                : 'Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại sau.'}
            </p>
          </div>

          {paymentStatus?.success && (
            <div className="max-w-2xl mx-auto">
              {/* Single Invoice Card */}
              <div className="dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center">
                      <Package className="w-8 h-8 mr-4" />
                      <div>
                        <h2 className="text-2xl font-bold mb-2">HÓA ĐƠN THANH TOÁN</h2>
                        <span className="font-semibold text-gray-900 bg-white px-3 py-1 rounded-full">
                          {orderDetails.shippingInfo.paymentMethod === 'cod' ? 'COD' : 'VNPay'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-indigo-100">Ngày đặt hàng</p>
                      <p className="text-xl font-semibold">{format(new Date(), 'dd/MM/yyyy HH:mm')}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Shipping Information */}
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Truck className="w-5 h-5 mr-2 text-indigo-600" />
                      Thông tin giao hàng
                    </h3>

                    <div className="space-y-3">
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Người nhận */}
                        <div>
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-2 text-gray-500" />
                            <p className="text-gray-600 dark:text-gray-400">Người nhận</p>
                          </div>
                          <p className="font-semibold text-gray-800 dark:text-gray-300 ml-6">
                            {orderDetails.shippingInfo.fullName}
                          </p>
                        </div>

                        {/* Số điện thoại */}
                        <div>
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-2 text-gray-500" />
                            <p className="text-gray-600 dark:text-gray-400">Số điện thoại</p>
                          </div>
                          <p className="font-semibold text-gray-800 dark:text-gray-300 ml-6">
                            {orderDetails.shippingInfo.phone}
                          </p>
                        </div>
                      </div>

                      {/* Địa chỉ giao hàng */}
                      <div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                          <p className="text-gray-600 dark:text-gray-400">Địa chỉ giao hàng</p>
                        </div>
                        <p className="font-semibold text-gray-800 dark:text-gray-300 ml-6">
                          {orderDetails.shippingInfo.address}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 my-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <ShoppingBag className="w-5 h-5 mr-2 text-indigo-600" />
                      Chi tiết sản phẩm
                    </h3>

                    <div className="space-y-4">
                      {orderDetails.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center py-2">
                          <div className="flex items-center">
                            <img
                              src={item.image_url}
                              alt={item.product_name}
                              className="w-16 h-full object-cover rounded"
                            />
                            <div className="ml-4">
                              <p className="text-lg text-gray-800 dark:text-gray-200">{item.product_name}</p>
                              <p className="text-gray-600 dark:text-gray-400">
                                {`${item.color} - ${item.size}`}
                              </p>
                              <p className="text-gray-600 dark:text-gray-400">
                                Số lượng: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <p className="font-medium dark:text-white">
                            {Number(item.price).toLocaleString()}₫
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total Summary */}
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
                    <div className="ml-auto">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-lg">
                          <span className="text-gray-600 dark:text-gray-400">Tạm tính:</span>
                          <span className="font-semibold">{orderDetails.total.toLocaleString()}₫</span>
                        </div>

                        <div className="flex justify-between items-center text-lg">
                          <span className="text-gray-600 dark:text-gray-400">Phí vận chuyển:</span>
                          <span className="font-semibold text-green-600">Miễn phí</span>
                        </div>

                        <div className="border-t border-gray-300 dark:border-gray-600 pt-3">
                          <div className="flex justify-between items-center">
                            <span className="text-xl font-bold">TỔNG CỘNG:</span>
                            <span className="text-3xl font-bold text-indigo-600">
                              {orderDetails.total.toLocaleString()}₫
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="text-center mt-8">
                    <button
                      onClick={() => navigate('/product')}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      Tiếp tục mua sắm
                    </button>
                  </div>
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
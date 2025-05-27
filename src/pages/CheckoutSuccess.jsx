import { useEffect, useState } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

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
      <div className="container mx-auto px-4 py-8 mt-[74px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Không tìm thấy thông tin đơn hàng</h2>
          <button
            onClick={() => navigate('/product')}
            className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-[74px]">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          {paymentStatus?.success ? (
            <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
          ) : (
            <FaTimesCircle className="text-red-500 text-6xl mx-auto mb-4" />
          )}
          <h1 className="text-3xl font-bold mb-2 dark:text-white">
            {paymentStatus?.message}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {paymentStatus?.success
              ? 'Cảm ơn bạn đã mua hàng. Chúng tôi sẽ sớm liên hệ với bạn.'
              : 'Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại.'}
          </p>
        </div>

        {paymentStatus?.success && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-xl font-semibold mb-4 dark:text-white text-center">
              CHI TIẾT ĐƠN HÀNG
            </h2>

            {/* Thông tin đặt hàng */}
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Ngày đặt hàng: {format(new Date(), 'dd/MM/yyyy HH:mm')}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Phương thức thanh toán: {orderDetails.shippingInfo.paymentMethod === 'cod' ? 'COD' : 'VNPay'}
              </p>
            </div>

            {/* Thông tin vận chuyển */}
            <div className="mb-6">
              <h3 className="font-medium mb-3 dark:text-white border-b pb-2">
                Thông tin giao hàng
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-300">Họ tên:</p>
                  <p className="font-medium dark:text-white">{orderDetails.shippingInfo.fullName}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-300">Số điện thoại:</p>
                  <p className="font-medium dark:text-white">{orderDetails.shippingInfo.phone}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-300">Địa chỉ:</p>
                  <p className="font-medium dark:text-white">
                    {`${orderDetails.shippingInfo.address}, ${orderDetails.shippingInfo.city}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="font-medium mb-3 dark:text-white border-b pb-2">
                Sản phẩm đã mua
              </h3>
              <div className="space-y-4">
                {orderDetails.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2">
                    <div className="flex items-center">
                      <img
                        src={item.image_url}
                        alt={item.product_name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="ml-4">
                        <p className="font-medium dark:text-white">{item.product_name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {`${item.color} - ${item.size}`}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
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

            {/* Order Summary */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 dark:text-gray-300">Tạm tính:</span>
                <span className="font-medium dark:text-white">
                  {orderDetails.total.toLocaleString()}₫
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 dark:text-gray-300">Phí vận chuyển:</span>
                <span className="font-medium dark:text-white">Miễn phí</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                <span className="dark:text-white">Tổng cộng:</span>
                <span className="dark:text-white">
                  {orderDetails.total.toLocaleString()}₫
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={() => navigate('/product')}
            className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutSuccess;
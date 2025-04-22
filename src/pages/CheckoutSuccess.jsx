import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';

import { getThumbnailImage, getLowestPrice } from '../utils/product';

function CheckoutSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderDetails = location.state?.orderDetails;

  if (!orderDetails) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Không tìm thấy thông tin đơn hàng</h2>
          <button
            onClick={() => navigate('/san-pham')}
            className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
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
          <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2 dark:text-white">Đặt hàng thành công!</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Cảm ơn bạn đã mua hàng. Chúng tôi sẽ sớm liên hệ với bạn.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-[0_0_10px_green] mb-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-white text-center">THÔNG TIN ĐƠN HÀNG</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2 dark:text-white">Thông tin giao hàng:</h3>
              <div className="text-gray-600 dark:text-gray-300 space-y-1">
                <p>Họ tên: {orderDetails.shippingInfo.fullName}</p>
                <p>Email: {orderDetails.shippingInfo.email}</p>
                <p>Số điện thoại: {orderDetails.shippingInfo.phone}</p>
                <p>Địa chỉ: {orderDetails.shippingInfo.address}</p>
                <p>Thành phố: {orderDetails.shippingInfo.city}</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2 dark:text-white">Sản phẩm:</h3>
              {orderDetails.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                  <div className="flex items-center">
                    <img
                      src={getThumbnailImage(item)}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="ml-4">
                      <p className="font-medium dark:text-white">{item.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Số lượng: {item.quantity || 1}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Đơn giá: {getLowestPrice(item)}₫
                      </p>
                    </div>
                  </div>
                  <p className="font-medium dark:text-white">
                    {((item.quantity || 1) * Number(getLowestPrice(item)))}₫
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t dark:border-gray-700">
              <div className="flex justify-between items-center">
                <span className="font-semibold dark:text-white">Tổng cộng:</span>
                <span className="font-semibold text-xl dark:text-white">
                  {orderDetails.total.toLocaleString()}₫
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate('/san-pham')}
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
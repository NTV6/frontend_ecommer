import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { auth } from '../lib/firebase';
import { clearCart } from '../store/cartSlice';

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading, error } = useSelector((state) => state.carts);

  const [formData, setFormData] = useState({
    fullName: '',
    email: auth.currentUser.email || '',
    phone: '',
    address: '',
    city: '',
    paymentMethod: 'cod'
  });

  const totalAmount = items.reduce((total, item) => {
    return total + (Number(item.price) * (item.quantity || 1));
  }, 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mô phỏng API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Xóa giỏ hàng
      dispatch(clearCart());

      // Chuyển hướng đến trang xác nhận
      navigate('/thanh-toan/thanh-cong', {
        state: {
          orderDetails: {
            items,
            total: totalAmount,
            shippingInfo: formData
          }
        }
      });
    } catch (error) {
      console.error('Lỗi khi xử lý đơn hàng:', error);
      alert('Có lỗi xảy ra khi xử lý đơn hàng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Giỏ hàng trống</h2>
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
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Thanh toán</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Thông tin giao hàng</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Họ và tên
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Số điện thoại
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Địa chỉ
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Thành phố
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phương thức thanh toán
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="cod">Thanh toán khi nhận hàng (COD)</option>
                <option value="bank">Chuyển khoản ngân hàng</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              {loading ? 'Đang xử lý...' : 'Đặt hàng'}
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Đơn hàng của bạn</h2>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                <div className="flex items-center">
                  <img
                    src={item.image_url}
                    alt={item.product_name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="ml-4">
                    <h3 className="font-medium dark:text-white">{item.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Số lượng: {item.quantity || 1}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Đơn giá: {Number(item.price).toLocaleString()}₫
                    </p>
                  </div>
                </div>
                <p className="font-medium dark:text-white">
                  {((item.quantity || 1) * Number((item.price).replace(/,/g, ''))).toLocaleString()}₫
                </p>
              </div>
            ))}

            <div className="mt-4 space-y-2">
              <div className="flex justify-between dark:text-white">
                <span>Tạm tính</span>
                <span>{totalAmount.toLocaleString()}₫</span>
              </div>
              <div className="flex justify-between dark:text-white">
                <span>Phí vận chuyển</span>
                <span>Miễn phí</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2 border-t dark:border-gray-700 dark:text-white">
                <span>Tổng cộng</span>
                <span>{totalAmount.toLocaleString()}₫</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
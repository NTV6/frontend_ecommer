import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  ShoppingBag,
  Truck,
  Shield,
  CreditCard,
  MapPin,
  Phone,
  User,
  CheckCircle,
  Gift,
  Clock,
  ArrowRight
} from 'lucide-react';

import { clearCart } from '../store/cartSlice';
import { orderService } from '../services/api';
import { validatePhoneNumber } from '../utils';
import InputField from '../components/InputField';
import AddressSelector from '../components/AddressSelector';

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.carts);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [addressValid, setAddressValid] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    detailAddress: '',
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

    // Validate phone number
    if (name === 'phone') {
      const { isValid, message } = validatePhoneNumber(value);
      setPhoneError(message);
    }
  };

  const handleAddressChange = (fullAddress) => {
    setFormData(prev => ({
      ...prev,
      address: fullAddress
    }));
  };

  const handleDetailAddressChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      detailAddress: value
    }));
  };

  const isFormValid = formData.fullName.trim() &&
    formData.phone.trim() &&
    formData.address.trim() &&
    formData.detailAddress.trim() &&
    addressValid &&
    !phoneError;

  const handleAddressValidityChange = (isValid) => {
    setAddressValid(isValid);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate phone number trước khi submit
    const { isValid, message } = validatePhoneNumber(formData.phone);
    if (!isValid) {
      setPhoneError(message);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Tạo địa chỉ đầy đủ (số nhà + phường/xã, quận/huyện, tỉnh/thành)
      const fullShippingAddress = formData.detailAddress
        ? `${formData.detailAddress}, ${formData.address}`
        : formData.address;

      // Chuẩn bị dữ liệu đơn hàng
      const orderData = {
        full_name: formData.fullName,
        shipping_address: fullShippingAddress,
        phone_number: formData.phone,
        total_amount: totalAmount
      };

      if (formData.paymentMethod === 'cod') {
        // Xử lý thanh toán COD
        const response = await orderService.createCodOrder(orderData);

        if (response.data.status === 'success') {
          dispatch(clearCart());
          navigate('/checkout/success', {
            state: {
              orderId: response.data.data.order_id
            }
          });
        }
      } else if (formData.paymentMethod === 'vnpay') {
        // Xử lý thanh toán VNPay
        const response = await orderService.createVnpayOrder(orderData);

        if (response.data?.data?.paymentUrl) {
          // Lưu chi tiết đơn hàng vào localStorage trước khi chuyển hướng
          localStorage.setItem('pendingOrder', JSON.stringify({
            items,
            total: totalAmount,
            shippingInfo: {
              ...formData,
              address: fullShippingAddress
            }
          }));

          // Chuyển hướng đến trang thanh toán VNPay
          window.location.href = response.data.data.paymentUrl;
        }
      }
    } catch (error) {
      console.error('Error creating order:', error);
      setError('Đã có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-[65px]">
      {/* Header */}
      {items.length === 0 ? (
        <div className="container mx-auto px-4 max-w-6xl py-6">
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 dark:bg-gray-900 rounded-full mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Giỏ hàng trống
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Hãy khám phá các sản phẩm tuyệt vời của chúng tôi và thêm vào giỏ hàng
            </p>
            <button
              onClick={() => navigate('/product')}
              className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Tiếp tục mua sắm
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-12">
            <div className="max-w-6xl mx-auto px-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <ShoppingBag className="w-8 h-8" />
                <h1 className="text-3xl md:text-4xl font-bold">Thanh toán</h1>
              </div>
              <p className="text-center text-lg opacity-90">
                Hoàn tất đơn hàng của bạn chỉ trong vài bước đơn giản
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-600">Giỏ hàng</span>
              </div>
              <div className="w-12 h-0.5 bg-blue-500"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <span className="text-sm font-medium text-blue-600">Thanh toán</span>
              </div>
              <div className="w-12 h-0.5 bg-gray-200"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 font-bold text-sm">3</span>
                </div>
                <span className="text-sm font-medium text-gray-400">Hoàn tất</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Form thông tin */}
              <div className="lg:col-span-3">
                <div className="dark:bg-gray-900 rounded-lg p-6 shadow-xl border border-gray-100 dark:border-gray-700">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <Truck className="w-6 h-6 text-blue-500" />
                    Thông tin giao hàng
                  </h2>

                  <div className="space-y-4">
                    {error && (<div className="mb-2 p-3 bg-rose-100 text-rose-700 rounded">{error}</div>)}

                    <div className="grid md:grid-cols-2 gap-4">
                      <InputField
                        label="Họ và tên *"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        icon={User}
                        placeholder=""
                      />

                      <div>
                        <InputField
                          label="Số điện thoại *"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          icon={Phone}
                          placeholder=""
                          className={phoneError ? 'border-red-500' : ''}
                        />
                        {phoneError && (
                          <p className="mt-1 text-sm text-red-500">
                            {phoneError}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Địa chỉ hành chính */}
                    <div>
                      <label className="block text-gray-600 dark:text-gray-400 text-sm font-semibold mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Địa chỉ giao hàng *
                      </label>
                      <AddressSelector
                        value={formData.address}
                        onChange={handleAddressChange}
                        required={true}
                        onValidityChange={handleAddressValidityChange}
                      />
                      {!addressValid && formData.address && (
                        <p className="mt-1 text-sm text-red-500">
                          Vui lòng chọn đầy đủ Tỉnh/Thành phố, Quận/Huyện và Phường/Xã
                        </p>
                      )}
                    </div>

                    {/* Số nhà, tên đường */}
                    <div>
                      <InputField
                        name="detailAddress"
                        value={formData.detailAddress}
                        onChange={handleDetailAddressChange}
                        required
                        placeholder="Số nhà, tên đường..."
                        className={`mt-1 ${!formData.detailAddress.trim() ? 'border-red-500' : ''}`}
                      />
                    </div>

                    {/* Hiển thị địa chỉ đầy đủ */}
                    {(formData.address || formData.detailAddress) && (
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">
                          Địa chỉ giao hàng đầy đủ:
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {formData.detailAddress && `${formData.detailAddress}, `} {formData.address}
                        </p>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        <CreditCard className="w-4 h-4 inline mr-2" />
                        Phương thức thanh toán
                      </label>
                      <div className="space-y-3">
                        <label className="flex items-center p-4 border border-gray-100 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 hover:dark:bg-gray-800 transition-colors">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="cod"
                            checked={formData.paymentMethod === 'cod'}
                            onChange={handleInputChange}
                            className="w-4 h-4"
                          />
                          <div className="ml-3 flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <Truck className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <div className="font-medium">Thanh toán khi nhận hàng (COD)</div>
                              <div className="text-sm text-gray-500">Thanh toán bằng tiền mặt khi nhận hàng</div>
                            </div>
                          </div>
                        </label>

                        <label className="flex items-center p-4 border border-gray-100 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 hover:dark:bg-gray-800 transition-colors">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="vnpay"
                            checked={formData.paymentMethod === 'vnpay'}
                            onChange={handleInputChange}
                            className="w-4 h-4"
                          />
                          <div className="ml-3 flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <CreditCard className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium">Thanh toán qua VNPay</div>
                              <div className="text-sm text-gray-500">Thanh toán trực tuyến qua VNPay</div>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="mt-6 grid md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg p-6 text-white">
                    <div className="flex items-center gap-3 mb-2">
                      <Truck className="w-6 h-6" />
                      <h3 className="font-bold">Miễn phí vận chuyển</h3>
                    </div>
                    <p className="text-sm opacity-90">Mọi đơn hàng</p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg p-6 text-white">
                    <div className="flex items-center gap-3 mb-2">
                      <Shield className="w-6 h-6" />
                      <h3 className="font-bold">Bảo đảm chất lượng</h3>
                    </div>
                    <p className="text-sm opacity-90">Đổi trả trong 30 ngày</p>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-2">
                <div className="dark:bg-gray-900 rounded-lg p-6 shadow-xl border border-gray-100 dark:border-gray-700 sticky top-24">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <ShoppingBag className="w-6 h-6 text-blue-500" />
                    Đơn hàng của bạn
                  </h2>

                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <div className="relative">
                          <img
                            src={item.image_url}
                            alt={item.product_name}
                            className="w-16 h-full object-cover rounded-lg"
                          />
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {item.quantity}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm">{item.product_name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {Number(item.price).toLocaleString()}₫
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">
                            {(item.quantity * Number(item.price)).toLocaleString()}₫
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-6 space-y-3">
                    <div className="flex justify-between">
                      <span>Tạm tính</span>
                      <span>{totalAmount.toLocaleString()}₫</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-2">
                        <Gift className="w-4 h-4" />
                        Phí vận chuyển
                      </span>
                      <span className="text-green-600 font-medium">Miễn phí</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold pt-3 border-t border-gray-200">
                      <span>Tổng cộng</span>
                      <span className="text-blue-600">{totalAmount.toLocaleString()}₫</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-600 mb-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">Giao hàng dự kiến</span>
                    </div>
                    <p className="text-sm text-gray-600">2-3 ngày làm việc</p>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={!isFormValid || loading}
                    className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-lg font-bold text-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Đang xử lý...
                      </div>
                    ) : (
                      'Đặt hàng ngay'
                    )}
                  </button>

                  {!isFormValid && (
                    <div className="mt-2 text-sm text-red-500">
                      {!formData.fullName.trim() && <p>- Vui lòng nhập họ tên</p>}
                      {!formData.phone.trim() && <p>- Vui lòng nhập số điện thoại</p>}
                      {phoneError && <p>- {phoneError}</p>}
                      {!addressValid && <p>- Vui lòng chọn đầy đủ địa chỉ</p>}
                      {!formData.detailAddress.trim() && <p>- Vui lòng nhập số nhà, tên đường</p>}
                    </div>
                  )}

                  <div className="mt-4 text-center">
                    <p className="text-xs text-gray-500">
                      Bằng cách đặt hàng, bạn đồng ý với{' '}
                      <a href="#" className="text-rose-500 hover:underline">
                        Điều khoản dịch vụ
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Checkout;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { auth } from '../lib/firebase';
import { removeFromCart, updateQuantity } from '../store/cartSlice';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading, error } = useSelector((state) => state.carts);
  const [removingItems, setRemovingItems] = useState(new Set());

  const totalAmount = items.reduce((total, item) => {
    return total + (Number(item.price) * (item.quantity || 1));
  }, 0);

  const handleRemoveFromCart = async (productId, variantId) => {
    const itemKey = `${productId}-${variantId}`;
    setRemovingItems(prev => new Set(prev).add(itemKey));
    try {
      // Thêm delay để hiệu ứng có thời gian hiển thị
      await new Promise(resolve => setTimeout(resolve, 350));
      await dispatch(removeFromCart({ productId, variantId })).unwrap();
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Có lỗi khi xóa sản phẩm khỏi giỏ hàng');
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemKey);
        return newSet;
      });
    }
  };

  const handleQuantityChange = async (productId, variantId, newQuantity) => {
    if (newQuantity > 0) {
      try {
        await dispatch(updateQuantity({
          productId,
          variantId,
          quantity: newQuantity
        })).unwrap();
      } catch (error) {
        console.error('Error updating quantity:', error);
        alert('Có lỗi khi cập nhật số lượng');
      }
    }
  };

  const handleCheckout = () => {
    if (!auth.currentUser) {
      alert('Vui lòng đăng nhập để tiếp tục thanh toán');
      navigate('/auth');
      return;
    }

    // Kiểm tra giỏ hàng có trống không
    if (items.length === 0) {
      alert('Giỏ hàng trống');
      return;
    }

    navigate('/checkout');
  };

  const handleNavigateToProducts = () => {
    navigate('/product');
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-[65px]">
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[65px]">
      <div className="container mx-auto px-4 max-w-6xl py-6">

        {items.length === 0 ? (
          /* Empty Cart */
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
              onClick={handleNavigateToProducts}
              className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Tiếp tục mua sắm
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                <ShoppingBag className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Giỏ hàng của bạn</h2>
              <p className="text-gray-600 dark:text-gray-400">{`${items.length} sản phẩm trong giỏ hàng`}</p>
            </div>

            {/* Cart with Items */}
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
              {/* Cart Items */}
              <div className="lg:col-span-4 space-y-4">
                {items.map((item) => {
                  const itemKey = `${item.product_id}-${item.variant_id}`;
                  const isRemoving = removingItems.has(itemKey);

                  return (
                    <div
                      key={item.id}
                      className={`bg-gray-50 dark:bg-gray-900 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 ${isRemoving ? 'opacity-50 scale-95' : ''}`}
                    >
                      <div className="p-4">
                        <div className="flex gap-6">
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <div className="relative group">
                              <img
                                src={item.image_url}
                                alt={item.product_name}
                                className="w-20 object-cover rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-xl transition-colors duration-300"></div>
                            </div>
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <h3 className="text-gray-900 dark:text-white mb-2 line-clamp-2">
                                {item.product_name}
                              </h3>

                              {/* Actions */}
                              <div className=" ml-4">
                                <button
                                  onClick={() => handleRemoveFromCart(item.product_id, item.variant_id)}
                                  disabled={isRemoving}
                                  className="text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 disabled:opacity-50"
                                  title="Xóa khỏi giỏ hàng"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-3 text-sm mb-3">
                              <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium">
                                {item.color}
                              </span>
                              <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium">
                                Size {item.size}
                              </span>
                            </div>

                            {/* Price and Quantity */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                              {Number(item.price).toLocaleString()} ₫

                              {/* Quantity Controls */}
                              <div className="flex items-center">
                                <div className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-full">
                                  <button
                                    onClick={() => handleQuantityChange(
                                      item.product_id,
                                      item.variant_id,
                                      (item.quantity || 1) - 1
                                    )}
                                    disabled={item.quantity <= 1}
                                    className="p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                  >
                                    <Minus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                  </button>

                                  <span className="w-8 text-center font-medium text-gray-900 dark:text-white">
                                    {item.quantity || 1}
                                  </span>

                                  <button
                                    onClick={() => handleQuantityChange(
                                      item.product_id,
                                      item.variant_id,
                                      (item.quantity || 1) + 1
                                    )}
                                    className="p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                                  >
                                    <Plus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Item Total */}
                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Thành tiền:</span>
                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                              {(item.quantity * Number(item.price)).toLocaleString()} ₫
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-2">
                <div className="sticky top-24">
                  <div className="dark:bg-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                      <h2 className="text-xl font-bold">Tóm tắt đơn hàng</h2>
                    </div>

                    <div className="p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Số lượng sản phẩm:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{items.length}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Tạm tính:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {totalAmount.toLocaleString()} ₫
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Phí vận chuyển:</span>
                        <span className="font-medium text-green-600">Miễn phí</span>
                      </div>

                      <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-900 dark:text-white">Tổng cộng:</span>
                          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {totalAmount.toLocaleString()} ₫
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={handleCheckout}
                        disabled={items.length === 0}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        <div className="flex items-center justify-center">
                          Thanh toán ngay
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </div>
                      </button>

                      <button
                        onClick={handleNavigateToProducts}
                        className="w-full border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium py-3 rounded-xl transition-all duration-200"
                      >
                        Tiếp tục mua sắm
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;
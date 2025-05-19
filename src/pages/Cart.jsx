import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { auth } from '../lib/firebase';
import { fetchCart, removeFromCart, updateQuantity } from '../store/cartSlice';

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading, error } = useSelector((state) => state.carts);

  useEffect(() => {
    if (auth.currentUser) {
      dispatch(fetchCart());
    }
  }, [dispatch]);

  const totalAmount = items.reduce((total, item) => {
    return total + (Number(item.price) * (item.quantity || 1));
  }, 0);

  const handleRemoveFromCart = async (productId, variantId) => {
    try {
      await dispatch(removeFromCart({ productId, variantId })).unwrap();
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Có lỗi khi xóa sản phẩm khỏi giỏ hàng');
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

    navigate('/thanh-toan');
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-[74px]">
      <h1 className="text-3xl font-bold mb-8">Giỏ hàng</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Giỏ hàng trống</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image_url}
                      alt={item.product_name}
                      className="w-20 h-20 object-cover rounded"
                    />

                    <div>
                      <h3 className="font-semibold dark:text-white">{item.product_name}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{Number(item.price).toLocaleString()} ₫</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() => handleQuantityChange(
                            item.product_id,
                            item.variant_id,
                            (item.quantity || 1) - 1
                          )}
                          className="px-2 py-1 border rounded dark:border-gray-600 dark:text-white w-8"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="dark:text-white">{item.quantity || 1}</span>
                        <button
                          onClick={() => handleQuantityChange(
                            item.product_id,
                            item.variant_id,
                            (item.quantity || 1) + 1
                          )}
                          className="px-2 py-1 border rounded dark:border-gray-600 dark:text-white w-8"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <button
                      onClick={() => handleRemoveFromCart(item.product_id, item.variant_id)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Xóa
                    </button>
                    <p className="font-semibold mt-2 dark:text-white">
                      {(item.quantity * Number(item.price)).toLocaleString()} ₫
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Tổng giỏ hàng</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between dark:text-white">
              <span>Tạm tính</span>
              <span>{totalAmount.toLocaleString()} ₫</span>
            </div>
            <div className="flex justify-between font-semibold dark:text-white">
              <span>Tổng cộng</span>
              <span>{totalAmount.toLocaleString()} ₫</span>
            </div>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 dark:bg-blue-700 dark:hover:bg-blue-600"
            disabled={items.length === 0}
          >
            Thanh toán
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
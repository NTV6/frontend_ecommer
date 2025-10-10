import { useLocation, useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';

function CheckoutFailed() {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const errorCode = queryParams.get('code');

    const getErrorMessage = (code) => {
        switch (code) {
            case '24':
                return 'Bạn đã hủy giao dịch thanh toán';
            case '09':
                return 'Thẻ/Tài khoản không đủ số dư';
            case '10':
                return 'Sai thông tin xác thực';
            case '11':
                return 'Đã hết hạn chờ thanh toán';
            case '65':
                return 'Tài khoản bị khóa';
            default:
                return 'Giao dịch không thành công. Vui lòng thử lại.';
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center px-4 text-center">
            {/* Icon + Heading */}
            <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center shadow-lg mb-4">
                    <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                </div>
                <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
                    Thanh toán thất bại
                </h1>
                <p className="text-gray-700 dark:text-gray-300 max-w-md">
                    {getErrorMessage(errorCode)}
                </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mt-4">
                <button
                    onClick={() => navigate('/cart')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                    Quay lại giỏ hàng
                </button>

                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-3 border border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                >
                    Tiếp tục mua sắm
                </button>
            </div>
        </div>
    );
}

export default CheckoutFailed;

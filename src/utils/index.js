export const getThumbnailImage = (product) => {
    if (!product?.variants?.length) return '';

    // Tìm biến thể có giá thấp nhất
    const lowestPriceVariant = product.variants.reduce((lowest, current) => {
        if (!lowest || Number(current.price) < Number(lowest.price)) {
            return current;
        }
        return lowest;
    }, null);

    if (!lowestPriceVariant?.images?.length) return '';

    // Tìm hình ảnh thu nhỏ ở mức giá thấp nhất
    const thumbnail = lowestPriceVariant.images.find(img => img.is_thumbnail);
    if (thumbnail) return thumbnail.image;

    // Nếu không có hình thu nhỏ, trả về hình ảnh đầu tiên
    return lowestPriceVariant.images[0].image;
};

export const getLowestPrice = (product) => {
    if (!product?.variants?.length) return 0;

    const prices = product.variants.map(v => Number(v.price));
    return Math.min(...prices).toLocaleString();
};

export const getInitials = (email) => {
    return email
        .split('@')[0]
        .substring(0, 1)
        .toUpperCase();
};

export const validatePhoneNumber = (phoneNumber) => {
    // Cho phép số điện thoại trống
    if (!phoneNumber) {
        return {
            isValid: true,
            message: ''
        };
    }

    const phoneRegex = /^0\d{9}$/;
    const isValid = phoneRegex.test(phoneNumber.trim());

    return {
        isValid,
        message: isValid ? '' : 'SĐT phải có 10 số và bắt đầu bằng số 0'
    };
};

export const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
        case 'delivered':
        case 'completed':
            return 'bg-green-300 text-green-900';
        case 'processing':
        case 'user':
            return 'bg-blue-300 text-blue-900';
        case 'pending':
        case 'admin':
            return 'bg-yellow-300 text-yellow-900';
        case 'cancelled':
        case 'failed':
            return 'bg-red-300 text-red-900';
        case 'shipping':
            return 'bg-purple-300 text-purple-900';
        default:
            return 'bg-gray-300 text-gray-900';
    }
};

export const getStatusText = (status) => {
    switch (status) {
        case 'pending':
            return 'Chờ xác nhận';
        case 'processing':
            return 'Đang xử lý';
        case 'shipping':
            return 'Đang giao hàng';
        case 'delivered':
            return 'Đã giao hàng';
        case 'cancelled':
            return 'Đã hủy';
        case 'completed':
            return 'Đã hoàn thành';
        case 'failed':
            return 'Đã thất bại';
        default:
            return status;
    }
};

export const getPaymentStatus = (status) => {
    switch (status) {
        case 'pending':
            return 'Chưa thanh toán';
        case 'completed':
            return 'Đã thanh toán';
        case 'failed':
            return 'Thanh toán thất bại';
        default:
            return status;
    }
};

export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
};
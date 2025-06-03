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

export const formatDate = (dateString, showTime = true) => {
    if (!dateString) return 'Chưa cập nhật';
    const date = new Date(dateString);

    const dateStr = date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    // Trả về ngày chỉ khi showTime là false (đối với ngày sinh) hoặc thời gian là nửa đêm
    if (!showTime || (date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0)) {
        return dateStr;
    }

    const timeStr = date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    return `${dateStr} - ${timeStr}`;
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
        message: isValid ? '' : 'Số điện thoại phải có 10 số và bắt đầu bằng số 0'
    };
};
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

    // Return date only if showTime is false (for birthdays) or time is midnight
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
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
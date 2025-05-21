import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

import { auth } from '../lib/firebase';
import { addToCart } from '../store/cartSlice';
import { getProduct } from '../store/productSlice';


function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedProduct: productData, loading, error } = useSelector(state => state.products);

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    dispatch(getProduct(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (productData?.variants?.length > 0) {
      const firstVariant = productData.variants[0];
      setSelectedColor(firstVariant.color);
      setSelectedSize(firstVariant.size);
    }
  }, [productData]);

  // Sửa phần useEffect khi selectedVariant thay đổi
  useEffect(() => {
    if (selectedVariant?.images?.length > 0) {
      const sortedImages = sortImages(selectedVariant.images);
      setSelectedImage(sortedImages[0]);
    }
  }, [selectedVariant]);

  // Cập nhật biến thể đã chọn khi màu sắc hoặc kích thước thay đổi
  useEffect(() => {
    if (selectedColor && selectedSize && productData?.variants) {
      const variant = productData.variants.find(
        v => v.color === selectedColor && v.size === selectedSize
      );
      setSelectedVariant(variant);
    }
  }, [selectedColor, selectedSize, productData]);

  // Nhận màu sắc và kích thước độc đáo
  const availableColors = [...new Set(productData?.variants?.map(v => v.color) || [])];
  const availableSizes = [...new Set(productData?.variants
    ?.filter(v => v.color === selectedColor) // Chỉ lấy các variant có màu đã chọn
    ?.map(v => v.size) || []
  )];

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  const handleQuantityChange = (value) => {
    const newQuantity = quantity + value;
    if (newQuantity >= 1 && selectedVariant && newQuantity <= selectedVariant.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!auth.currentUser) {
      alert('Vui lòng đăng nhập để thêm vào giỏ hàng!');
      navigate('/auth');
      return;
    }

    if (!selectedVariant) {
      alert('Vui lòng chọn màu sắc và kích thước');
      return;
    }

    try {
      await dispatch(addToCart({
        productId: productData.id,
        variantId: selectedVariant.id,
        quantity
      })).unwrap();

      alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
      setQuantity(1);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert(error.message || 'Có lỗi xảy ra khi thêm vào giỏ hàng');
    }
  };

  const sortImages = (images) => {
    if (!images?.length) return [];
    return [...images].sort((a, b) => {
      if (a.is_thumbnail && !b.is_thumbnail) return -1;
      if (!a.is_thumbnail && b.is_thumbnail) return 1;
      return 0;
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-[74px]">
      {productData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative flex gap-4">
            {/* Thumbnail images */}
            <div className="hidden md:flex flex-col gap-2 w-20">
              {selectedVariant?.images && sortImages(selectedVariant.images).map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(image)}
                  className={`w-20 h-20 border rounded-lg overflow-hidden ${selectedImage?.id === image.id
                    ? 'border-2 border-blue-500'
                    : 'border-gray-200 hover:border-gray-400'
                    }`}
                >
                  <img
                    src={image.image}
                    alt={`View ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main image */}
            <div className="flex-1">
              <div
                ref={imageRef}
                className="aspect-square relative cursor-crosshair"
                onMouseEnter={() => setShowZoom(true)}
                onMouseLeave={() => setShowZoom(false)}
                onMouseMove={handleMouseMove}
              >
                <img
                  src={selectedImage?.image ||
                    selectedVariant?.images?.[0]?.image ||
                    productData.variants?.[0]?.images?.[0]?.image}
                  alt={productData.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              {/* Zoom view */}
              {showZoom && (selectedImage || selectedVariant?.images?.[0]) && (
                <div className="hidden md:block absolute left-[105%] top-0 w-[500px] h-[500px] overflow-hidden rounded-lg shadow-lg">
                  <div
                    className="absolute w-[200%] h-[200%]"
                    style={{
                      backgroundImage: `url(${selectedImage?.image || selectedVariant.images[0].image})`,
                      backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      backgroundSize: 'cover',
                      backgroundRepeat: 'no-repeat',
                      transform: 'scale(2)',
                      transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    }}
                  />
                </div>
              )}
            </div>
          </div>


          <div>
            <h1 className="text-3xl font-bold mb-4">{productData.name}</h1>
            <p className="text-2xl font-semibold text-gray-900 mb-4 dark:text-gray-100">
              {selectedVariant ? Number(selectedVariant.price).toLocaleString() : 'Chọn biến thể'}₫
            </p>

            <div className="items-center mb-2">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Số lượng</h3>
              {selectedVariant && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Còn {selectedVariant.stock} sản phẩm
                </span>
              )}
            </div>

            {/* Color selection */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Màu sắc</h3>
              <div className="flex gap-2 mt-2">
                {availableColors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded-md ${selectedColor === color
                      ? 'border-blue-500 text-blue-500'
                      : 'hover:border-gray-900'
                      }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size selection */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Kích thước</h3>
              <div className="flex gap-2 mt-2">
                {availableSizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-md ${selectedSize === size
                      ? 'border-blue-500 text-blue-500'
                      : 'hover:border-gray-900'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {selectedColor && availableSizes.length === 0 && (
                <p className="mt-2 text-sm text-red-500">
                  Không có size nào cho màu {selectedColor}
                </p>
              )}
            </div>

            {/* Quantity selection */}
            <div className="mb-4">

              <div className="flex items-center">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="px-3 py-1 border rounded-l"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  min="1"
                  max={selectedVariant?.stock || 1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-16 px-2 py-1 border-t border-b text-center dark:bg-gray-800 dark:text-gray-200"
                />
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="px-3 py-1 border rounded-r"
                  disabled={!selectedVariant || quantity >= selectedVariant.stock}
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to cart button */}
            <button
              onClick={handleAddToCart}
              disabled={!selectedVariant || selectedVariant.stock === 0}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {!selectedVariant
                ? 'Chọn biến thể'
                : selectedVariant.stock === 0
                  ? 'Hết hàng'
                  : 'Thêm vào giỏ hàng'
              }
            </button>

            {/* Product description */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Mô tả sản phẩm</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">{productData.description}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-screen">
          <p className="text-lg text-gray-500">Đang tải thông tin sản phẩm...</p>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
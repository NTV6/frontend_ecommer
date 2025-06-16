import { FiPlus, FiMinus } from 'react-icons/fi'
import { MdShoppingCart } from 'react-icons/md';

import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

import { db } from '../lib/firebase';
import { auth } from '../lib/firebase';
import { addToCart } from '../store/cartSlice';
import { getProduct } from '../store/productSlice';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import RatingStars from '../components/RatingStart';

function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedProduct: productData, loading, error } = useSelector(state => state.products);

  const imageRef = useRef(null);
  const zoomTimeoutRef = useRef(null);
  const [zoomBoxSize] = useState(150); // Kích thước khung zoom
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [showZoom, setShowZoom] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [showZoomDelayed, setShowZoomDelayed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (id) {
      const reviewsRef = collection(db, 'reviews');
      // Chuyển đổi id thành chuỗi để khớp với dữ liệu Firebase
      const q = query(reviewsRef, where('productId', '==', String(id)));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const reviewsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setReviews(reviewsData);
      });

      return () => unsubscribe();
    }
  }, [id]);

  // Lấy thông tin sản phẩm khi component mount
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

  const handleMouseEnter = () => {
    setShowZoom(true);
    // Delay 0.5 giây trước khi hiện zoom
    zoomTimeoutRef.current = setTimeout(() => {
      setShowZoomDelayed(true);
    }, 1000);
  };

  const handleMouseLeave = () => {
    setShowZoom(false);
    setShowZoomDelayed(false);
    // Clear timeout nếu user rời chuột trước khi delay kết thúc
    if (zoomTimeoutRef.current) {
      clearTimeout(zoomTimeoutRef.current);
      zoomTimeoutRef.current = null;
    }
  };

  // Cleanup timeout khi component unmount
  useEffect(() => {
    return () => {
      if (zoomTimeoutRef.current) {
        clearTimeout(zoomTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;

    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;

    // Tính toán vị trí khung zoom (giới hạn trong ảnh)
    const halfBoxSize = zoomBoxSize / 2;
    const boxX = Math.max(halfBoxSize, Math.min(width - halfBoxSize, mouseX));
    const boxY = Math.max(halfBoxSize, Math.min(height - halfBoxSize, mouseY));

    setMousePosition({ x: boxX, y: boxY });

    // Tính toán vị trí zoom (tỷ lệ phần trăm)
    const zoomX = ((boxX - halfBoxSize) / (width - zoomBoxSize)) * 100;
    const zoomY = ((boxY - halfBoxSize) / (height - zoomBoxSize)) * 100;

    setZoomPosition({
      x: Math.max(0, Math.min(100, zoomX)),
      y: Math.max(0, Math.min(100, zoomY))
    });
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

  // Thêm hàm tính điểm trung bình
  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-[74px] dark:bg-gray-900">
      {productData ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative flex gap-4">
              {/* Thumbnail images */}
              <div className="hidden md:flex flex-col gap-2 w-20">
                {selectedVariant?.images && sortImages(selectedVariant.images).map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(image)}
                    className={`border rounded-lg overflow-hidden ${selectedImage?.id === image.id
                      ? 'border-2 border-blue-500'
                      : 'border-gray-200 hover:border-gray-400'
                      }`}
                  >
                    <img
                      src={image.image}
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>

              {/* Main image with zoom */}
              <div className="flex-1 relative z-10">
                <div
                  ref={imageRef}
                  className="relative cursor-crosshair overflow-hidden rounded-lg"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onMouseMove={handleMouseMove}
                >
                  <img
                    src={selectedImage?.image ||
                      selectedVariant?.images?.[0]?.image ||
                      productData.variants?.[0]?.images?.[0]?.image}
                    alt={productData.name}
                    className="w-full h-full object-contain"
                  />

                  {/* Zoom box overlay */}
                  {showZoom && (
                    <div
                      className="absolute border-2 border-blue-500 bg-blue-500 bg-opacity-20 pointer-events-none"
                      style={{
                        width: `${zoomBoxSize}px`,
                        height: `${zoomBoxSize}px`,
                        left: `${mousePosition.x - zoomBoxSize / 2}px`,
                        top: `${mousePosition.y - zoomBoxSize / 2}px`,
                        transform: 'translate(0, 0)'
                      }}
                    />
                  )}
                </div>

                {/* Zoom view panel */}
                {showZoomDelayed && (selectedImage || selectedVariant?.images?.[0]) && (
                  <div className="hidden md:block absolute left-[105%] top-0 w-[500px] h-[500px] overflow-hidden rounded-lg shadow-lg border-2 border-gray-200 bg-white">
                    <div
                      className="w-full h-full"
                      style={{
                        backgroundImage: `url(${selectedImage?.image || selectedVariant.images[0].image})`,
                        backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        backgroundSize: '300%', // Tăng độ zoom
                        backgroundRepeat: 'no-repeat',
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Product details */}
            <div>
              <h1 className="text-3xl font-bold mb-4">{productData.name}</h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <RatingStars rating={parseFloat(calculateAverageRating(reviews))} />
                  <span className="ml-2 text-sm text-gray-600">
                    {calculateAverageRating(reviews)} / 5
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  ({reviews.length} đánh giá)
                </span>
              </div>

              <p className="text-2xl font-semibold text-gray-900 mb-4 dark:text-gray-100">
                {selectedVariant ? Number(selectedVariant.price).toLocaleString() : 'Chọn biến thể'}₫
              </p>

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
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Số lượng</h3>

                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center border rounded overflow-hidden">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="p-2 disabled:opacity-50 dark:bg-gray-700"
                      disabled={quantity <= 1}
                    >
                      <FiMinus className="w-4 h-4 text-gray-700 dark:text-gray-200" />
                    </button>
                    <input
                      min="1"
                      max={selectedVariant?.stock || 1}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-12 px-2 py-1 text-center border-x dark:bg-gray-800 dark:text-gray-200"
                    />
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="p-2 disabled:opacity-50 dark:bg-gray-700"
                      disabled={!selectedVariant || quantity >= selectedVariant.stock}
                    >
                      <FiPlus className="w-4 h-4 text-gray-700 dark:text-gray-200" />
                    </button>
                  </div>

                  {selectedVariant && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Còn {selectedVariant.stock} sản phẩm
                    </span>
                  )}
                </div>
              </div>

              {/* Add to cart button */}
              <button
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.stock === 0}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                {selectedVariant?.stock === 0
                  ? 'Hết hàng'
                  : !selectedVariant
                    ? 'Chọn biến thể'
                    : (
                      <>
                        <MdShoppingCart className="w-5 h-5" />
                        Thêm vào giỏ hàng
                      </>
                    )
                }
              </button>

              {/* Product description */}
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Mô tả sản phẩm</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">{productData.description}</p>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Đánh giá sản phẩm</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <ReviewForm productId={productData.id} onReviewSubmitted={() => console.log('Đánh giá đã được gửi')} />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Tất cả đánh giá ({reviews.length})
                </h3>
                {loading ? (
                  <p>Đang tải đánh giá...</p>
                ) : reviews.length > 0 ? (
                  <ReviewList reviews={reviews} />
                ) : (
                  <p className="text-gray-500">Chưa có đánh giá nào.</p>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-screen">
          <p className="text-lg text-gray-500">Đang tải thông tin sản phẩm...</p>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { HiChevronDown, HiChevronUp, HiPlus, HiMinus, HiShoppingCart } from "react-icons/hi";

import { db } from '../lib/firebase';
import { auth } from '../lib/firebase';
import { addToCart } from '../store/cartSlice';
import { getProduct } from '../store/productSlice';
import { fetchProducts } from '../store/productSlice';
import ProductCard from '../components/ProductCard';
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
  const [activeTab, setActiveTab] = useState('description');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { products } = useSelector(state => state.products);
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_DESCRIPTION_LENGTH = 300; // Số ký tự tối đa khi thu gọn

  const isDescriptionLong = (description) => {
    return description?.length > MAX_DESCRIPTION_LENGTH;
  };

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

  // Cleanup timeout khi component unmount
  useEffect(() => {
    return () => {
      if (zoomTimeoutRef.current) {
        clearTimeout(zoomTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (productData && products) {
      // Get products in the same category
      const related = products
        .filter(p =>
          p.category_id === productData.category_id &&
          p.id !== productData.id
        )
        .slice(0, 4); // Limit to 4 products
      setRelatedProducts(related);
    }
  }, [productData, products]);

  useEffect(() => {
    if (!products?.length) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products]);

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
    <div className="container mx-auto px-4 py-8 mt-[65px]">
      {productData ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Image section */}
            <div className="flex flex-col md:flex-row gap-4">
              {/* Thumbnail images */}
              <div className="order-2 md:order-1 md:w-20">
                <div className="flex md:flex-col gap-2 overflow-x-auto">
                  {selectedVariant?.images && sortImages(selectedVariant.images).map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImage(image)}
                      className={`flex-shrink-0 w-12 md:w-20 rounded-lg overflow-hidden ${selectedImage?.id === image.id
                        ? 'border-2 border-blue-500'
                        : ''
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
              </div>

              {/* Main image with zoom */}
              <div className="order-1 md:order-2 flex-1">
                <div className="relative z-10">
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
            </div>

            {/* Product details */}
            <div>
              <h1 className="text-4xl font-bold mb-4">{productData.name}</h1>

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

              <p className="text-3xl font-semibold text-gray-900 mb-4 dark:text-gray-100">
                {selectedVariant ? Number(selectedVariant.price).toLocaleString() : 'Chọn biến thể'}₫
              </p>

              {/* Color selection with thumbnails */}
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Màu sắc</h3>
                <div className="flex gap-2 mt-2">
                  {availableColors.map(color => {
                    // Find the first variant with this color to get its thumbnail
                    const variantWithColor = productData.variants.find(v => v.color === color);
                    const thumbnail = variantWithColor?.images?.find(img => img.is_thumbnail)?.image ||
                      variantWithColor?.images?.[0]?.image;

                    return (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-12 h-12 rounded-full overflow-hidden transition-all ${selectedColor === color
                          ? 'border-[3px] border-blue-500'
                          : ''
                          }`}
                      >
                        <img
                          src={thumbnail}
                          alt={color}
                          className="w-full h-full object-cover"
                        />
                        <span className="sr-only">{color}</span>
                      </button>
                    );
                  })}
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
                      className={`w-12 h-12 rounded-full bg-gray-200 dark:bg-blue-950 ${selectedSize === size
                        ? 'border-2 border-blue-500 text-blue-500'
                        : ''
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
                  <div className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-full">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="p-3 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      disabled={quantity <= 1}
                    >
                      <HiMinus className="w-4 h-4 text-gray-700 dark:text-gray-200" />
                    </button>

                    <input
                      min="1"
                      max={selectedVariant?.stock || 1}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-10 text-center font-medium bg-transparent outline-none"
                    />

                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="p-3 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      disabled={!selectedVariant || quantity >= selectedVariant.stock}
                    >
                      <HiPlus className="w-4 h-4 text-gray-700 dark:text-gray-200" />
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
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {selectedVariant?.stock === 0
                  ? 'Hết hàng'
                  : !selectedVariant
                    ? 'Chọn biến thể'
                    : (
                      <>
                        <HiShoppingCart className="w-5 h-5" />
                        Thêm vào giỏ hàng
                      </>
                    )
                }
              </button>
            </div>
          </div>

          {/* New tabbed section for description and reviews */}
          <div className="mt-12">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow-xl overflow-hidden">
              {/* Tab Headers */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex gap-8 px-8">
                  {['description', 'reviews'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-1 my-4 border-b-2 font-semibold transition-colors ${activeTab === tab
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                      {tab === 'description' ? 'Mô tả sản phẩm' : `Đánh giá (${reviews.length})`}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-8">
                {activeTab === 'description' && (
                  <div className="prose prose-lg max-w-none dark:prose-invert">
                    <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      <p className="whitespace-pre-line">
                        {isDescriptionLong(productData.description) && !isExpanded
                          ? productData.description.slice(0, MAX_DESCRIPTION_LENGTH) + '...'
                          : productData.description
                        }
                      </p>

                      {isDescriptionLong(productData.description) && (
                        <button
                          onClick={() => setIsExpanded(!isExpanded)}
                          className="mt-4 text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
                        >
                          {isExpanded ? (
                            <>
                              Thu gọn
                              <HiChevronUp className="w-5 h-5" />
                            </>
                          ) : (
                            <>
                              Xem thêm
                              <HiChevronDown className="w-5 h-5" />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div>
                      <ReviewForm
                        productId={productData.id}
                        onReviewSubmitted={() => console.log('Đánh giá đã được gửi')}
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
                        Tất cả đánh giá ({reviews.length})
                      </h3>
                      {reviews.length > 0 ? (
                        <ReviewList reviews={reviews} />
                      ) : (
                        <div className="text-center py-12">
                          <div className="text-6xl mb-4">💬</div>
                          <p className="text-gray-500 dark:text-gray-400">Chưa có đánh giá nào.</p>
                          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                            Hãy là người đầu tiên đánh giá sản phẩm này!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
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

      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Sản phẩm liên quan
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map(product => (
              <div
                key={product.id}
                className="transform hover:scale-105 transition-all duration-300"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
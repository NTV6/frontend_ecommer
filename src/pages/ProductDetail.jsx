import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';

function ProductDetail() {
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const { product } = location.state || {};
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const imageRef = useRef(null);

  // Thêm các kiểu dáng mẫu cho sản phẩm
  const productVariants = [
    { id: 0, image_url: product?.image_url },
    {
      id: 1,
      image_url: "https://product.hstatic.net/200000471735/product/mpu011s4-2-b04-ao-polo-2_06df45f6d0b547de8c413452dd6af800_1024x1024.jpg"
    },
    {
      id: 2,
      image_url: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=400"
    },
    {
      id: 3,
      image_url: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=400"
    }
  ];

  useEffect(() => {
    let unsubscribe;

    const fetchReviews = () => {
      const reviewsRef = collection(db, 'reviews');
      const q = query(
        reviewsRef,
        where('productId', '==', id),
        orderBy('createdAt', 'desc')
      );

      unsubscribe = onSnapshot(q, (snapshot) => {
        const reviewsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setReviews(reviewsData);
        setLoading(false);
      });
    };

    fetchReviews();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [id]);

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;

    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomPosition({ x, y });
  };

  const handleQuantityChange = (value) => {
    const newQuantity = quantity + value;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleQuantityInput = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= product.stock) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity }));
    alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
    setQuantity(1);
  };

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Không tìm thấy sản phẩm</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-[74px]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative flex gap-4">
          {/* Các kiểu dáng sản phẩm */}
          <div className="hidden md:flex flex-col gap-2 w-20">
            {productVariants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => setSelectedVariant(variant.id)}
                className={`w-20 h-20 border rounded-lg overflow-hidden transition-all ${selectedVariant === variant.id
                  ? 'border-2 border-gray-900'
                  : 'border-gray-200 hover:border-gray-400'
                  }`}
              >
                <img
                  src={variant.image_url}
                  alt={`Kiểu dáng ${variant.id + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Ảnh chính */}
          <div className="flex-1">
            <div
              ref={imageRef}
              className="aspect-square relative cursor-crosshair"
              onMouseEnter={() => setShowZoom(true)}
              onMouseLeave={() => setShowZoom(false)}
              onMouseMove={handleMouseMove}
            >
              <img
                src={productVariants[selectedVariant].image_url}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            {/* Ô phóng to */}
            {showZoom && (
              <div className="hidden md:block absolute left-[105%] top-0 w-[500px] h-[500px] overflow-hidden rounded-lg shadow-lg border border-gray-200">
                <div
                  className="absolute w-[200%] h-[200%]"
                  style={{
                    backgroundImage: `url(${productVariants[selectedVariant].image_url})`,
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
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-semibold text-gray-900 mb-4 dark:text-gray-100">{Number(product.price).toLocaleString()}₫</p>

          {/* Số lượng tồn kho */}
          <p className="text-sm text-gray-600 mb-4 dark:text-gray-300">
            Còn {product.stock} sản phẩm
          </p>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 dark:text-gray-300">Kích thước:</span>
              <div className="flex space-x-2">
                {['S', 'M', 'L', 'XL'].map((size) => (
                  <button
                    key={size}
                    className="px-4 py-2 border rounded-md hover:border-gray-900 hover:text-gray-900"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Chọn số lượng */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 dark:text-gray-300">Số lượng:</span>
              <div className="flex items-center border rounded-md">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="px-3 py-1 border-r hover:bg-gray-100"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={handleQuantityInput}
                  className="w-12 text-center focus:outline-none dark:bg-gray-950"
                />
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="px-3 py-1 border-l hover:bg-gray-100"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full md:w-auto bg-blue-700 text-white px-8 py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {product.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
            </button>
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Mô tả sản phẩm</h2>
              <p className="text-gray-600 dark:text-gray-400">
                {product.description}
              </p>
            </div>
          </div>
        </div>
      </div>


      {/* Phần đánh giá sản phẩm */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Đánh giá sản phẩm</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Viết đánh giá</h3>
            <ReviewForm productId={id} onReviewSubmitted={() => { }} />
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
    </div>
  );
}

export default ProductDetail;
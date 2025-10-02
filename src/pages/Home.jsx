import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { ArrowRight, TrendingUp, Users, Award, Truck } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../store/productSlice';
import { fetchCategories } from '../store/categorySlice';

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        className="h-screen overflow-hidden"
      >
        <SwiperSlide>
          <div className="relative w-full h-full bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80')]">
            {/* Overlay đen mờ */}
            <div className="absolute inset-0 bg-black bg-opacity-20 z-0" />
            <div className="relative container mx-auto px-4 h-full flex items-center z-10">
              <div className="max-w-xl">
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">Bộ sưu tập mới 2024</h2>
                <p className="text-white text-lg mb-8">Khám phá những xu hướng thời trang mới nhất</p>
                <button className="bg-white text-gray-900 px-8 py-3 rounded-full hover:bg-gray-100">
                  Xem ngay
                </button>
              </div>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="relative w-full h-full bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80')]">
            {/* Overlay đen mờ */}
            <div className="absolute inset-0 bg-black bg-opacity-20 z-0" />
            <div className="relative container mx-auto px-4 h-full flex items-center z-10">
              <div className="max-w-xl">
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">Phong cách thanh lịch</h2>
                <p className="text-white text-lg mb-8">Tôn vinh vẻ đẹp của phái nữ</p>
                <button className="bg-white text-gray-900 px-8 py-3 rounded-full hover:bg-gray-100">
                  Khám phá
                </button>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-white to-cyan-50 dark:from-gray-950 dark:to-cyan-950 text-gray-900 dark:text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-2">50K+</h3>
              <p className="text-gray-600 dark:text-gray-300">Khách hàng tin tưởng</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-2">99%</h3>
              <p className="text-gray-600 dark:text-gray-300">Đánh giá tích cực</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold mb-2">500+</h3>
              <p className="text-gray-600 dark:text-gray-300">Sản phẩm đa dạng</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold mb-2">24h</h3>
              <p className="text-gray-600 dark:text-gray-300">Giao hàng nhanh</p>
            </div>
          </div >
        </div >
      </section >

      {/* Categories Section */}
      <section className="py-20" >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Danh mục nổi bật</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Khám phá những bộ sưu tập đa dạng với phong cách thời trang hiện đại
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...categories].reverse().slice(0, 4).map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
              />
            ))}
          </div>
        </div>
      </section >

      {/* Featured Products */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900" >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Sản phẩm mới nhất</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Những thiết kế mới nhất với chất lượng cao và giá cả hợp lý
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...products].reverse().slice(0, 4).map((product) => (
              <div
                key={product.id}
                className="transform hover:scale-105 transition-all duration-300"
              >
                <ProductCard
                  key={product.id}
                  product={product}
                />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button onClick={() => navigate('/product')} className="dark:bg-gray-900 px-8 py-4 rounded-full hover:dark:bg-gray-800 hover:bg-gray-200 transition-colors flex items-center gap-2 mx-auto">
              Xem tất cả sản phẩm
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section >

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-cyan-50 dark:from-gray-900 dark:to-cyan-950 text-gray-900 dark:text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold mb-4">
              Đăng ký nhận thông tin mới nhất
            </h2>
            <p className="text-xl dark:text-blue-100 mb-8">
              Nhận ngay thông tin về các sản phẩm mới, khuyến mãi và xu hướng thời trang
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1 px-6 py-4 rounded-full border border-gray-300"
              />
              <button className="border border-gray-400 dark:border-white px-8 py-4 rounded-full font-semibold bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 dark:hover:bg-black transition-colors hover:text-white">
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </section >
    </div >
  );
}

export default Home;
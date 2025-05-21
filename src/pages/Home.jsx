import { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import Categories from '../components/Categories';
import ProductItem from '../components/ProductItem';
import { fetchProducts } from '../store/productSlice';

function Home() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div className='mt-[74px]'>
      {/* Banner Slider */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        className="h-[835px]"
      >
        <SwiperSlide>
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80')] bg-cover bg-center">
            <div className="container mx-auto px-4 h-full flex items-center">
              <div className="max-w-xl">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Bộ sưu tập mới 2024</h1>
                <p className="text-white text-lg mb-8">Khám phá những xu hướng thời trang mới nhất</p>
                <button className="bg-white text-gray-900 px-8 py-3 rounded-full hover:bg-gray-100">
                  Xem ngay
                </button>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80')] bg-cover bg-center">
            <div className="container mx-auto px-4 h-full flex items-center">
              <div className="max-w-xl">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Phong cách thanh lịch</h1>
                <p className="text-white text-lg mb-8">Tôn vinh vẻ đẹp của phái nữ</p>
                <button className="bg-white text-gray-900 px-8 py-3 rounded-full hover:bg-gray-100">
                  Khám phá
                </button>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>

      {/* Danh mục sản phẩm nổi bật */}
      <section className="py-16 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">DANH MỤC NỔI BẬT</h2>
          <Categories />
        </div>
      </section>

      {/* Sản phẩm mới */}
      <section className="py-16 bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">SẢN PHẨM MỚI</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...products].reverse().slice(0, 4).map((product) => (
              <ProductItem
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';

import Pagination from '../components/Pagination';
import PriceFilter from '../components/PriceFilter';
import GenderFilter from '../components/GenderFilter';
import ProductItem from '../components/ProductItem';
import { fetchProductsByCategory } from '../store/productSlice';


function CategoryProducts() {
  const { id } = useParams();
  const location = useLocation();
  const category = location.state?.category;
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;
  const dispatch = useDispatch();

  // Lấy dữ liệu từ kho lưu trữ Redux
  const { products, loading, error } = useSelector((state) => state.products);
  const selectedPriceRange = useSelector((state) => state.categories.selectedPriceRange);
  const selectedGender = useSelector((state) => state.categories.selectedGender);

  const filteredProducts = products.filter(product => {
    // Lấy giá thấp nhất từ các variants để so sánh
    const minPrice = Math.min(...(product.variants?.map(v => Number(v.price)) || [0]));

    const matchesPrice = !selectedPriceRange ||
      (minPrice >= selectedPriceRange.min && minPrice <= selectedPriceRange.max);
    const matchesGender = !selectedGender || product.gender === selectedGender.value;
    return matchesPrice && matchesGender;
  });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductsByCategory(id));
    }
  }, [dispatch, id]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  if (loading) return <div className="container mx-auto px-4 py-8 mt-[74px]">
    <p className="text-center text-gray-500">Đang tải...</p>
  </div>;

  if (error) return <div className="container mx-auto px-4 py-8 mt-[74px]">
    <p className="text-center text-red-500">Lỗi: {error}</p>
  </div>;

  if (!category) return <div className="container mx-auto px-4 py-8 mt-[74px]">
    <p className="text-center text-gray-500">Không tìm thấy danh mục</p>
  </div>;

  return (
    <div className="container mx-auto px-4 py-8 mt-[74px] dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">{category.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <GenderFilter />
          <PriceFilter />
        </div>
        <div className="md:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">Không tìm thấy sản phẩm phù hợp</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {paginatedProducts.map((product) => (
                  <ProductItem
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoryProducts;
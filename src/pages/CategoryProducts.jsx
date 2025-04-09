import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart } from '../store/cartSlice';
import PriceFilter from '../components/PriceFilter';
import GenderFilter from '../components/GenderFilter';
import Pagination from '../components/Pagination';
import { fetchProducts } from '../store/productSlice';

function CategoryProducts() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.category.categories);
  const selectedPriceRange = useSelector((state) => state.category.selectedPriceRange);
  const selectedGender = useSelector((state) => state.category.selectedGender);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const category = categories.find(cat => cat.slug === slug);

  const filteredProducts = products.filter(product => {
    const matchesCategory = product.category_id === category?.id;
    const matchesPrice = !selectedPriceRange ||
      (product.price >= selectedPriceRange.min && product.price <= selectedPriceRange.max);
    const matchesGender = !selectedGender || product.gender === selectedGender.value;
    return matchesCategory && matchesPrice && matchesGender;
  });

  // Tính toán phân trang
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    alert('Đã thêm sản phẩm vào giỏ hàng!');
  };

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Không tìm thấy danh mục</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-[74px]">
      <h1 className="text-3xl font-bold mb-8">{category.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <GenderFilter />
          <PriceFilter />
        </div>
        <div className="md:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Không tìm thấy sản phẩm phù hợp</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {paginatedProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-md">
                    <Link to={`/san-pham/${product.id}`} state={{ product }}>
                      <img src={product.image_url} alt={product.name} className="w-full h-[300px] object-cover hover:opacity-90 transition-opacity" />
                    </Link>
                    <div className="p-4">
                      <Link to={`/san-pham/${product.id}`} state={{ product }}>
                        <h3 className="text-lg font-semibold mb-2 hover:text-gray-600">{product.name}</h3>
                      </Link>
                      <p className="text-gray-600 mb-2">{Number(product.price).toLocaleString()}₫</p>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-gray-900 text-white py-2 rounded hover:bg-gray-800"
                      >
                        Thêm vào giỏ
                      </button>
                    </div>
                  </div>
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
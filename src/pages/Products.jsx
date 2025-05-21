import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import PriceFilter from '../components/PriceFilter';
import GenderFilter from '../components/GenderFilter';
import ProductItem from '../components/ProductItem';
import { fetchProducts } from '../store/productSlice';

function Products() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const selectedPriceRange = useSelector((state) => state.categories.selectedPriceRange);
  const selectedGender = useSelector((state) => state.categories.selectedGender);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Lọc sản phẩm dựa trên các bộ lọc đã chọn
  const filteredProducts = products.filter(product => {
    // Lấy giá thấp nhất từ các variants để so sánh
    const minPrice = Math.min(...(product.variants?.map(v => Number(v.price)) || [0]));

    const matchesPrice = !selectedPriceRange ||
      (minPrice >= selectedPriceRange.min && minPrice <= selectedPriceRange.max);
    const matchesGender = !selectedGender || product.gender === selectedGender.value;
    return matchesPrice && matchesGender;
  });

  return (
    <div className="container mx-auto px-4 py-8 mt-[74px]">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Sản phẩm</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar with filters */}
        <div className="md:col-span-1">
          <GenderFilter />
          <PriceFilter />
        </div>

        {/* Product grid */}
        <div className="md:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">Không tìm thấy sản phẩm phù hợp</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...filteredProducts].reverse().map((product) => (
                <ProductItem
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;
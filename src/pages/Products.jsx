import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart } from '../store/cartSlice';
import { fetchProducts } from '../store/productSlice';
import PriceFilter from '../components/PriceFilter';
import GenderFilter from '../components/GenderFilter';

function Products() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const selectedPriceRange = useSelector((state) => state.categories.selectedPriceRange);
  const selectedGender = useSelector((state) => state.categories.selectedGender);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    alert('Đã thêm sản phẩm vào giỏ hàng!');
  };

  // Filter products based on selected filters
  const filteredProducts = products.filter(product => {
    const matchesPrice = !selectedPriceRange ||
      (product.price >= selectedPriceRange.min && product.price <= selectedPriceRange.max);
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
                <div key={product.id} className="bg-white dark:bg-gray-700 rounded-lg overflow-hidden shadow-md">
                  <Link to={`/san-pham/${product.id}`} state={{ product }}>
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-[300px] object-cover hover:opacity-90 transition-opacity"
                    />
                  </Link>
                  <div className="p-4">
                    <Link to={`/san-pham/${product.id}`} state={{ product }}>
                      <h3 className="text-lg font-semibold mb-2 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-gray-600 dark:text-gray-100 mb-2">
                      {Number(product.price).toLocaleString()}₫
                    </p>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full text-white py-2 rounded bg-gray-900 hover:bg-gray-800 dark:bg-blue-700 dark:hover:bg-blue-600"
                    >
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;
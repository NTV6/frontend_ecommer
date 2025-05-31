import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { addToCart } from '../store/cartSlice';
import { fetchProducts } from '../store/productSlice';
import { getThumbnailImage, getLowestPrice } from '../utils';

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q')?.toLowerCase() || '';
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const searchResults = products.filter(product =>
    product.name.toLowerCase().includes(query) ||
    product.description.toLowerCase().includes(query)
  );

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    alert('Đã thêm sản phẩm vào giỏ hàng!');
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-[74px]">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">
        Kết quả tìm kiếm cho "{query}"
      </h1>
      {searchResults.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">Không tìm thấy sản phẩm phù hợp</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {searchResults.map((product) => (
            <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
              <Link to={`/san-pham/${product.id}`} state={{ product }}>
                <img
                  src={getThumbnailImage(product)}
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
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  {getLowestPrice(product)}₫
                </p>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-gray-900 text-white py-2 rounded hover:bg-gray-800 dark:bg-blue-700 dark:hover:bg-blue-600"
                >
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchResults;
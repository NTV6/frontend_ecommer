import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { fetchProducts } from '../store/productSlice';

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
      <h1 className="text-3xl font-bold mb-8">
        Kết quả tìm kiếm cho "{query}"
      </h1>
      {searchResults.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Không tìm thấy sản phẩm phù hợp</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {searchResults.map((product) => (
            <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-md">
              <Link to={`/san-pham/${product.id}`} state={{ product }}>
                <img src={product.image} alt={product.name} className="w-full h-[300px] object-cover hover:opacity-90 transition-opacity" />
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
      )}
    </div>
  );
}

export default SearchResults;
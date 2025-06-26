import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/productSlice';
import ProductLayout from '../components/ProductLayout';

function Products() {
  const dispatch = useDispatch();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { products, loading } = useSelector((state) => state.products);
  const selectedPriceRange = useSelector((state) => state.categories.selectedPriceRange);
  const selectedGender = useSelector((state) => state.categories.selectedGender);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = products.filter(product => {
    const minPrice = Math.min(...(product.variants?.map(v => Number(v.price)) || [0]));
    const matchesPrice = !selectedPriceRange ||
      (minPrice >= selectedPriceRange.min && minPrice <= selectedPriceRange.max);
    const matchesGender = !selectedGender || product.gender === selectedGender.value;
    return matchesPrice && matchesGender;
  });

  return (
    <ProductLayout
      title="Bộ Sưu Tập Sản Phẩm"
      subtitle="Khám phá những sản phẩm chất lượng cao với thiết kế hiện đại và phong cách độc đáo"
      products={[...filteredProducts].reverse()}
      loading={loading}
      selectedPriceRange={selectedPriceRange}
      selectedGender={selectedGender}
      isFilterOpen={isFilterOpen}
      setIsFilterOpen={setIsFilterOpen}
    />
  );
}

export default Products;
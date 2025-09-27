import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchProducts } from '../store/productSlice';
import { fetchCategories } from '../store/categorySlice';
import ProductLayout from '../components/ProductLayout';

function Products() {
  const dispatch = useDispatch();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { products, loading } = useSelector((state) => state.products);
  const selectedPriceRange = useSelector((state) => state.categories.selectedPriceRange);
  const selectedGender = useSelector((state) => state.categories.selectedGender);
  const selectedCategory = useSelector((state) => state.categories.selectedCategory);
  const { categories } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const filteredProducts = products.filter(product => {
    const minPrice = Math.min(...(product.variants?.map(v => Number(v.price)) || [0]));
    const matchesPrice = !selectedPriceRange ||
      (minPrice >= selectedPriceRange.min && minPrice <= selectedPriceRange.max);
    const matchesGender = !selectedGender || product.gender === selectedGender.value;
    const matchesCategory = !selectedCategory || product.category_id === selectedCategory.id;
    return matchesPrice && matchesGender && matchesCategory;
  });

  return (
    <ProductLayout
      title="Bộ Sưu Tập Sản Phẩm"
      subtitle="Khám phá những sản phẩm chất lượng cao với thiết kế hiện đại và phong cách độc đáo"
      products={[...filteredProducts].reverse()}
      loading={loading}
      selectedPriceRange={selectedPriceRange}
      selectedGender={selectedGender}
      selectedCategory={selectedCategory}
      categories={categories}
      isFilterOpen={isFilterOpen}
      setIsFilterOpen={setIsFilterOpen}
      showCategories={true}
    />
  );
}

export default Products;
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';
import { fetchProductsByCategory } from '../store/productSlice';
import ProductLayout from '../components/ProductLayout';

function CategoryProducts() {
  const { id } = useParams();
  const location = useLocation();
  const category = location.state?.category;
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const productsPerPage = 6;
  const dispatch = useDispatch();

  const { products, loading } = useSelector((state) => state.products);
  const selectedPriceRange = useSelector((state) => state.categories.selectedPriceRange);
  const selectedGender = useSelector((state) => state.categories.selectedGender);

  const filteredProducts = products.filter(product => {
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

  if (!category) return null;

  return (
    <ProductLayout
      title={category.name}
      products={paginatedProducts}
      loading={loading}
      selectedPriceRange={selectedPriceRange}
      selectedGender={selectedGender}
      isFilterOpen={isFilterOpen}
      setIsFilterOpen={setIsFilterOpen}
      showPagination={true}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={(page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
      }}
    />
  );
}

export default CategoryProducts;
import PriceFilter from './PriceFilter';
import { useDispatch } from 'react-redux';
import { HiOutlineCubeTransparent, HiOutlineFilter, HiOutlineChevronDown, HiOutlineDatabase, HiOutlineViewGrid } from 'react-icons/hi';
// import GenderFilter from './GenderFilter';
import ProductCard from './ProductCard';
import Pagination from './Pagination';
import { setSelectedCategory } from '../store/categorySlice';

function ProductLayout({
    title,
    subtitle,
    products,
    loading,
    selectedPriceRange,
    selectedGender,
    selectedCategory,
    categories,
    isFilterOpen,
    setIsFilterOpen,
    showPagination = false,
    currentPage,
    totalPages,
    onPageChange,
    showCategories = false,
    totalItems = 0,
}) {
    const dispatch = useDispatch();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-[65px]">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">Đang tải sản phẩm...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-[65px]">
            {title && (
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">
                    <div className="container mx-auto px-4 py-12">
                        <div className="text-center text-white">
                            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text">
                                {title}
                            </h2>
                            {subtitle && <p className="opacity-90 max-w-2xl mx-auto">{subtitle}</p>}
                            <div className="mt-6 flex justify-center">
                                <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 text-sm font-medium">
                                    {products.length} sản phẩm có sẵn
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Mobile Filter Toggle */}
                    <div className="lg:hidden">
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="w-full bg-white dark:bg-gray-800 shadow-lg rounded-xl px-6 py-4 flex items-center justify-between hover:shadow-xl transition-all duration-300"
                        >
                            <span className="font-semibold text-gray-800 dark:text-white flex items-center">
                                <HiOutlineFilter className="w-5 h-5 mr-2" />
                                Bộ Lọc
                            </span>
                            <HiOutlineChevronDown
                                className={`w-5 h-5 transform transition-transform ${isFilterOpen ? 'rotate-180' : ''}`}
                            />
                        </button>
                    </div>

                    {/* Sidebar with filters */}
                    <div className={`lg:w-80 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
                        <div className="sticky top-24 space-y-6">
                            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 border border-gray-100 dark:border-gray-700">
                                {showCategories && (
                                    <div className="mb-6">
                                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                                            <HiOutlineViewGrid className="w-6 h-6 mr-2 text-blue-600" />
                                            Danh mục sản phẩm
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() => dispatch(setSelectedCategory(null))}
                                                className={`px-4 py-2 rounded-md ${!selectedCategory
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200'
                                                    }`}
                                            >
                                                Tất cả
                                            </button>
                                            {Array.isArray(categories) && categories.map(category => (
                                                <button
                                                    key={category.id}
                                                    onClick={() => dispatch(setSelectedCategory(category))}
                                                    className={`px-4 py-2 rounded-md ${selectedCategory?.id === category.id
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    {category.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                                    <HiOutlineCubeTransparent className="w-6 h-6 mr-2 text-blue-600" />
                                    Bộ Lọc Sản Phẩm
                                </h3>

                                <div className="space-y-6">
                                    {/* <GenderFilter /> */}
                                    <PriceFilter />
                                </div>

                                {/* Filter Summary */}
                                {(selectedGender || selectedPriceRange) && (
                                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                                        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Bộ lọc đang áp dụng:</h4>
                                        <div className="space-y-1 text-sm">
                                            {selectedGender && (
                                                <div className="text-blue-700 dark:text-blue-300">• Giới tính: {selectedGender.label}</div>
                                            )}
                                            {selectedPriceRange && (
                                                <div className="text-blue-700 dark:text-blue-300">
                                                    • Giá: {selectedPriceRange.min.toLocaleString()} - {selectedPriceRange.max.toLocaleString()} VNĐ
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Product grid */}
                    <div className="flex-1">
                        {products.length === 0 ? (
                            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-12 text-center border border-gray-100 dark:border-gray-700">
                                <div className="flex flex-col items-center space-y-4">
                                    <HiOutlineDatabase className="w-16 h-16 text-gray-400" />
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                                            Không tìm thấy sản phẩm
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400 max-w-md">
                                            Thử điều chỉnh bộ lọc của bạn hoặc tìm kiếm với từ khóa khác để tìm thấy sản phẩm phù hợp.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                                    >
                                        Làm mới trang
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    {products.map((product, index) => (
                                        <div
                                            key={product.id}
                                            className="transform hover:scale-105 transition-all duration-300"
                                            style={{
                                                animation: `fadeInUp 0.6s ease-out forwards ${index * 100}ms`
                                            }}
                                        >
                                            <ProductCard product={product} />
                                        </div>
                                    ))}
                                </div>
                                {showPagination && totalPages > 1 && (
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={onPageChange}
                                        totalItems={totalItems}
                                    />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductLayout;
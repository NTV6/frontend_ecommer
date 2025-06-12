import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    HiPlus,
    HiClipboardList,
    HiXCircle,
    HiPencilAlt,
    HiTrash,
    HiInbox
} from 'react-icons/hi';

import { formatDate } from '../../utils';
import { fetchCategories } from '../../store/categorySlice';
import { usePagination } from '../../../hook/usePagination';
import { useDebounceSearch } from '../../../hook/useDebounceSearch';
import { fetchProducts, deleteProduct } from '../../store/productSlice';
import Search from '../../components/Search';
import Filter from '../../components/Filter';
import Pagination from '../../components/Pagination';
import ProductModal from '../../components/ProductModal';

function ProductManagement() {
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.products);
    const { categories } = useSelector((state) => state.categories);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [modalMode, setModalMode] = useState('add');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');

    const statusOptions = [
        { value: 'in-stock', label: '🟢 Còn hàng' },
        { value: '0', label: '🔴 Hết hàng' }
    ];

    const {
        searchTerm,
        setSearchTerm,
        filteredItems: filteredProducts,
        activeFilters,
        setActiveFilters
    } = useDebounceSearch(products, {
        searchFields: ['name', 'description'],
        filters: {
            status: 'all',
            category_id: 'all'
        }
    });

    const {
        currentPage,
        setCurrentPage,
        totalPages,
        paginatedItems: currentProducts,
        totalItems
    } = usePagination(filteredProducts);

    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchCategories());
    }, [dispatch]);

    useEffect(() => {
        setActiveFilters(prev => ({
            ...prev,
            status: statusFilter,
            category_id: categoryFilter
        }));
    }, [statusFilter, categoryFilter, setActiveFilters]);

    const handleAddProduct = () => {
        setModalMode('add');
        setSelectedProduct(null);
        setIsModalOpen(true);
    };

    const handleEditProduct = (product) => {
        setModalMode('edit');
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleDeleteProduct = async (product) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            try {
                await dispatch(deleteProduct(product.id)).unwrap();
                dispatch(fetchProducts());
                alert('Xóa sản phẩm thành công');
            } catch (error) {
                console.error('Lỗi khi xóa sản phẩm:', error);
                alert('Có lỗi xảy ra khi xóa sản phẩm');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }
    return (
        <div className="space-y-4">
            <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                {/* Tiêu đề và nút */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                        <HiInbox className="w-8 h-8 text-blue-600" />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Quản lý sản phẩm
                        </h2>
                    </div>
                    <button
                        onClick={handleAddProduct}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md"
                    >
                        <HiPlus className="w-5 h-5 mr-2" />
                        Thêm sản phẩm
                    </button>
                </div>

                {/* Tìm kiếm & bộ lọc */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Search bên trái */}
                    <div className="flex-1">
                        <Search
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder="Tìm kiếm sản phẩm..."
                            className="w-full sm:max-w-60"
                        />
                    </div>

                    {/* Bộ lọc và tổng số bên phải */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Tổng số: <strong>{filteredProducts.length}</strong> sản phẩm
                        </div>

                        <Filter
                            value={statusFilter}
                            onChange={setStatusFilter}
                            options={statusOptions}
                            defaultLabel="📦 Tất cả trạng thái"
                        />
                        <Filter
                            value={categoryFilter}
                            onChange={setCategoryFilter}
                            options={categories.map(cat => ({
                                value: cat.id,
                                label: cat.name
                            }))}
                            defaultLabel="📁 Tất cả danh mục"
                        />
                    </div>
                </div>
            </div>

            {(statusFilter !== 'all' || categoryFilter !== 'all' || searchTerm) && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>Bộ lọc:</span>
                    {statusFilter !== 'all' && (
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusFilter === 'in-stock'
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                            }`}>
                            {statusOptions.find(opt => opt.value === statusFilter)?.label}
                        </span>
                    )}
                    {categoryFilter !== 'all' && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                            {categories.find(cat => cat.id.toString() === categoryFilter)?.name}
                        </span>
                    )}
                    {searchTerm && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300">
                            Tìm kiếm: {searchTerm}
                        </span>
                    )}
                    <button
                        onClick={() => {
                            setStatusFilter('all');
                            setCategoryFilter('all');
                            setSearchTerm('');
                        }}
                        className="text-red-600 hover:text-red-800 ml-2"
                    >
                        Xóa bộ lọc
                    </button>
                </div>
            )}

            {/* Products Grid/Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    Sản phẩm
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    Danh mục
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    Biến thể
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    Giá từ
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    Tồn kho
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    Trạng thái
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    Ngày tạo
                                </th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                            {currentProducts.map((product) => {
                                const totalStock = product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
                                const lowestPrice = product.variants?.length > 0
                                    ? Math.min(...product.variants.map(v => v.price))
                                    : 0;
                                const thumbnailImage = product.variants?.[0]?.images?.find(img => img.is_thumbnail)?.image
                                    || product.variants?.[0]?.images?.[0]?.image;

                                return (
                                    <tr key={`product-${product.id}`} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="relative">
                                                    <img
                                                        src={thumbnailImage}
                                                        alt={product.name}
                                                        className="w-12 rounded-lg object-cover mr-4 border border-gray-200 dark:border-gray-600"
                                                    />
                                                    {totalStock === 0 && (
                                                        <div className="absolute w-12 inset-0 bg-red-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                                                            <HiXCircle className="w-6 h-6 text-red-600" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                                        {product.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                                {categories.find(cat => cat.id === product.category_id)?.name || 'Chưa có danh mục'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-900 dark:text-white">
                                                <HiClipboardList className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                                                {product.variants?.length || 0}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                                {Number(lowestPrice).toLocaleString()}₫
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className={`w-2 h-2 rounded-full mr-2 ${totalStock > 0 ? 'bg-green-400' : 'bg-red-400'}`}></div>
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {totalStock}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${totalStock > 0
                                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${totalStock > 0 ? 'bg-green-400' : 'bg-red-400'}`}></div>
                                                {totalStock > 0 ? "Còn hàng" : "Hết hàng"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {formatDate(product.created_at)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex items-center justify-center space-x-2">
                                                <button
                                                    onClick={() => handleEditProduct(product)}
                                                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 dark:text-blue-400 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 transition-colors duration-200"
                                                >
                                                    <HiPencilAlt className="w-4 h-4 mr-1" />
                                                    Sửa
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(product)}
                                                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 dark:text-red-400 dark:bg-red-900/20 dark:hover:bg-red-900/30 transition-colors duration-200"
                                                >
                                                    <HiTrash className="w-4 h-4 mr-1" />
                                                    Xóa
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    onPageChange={setCurrentPage}
                />

                {/* Empty State */}
                {filteredProducts.length === 0 && (
                    <div className="text-center py-12">
                        <HiClipboardList className="mx-auto w-12 h-12 text-gray-400 dark:text-gray-500" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Không có sản phẩm</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Không tìm thấy sản phẩm nào phù hợp với bộ lọc hiện tại.
                        </p>
                    </div>
                )}
            </div>
            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={selectedProduct}
                mode={modalMode}
                categories={categories}
            />
        </div>
    );
}

export default ProductManagement;
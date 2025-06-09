import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    HiPlus,
    HiSearch,
    HiMenuAlt4,
    HiClipboardList,
    HiXCircle,
    HiPencilAlt,
    HiTrash
} from 'react-icons/hi';

import { formatDate } from '../../utils';
import { fetchCategories } from '../../store/categorySlice';
import { fetchProducts, deleteProduct } from '../../store/productSlice';
import ProductModal from '../../components/ProductModal';

function ProductManagement() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [modalMode, setModalMode] = useState('add');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');

    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.products);
    const { categories } = useSelector((state) => state.categories);

    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchCategories());
    }, [dispatch]);

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

    // Filter products
    const filteredProducts = [...products].reverse().filter(product => {
        const totalStock = product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'in-stock' && totalStock > 0) ||
            (statusFilter === 'out-of-stock' && totalStock === 0);
        const matchesCategory = categoryFilter === 'all' || product.category_id.toString() === categoryFilter;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6 pt-0 space-y-6 mt-[110px]">
            {/* Fixed Header */}
            <div className="flex justify-between items-center h-[88px] fixed top-0 left-64 right-0 bg-white dark:bg-gray-900 px-6 py-6 border-b border-gray-200 dark:border-gray-700">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý sản phẩm</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Quản lý thông tin sản phẩm và biến thể
                    </p>
                </div>
                <button
                    onClick={handleAddProduct}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                    <HiPlus className="w-5 h-5 mr-2" />
                    Thêm sản phẩm
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                        <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="in-stock">Còn hàng</option>
                        <option value="out-of-stock">Hết hàng</option>
                    </select>

                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">Tất cả danh mục</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>

                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {filteredProducts.length} sản phẩm
                        </span>
                        <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                            <HiMenuAlt4 className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

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
                            {filteredProducts.map((product) => {
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
                                                    <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                                                        {product.description}
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
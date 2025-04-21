import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

import ProductModal from '../../components/ProductModal';
import { fetchCategories } from '../../store/categorySlice';
import { fetchProducts, deleteProduct } from '../../store/productSlice';

function ProductManagement() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [modalMode, setModalMode] = useState('add');

    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.products);
    const { categories } = useSelector((state) => state.categories); // Thêm selector

    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchCategories()); // Fetch categories khi component mount
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
                dispatch(fetchProducts()); // Refresh danh sách sau khi xóa
                alert('Xóa sản phẩm thành công');
            } catch (error) {
                console.error('Lỗi khi xóa sản phẩm:', error);
                alert('Có lỗi xảy ra khi xóa sản phẩm');
            }
        }
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="text-center">Đang tải...</div>
            </div>
        );
    }

    return (
        <div className="p-6 pt-0">
            <div className="flex justify-between items-center h-[88px] fixed top-0 left-64 right-0 bg-gray-100 dark:bg-gray-900 px-6 py-6">
                <h2 className="text-2xl font-bold dark:text-white">Quản lý sản phẩm</h2>
                <button
                    onClick={handleAddProduct}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                    Thêm sản phẩm
                </button>
            </div>
            <div className="bg-white mt-[88px] dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-orange-300 text-back text-left text-xs font-medium uppercase tracking-wider dark:text-black">
                        <tr>
                            <th className="px-6 py-3">Sản phẩm</th>
                            <th className="px-6 py-3">Loại sản phẩm</th>
                            <th className="px-6 py-3">Biến thể</th>
                            <th className="px-6 py-3">Giá thấp nhất</th>
                            <th className="px-6 py-3">Tổng tồn kho</th>
                            <th className="px-6 py-3">Trạng thái</th>
                            <th className="px-6 py-3">Mô tả</th>
                            <th className="px-6 py-3">Ngày tạo</th>
                            <th className="px-6 py-3">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {[...products].reverse().map((product) => {
                            // Calculate product statistics from variants
                            const totalStock = product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
                            const lowestPrice = product.variants?.length > 0
                                ? Math.min(...product.variants.map(v => v.price))
                                : 0;
                            const thumbnailImage = product.variants?.[0]?.images?.find(img => img.is_thumbnail)?.image
                                || product.variants?.[0]?.images?.[0]?.image;

                            return (
                                <tr key={`product-${product.id}`}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <img
                                                src={thumbnailImage}
                                                alt={product.name}
                                                className="w-10 h-10 rounded-md object-cover mr-3"
                                            />
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {product.name}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500 dark:text-gray-300">
                                            {categories.find(cat => cat.id === product.category_id)?.name || 'Chưa có loại'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500 dark:text-gray-300">
                                            {product.variants?.length || 0} biến thể
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500 dark:text-gray-300">
                                            {Number(lowestPrice).toLocaleString()}₫
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500 dark:text-gray-300">
                                            {totalStock}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${totalStock > 0
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                            }`}>
                                            {totalStock > 0 ? "Còn hàng" : "Hết hàng"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500 dark:text-gray-300">
                                            {product.description}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500 dark:text-gray-300">
                                            {product.created_at
                                                ? format(parseISO(product.created_at), 'dd/MM/yyyy - HH:mm', { locale: vi })
                                                : 'Chưa có ngày tạo'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleEditProduct(product)}
                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProduct(product)}
                                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
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
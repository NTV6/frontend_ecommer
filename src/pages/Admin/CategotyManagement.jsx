import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HiPlus, HiViewGrid, HiViewList, HiPencilAlt, HiTrash, HiOutlineExclamationCircle, HiFolder } from 'react-icons/hi';

import Search from '../../components/Search';
import Pagination from '../../components/Pagination';
import CategoryModal from '../../components/CategoryModal';
import { usePagination } from '../../../hook/usePagination';
import { useDebounceSearch } from '../../../hook/useDebounceSearch';
import { fetchCategories, addCategory, updateCategory, deleteCategory } from '../../store/categorySlice';

function CategoryManagement() {
    const dispatch = useDispatch();
    const { categories, loading } = useSelector((state) => state.categories);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    const {
        searchTerm,
        setSearchTerm,
        filteredItems: filteredCategories,
        activeFilters,
        setActiveFilters
    } = useDebounceSearch(categories, {
        searchFields: ['name'], // Chỉ tìm kiếm theo tên danh mục
        filters: {}
    });

    const {
        currentPage,
        setCurrentPage,
        totalPages,
        paginatedItems: currentCategories,
        totalItems
    } = usePagination(filteredCategories);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleAdd = (formData) => {
        dispatch(addCategory(formData))
            .unwrap()
            .then(() => {
                setIsModalOpen(false);
                dispatch(fetchCategories());
                toast.success('Danh mục đã được thêm thành công!');
            })
            .catch(error => {
                toast.error('Lỗi khi thêm danh mục:', error);
            });
    };

    const handleEdit = (formData) => {
        dispatch(updateCategory({ id: selectedCategory.id, ...formData }))
            .unwrap()
            .then(() => {
                setIsModalOpen(false);
                setSelectedCategory(null);
                dispatch(fetchCategories());
                toast.success('Cập nhật danh mục thành công');
            })
            .catch(error => {
                toast.error('Lỗi khi cập nhật danh mục:', error);
            });
    };

    const handleDelete = (category) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
            try {
                dispatch(deleteCategory(category.id)).unwrap();
                dispatch(fetchCategories());
                toast.success('Danh mục đã được xóa thành công!');
            } catch (error) {
                console.error('Chi tiết lỗi:', error);
                toast.error('Lỗi khi xóa danh mục:', error);
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
            <div className="bg-white dark:bg-gray-900 px-6 py-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                {/* Tiêu đề */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                        <HiFolder className="w-8 h-8 text-blue-600" />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Quản lý danh mục
                        </h2>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md"
                    >
                        <HiPlus className="w-5 h-5 mr-2" />
                        Thêm danh mục
                    </button>
                </div>

                {/* Tìm kiếm, số lượng & chế độ hiển thị */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Search bên trái */}
                    <div className="flex-1">
                        <Search
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder="Tìm kiếm danh mục..."
                            className="w-full sm:max-w-60"
                        />
                    </div>

                    {/* Tổng số danh mục + Toggle bên phải */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            Tổng: <strong>{categories.length}</strong> danh mục
                        </span>

                        <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1 w-fit">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-md transition-colors ${viewMode === 'grid'
                                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                <HiViewGrid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-md transition-colors ${viewMode === 'list'
                                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                <HiViewList className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            {searchTerm && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>Bộ lọc:</span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300">
                        Tìm kiếm: {searchTerm}
                    </span>
                    <button
                        onClick={() => {
                            setSearchTerm('');
                        }}
                        className="text-red-600 hover:text-red-800 ml-2"
                    >
                        Xóa bộ lọc
                    </button>
                </div>
            )}

            {/* Categories Display */}
            {viewMode === 'grid' ? (
                /* Grid View */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {currentCategories.map((category) => (
                        <div
                            key={`category-${category.id}`}
                            className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-200 group"
                        >
                            <div className="relative overflow-hidden">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>

                                {/* Action Buttons Overlay */}
                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => {
                                                setSelectedCategory(category);
                                                setIsModalOpen(true);
                                            }}
                                            className="p-2 bg-white/90 text-blue-600 rounded-lg hover:bg-white transition-colors duration-200 shadow-sm"
                                        >
                                            <HiPencilAlt className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category)}
                                            className="p-2 bg-white/90 text-red-600 rounded-lg hover:bg-white transition-colors duration-200 shadow-sm"
                                        >
                                            <HiTrash className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">{category.name}</h3>
                                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                                    <span>ID: {category.id}</span>
                                    <div className="flex items-center space-x-1">
                                        <span>{format(new Date(category.created_at), 'dd/MM/yyyy - HH:mm')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* List View */
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        Danh mục
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-700">
                                {currentCategories.map((category) => (
                                    <tr key={`category-list-${category.id}`} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <img
                                                    src={category.image}
                                                    alt={category.name}
                                                    className="w-12 h-12 rounded-lg object-cover mr-4 border border-gray-200 dark:border-gray-600"
                                                />
                                                <div>
                                                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                                        {category.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {format(new Date(category.created_at), 'dd/MM/yyyy' + ' ' + 'HH:mm')}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                                #{category.id}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex items-center justify-center space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedCategory(category);
                                                        setIsModalOpen(true);
                                                    }}
                                                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 dark:text-blue-400 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 transition-colors duration-200"
                                                >
                                                    <HiPencilAlt className="w-4 h-4" />
                                                    Sửa
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category)}
                                                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 dark:text-red-400 dark:bg-red-900/20 dark:hover:bg-red-900/30 transition-colors duration-200"
                                                >
                                                    <HiTrash className="w-4 h-4 mr-1" />
                                                    Xóa
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                onPageChange={setCurrentPage}
            />

            {/* Empty State */}
            {currentCategories.length === 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12">
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Không có danh mục</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {searchTerm ? 'Không tìm thấy danh mục nào phù hợp với từ khóa tìm kiếm.' : 'Bắt đầu bằng cách tạo danh mục đầu tiên.'}
                        </p>
                        {!searchTerm && (
                            <div className="mt-6">
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                >
                                    <HiPlus className="w-5 h-5 mr-2" />
                                    Thêm danh mục đầu tiên
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <CategoryModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedCategory(null);
                }}
                category={selectedCategory}
                onSubmit={selectedCategory ? handleEdit : handleAdd}
            />
        </div>
    );
}

export default CategoryManagement;
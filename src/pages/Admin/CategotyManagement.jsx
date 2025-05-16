import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CategoryModal from '../../components/CategoryModal';
import { fetchCategories, addCategory, updateCategory, deleteCategory } from '../../store/categorySlice';

function CategoryManagement() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const dispatch = useDispatch();
    const { categories } = useSelector((state) => state.categories);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleAdd = (formData) => {
        dispatch(addCategory(formData))
            .unwrap()
            .then(() => {
                setIsModalOpen(false);
                dispatch(fetchCategories());
                alert('Thêm danh mục thành công');
            })
            .catch(error => {
                alert('Lỗi khi thêm danh mục: ' + error.message);
            });
    };

    const handleEdit = (formData) => {
        dispatch(updateCategory({ id: selectedCategory.id, ...formData }))
            .unwrap()
            .then(() => {
                setIsModalOpen(false);
                setSelectedCategory(null);
                dispatch(fetchCategories());
                alert('Cập nhật danh mục thành công');
            })
            .catch(error => {
                alert('Lỗi khi cập nhật danh mục: ' + error.message);
            });
    };

    const handleDelete = (category) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
            try {
                dispatch(deleteCategory(category.id)).unwrap();
                dispatch(fetchCategories());
                alert('Xóa danh mục thành công');
            } catch (error) {
                console.error('Chi tiết lỗi:', error);
                alert(`Lỗi khi xóa danh mục: ${error.message}`);
            }
        }
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Quản lý danh mục</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Thêm danh mục
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                    <div
                        key={`category-${category.id}`}
                        className="border rounded p-4"
                    >
                        <img
                            src={category.image}
                            alt={category.name}
                            className="w-full h-80 object-cover mb-2"
                        />
                        <h3 className="font-bold">{category.name}</h3>
                        <div className="mt-2 flex gap-2">
                            <button
                                key={`edit-${category.id}`}
                                onClick={() => {
                                    setSelectedCategory(category);
                                    setIsModalOpen(true);
                                }}
                                className="text-blue-500"
                            >
                                Sửa
                            </button>
                            <button
                                key={`delete-${category.id}`}
                                onClick={() => handleDelete(category)}
                                className="text-red-500"
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                ))}
            </div>

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
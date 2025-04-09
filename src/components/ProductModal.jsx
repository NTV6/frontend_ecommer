import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addProduct, updateProduct, fetchProducts } from '../store/productSlice';
import axios from 'axios';

function ProductModal({ isOpen, onClose, product, mode }) {
    const dispatch = useDispatch();

    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        stock: '',
        image_url: '',
        image_public_id: '', // Thêm trường image_public_id
        description: '',
        category_id: ''
    });

    useEffect(() => {
        if (product && mode === 'edit') {
            setFormData({
                name: product.name || '',
                price: product.price || '',
                stock: product.stock || '',
                image_url: product.image_url || '',
                image_public_id: product.image_public_id || '', // Thêm trường image_public_id
                description: product.description || '',
                category_id: product.category_id || ''
            });
        } else {
            setFormData({
                name: '',
                price: '',
                stock: '',
                image_url: '',
                image_public_id: '', // Thêm trường image_public_id
                description: '',
                category_id: ''
            });
        }
    }, [product, mode, isOpen]);

    // Thêm hàm deleteImage
    const deleteImage = async (publicId) => {
        try {
            if (!publicId) return;
            await axios.delete(import.meta.env.VITE_API_DELETE_IMAGE_CLOUDINARY, {
                data: { public_id: publicId }
            });
        } catch (error) {
            console.error('Error deleting image:', error);
            throw new Error('Lỗi khi xóa ảnh');
        }
    };

    const uploadImage = async (file) => {
        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'ecommer');

            const response = await axios.post(
                import.meta.env.VITE_API_UPLOAD_IMAGE_CLOUDINARY,
                formData
            );

            // Trả về cả secure_url và image_public_id
            return {
                url: response.data.secure_url,
                public_id: response.data.public_id
            };
        } catch (error) {
            console.error('Error uploading image:', error);
            throw new Error('Lỗi khi tải ảnh lên');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        try {
            setIsSubmitting(true); // Bắt đầu submit
            let imageUrl = formData.image_url;
            let publicId = formData.image_public_id;

            if (imageFile) {
                // Nếu đang ở chế độ edit và có ảnh cũ, xóa ảnh cũ trước
                if (mode === 'edit' && product.image_public_id) {
                    await deleteImage(product.image_public_id);
                }

                // Upload ảnh mới
                const uploadResult = await uploadImage(imageFile);
                imageUrl = uploadResult.url;
                publicId = uploadResult.public_id;
            }
            const actionData = {
                ...formData,
                price: Number(formData.price),
                stock: Number(formData.stock),
                image_url: imageUrl,
                image_public_id: publicId
            };
            // console.log('Data being sent:', actionData);

            if (mode === 'add') {
                await dispatch(addProduct(actionData)).unwrap();
                alert('Thêm sản phẩm thành công');
            } else {
                await dispatch(updateProduct({ id: product.id, ...actionData })).unwrap();
                alert('Cập nhật sản phẩm thành công');
            }

            dispatch(fetchProducts());
            onClose();
        } catch (error) {
            alert(error.message || 'Có lỗi xảy ra');
        }
        finally {
            setIsSubmitting(false); // Kết thúc submit
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4 dark:text-white">
                    {mode === 'add' ? 'Thêm sản phẩm mới' : 'Sửa sản phẩm'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium dark:text-white">
                            Tên sản phẩm
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium dark:text-white">
                            Giá
                        </label>
                        <input
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                            required
                            min="0"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium dark:text-white">
                            Số lượng tồn kho
                        </label>
                        <input
                            type="number"
                            value={formData.stock}
                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                            required
                            min="0"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium dark:text-white">
                            Hình ảnh sản phẩm
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                setImageFile(file);
                                // Tạo URL preview
                                const previewUrl = URL.createObjectURL(file);
                                setFormData({ ...formData, image_url: previewUrl });
                            }}
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                        />
                        {formData.image_url && (
                            <img
                                src={formData.image_url}
                                alt="Preview"
                                className="mt-2 w-32 h-32 object-cover rounded"
                            />
                        )}
                        {uploading && <p className="mt-2 text-sm text-gray-500">Đang tải ảnh lên...</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium dark:text-white">
                            Loại sản phẩm
                        </label>
                        <input
                            type="text"
                            value={formData.category_id}
                            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium dark:text-white">
                            Mô tả
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                            rows="3"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || uploading}
                            className={`px-4 py-2 text-white rounded ${isSubmitting || uploading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600'
                                }`}
                        >
                            {isSubmitting || uploading
                                ? 'Đang xử lý...'
                                : mode === 'add'
                                    ? 'Thêm'
                                    : 'Lưu'
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProductModal;
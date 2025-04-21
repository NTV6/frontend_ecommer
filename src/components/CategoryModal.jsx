import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CategoryModal({ isOpen, onClose, category, onSubmit }) {
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: '',
        image_public_id: '' // Thêm trường image_public_id
    });

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name || '',
                description: category.description || '',
                image: category.image || '',
                image_public_id: category.image_public_id || '' // Lấy image_public_id từ category
            });
        } else {
            setFormData({
                name: '',
                description: '',
                image: '',
                image_public_id: '' // Đặt lại khi thêm mới
            });
        }
    }, [category, isOpen]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        try {
            setIsSubmitting(true); // Bắt đầu submit
            let imageUrl = formData.image;
            let publicId = formData.image_public_id;

            if (imageFile) {
                // Nếu đang ở chế độ edit và có ảnh cũ, xóa ảnh cũ trước
                if (category && category.image_public_id) {
                    await deleteImage(category.image_public_id);
                }

                const uploadResult = await uploadImage(imageFile);
                imageUrl = uploadResult.url;
                publicId = uploadResult.public_id;
            }
            const actionData = {
                ...formData,
                image: imageUrl,
                image_public_id: publicId
            };
            await onSubmit(actionData);
            onClose();
        } catch (error) {
            alert(error.message || 'Có lỗi xảy ra');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4 dark:text-white">
                    {!category ? 'Thêm danh mục mới' : 'Sửa danh mục'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium dark:text-white">
                            Tên danh mục
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium dark:text-white">
                            Hình ảnh danh mục
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                setImageFile(file);
                                // Tạo URL preview
                                const previewUrl = URL.createObjectURL(file);
                                setFormData({ ...formData, image: previewUrl });
                            }}
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                        />
                        {formData.image && (
                            <img
                                src={formData.image}
                                alt="Preview"
                                className="mt-2 w-32 h-32 object-cover rounded"
                            />
                        )}
                        {uploading && <p className="mt-2 text-sm text-gray-500">Đang tải ảnh lên...</p>}
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
                                : category
                                    ? 'Lưu'
                                    : 'Thêm'
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CategoryModal;
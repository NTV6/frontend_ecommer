import axios from 'axios';
import { useState, useEffect } from 'react';
import { FaTimes, FaUpload, FaFileImage, FaTag, FaFileAlt } from 'react-icons/fa';

import InputField from './InputField';

function CategoryModal({ isOpen, onClose, category, onSubmit }) {
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: '',
        image_public_id: ''
    });

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name || '',
                description: category.description || '',
                image: category.image || '',
                image_public_id: category.image_public_id || ''
            });
        } else {
            setFormData({
                name: '',
                description: '',
                image: '',
                image_public_id: ''
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

    const handleFileSelect = (file) => {
        if (file && file.type.startsWith('image/')) {
            setImageFile(file);
            const previewUrl = URL.createObjectURL(file);
            setFormData({ ...formData, image: previewUrl });
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        try {
            setIsSubmitting(true);
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-100 animate-in fade-in zoom-in">
                {/* Header với gradient */}
                <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-6 py-4 rounded-t-2xl">
                    <div className="absolute inset-0 bg-black/10 rounded-t-2xl"></div>
                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div>
                                <h2 className="text-2xl font-bold text-white">
                                    {!category ? '✨ Tạo danh mục mới' : 'Chỉnh sửa danh mục'}
                                </h2>
                                <p className="text-white/80 text-sm">
                                    {!category ? 'Thêm danh mục để tổ chức sản phẩm' : 'Cập nhật thông tin danh mục'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
                        >
                            <FaTimes className="w-6 h-6 text-white" />
                        </button>
                    </div>
                </div>

                {/* Form content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Tên danh mục */}
                    <InputField
                        label={
                            <div className="flex items-center gap-2">
                                <FaTag />
                                Tên danh mục
                            </div>
                        }
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Nhập tên danh mục..."
                        required={true}
                    />

                    {/* Mô tả */}
                    <InputField
                        label={
                            <div className="flex items-center gap-2">
                                <FaFileAlt />
                                Mô tả
                            </div>
                        }
                        type="textarea"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Mô tả chi tiết về danh mục..."
                        rows={1}
                    />

                    {/* Upload ảnh */}
                    <div>
                        <label className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                            <FaFileImage />
                            Hình ảnh danh mục
                        </label>

                        {/* Drag & Drop Area */}
                        <div
                            className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-300 ${dragActive
                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                : 'border-gray-300 dark:border-gray-600 hover:border-purple-400'
                                }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileSelect(e.target.files[0])}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />

                            {formData.image ? (
                                <div className="relative group">
                                    <img
                                        src={formData.image}
                                        alt="Preview"
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                                        <p className="text-white font-medium">Nhấp để thay đổi</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                                        <FaUpload className="w-8 h-8 text-white" />
                                    </div>
                                    <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Kéo thả ảnh vào đây
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        hoặc nhấp để chọn file
                                    </p>
                                </div>
                            )}
                        </div>

                        {uploading && (
                            <div className="mt-3 flex items-center gap-2 text-purple-600">
                                <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-sm font-medium">Đang tải ảnh lên...</span>
                            </div>
                        )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02]"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || uploading}
                            className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] ${isSubmitting || uploading
                                ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                                }`}
                        >
                            {isSubmitting || uploading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                                    Đang xử lý...
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2">

                                    {category ? '💾 Cập nhật' : '✨ Tạo mới'}
                                </div>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CategoryModal;
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';

import { uploadService } from '../services/api';
import { addProduct, updateProduct, fetchProducts } from '../store/productSlice';

function ProductModal({ isOpen, onClose, product, mode, categories }) {
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category_id: '',
        variants: [
            {
                color: '',
                size: '',
                price: '',
                stock: '',
                images: []
            }
        ]
    });

    useEffect(() => {
        if (mode === 'edit' && product) {
            setFormData({
                name: product.name || '',
                description: product.description || '',
                category_id: product.category_id || '',
                variants: product.variants?.map(variant => ({
                    id: variant.id,
                    color: variant.color || '',
                    size: variant.size || '',
                    price: variant.price || '',
                    stock: variant.stock || '',
                    images: variant.images?.map(img => ({
                        ...img,
                        variant_id: img.variant_id || variant.id
                    })) || []
                })) || []
            });
        } else {
            setFormData({
                name: '',
                description: '',
                category_id: '',
                variants: [
                    {
                        color: '',
                        size: '',
                        price: '',
                        stock: '',
                        images: []
                    }
                ]
            });
        }
    }, [product, mode]);

    const handleVariantChange = (index, field, value) => {
        const newVariants = [...formData.variants];
        newVariants[index][field] = value;
        setFormData({ ...formData, variants: newVariants });
    };

    const handleAddVariant = () => {
        setFormData({
            ...formData,
            variants: [
                ...formData.variants,
                {
                    color: '',
                    size: '',
                    price: '',
                    stock: '',
                    images: []
                }
            ]
        });
    };

    const handleRemoveVariant = async (index) => {
        try {
            const variant = formData.variants[index];

            // Delete all images of this variant from Cloudinary
            if (variant.images && variant.images.length > 0) {
                for (const img of variant.images) {
                    if (img.image_public_id) {
                        try {
                            await axios.delete(import.meta.env.VITE_API_DELETE_IMAGE_CLOUDINARY, {
                                data: { public_id: img.image_public_id }
                            });
                        } catch (deleteError) {
                            console.error('Error deleting image from Cloudinary:', deleteError);
                            // Continue with other images even if one fails
                        }
                    }
                }
            }

            // Remove variant from formData
            const newVariants = formData.variants.filter((_, i) => i !== index);
            setFormData(prevData => ({
                ...prevData,
                variants: newVariants
            }));

        } catch (error) {
            console.error('Error removing variant:', error);
            alert('Có lỗi khi xóa biến thể: ' + error.message);
        }
    };

    const handleImageUpload = async (variantIndex, e) => {
        const files = Array.from(e.target.files);
        const newVariants = [...formData.variants];

        try {
            const uploadPromises = files.map(async (file) => {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', 'ecommer');

                const response = await axios.post(
                    import.meta.env.VITE_API_UPLOAD_IMAGE_CLOUDINARY,
                    formData
                );

                return {
                    image: response.data.secure_url,
                    image_public_id: response.data.public_id,
                    is_thumbnail: false,
                    variant_id: null // Sẽ được backend tự động cập nhật
                };
            });

            const uploadedImages = await Promise.all(uploadPromises);

            // Set first image as thumbnail
            if (uploadedImages.length > 0) {
                uploadedImages[0].is_thumbnail = 1;
            }

            // Update variant images
            newVariants[variantIndex] = {
                ...newVariants[variantIndex],
                images: [...(newVariants[variantIndex].images || []), ...uploadedImages]
            };

            setFormData(prevData => ({
                ...prevData,
                variants: newVariants
            }));

        } catch (error) {
            console.error('Error uploading images:', error);
            alert('Lỗi khi tải ảnh lên: ' + error.message);
        }
    };

    const handleRemoveImage = async (variantIndex, imgIndex) => {
        try {
            const variant = formData.variants[variantIndex];
            const imageToDelete = variant.images[imgIndex];

            if (imageToDelete.image_public_id) {
                await uploadService.deleteImage(imageToDelete.image_public_id);
            }

            // Cập nhật state để xóa ảnh khỏi UI

            const newVariants = [...formData.variants];
            newVariants[variantIndex].images = variant.images.filter((_, i) => i !== imgIndex);

            // Nếu xóa ảnh thumbnail, set ảnh đầu tiên còn lại làm thumbnail
            if (imageToDelete.is_thumbnail && newVariants[variantIndex].images.length > 0) {
                newVariants[variantIndex].images[0].is_thumbnail = 1;
            }

            setFormData({ ...formData, variants: newVariants });

        } catch (error) {
            console.error('Error removing image:', error);
            alert('Có lỗi khi xóa ảnh: ' + error.message);
        }
    };

    const handleSetThumbnail = (variantIndex, imgIndex) => {
        const newVariants = [...formData.variants];
        const variant = newVariants[variantIndex];

        // Đặt tất cả ảnh của variant này thành non-thumbnail
        variant.images = variant.images.map((img, idx) => ({
            ...img,
            is_thumbnail: idx === imgIndex ? 1 : 0
        }));

        setFormData({ ...formData, variants: newVariants });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Validate form data
            if (!formData.name?.trim() || !formData.category_id || !formData.description?.trim()) {
                throw new Error('Vui lòng điền đầy đủ thông tin sản phẩm');
            }

            // Clean and format data
            const processedData = {
                name: formData.name.trim(),
                description: formData.description.trim(),
                category_id: Number(formData.category_id),
                variants: formData.variants.map(variant => ({
                    ...(variant.id && { id: variant.id }),
                    color: variant.color.trim(),
                    size: variant.size.trim(),
                    price: Number(variant.price) || 0,
                    stock: Number(variant.stock) || 0,
                    images: variant.images.map(img => ({
                        image: String(img.image || ''),
                        image_public_id: String(img.image_public_id || ''),
                        is_thumbnail: Number(Boolean(img.is_thumbnail)),
                        variant_id: img.variant_id || null
                    }))
                }))
            };

            let result;
            if (mode === 'edit' && product?.id) {
                // Cập nhật sản phẩm
                result = await dispatch(updateProduct({
                    id: product.id,
                    ...processedData
                })).unwrap();
                dispatch(fetchProducts());
                alert('Cập nhật sản phẩm thành công!');
            } else {
                // Thêm sản phẩm mới
                result = await dispatch(addProduct(processedData)).unwrap();
                dispatch(fetchProducts());
                alert('Thêm sản phẩm thành công!');
            }

            onClose();
        } catch (error) {
            console.error('Submit error:', error);
            alert(error.message || 'Có lỗi xảy ra khi lưu sản phẩm');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="sticky top-0 bg-white dark:bg-gray-900 px-8 py-6 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl z-10">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {mode === 'add' ? '✨ Thêm sản phẩm mới' : '🔧 Chỉnh sửa sản phẩm'}
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 mt-1">
                                    {mode === 'add' ? 'Tạo sản phẩm mới cho cửa hàng của bạn' : 'Cập nhật thông tin sản phẩm'}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                            >
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        {/* Basic Info Section */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                Thông tin cơ bản
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Tên sản phẩm
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400"
                                        placeholder="Nhập tên sản phẩm..."
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Loại sản phẩm
                                    </label>
                                    <select
                                        value={formData.category_id}
                                        onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white"
                                        required
                                    >
                                        <option value="">Chọn loại sản phẩm</option>
                                        {categories && categories.map(category => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Mô tả sản phẩm
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400"
                                        rows="4"
                                        placeholder="Mô tả chi tiết về sản phẩm..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Variants Section */}
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                                        </svg>
                                    </div>
                                    Biến thể sản phẩm
                                </h3>
                                <button
                                    type="button"
                                    onClick={handleAddVariant}
                                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all flex items-center shadow-lg"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                    Thêm biến thể
                                </button>
                            </div>

                            <div className="space-y-6">
                                {formData.variants.map((variant, index) => (
                                    <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
                                                <span className="w-6 h-6 bg-indigo-500 text-white text-xs rounded-full flex items-center justify-center mr-2">
                                                    {index + 1}
                                                </span>
                                                Biến thể {index + 1}
                                            </h4>
                                            {index > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveVariant(index)}
                                                    className="px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center text-sm"
                                                >
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    Xóa
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Màu sắc
                                                </label>
                                                <input
                                                    type="text"
                                                    value={variant.color}
                                                    onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white"
                                                    placeholder="Đỏ, Xanh..."
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Kích thước
                                                </label>
                                                <input
                                                    type="text"
                                                    value={variant.size}
                                                    onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white"
                                                    placeholder="S, M, L..."
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Giá (VNĐ)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={variant.price}
                                                    onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white"
                                                    placeholder="100000"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Số lượng
                                                </label>
                                                <input
                                                    type="number"
                                                    value={variant.stock}
                                                    onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white"
                                                    placeholder="10"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Images Section */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                                Hình ảnh sản phẩm
                                            </label>

                                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                                                <input
                                                    type="file"
                                                    multiple
                                                    onChange={(e) => handleImageUpload(index, e)}
                                                    className="hidden"
                                                    accept="image/*"
                                                    id={`file-upload-${index}`}
                                                />
                                                <label htmlFor={`file-upload-${index}`} className="cursor-pointer">
                                                    <div className="text-gray-400 mb-2">
                                                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                        </svg>
                                                    </div>
                                                    <p className="text-gray-600 dark:text-gray-400">
                                                        <span className="font-medium text-blue-600">Click để tải ảnh</span> hoặc kéo thả file vào đây
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                                                </label>
                                            </div>

                                            {variant.images.length > 0 && (
                                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-4">
                                                    {variant.images.map((img, imgIndex) => (
                                                        <div key={imgIndex} className="relative group">
                                                            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                                                                <img
                                                                    src={img.image}
                                                                    alt={`Preview ${imgIndex + 1}`}
                                                                    className={`w-full h-full object-cover transition-all group-hover:scale-105 ${img.is_thumbnail ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                                                                        }`}
                                                                />
                                                            </div>

                                                            {/* Image Controls */}
                                                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleSetThumbnail(index, imgIndex)}
                                                                    className={`p-1.5 rounded-full shadow-lg transition-all ${img.is_thumbnail
                                                                        ? 'bg-blue-500 text-white'
                                                                        : 'bg-white text-gray-600 hover:bg-blue-500 hover:text-white'
                                                                        }`}
                                                                    title={img.is_thumbnail ? 'Ảnh đại diện' : 'Đặt làm ảnh đại diện'}
                                                                >
                                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                    </svg>
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveImage(index, imgIndex)}
                                                                    className="p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                                                                    title="Xóa ảnh"
                                                                >
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                                    </svg>
                                                                </button>
                                                            </div>

                                                            {img.is_thumbnail && (
                                                                <div className="absolute bottom-2 left-2">
                                                                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                                                        Ảnh đại diện
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all font-medium shadow-lg"
                            >
                                {mode === 'add' ? '✨ Thêm sản phẩm' : '💾 Cập nhật'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductModal;
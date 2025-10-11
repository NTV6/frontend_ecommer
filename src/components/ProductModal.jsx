import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import {
    FaTimes,
    FaUpload,
    FaInfoCircle,
    FaPlus,
    FaTrash,
    FaBookOpen,
    FaStar,
    FaTag,
    FaLayerGroup,
    FaAlignLeft,
    FaPalette,
    FaRulerCombined,
    FaDollarSign,
    FaBoxes,
    FaImages,
} from 'react-icons/fa';

import Filter from './DropDown';
import InputField from './InputField';
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
                toast.error('Vui lòng điền đầy đủ thông tin sản phẩm');
                return;
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
            toast.error(error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-3xl h-[95vh] overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 sticky top-0 px-6 py-4 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl z-10">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-white">
                                    {mode === 'add' ? '✨ Thêm sản phẩm mới' : '🔧 Chỉnh sửa sản phẩm'}
                                </h2>
                                <p className="text-gray-300 mt-1">
                                    {mode === 'add' ? 'Tạo sản phẩm mới cho cửa hàng của bạn' : 'Cập nhật thông tin sản phẩm'}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
                            >
                                <FaTimes className="w-6 h-6 text-white" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 overflow-y-auto flex-1">
                        {/* Basic Info Section */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                                    <FaInfoCircle className="w-5 h-5 text-white" />
                                </div>
                                Thông tin cơ bản
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField
                                    label={<div className="flex items-center gap-2"><FaTag /> Tên sản phẩm</div>}
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Nhập tên sản phẩm..."
                                    required={true}
                                />

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                        <FaLayerGroup /> Loại sản phẩm
                                    </label>
                                    <Filter
                                        value={formData.category_id || ''}
                                        onChange={(value) => setFormData({ ...formData, category_id: value })}
                                        options={categories.map(category => ({
                                            value: category.id,
                                            label: category.name
                                        }))}
                                        defaultLabel="Chọn loại sản phẩm"
                                    />
                                </div>

                                <InputField
                                    label={<div className="flex items-center gap-2"><FaAlignLeft /> Mô tả sản phẩm</div>}
                                    type="textarea"
                                    name="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Mô tả chi tiết về sản phẩm..."
                                    rows={8}
                                />
                            </div>
                        </div>

                        {/* Variants Section */}
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                                        <FaBookOpen className="w-5 h-5 text-white" />
                                    </div>
                                    Biến thể sản phẩm
                                </h3>
                                <button
                                    type="button"
                                    onClick={handleAddVariant}
                                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all flex items-center shadow-lg"
                                >
                                    <FaPlus className="w-5 h-5 mr-2" />
                                    Thêm biến thể
                                </button>
                            </div>

                            <div className="space-y-6">
                                {formData.variants.map((variant, index) => (
                                    <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-4 pb-8 border border-gray-200 dark:border-gray-700 shadow-sm">
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
                                                    <FaTrash className="w-5 h-5 mr-1" />
                                                    Xóa
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                            <InputField
                                                label={<div className="flex items-center gap-2"><FaPalette /> Màu sắc</div>}
                                                type="text"
                                                value={variant.color}
                                                onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                                                placeholder="Đỏ, Xanh..."
                                                required={true}
                                            />

                                            <InputField
                                                label={<div className="flex items-center gap-2"><FaRulerCombined /> Kích thước</div>}
                                                type="text"
                                                value={variant.size}
                                                onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                                                placeholder="S, M, L..."
                                                required={true}
                                            />

                                            <InputField
                                                label={<div className="flex items-center gap-2"><FaDollarSign /> Giá (VNĐ)</div>}
                                                type="number"
                                                value={variant.price}
                                                onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                                                placeholder="100000"
                                                required={true}
                                            />

                                            <InputField
                                                label={<div className="flex items-center gap-2"><FaBoxes /> Số lượng</div>}
                                                type="number"
                                                value={variant.stock}
                                                onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                                                placeholder="10"
                                                required={true}
                                            />
                                        </div>

                                        {/* Images Section */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                                                <FaImages /> Hình ảnh sản phẩm
                                            </label>

                                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-4">
                                                {variant.images.map((img, imgIndex) => (
                                                    <div key={imgIndex} className="relative group">
                                                        <div className="rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                                                            <img
                                                                src={img.image}
                                                                alt={`Preview ${imgIndex + 1}`}
                                                                className={`w-full object-cover transition-all group-hover:scale-105 ${img.is_thumbnail ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
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
                                                                <FaStar className="w-5 h-5" />
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveImage(index, imgIndex)}
                                                                className="p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                                                                title="Xóa ảnh"
                                                            >
                                                                <FaTrash className="w-5 h-5" />
                                                            </button>
                                                        </div>

                                                        {img.is_thumbnail ? (
                                                            <div className="absolute -bottom-1 left-1">
                                                                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                                                    Ảnh đại diện
                                                                </span>
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                ))}

                                                <div className="border-2 w-full h-full border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-3 text-center hover:border-blue-400 transition-colors">
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
                                                            <FaUpload className="w-12 h-12 mx-auto" />
                                                        </div>
                                                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-4 pt-4">
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
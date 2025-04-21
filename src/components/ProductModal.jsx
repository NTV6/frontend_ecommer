import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';

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
            // Đảm bảo có đủ dữ liệu khi edit
            setFormData({
                name: product.name || '',
                description: product.description || '',
                category_id: product.category_id || '',
                variants: product.variants?.map(variant => ({
                    id: variant.id, // Quan trọng: giữ lại id của variant
                    color: variant.color || '',
                    size: variant.size || '',
                    price: variant.price || '',
                    stock: variant.stock || '',
                    images: variant.images?.map(img => ({
                        ...img,
                        variant_id: img.variant_id || variant.id // Giữ liên kết với variant
                    })) || []
                })) || []
            });
        } else {
            // Reset form khi thêm mới
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
        // Lấy files từ event
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
                uploadedImages[0].is_thumbnail = 1; // Đổi thành 1 thay vì true để phù hợp với MySQL
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

            // Nếu ảnh đã được upload lên Cloudinary, xóa nó
            if (imageToDelete.image_public_id) {
                await axios.delete(import.meta.env.VITE_API_DELETE_IMAGE_CLOUDINARY, {
                    data: { public_id: imageToDelete.image_public_id }
                });
            }

            // Cập nhật state để xóa ảnh khỏi UI
            const newVariants = [...formData.variants];
            newVariants[variantIndex].images = variant.images.filter((_, i) => i !== imgIndex);
            setFormData({ ...formData, variants: newVariants });

        } catch (error) {
            console.error('Error removing image:', error);
            alert('Có lỗi khi xóa ảnh');
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
                    ...(variant.id && { id: variant.id }), // Chỉ thêm id nếu có
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

            // console.log('Mode:', mode);
            // console.log('Submitting data:', JSON.stringify(processedData, null, 2));

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

    return (
        <div className={`fixed inset-0 ${isOpen ? 'block' : 'hidden'}`}>
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl">
                        <form onSubmit={handleSubmit} className="p-6">
                            <h2 className="text-xl font-semibold mb-4">
                                {mode === 'add' ? 'Thêm sản phẩm mới' : 'Chỉnh sửa sản phẩm'}
                            </h2>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Tên sản phẩm</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Loại sản phẩm</label>
                                    <select
                                        value={formData.category_id}
                                        onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                        required
                                    >
                                        <option value="">Chọn loại sản phẩm</option>
                                        {categories.map(category => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Mô tả</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                        rows="3"
                                    />

                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-medium">Biến thể sản phẩm</h3>
                                    <button
                                        type="button"
                                        onClick={handleAddVariant}
                                        className="text-blue-500 hover:text-blue-600"
                                    >
                                        + Thêm biến thể
                                    </button>
                                </div>

                                {formData.variants.map((variant, index) => (
                                    <div key={index} className="border p-4 rounded space-y-4">
                                        <div className="flex justify-between">
                                            <h4 className="font-medium">Biến thể {index + 1}</h4>
                                            {index > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleRemoveVariant(index)
                                                    }
                                                    className="text-red-500 hover:text-red-600"
                                                >
                                                    Xóa
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Màu sắc</label>
                                                <input
                                                    type="text"
                                                    value={variant.color}
                                                    onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                                                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-1">Kích thước</label>
                                                <input
                                                    type="text"
                                                    value={variant.size}
                                                    onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                                                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-1">Giá</label>
                                                <input
                                                    type="number"
                                                    value={variant.price}
                                                    onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                                                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-1">Số lượng</label>
                                                <input
                                                    type="number"
                                                    value={variant.stock}
                                                    onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                                                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1">Hình ảnh</label>
                                            <input
                                                type="file"
                                                multiple
                                                onChange={(e) => handleImageUpload(index, e)}
                                                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                                accept="image/*"
                                            />
                                            {variant.images.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {variant.images.map((img, imgIndex) => (
                                                        <div key={imgIndex} className="relative group">
                                                            <img
                                                                src={img.image}
                                                                alt={`Preview ${imgIndex + 1}`}
                                                                className={`w-20 h-20 object-cover rounded ${img.is_thumbnail ? 'ring-2 ring-blue-500' : ''}`}
                                                            />
                                                            <div className="absolute top-0 right-0 flex gap-1">
                                                                {/* Nút xóa */}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveImage(index, imgIndex)}
                                                                    className="bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="h-4 w-4"
                                                                        viewBox="0 0 20 20"
                                                                        fill="currentColor"
                                                                    >
                                                                        <path
                                                                            fillRule="evenodd"
                                                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                                            clipRule="evenodd"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                                {/* Nút set thumbnail */}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleSetThumbnail(index, imgIndex)}
                                                                    className={`p-1 rounded-full transition-opacity opacity-0 group-hover:opacity-100
                                                                            ${img.is_thumbnail
                                                                            ? 'bg-blue-500 text-white'
                                                                            : 'bg-gray-200 hover:bg-blue-500 hover:text-white'}`}
                                                                    title={img.is_thumbnail ? 'Ảnh đại diện' : 'Đặt làm ảnh đại diện'}
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="h-4 w-4"
                                                                        viewBox="0 0 20 20"
                                                                        fill="currentColor"
                                                                    >
                                                                        <path
                                                                            d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:text-black"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    {mode === 'add' ? 'Thêm sản phẩm' : 'Cập nhật'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductModal;
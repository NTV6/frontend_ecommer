import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaPen, FaTimes, FaSave } from 'react-icons/fa';

import InputField from '../components/InputField';
import ImagePreview from '../components/ImagePreview';
import { getInitials, validatePhoneNumber } from '../utils';
import { authService, uploadService } from '../services/api';
import { setProfile, updateProfile } from '../store/userSlice';

const Profile = () => {
    const dispatch = useDispatch();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [currentPublicId, setCurrentPublicId] = useState(null);
    const { user } = useSelector((state) => state.auth);
    const { data: users } = useSelector((state) => state.users);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        phone_number: '',
        address: '',
        date_of_birth: ''
    });

    useEffect(() => {
        if (users) {
            setFormData({
                full_name: users.full_name || '',
                phone_number: users.phone_number || '',
                address: users.address || '',
                date_of_birth: users.date_of_birth ? users.date_of_birth.split('T')[0] : ''
            });
        }
    }, [users]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Xác thực số điện thoại
            if (formData.phone_number) {
                const { isValid, message } = validatePhoneNumber(formData.phone_number);
                if (!isValid) {
                    toast.error(message);
                    return;
                }
            }
            // Xử lý ngày tháng trước khi gửi
            const dataToSend = {
                ...formData,
                date_of_birth: formData.date_of_birth || null
            };

            const response = await authService.updateInfoProfile(dataToSend);

            if (response.data.status === 'success') {
                dispatch(updateProfile(response.data.data.user));
                setIsEditing(false);
                toast.success('Cập nhật thông tin thành công');
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            toast.error(err.response?.data?.message || 'Lỗi khi cập nhật thông tin');
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await authService.getProfile();
                if (response.data?.data) {
                    dispatch(setProfile(response.data.data));
                    if (response.data.data.profile_picture) {
                        const urlParts = response.data.data.profile_picture.split('/');
                        const fileName = urlParts[urlParts.length - 1];
                        const publicId = `profiles/${fileName.split('.')[0]}`;
                        setCurrentPublicId(publicId);
                    }
                }
            } catch (err) {
                setError(err.message);
                toast.error('Không thể tải thông tin người dùng');
            } finally {
                setLoading(false);
            }
        };

        if (user?.uid) {
            fetchProfile();
        }
    }, [user, dispatch]);

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Xác thực loại tệp
        if (!file.type.startsWith('image/')) {
            toast.error('Vui lòng chọn file hình ảnh');
            return;
        }

        // Xác thực kích thước tệp (tối đa 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Kích thước ảnh phải nhỏ hơn 5MB');
            return;
        }

        try {
            setUploading(true);

            if (currentPublicId) {
                await uploadService.deleteImage(currentPublicId);
            }

            const formData = new FormData();
            formData.append('image', file);

            const uploadResponse = await uploadService.uploadImage(formData);
            const imageUrl = uploadResponse.data.data.url;
            const newPublicId = uploadResponse.data.data.public_id;

            await authService.updateImageProfile({
                profile_picture: imageUrl
            });

            // Cập nhật cả trạng thái cục bộ và cửa hàng Redux
            setProfile(prev => ({
                ...prev,
                profile_picture: imageUrl
            }));
            dispatch(updateProfile({ profile_picture: imageUrl }));

            setCurrentPublicId(newPublicId);
            toast.success('Cập nhật ảnh đại diện thành công');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Lỗi khi cập nhật ảnh đại diện');
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 mt-[74px]">
            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Thông tin cá nhân
                        </h2>
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-md"
                                title="Chỉnh sửa"
                            >
                                <FaPen size={14} />
                            </button>
                        ) : (
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors shadow-sm"
                                >
                                    <FaTimes />
                                    <span>Hủy</span>
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors shadow-sm"
                                >
                                    <FaSave />
                                    <span>Lưu</span>
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        {/* Avatar */}
                        <div className="flex flex-col items-center">
                            <div className="relative w-32 h-32 group">
                                <div
                                    className="w-32 h-32 rounded-full overflow-hidden cursor-pointer"
                                    onClick={() => users?.profile_picture && setShowPreview(true)}
                                >
                                    {users?.profile_picture ? (
                                        <img
                                            src={users.profile_picture}
                                            alt="Profile"
                                            className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-900 dark:bg-gray-600 text-white flex items-center justify-center">
                                            <span className="text-8xl font-semibold transform -translate-y-1">
                                                {getInitials(user.email)}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity">
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                    />
                                    <span className="text-white text-sm">
                                        {uploading ? 'Đang tải...' : 'Thay đổi ảnh'}
                                    </span>
                                </label>
                            </div>
                            {users?.profile_picture && (
                                <button
                                    onClick={() => setShowPreview(true)}
                                    className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                    Xem ảnh đại diện
                                </button>
                            )}
                        </div>

                        {/* Thông tin chi tiết */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField
                                label="Họ và tên"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleInputChange}
                                isEditing={isEditing}
                            />

                            <InputField
                                label="Email"
                                value={users?.email}
                                isEditing={false}
                            />

                            <InputField
                                label="Số điện thoại"
                                type="tel"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleInputChange}
                                isEditing={isEditing}
                            />

                            <InputField
                                label="Ngày sinh"
                                type="date"
                                name="date_of_birth"
                                value={formData.date_of_birth}
                                onChange={handleInputChange}
                                isEditing={isEditing}
                            />

                            <InputField
                                label="Địa chỉ"
                                type="textarea"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                isEditing={isEditing}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Xem trước hình ảnh Modal */}
            {showPreview && users?.profile_picture && (
                <ImagePreview
                    imageUrl={users.profile_picture}
                    onClose={() => setShowPreview(false)}
                />
            )}
        </div>
    );
};

export default Profile;
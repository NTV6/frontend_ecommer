import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import ImagePreview from '../components/ImagePreview';
import { getInitials, formatDate } from '../utils';
import { authService, uploadService } from '../services/api';
import { setProfile, updateProfile } from '../store/profileSlice';

const Profile = () => {
    const dispatch = useDispatch();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [currentPublicId, setCurrentPublicId] = useState(null);
    const { user } = useSelector((state) => state.auth);
    const { data: profile } = useSelector((state) => state.profile);

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

            await authService.updateProfile({
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
                    <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                        Thông tin cá nhân
                    </h2>

                    <div className="space-y-6">
                        {/* Avatar */}
                        <div className="flex flex-col items-center">
                            <div className="relative w-32 h-32 group">
                                <div
                                    className="w-32 h-32 rounded-full overflow-hidden cursor-pointer"
                                    onClick={() => profile?.profile_picture && setShowPreview(true)}
                                >
                                    {profile?.profile_picture ? (
                                        <img
                                            src={profile.profile_picture}
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
                            {profile?.profile_picture && (
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
                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Họ và tên
                                </label>
                                <div className="mt-1 text-gray-900 dark:text-white">
                                    {profile?.full_name}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Email
                                </label>
                                <div className="mt-1 text-gray-900 dark:text-white">
                                    {profile?.email}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Số điện thoại
                                </label>
                                <div className="mt-1 text-gray-900 dark:text-white">
                                    {profile?.phone_number || 'Chưa cập nhật'}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Ngày sinh
                                </label>
                                <div className="mt-1 text-gray-900 dark:text-white">
                                    {formatDate(profile?.date_of_birth)}
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Địa chỉ
                                </label>
                                <div className="mt-1 text-gray-900 dark:text-white">
                                    {profile?.address || 'Chưa cập nhật'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Xem trước hình ảnh Modal */}
            {showPreview && profile?.profile_picture && (
                <ImagePreview
                    imageUrl={profile.profile_picture}
                    onClose={() => setShowPreview(false)}
                />
            )}
        </div>
    );
};

export default Profile;
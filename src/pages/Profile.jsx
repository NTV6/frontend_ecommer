import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User, Edit3, Save, X, Camera, Mail, Phone, Calendar, MapPin, Eye } from 'lucide-react';

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
    const { users } = useSelector((state) => state.users);
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
            <div className="min-h-screen flex items-center justify-center pt-[65px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-[65px]">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-4 pt-[65px] pb-8">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="text-center m-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4 shadow-lg">
                            <User className="w-8 h-8 text-blue-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Hồ sơ cá nhân
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Quản lý thông tin cá nhân của bạn
                        </p>
                    </div>

                    {/* Profile Card */}
                    <div className="dark:bg-gray-900 bg-gray-50 rounded-lg shadow-xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
                        <div className="px-8 py-12">
                            {/* Avatar Section */}
                            <div className="realative flex flex-col items-center mb-12">
                                <div className="relative group">
                                    <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-2xl ring-4 ring-white dark:ring-gray-700">
                                        {users?.profile_picture ? (
                                            <img
                                                src={users.profile_picture}
                                                alt="Profile"
                                                className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform duration-300"
                                                onClick={() => setShowPreview(true)}
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center">
                                                <span className="text-6xl font-bold">
                                                    {getInitials(users?.email)}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Upload Overlay */}
                                    <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-all duration-300">
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            disabled={uploading}
                                        />
                                        <div className="text-center text-white">
                                            {uploading ? (
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto mb-1"></div>
                                            ) : (
                                                <Camera className="w-6 h-6 mx-auto mb-1" />
                                            )}
                                            <span className="text-xs font-medium">
                                                {uploading ? 'Đang tải...' : 'Thay đổi'}
                                            </span>
                                        </div>
                                    </label>
                                </div>

                                <div className="absolute top-3 right-3">
                                    {!isEditing ? (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-white transition-all duration-200"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                            <span className="hidden sm:inline text-sm">Sửa</span>
                                        </button>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all duration-200"
                                            >
                                                <X className="w-4 h-4" />
                                                <span className="hidden sm:inline">Hủy</span>
                                            </button>
                                            <button
                                                onClick={handleSubmit}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all duration-200 shadow-lg"
                                            >
                                                <Save className="w-4 h-4" />
                                                <span className="hidden sm:inline">Lưu</span>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {users?.profile_picture && (
                                    <button
                                        onClick={() => setShowPreview(true)}
                                        className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                                    >
                                        <Eye className="w-4 h-4" />
                                        Xem ảnh đại diện
                                    </button>
                                )}
                            </div>

                            {/* Information Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <InputField
                                    label="Họ và tên"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleInputChange}
                                    isEditing={isEditing}
                                    icon={User}
                                />

                                <InputField
                                    label="Email"
                                    value={users?.email}
                                    isEditing={false}
                                    icon={Mail}
                                />

                                <InputField
                                    label="Số điện thoại"
                                    type="tel"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleInputChange}
                                    isEditing={isEditing}
                                    icon={Phone}
                                />

                                <InputField
                                    label="Ngày sinh"
                                    type="date"
                                    name="date_of_birth"
                                    value={formData.date_of_birth}
                                    onChange={handleInputChange}
                                    isEditing={isEditing}
                                    icon={Calendar}
                                />

                                <InputField
                                    label="Địa chỉ"
                                    type="textarea"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    isEditing={isEditing}
                                    icon={MapPin}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Image Preview Modal */}
                {showPreview && users?.profile_picture && (
                    <ImagePreview
                        imageUrl={users.profile_picture}
                        onClose={() => setShowPreview(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default Profile;
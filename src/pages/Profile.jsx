import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { authService } from '../services/api';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await authService.getProfile();
                setProfile(response.data.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Có lỗi xảy ra');
                setLoading(false);
            }
        };

        if (user) {
            fetchProfile();
        }
    }, [user]);

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
                        <div className="flex justify-center">
                            <div className="w-32 h-32 rounded-full overflow-hidden">
                                <img
                                    src={profile?.profile_picture || '/default-avatar.png'}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
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
                                    {profile?.date_of_birth || 'Chưa cập nhật'}
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
        </div>
    );
};

export default Profile;
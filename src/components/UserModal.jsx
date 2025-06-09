import { useState } from 'react';
import { format } from 'date-fns';
import { useDispatch } from 'react-redux';
import { MdEmail } from 'react-icons/md';
import { FaUser, FaPhoneAlt, FaMapMarkerAlt, FaRegCalendarAlt, FaRegClock, FaShieldAlt, FaTimes } from 'react-icons/fa';

import { updateUserRole } from '../store/userSlice';

function UserModal({ user, onClose }) {
    const dispatch = useDispatch();
    const [selectedRole, setSelectedRole] = useState(user.role);

    const handleRoleChange = async (newRole) => {
        if (newRole === user.role) return;

        try {
            await dispatch(updateUserRole({ userId: user.id, role: newRole })).unwrap();
            setSelectedRole(newRole);
        } catch (error) {
            console.error('Failed to update role:', error);
            setSelectedRole(user.role); // Reset về role cũ nếu có lỗi
        }
    };

    const getRoleBadgeColor = (role) => {
        return role === 'admin'
            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-screen overflow-y-auto border border-gray-200 dark:border-gray-700">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                <FaUser className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white">
                                    {user.full_name}
                                </h3>
                                <div className="flex items-center space-x-2 mt-1">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(selectedRole)}`}>
                                        {selectedRole === 'admin' ? 'Admin' : 'User'}
                                    </span>
                                </div>
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

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Personal Information */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                            <FaUser className="w-5 h-5 mr-2 text-blue-500" />
                            Thông tin cá nhân
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                    <MdEmail className="w-4 h-4 mr-2" />
                                    Email
                                </div>
                                <p className="font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                    {user.email}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                    <FaPhoneAlt className="w-4 h-4 mr-2" />
                                    Số điện thoại
                                </div>
                                <p className="font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                    {user.phone_number || 'Chưa cập nhật'}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                    <FaRegCalendarAlt className="w-4 h-4 mr-2" />
                                    Ngày sinh
                                </div>
                                <p className="font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                    {user.date_of_birth
                                        ? format(new Date(user.date_of_birth), 'dd/MM/yyyy')
                                        : 'Chưa cập nhật'}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                    <FaRegClock className="w-4 h-4 mr-2" />
                                    Ngày tạo tài khoản
                                </div>
                                <p className="font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                    {format(new Date(user.created_at), 'dd/MM/yyyy HH:mm')}
                                </p>
                            </div>
                            <div className="space-y-1 md:col-span-2">
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                    <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                                    Địa chỉ
                                </div>
                                <p className="font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                    {user.address || 'Chưa cập nhật'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Role Management */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                            <FaShieldAlt className="w-5 h-5 mr-2 text-purple-500" />
                            Quản lý vai trò
                        </h4>
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Vai trò hiện tại
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedRole}
                                    onChange={(e) => {
                                        setSelectedRole(e.target.value);
                                        handleRoleChange(e.target.value);
                                    }}
                                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                Thay đổi vai trò sẽ được áp dụng ngay lập tức
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserModal;
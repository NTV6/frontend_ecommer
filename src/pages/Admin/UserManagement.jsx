import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlineEye, HiTrash, HiUsers } from 'react-icons/hi';

import Search from '../../components/Search';
import Filter from '../../components/Filter';
import UserModal from '../../components/UserModal';
import Pagination from '../../components/Pagination';
import { fetchUsers, deleteUser } from '../../store/userSlice';

function UserManagement() {
    const dispatch = useDispatch();
    const { users, loading } = useSelector(state => state.users);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(9);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [filterRole, setFilterRole] = useState('all');

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    // Tìm kiếm và lọc người dùng
    const filteredUsers = users.filter(user => {
        const searchString = searchTerm.toLowerCase();
        const matchesSearch =
            user.full_name?.toLowerCase().includes(searchString) ||
            user.email?.toLowerCase().includes(searchString) ||
            user.phone_number?.includes(searchString);

        const matchesRole = filterRole === 'all' || user.role === filterRole;

        return matchesSearch && matchesRole;
    });

    // Phân trang
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const roleOptions = [
        { value: 'user', label: '👤 Người dùng' },
        { value: 'admin', label: '👑 Admin' }
    ];

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await dispatch(deleteUser(userToDelete.id)).unwrap();
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };

    const getRoleBadge = (role) => {
        if (role === 'admin') {
            return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
        }
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    };

    const DeleteConfirmationModal = ({ onConfirm, onCancel }) => (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-700">
                <div className="p-6">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 dark:bg-red-900 rounded-full mb-4">
                        <HiTrash className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-xl font-bold text-center mb-2 dark:text-white">
                        Xác nhận xóa người dùng
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                        Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác.
                    </p>
                    <div className="flex space-x-3">
                        <button
                            onClick={onCancel}
                            className="flex-1 px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                'Xóa'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="p-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                            <HiUsers className="w-8 h-8 mr-3 text-blue-600" />
                            Quản lý người dùng
                        </h2>
                    </div>
                    {/* Search and Filter */}
                    <div className="flex items-center space-x-3">
                        <Search
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder="Tìm kiếm người dùng..."
                        />
                        <Filter
                            value={filterRole}
                            onChange={setFilterRole}
                            options={roleOptions}
                            defaultLabel="🔍 Tất cả vai trò"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Người dùng
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Liên hệ
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Vai trò
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Ngày tạo
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {currentUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {user.profile_picture ? (
                                                    <img
                                                        className="h-10 w-10 rounded-full"
                                                        src={user.profile_picture}
                                                        alt=""
                                                    />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                                        <span className="text-gray-500 dark:text-gray-400 text-lg">
                                                            {user.full_name?.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {user.full_name}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        ID: {user.id}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 dark:text-white">
                                                {user.email}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {user.phone_number || 'Chưa cập nhật'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadge(user.role)}`}>
                                                {user.role === 'admin' ? 'Admin' : 'User'}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            <div className="font-medium">
                                                {format(new Date(user.created_at), 'dd/MM/yyyy')}
                                            </div>
                                            <div>
                                                {format(new Date(user.created_at), 'HH:mm')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex items-center justify-center space-x-3">
                                                <button
                                                    onClick={() => setSelectedUser(user)}
                                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 dark:text-blue-400 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 transition-colors duration-200"
                                                >
                                                    <HiOutlineEye className="w-4 h-4 mr-1" />
                                                    Chi tiết
                                                </button>
                                                {user.role !== 'admin' && (
                                                    <button
                                                        onClick={() => handleDeleteClick(user)}
                                                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 dark:text-red-400 dark:bg-red-900/20 dark:hover:bg-red-900/30 transition-colors duration-200"
                                                    >
                                                        <HiTrash className="w-4 h-4 mr-1" />
                                                        Xóa
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(filteredUsers.length / usersPerPage)}
                        totalItems={filteredUsers.length}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>

            {/* Modals */}
            {selectedUser && (
                <UserModal
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                />
            )}

            {showDeleteModal && (
                <DeleteConfirmationModal
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setShowDeleteModal(false)}
                />
            )}
        </div>
    );
}

export default UserManagement;
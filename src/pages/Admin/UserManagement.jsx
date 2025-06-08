import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { HiOutlineSearch, HiOutlineTrash, HiOutlineEye } from 'react-icons/hi';
import { fetchUsers, deleteUser } from '../../store/userSlice';

function UserManagement() {
    const dispatch = useDispatch();
    const { users, loading } = useSelector(state => state.users);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    // Tìm kiếm người dùng
    const filteredUsers = users.filter(user => {
        const searchString = searchTerm.toLowerCase();
        return (
            user.full_name?.toLowerCase().includes(searchString) ||
            user.email?.toLowerCase().includes(searchString) ||
            user.phone_number?.includes(searchString)
        );
    });

    // Phân trang
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

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

    const UserDetailsModal = ({ user, onClose }) => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold dark:text-white">
                        Thông tin người dùng
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <span className="text-2xl">&times;</span>
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-500">Họ tên:</p>
                        <p className="font-medium">{user.full_name}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Email:</p>
                        <p className="font-medium">{user.email}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Số điện thoại:</p>
                        <p className="font-medium">{user.phone_number || 'Chưa cập nhật'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Địa chỉ:</p>
                        <p className="font-medium">{user.address || 'Chưa cập nhật'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Ngày sinh:</p>
                        <p className="font-medium">
                            {user.date_of_birth
                                ? format(new Date(user.date_of_birth), 'dd/MM/yyyy')
                                : 'Chưa cập nhật'
                            }
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Vai trò:</p>
                        <p className="font-medium">{user.role}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Ngày tạo:</p>
                        <p className="font-medium">
                            {format(new Date(user.created_at), 'dd/MM/yyyy HH:mm')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    const DeleteConfirmationModal = ({ onConfirm, onCancel }) => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
                <h3 className="text-xl font-bold mb-4 dark:text-white">
                    Xác nhận xóa người dùng
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác.
                </p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        Xóa
                    </button>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return <div className="p-6">Đang tải...</div>;
    }

    return (
        <div className="p-6">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Quản lý người dùng
                    </h2>
                    <div className="relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Tìm kiếm người dùng..."
                            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <HiOutlineSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Người dùng
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Số điện thoại
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Vai trò
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Ngày tạo
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {currentUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
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
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {user.phone_number || 'Chưa cập nhật'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin'
                                                ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                                : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {format(new Date(user.created_at), 'dd/MM/yyyy')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex items-center justify-center space-x-2">
                                                <button
                                                    onClick={() => setSelectedUser(user)}
                                                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                >
                                                    <HiOutlineEye className="h-5 w-5" />
                                                </button>
                                                {user.role !== 'admin' && (
                                                    <button
                                                        onClick={() => handleDeleteClick(user)}
                                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                    >
                                                        <HiOutlineTrash className="h-5 w-5" />
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
                    <div className="bg-white dark:bg-gray-800 px-6 py-4 border-t border:gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                Hiển thị {indexOfFirstUser + 1} đến {Math.min(indexOfLastUser, filteredUsers.length)} trong số {filteredUsers.length} người dùng
                            </div>
                            <div className="flex space-x-2">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`px-3 py-1 rounded-md ${currentPage === page
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {selectedUser && (
                <UserDetailsModal
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
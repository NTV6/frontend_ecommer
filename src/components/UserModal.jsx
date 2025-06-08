import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { format } from 'date-fns';
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

    return (
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
                                : 'Chưa cập nhật'}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Ngày tạo:</p>
                        <p className="font-medium">
                            {format(new Date(user.created_at), 'dd/MM/yyyy HH:mm')}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Vai trò:</p>
                        <select
                            value={selectedRole}
                            onChange={(e) => {
                                setSelectedRole(e.target.value);
                                handleRoleChange(e.target.value);
                            }}
                            className="mt-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserModal;

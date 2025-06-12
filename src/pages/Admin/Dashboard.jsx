import { useSelector } from 'react-redux';
import {
    Package,
    ShoppingCart,
    Folder,
    Users,
} from 'lucide-react';

function Dashboard() {
    const { products } = useSelector((state) => state.products);
    const { categories } = useSelector((state) => state.categories);
    const { orders } = useSelector((state) => state.orders);
    const { users } = useSelector((state) => state.users);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <Package className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Tổng sản phẩm</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{products.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                            <ShoppingCart className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Tổngđơn hàng</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{orders.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                            <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Tổng Người dùng</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{users.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                        <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                            <Folder className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Tổng Danh mục</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{categories.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Doanh thu theo tháng</h3>
                    <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500 dark:text-gray-400">Biểu đồ doanh thu</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Đơn hàng gần đây</h3>
                    <div className="space-y-3">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">Đơn hàng #00{item}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Nguyễn Văn A</p>
                                </div>
                                <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs font-medium">
                                    Đã xác nhận
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;
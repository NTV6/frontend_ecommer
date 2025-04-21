import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaBox, FaShoppingBag, FaUsers, FaChartBar, FaFolder } from 'react-icons/fa';

import ThemeToggle from '../../components/ThemeToggle';
import ProductManagement from './ProductManagement';
import CategoryManagement from './CategotyManagement';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { clearUser } from '../../store/authSlice';
import { fetchProducts } from '../../store/productSlice';
import { fetchCategories } from '../../store/categorySlice';

function Dashboard() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchCategories());
    }, [dispatch]);

    const { products } = useSelector((state) => state.products);
    const { categories } = useSelector((state) => state.categories);
    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">Tổng quan</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 dark:text-gray-400">Tổng đơn hàng</p>
                            <h3 className="text-2xl font-bold dark:text-white">150</h3>
                        </div>
                        <FaShoppingBag className="text-3xl text-blue-500" />
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 dark:text-gray-400">Danh mục</p>
                            <h3 className="text-2xl font-bold dark:text-white">{categories.length}</h3>
                        </div>
                        <FaFolder className="text-3xl text-green-500" />
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 dark:text-gray-400">Sản phẩm</p>
                            <h3 className="text-2xl font-bold dark:text-white">{products.length}</h3>
                        </div>
                        <FaBox className="text-3xl text-green-500" />
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 dark:text-gray-400">Khách hàng</p>
                            <h3 className="text-2xl font-bold dark:text-white">1,234</h3>
                        </div>
                        <FaUsers className="text-3xl text-purple-500" />
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 dark:text-gray-400">Doanh thu</p>
                            <h3 className="text-2xl font-bold dark:text-white">45.5M</h3>
                        </div>
                        <FaChartBar className="text-3xl text-red-500" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function Orders() {
    const orders = [
        {
            id: "ORD001",
            customer: "Nguyễn Văn A",
            date: "2024-03-20",
            total: 1298000,
            status: "Đã giao"
        },
        {
            id: "ORD002",
            customer: "Trần Thị B",
            date: "2024-03-19",
            total: 799000,
            status: "Đang xử lý"
        },
    ];

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">Quản lý đơn hàng</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Mã đơn hàng
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Khách hàng
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Ngày đặt
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Tổng tiền
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Trạng thái
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{order.id}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500 dark:text-gray-300">{order.customer}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500 dark:text-gray-300">{order.date}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500 dark:text-gray-300">{order.total.toLocaleString()}₫</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === "Đã giao"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-yellow-100 text-yellow-800"
                                        }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                                        Chi tiết
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function Admin() {
    const location = useLocation();
    const [currentTab, setCurrentTab] = useState(location.pathname.split('/').pop() || 'dashboard');

    const tabs = [
        { id: 'dashboard', name: 'Tổng quan', icon: FaChartBar },
        { id: 'categories', name: 'Danh mục', icon: FaFolder },
        { id: 'products', name: 'Sản phẩm', icon: FaBox },
        { id: 'orders', name: 'Đơn hàng', icon: FaShoppingBag },
    ];

    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            dispatch(clearUser());
        } catch (error) {
            console.error('Lỗi đăng xuất:', error);
        }
    };

    return (
        <div>
            <div className="flex min-h-screen">
                {/* Sidebar */}
                <div className="fixed w-64 h-screen overflow-y-auto bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col justify-between">
                    {/* Top section with title and navigation */}
                    <div>
                        <header className="bg-white dark:bg-gray-950 shadow-md transition-colors px-4 py-4">
                            <div className="flex items-center h-[42px]">
                                <Link to="/admin" className="text-2xl font-bold text-gray-800 dark:text-white">
                                    SAVANI ADMIN
                                </Link>
                            </div>
                        </header>
                        <nav>
                            {tabs.map((tab) => (
                                <Link
                                    key={tab.id}
                                    to={`/admin/${tab.id}`}
                                    className={`flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${currentTab === tab.id ? 'bg-gray-100 dark:bg-gray-700' : ''
                                        }`}
                                    onClick={() => setCurrentTab(tab.id)}
                                >
                                    <tab.icon className="w-5 h-5 mr-3" />
                                    {tab.name}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Bottom section with theme toggle and logout */}
                    <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-gray-600 dark:text-gray-300">Chế độ tối</span>
                            <ThemeToggle />
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Đăng xuất
                        </button>
                    </div>
                </div>

                {/* Main content */}
                <div className="flex-1 ml-64 bg-gray-100 dark:bg-gray-900">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/products" element={<ProductManagement />} />
                        <Route path="/categories" element={<CategoryManagement />} />
                        <Route path="/orders" element={<Orders />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}

export default Admin;
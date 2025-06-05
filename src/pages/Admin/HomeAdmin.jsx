import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBox, FaShoppingBag, FaChartBar, FaFolder } from 'react-icons/fa';

import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { clearUser } from '../../store/authSlice';
import Dashboard from './Dashboard';
import OrderManagement from './OrderManagement';
import ProductManagement from './ProductManagement';
import CategoryManagement from './CategotyManagement';
import ThemeToggle from '../../components/ThemeToggle';

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
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            dispatch(clearUser());
            navigate('/auth');
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
                        <Route path="/orders" element={<OrderManagement />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}

export default Admin;
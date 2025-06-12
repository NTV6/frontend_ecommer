import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    BarChart3,
    Package,
    ShoppingCart,
    Folder,
    Users,
    LogOut,
    Menu,
    X,
    ChevronDown,
    Settings,
    Home
} from 'lucide-react';

import { auth } from '../../lib/firebase';
import { clearUser } from '../../store/authSlice';
import Dashboard from './Dashboard';
import UserManagement from './UserManagement';
import OrderManagement from './OrderManagement';
import ProductManagement from './ProductManagement';
import CategoryManagement from './CategotyManagement';
import ThemeToggle from '../../components/ThemeToggle';

function Admin() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [currentTab, setCurrentTab] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const tabs = [
        { id: 'dashboard', name: 'Tổng quan', icon: BarChart3 },
        { id: 'categories', name: 'Danh mục', icon: Folder },
        { id: 'products', name: 'Sản phẩm', icon: Package },
        { id: 'orders', name: 'Đơn hàng', icon: ShoppingCart },
        { id: 'users', name: 'Người dùng', icon: Users },
    ];

    const handleLogout = async () => {
        try {
            await signOut(auth);
            dispatch(clearUser());
            navigate('/auth');
        } catch (error) {
            console.error('Lỗi đăng xuất:', error);
        }
    };

    const renderContent = () => {
        switch (currentTab) {
            case 'dashboard':
                return <Dashboard />;
            case 'categories':
                return <CategoryManagement />;
            case 'products':
                return <ProductManagement />;
            case 'orders':
                return <OrderManagement />;
            case 'users':
                return <UserManagement />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed top-0 bottom-0 left-0 z-50 w-full sm:w-72 flex-none overflow-hidden bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}>
                {/* Sidebar Header */}
                <div className="flex justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Home className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">SAVANI</h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Admin Panel</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setCurrentTab(tab.id);
                                    setSidebarOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all duration-200 ${currentTab === tab.id
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <div className="flex items-center">
                                    <Icon className="w-5 h-5 mr-3" />
                                    <span className="font-medium">{tab.name}</span>
                                </div>
                            </button>
                        );
                    })}
                </nav>

                {/* Sidebar Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <div className="space-y-3">
                        {/* Theme Toggle */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700 dark:text-gray-300">Chế độ tối</span>
                            <ThemeToggle />
                        </div>

                        {/* User Profile */}
                        <div className="relative">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                            >
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-bold">A</span>
                                    </div>
                                    <div className="ml-3 text-left">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Admin</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">admin@savani.com</p>
                                    </div>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* User Dropdown */}
                            {userMenuOpen && (
                                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg">
                                    <button className="w-full flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg">
                                        <Settings className="w-4 h-4 mr-3" />
                                        Cài đặt
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-b-lg"
                                    >
                                        <LogOut className="w-4 h-4 mr-3" />
                                        Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:ml-72">
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden m-4 mb-0"
                >
                    <Menu className="w-8 h-8" />
                </button>

                {/* Main content */}
                <main className="p-4">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}

export default Admin;
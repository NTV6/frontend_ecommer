import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaBox, FaShoppingBag, FaUsers, FaChartBar } from 'react-icons/fa';
import ProductModal from '../components/ProductModal';
import { fetchProducts, deleteProduct } from '../store/productSlice';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import ThemeToggle from '../components/ThemeToggle';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { clearUser } from '../store/authSlice';

function Dashboard() {
    const { products } = useSelector((state) => state.products);
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

function Products() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [modalMode, setModalMode] = useState('add');

    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.products);
    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const handleAddProduct = () => {
        setModalMode('add');
        setSelectedProduct(null);
        setIsModalOpen(true);
    };

    const handleEditProduct = (product) => {
        setModalMode('edit');
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleDeleteProduct = async (product) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            try {
                await dispatch(deleteProduct(product.id)).unwrap();
                alert('Xóa sản phẩm thành công');
                dispatch(fetchProducts()); // Refresh danh sách sau khi xóa
            } catch (error) {
                console.error('Lỗi khi xóa sản phẩm:', error);
                alert('Có lỗi xảy ra khi xóa sản phẩm');
            }
        }
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="text-center">Đang tải...</div>
            </div>
        );
    }

    return (
        <div className="p-6 pt-0">
            <div className="flex justify-between items-center h-[88px] fixed top-0 left-64 right-0 bg-gray-100 dark:bg-gray-900 px-6 py-6">
                <h2 className="text-2xl font-bold dark:text-white">Quản lý sản phẩm</h2>
                <button
                    onClick={handleAddProduct}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                    Thêm sản phẩm
                </button>
            </div>
            <div className="bg-white mt-[88px] dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-orange-300 text-back text-left text-xs font-medium uppercase tracking-wider dark:text-black">
                        <tr>
                            <th className="px-6 py-3">Sản phẩm</th>
                            <th className="px-6 py-3">Loại sản phẩm</th>
                            <th className="px-6 py-3">Giá</th>
                            <th className="px-6 py-3">Tồn kho</th>
                            <th className="px-6 py-3">Trạng thái</th>
                            <th className="px-6 py-3">Mô tả</th>
                            <th className="px-6 py-3">Ngày tạo</th>
                            <th className="px-6 py-3">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {[...products].reverse().map((product) => (
                            <tr key={`product-${product.id}`}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="w-10 h-10 rounded-md object-cover mr-3"
                                        />
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                            {product.name}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500 dark:text-gray-300">
                                        {product.category_id || 'Chưa có loại'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500 dark:text-gray-300">
                                        {Number(product.price)?.toLocaleString()}₫
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500 dark:text-gray-300">
                                        {product.stock}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.stock > 0
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                        }`}>
                                        {product.stock > 0 ? "Còn hàng" : "Hết hàng"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500 dark:text-gray-300">
                                        {product.description}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500 dark:text-gray-300">
                                        {product.created_at
                                            ? format(parseISO(product.created_at), 'dd/MM/yyyy - HH:mm', { locale: vi })
                                            : 'Chưa có ngày tạo'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => handleEditProduct(product)}
                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        onClick={() => handleDeleteProduct(product)}
                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={selectedProduct}
                mode={modalMode}
            />
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
                        <Route path="/products" element={<Products />} />
                        <Route path="/orders" element={<Orders />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}

export default Admin;
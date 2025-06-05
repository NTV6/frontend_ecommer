import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaBox, FaShoppingBag, FaUsers, FaChartBar, FaFolder } from 'react-icons/fa';

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

export default Dashboard;
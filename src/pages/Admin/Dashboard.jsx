import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
    format,
    subMonths,
    startOfMonth,
    endOfMonth,
    subDays,
    startOfDay,
    endOfDay
} from 'date-fns';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import {
    Package,
    ShoppingCart,
    Folder,
    Users,
} from 'lucide-react';

// Đăng ký các components của Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function Dashboard() {
    const { products } = useSelector((state) => state.products);
    const { categories } = useSelector((state) => state.categories);
    const { orders } = useSelector((state) => state.orders);
    const { users } = useSelector((state) => state.users);
    const [dailyRevenueData, setDailyRevenueData] = useState({
        labels: [],
        datasets: []
    });

    const [revenueData, setRevenueData] = useState({
        labels: [],
        datasets: []
    });

    useEffect(() => {
        // Tạo dữ liệu cho 7 ngày gần nhất
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = subDays(new Date(), i);
            return {
                date: format(date, 'dd/MM'),
                start: startOfDay(date),
                end: endOfDay(date)
            };
        }).reverse();

        // Tính tổng doanh thu cho mỗi ngày
        const dailyRevenue = last7Days.map(day => {
            const dailyOrders = orders.filter(order => {
                const orderDate = new Date(order.created_at);
                return orderDate >= day.start && orderDate <= day.end;
            });

            return {
                date: day.date,
                revenue: dailyOrders.reduce((sum, order) => sum + Number(order.total_amount), 0)
            };
        });

        setDailyRevenueData({
            labels: dailyRevenue.map(data => data.date),
            datasets: [
                {
                    label: 'Doanh thu theo ngày (VNĐ)',
                    data: dailyRevenue.map(data => data.revenue),
                    borderColor: 'rgb(34, 197, 94)',
                    backgroundColor: 'rgba(34, 197, 94, 0.5)',
                    tension: 0.4
                }
            ]
        });

        const last6Months = Array.from({ length: 6 }, (_, i) => {
            const date = subMonths(new Date(), i);
            return {
                month: format(date, 'MM/yyyy'),
                start: startOfMonth(date),
                end: endOfMonth(date)
            };
        }).reverse();

        // Tính tổng doanh thu cho mỗi tháng
        const monthlyRevenue = last6Months.map(month => {
            const monthlyOrders = orders.filter(order => {
                const orderDate = new Date(order.created_at);
                return orderDate >= month.start && orderDate <= month.end;
            });

            return {
                month: month.month,
                revenue: monthlyOrders.reduce((sum, order) => sum + Number(order.total_amount), 0)
            };
        });

        setRevenueData({
            labels: monthlyRevenue.map(data => data.month),
            datasets: [
                {
                    label: 'Doanh thu (VNĐ)',
                    data: monthlyRevenue.map(data => data.revenue),
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.5)',
                    tension: 0.4
                }
            ]
        });
    }, [orders]);

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value) => {
                        return new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                            maximumFractionDigits: 0
                        }).format(value);
                    }
                }
            }
        }
    };

    // Tính tổng doanh thu
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                            <ShoppingCart className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Tổng doanh thu</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND',
                                    maximumFractionDigits: 0
                                }).format(totalRevenue)}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
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
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
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
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                            <ShoppingCart className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Tổng đơn hàng</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{orders.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
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
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Biểu đồ doanh thu theo tháng */}
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Doanh thu theo tháng
                    </h3>
                    <div className="h-[300px]">
                        <Line options={chartOptions} data={revenueData} />
                    </div>
                </div>

                {/* Biểu đồ doanh thu theo ngày */}
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Doanh thu 7 ngày gần nhất
                    </h3>
                    <div className="h-[300px]">
                        <Line options={chartOptions} data={dailyRevenueData} />
                    </div>
                </div>
                {/* <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
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
                </div> */}
            </div>
        </div>
    )
}

export default Dashboard;
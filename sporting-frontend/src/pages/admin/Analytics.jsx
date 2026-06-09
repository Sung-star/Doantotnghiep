import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Package, Users, DollarSign } from 'lucide-react';
import axiosConfig from '../../api/axiosConfig';

const AnalyticsDashboard = () => {
    const [todayRevenue, setTodayRevenue] = useState(0);
    const [orderStats, setOrderStats] = useState({});
    const [topProducts, setTopProducts] = useState([]);
    const [topCustomers, setTopCustomers] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState({ from: '', to: '' });

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);

            // Fetch today revenue
            const todayRes = await axiosConfig.get('/analytics/today');
            setTodayRevenue(todayRes.data.revenue);

            // Fetch order stats
            const ordersRes = await axiosConfig.get('/analytics/orders');
            setOrderStats(ordersRes.data);

            // Fetch top products
            const productsRes = await axiosConfig.get('/analytics/top-products');
            setTopProducts(productsRes.data);

            // Fetch top customers
            const customersRes = await axiosConfig.get('/analytics/top-customers?limit=5');
            setTopCustomers(customersRes.data);

            // Fetch revenue range (last 7 days)
            const today = new Date();
            const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            const from = sevenDaysAgo.toISOString().split('T')[0];
            const to = today.toISOString().split('T')[0];

            const revenueRes = await axiosConfig.get(`/analytics/revenue?from=${from}&to=${to}`);
            if (revenueRes.data.dailyRevenue) {
                setRevenueData(
                    Object.entries(revenueRes.data.dailyRevenue).map(([date, revenue]) => ({
                        date,
                        revenue
                    }))
                );
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching analytics:', error);
            setLoading(false);
        }
    };

    const handleDateRangeChange = async () => {
        if (!dateRange.from || !dateRange.to) return;

        try {
            const revenueRes = await axiosConfig.get(
                `/analytics/revenue?from=${dateRange.from}&to=${dateRange.to}`
            );
            if (revenueRes.data.dailyRevenue) {
                setRevenueData(
                    Object.entries(revenueRes.data.dailyRevenue).map(([date, revenue]) => ({
                        date,
                        revenue
                    }))
                );
            }
        } catch (error) {
            console.error('Error fetching revenue range:', error);
        }
    };

    if (loading) {
        return <div className="text-center py-8">Đang tải dữ liệu...</div>;
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">📊 Thống Kê & Phân Tích</h1>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Doanh thu hôm nay</p>
                            <p className="text-2xl font-bold text-green-600">
                                ₫{todayRevenue.toLocaleString('vi-VN')}
                            </p>
                        </div>
                        <DollarSign className="w-12 h-12 text-green-400" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Tổng đơn hàng</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {orderStats.totalOrders || 0}
                            </p>
                        </div>
                        <Package className="w-12 h-12 text-blue-400" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Đã hoàn thành</p>
                            <p className="text-2xl font-bold text-purple-600">
                                {orderStats.statusBreakdown?.COMPLETED || 0}
                            </p>
                        </div>
                        <TrendingUp className="w-12 h-12 text-purple-400" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Doanh thu hoàn thành</p>
                            <p className="text-2xl font-bold text-orange-600">
                                ₫{Math.round(orderStats.completedRevenue || 0).toLocaleString('vi-VN')}
                            </p>
                        </div>
                        <DollarSign className="w-12 h-12 text-orange-400" />
                    </div>
                </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h2 className="text-xl font-bold mb-4">💹 Doanh thu (7 ngày gần đây)</h2>
                <div className="mb-4 flex gap-2">
                    <input
                        type="date"
                        value={dateRange.from}
                        onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                        className="px-3 py-2 border rounded"
                    />
                    <input
                        type="date"
                        value={dateRange.to}
                        onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                        className="px-3 py-2 border rounded"
                    />
                    <button
                        onClick={handleDateRangeChange}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Lọc
                    </button>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Doanh thu (₫)" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Top Products */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">🔥 Sản phẩm bán chạy hôm nay</h2>
                    <div className="space-y-2">
                        {topProducts.length > 0 ? (
                            topProducts.map((product, idx) => (
                                <div key={idx} className="flex justify-between p-2 border-b">
                                    <div>
                                        <p className="font-semibold">#{product.productId}</p>
                                        <p className="text-sm text-gray-600">Số lượng: {product.quantity}</p>
                                    </div>
                                    <p className="text-green-600 font-bold">
                                        ₫{Math.round(product.revenue).toLocaleString('vi-VN')}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">Chưa có dữ liệu</p>
                        )}
                    </div>
                </div>

                {/* Top Customers */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">👥 Khách hàng VIP</h2>
                    <div className="space-y-2">
                        {topCustomers.length > 0 ? (
                            topCustomers.map((customer, idx) => (
                                <div key={idx} className="flex justify-between p-2 border-b">
                                    <div>
                                        <p className="font-semibold">User-{customer.userId}</p>
                                        <p className="text-sm text-gray-600">Chi tiêu tổng cộng</p>
                                    </div>
                                    <p className="text-blue-600 font-bold">
                                        ₫{Math.round(customer.totalSpent).toLocaleString('vi-VN')}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">Chưa có dữ liệu</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;

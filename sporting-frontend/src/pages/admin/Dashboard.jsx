import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import { 
    FaDollarSign, FaCalendar, FaClipboardList, FaUsers, 
    FaChartLine, FaBox, FaClock 
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalUsers: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [ordersRes, productsRes, usersRes] = await Promise.all([
                    api.get('/orders'),
                    api.get('/products?size=1000'),
                    api.get('/users')
                ]);

                const orders = Array.isArray(ordersRes.data) ? ordersRes.data : (ordersRes.data?.content || []);
                const revenue = orders
                    .filter(o => o.orderStatus === 'PAID' || o.orderStatus === 'DELIVERED' || o.orderStatus === 'COMPLETED')
                    .reduce((sum, order) => sum + (order.total || 0), 0);

                setStats({
                    totalRevenue: revenue,
                    totalOrders: orders.length,
                    totalProducts: productsRes.data?.totalElements ?? (productsRes.data?.length || 0),
                    totalUsers: usersRes.data?.totalElements ?? (usersRes.data?.length || 0)
                });

                setRecentOrders(orders.slice(0, 5));
            } catch (err) {
                console.error("Lỗi dashboard:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const StatCard = ({ title, value, icon: Icon, colorClass }) => (
        <div className="col-xl-3 col-md-6 mb-4">
            <div className={`card border-left-${colorClass} shadow h-100 py-2`}>
                <div className="card-body">
                    <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                            <div className={`text-xs font-weight-bold text-${colorClass} text-uppercase mb-1`}>
                                {title}
                            </div>
                            <div className="h5 mb-0 font-weight-bold text-gray-800">
                                {typeof value === 'number' && title.includes('Doanh thu') ? value.toLocaleString() + 'đ' : value.toLocaleString()}
                            </div>
                        </div>
                        <div className="col-auto">
                            <Icon className="text-gray-300" size={30} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (loading) return (
        <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2 text-muted">Đang tải dữ liệu hệ thống...</p>
        </div>
    );

    return (
        <div className="container-fluid">
            <style>{`
                .border-left-primary { border-left: .25rem solid #4e73df!important; }
                .border-left-success { border-left: .25rem solid #1cc88a!important; }
                .border-left-info { border-left: .25rem solid #36b9cc!important; }
                .border-left-warning { border-left: .25rem solid #f6c23e!important; }
                .text-xs { font-size: .7rem; }
            `}</style>

            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Dashboard</h1>
                <button className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
                    <FaChartLine className="me-2" /> Tạo báo cáo
                </button>
            </div>

            <div className="row">
                <StatCard title="Doanh thu (Tổng)" value={stats.totalRevenue} icon={FaDollarSign} colorClass="primary" />
                <StatCard title="Đơn hàng" value={stats.totalOrders} icon={FaClipboardList} colorClass="success" />
                <StatCard title="Sản phẩm" value={stats.totalProducts} icon={FaCalendar} colorClass="info" />
                <StatCard title="Người dùng" value={stats.totalUsers} icon={FaUsers} colorClass="warning" />
            </div>

            <div className="row">
                {/* Recent Orders Table */}
                <div className="col-lg-8">
                    <div className="card shadow mb-4">
                        <div className="card-header py-3 bg-white d-flex justify-content-between align-items-center">
                            <h6 className="m-0 font-weight-bold text-primary">Đơn hàng gần đây</h6>
                            <Link to="/admin/orders" className="small font-weight-bold">Xem tất cả</Link>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0 align-middle">
                                    <thead className="bg-light">
                                        <tr className="small text-uppercase font-weight-bold">
                                            <th className="px-4">ID</th>
                                            <th>Khách hàng</th>
                                            <th>Ngày đặt</th>
                                            <th className="text-end px-4">Giá trị</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentOrders.map(order => (
                                            <tr key={order.id}>
                                                <td className="px-4 font-weight-bold">#ORD-{order.id}</td>
                                                <td>{order.client?.name || 'Khách vãng lai'}</td>
                                                <td>{new Date(order.moment).toLocaleDateString('vi-VN')}</td>
                                                <td className="text-end px-4 font-weight-bold">{order.total?.toLocaleString()}đ</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="col-lg-4">
                    <div className="card shadow mb-4">
                        <div className="card-header py-3 bg-white">
                            <h6 className="m-0 font-weight-bold text-primary">Thao tác nhanh</h6>
                        </div>
                        <div className="card-body">
                            <div className="d-grid gap-2">
                                <Link to="/admin/products" className="btn btn-outline-primary text-start">
                                    <FaBox className="me-2"/> Quản lý kho hàng
                                </Link>
                                <Link to="/admin/users" className="btn btn-outline-info text-start">
                                    <FaUsers className="me-2"/> Phân quyền người dùng
                                </Link>
                                <div className="mt-3 p-3 bg-light rounded small text-muted">
                                    <FaClock className="me-2"/> <strong>Hệ thống:</strong> Hoạt động bình thường. Phiên bản 2.0 đã ổn định.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
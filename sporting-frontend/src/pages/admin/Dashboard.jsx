import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import api from '../../api/axiosConfig';
import { 
    FaDollarSign, FaShoppingBag, FaBox, FaUsers, 
    FaChartLine, FaArrowUp, FaClock 
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
                // Bạn có thể tạo 1 API riêng /admin/stats hoặc gọi lẻ các API hiện có
                const [ordersRes, productsRes, usersRes] = await Promise.all([
                    api.get('/orders'), // Giả định bạn có endpoint này
                    api.get('/products?size=1000'),
                    api.get('/users') // Giả định bạn có endpoint này
                ]);

                // Tính toán dữ liệu cơ bản
                const orders = ordersRes.data.content || ordersRes.data || [];
                const revenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

                setStats({
                    totalRevenue: revenue,
                    totalOrders: orders.length,
                    totalProducts: productsRes.data.totalElements || productsRes.data.length,
                    totalUsers: usersRes.data.length || 0
                });

                setRecentOrders(orders.slice(0, 5)); // Lấy 5 đơn hàng mới nhất
            } catch (err) {
                console.error("Lỗi tải dữ liệu dashboard:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const StatCard = ({ title, value, icon: Icon, color, suffix = "" }) => (
        <div className="col-md-3">
            <div className="card border-0 shadow-sm p-3 mb-4" style={{ borderRadius: '15px' }}>
                <div className="d-flex align-items-center justify-content-between">
                    <div>
                        <h6 className="text-muted mb-1 small text-uppercase fw-bold">{title}</h6>
                        <h4 className="fw-bold mb-0">{value.toLocaleString()}{suffix}</h4>
                    </div>
                    <div className={`rounded-circle p-3 bg-${color} bg-opacity-10 text-${color}`}>
                        <Icon size={24} />
                    </div>
                </div>
                <div className="mt-3 small text-success">
                    <FaArrowUp /> <span className="fw-bold">12%</span> <span className="text-muted">so với tháng trước</span>
                </div>
            </div>
        </div>
    );

    StatCard.propTypes = {
        title: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        icon: PropTypes.elementType.isRequired,
        color: PropTypes.string.isRequired,
        suffix: PropTypes.string
    };

    if (loading) return <div className="p-5 text-center">Đang tải dữ liệu...</div>;

    return (
        <div className="container-fluid p-4 bg-light min-vh-100">
            <div className="mb-4">
                <h3 className="fw-bold text-dark">BẢNG ĐIỀU KHIỂN</h3>
                <p className="text-muted">Chào mừng trở lại, đây là tình hình kinh doanh của Sporting Shop hôm nay.</p>
            </div>

            {/* Khối Thống kê */}
            <div className="row">
                <StatCard title="Doanh thu" value={stats.totalRevenue} icon={FaDollarSign} color="primary" suffix="đ" />
                <StatCard title="Đơn hàng" value={stats.totalOrders} icon={FaShoppingBag} color="success" />
                <StatCard title="Sản phẩm" value={stats.totalProducts} icon={FaBox} color="warning" />
                <StatCard title="Khách hàng" value={stats.totalUsers} icon={FaUsers} color="info" />
            </div>

            <div className="row mt-2">
                {/* Đơn hàng gần đây */}
                <div className="col-md-8">
                    <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="fw-bold m-0"><FaClock className="me-2 text-primary" /> ĐƠN HÀNG GẦN ĐÂY</h5>
                                <Link to="/admin/orders" className="btn btn-sm btn-outline-primary rounded-pill px-3">Xem tất cả</Link>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead className="table-light small">
                                        <tr>
                                            <th>Mã đơn</th>
                                            <th>Khách hàng</th>
                                            <th>Ngày đặt</th>
                                            <th>Tổng tiền</th>
                                            <th>Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentOrders.map(order => (
                                            <tr key={order.id}>
                                                <td className="fw-bold text-primary">#{order.id}</td>
                                                <td>{order.client?.name || 'Khách vãng lai'}</td>
                                                <td className="small text-muted">{new Date(order.moment).toLocaleDateString('vi-VN')}</td>
                                                <td className="fw-bold">{order.total?.toLocaleString()}đ</td>
                                                <td>
                                                    <span className={`badge rounded-pill bg-${order.orderStatus === 'PAID' ? 'success' : 'warning'} bg-opacity-10 text-${order.orderStatus === 'PAID' ? 'success' : 'warning'} px-3`}>
                                                        {order.orderStatus}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Truy cập nhanh */}
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-4">QUẢN LÝ NHANH</h5>
                            <div className="d-grid gap-3">
                                <Link to="/admin/products" className="btn btn-light text-start p-3 border-0 shadow-none hover-shadow rounded-3">
                                    <FaBox className="me-2 text-warning" /> Quản lý Sản phẩm
                                </Link>
                                <Link to="/admin/categories" className="btn btn-light text-start p-3 border-0 shadow-none hover-shadow rounded-3">
                                    <FaChartLine className="me-2 text-primary" /> Quản lý Danh mục
                                </Link>
                                <Link to="/admin/users" className="btn btn-light text-start p-3 border-0 shadow-none hover-shadow rounded-3">
                                    <FaUsers className="me-2 text-info" /> Quản lý Người dùng
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
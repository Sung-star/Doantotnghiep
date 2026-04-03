import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import instance from '../../api/axiosConfig';
import { useLocation } from 'react-router-dom';

const AdminLayout = () => {
    const { loading, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const isDashboard = location.pathname === '/admin';

    // ── Kiểm tra quyền ──────────────────────────────────────────
    const isAdminSession = localStorage.getItem('isAdminSession') === 'true';
    const savedUser = JSON.parse(localStorage.getItem('user') || 'null');
    const hasAdminRole = savedUser && (
        (savedUser.roles       && savedUser.roles.some(r       => r.authority === 'ROLE_ADMIN')) ||
        (savedUser.authorities && savedUser.authorities.some(a => a.authority === 'ROLE_ADMIN'))
    );

    // ── Stats thật từ API ────────────────────────────────────────
    const [stats, setStats] = useState({
        totalOrders:   null,
        totalRevenue:  null,
        totalProducts: null,
        totalUsers:    null,
    });
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        if (!hasAdminRole || !isAdminSession) return;

        const fetchStats = async () => {
            setStatsLoading(true);
            try {
                const [ordersRes, productsRes, usersRes] = await Promise.allSettled([
                    instance.get('/orders'),
                    instance.get('/products?page=0&size=1'),
                    instance.get('/users'),
                ]);

                // Tổng đơn hàng & doanh thu từ danh sách orders
                let totalOrders  = 0;
                let totalRevenue = 0;
                if (ordersRes.status === 'fulfilled') {
                    const orders = Array.isArray(ordersRes.value.data)
                        ? ordersRes.value.data
                        : (ordersRes.value.data.content || []);
                    totalOrders  = orders.length;
                    totalRevenue = orders
                        .filter(o => o.orderStatus === 'PAID' || o.orderStatus === 'DELIVERED')
                        .reduce((sum, o) => sum + (o.total || 0), 0);
                }

                // Tổng sản phẩm
                let totalProducts = 0;
                if (productsRes.status === 'fulfilled') {
                    totalProducts = productsRes.value.data.totalElements
                        ?? (Array.isArray(productsRes.value.data)
                            ? productsRes.value.data.length
                            : 0);
                }

                // Tổng người dùng
                let totalUsers = 0;
                if (usersRes.status === 'fulfilled') {
                    const users = Array.isArray(usersRes.value.data)
                        ? usersRes.value.data
                        : (usersRes.value.data.content || []);
                    totalUsers = users.length;
                }

                setStats({ totalOrders, totalRevenue, totalProducts, totalUsers });
            } catch (err) {
                console.error('Lỗi tải thống kê:', err);
            }
            setStatsLoading(false);
        };

        fetchStats();
    }, []);

    // ── Định dạng tiền VNĐ ──────────────────────────────────────
    const formatRevenue = (amount) => {
        if (amount === null) return '...';
        if (amount >= 1_000_000_000) return `${(amount / 1_000_000_000).toFixed(1)}T ₫`;
        if (amount >= 1_000_000)     return `${(amount / 1_000_000).toFixed(0)}M ₫`;
        return amount.toLocaleString('vi-VN') + ' ₫';
    };

    const formatCount = (n) => (n === null ? '...' : n.toLocaleString('vi-VN'));

    // ── Loading / Unauthorized ───────────────────────────────────
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100"
                 style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' }}>
                <div className="text-center">
                    <div className="spinner-border text-light" style={{ width: '3rem', height: '3rem' }} role="status" />
                    <p className="mt-3 text-light fw-semibold">Đang tải hệ thống quản trị...</p>
                </div>
            </div>
        );
    }

    if (!hasAdminRole || !isAdminSession) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100"
                 style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' }}>
                <div className="text-center text-white p-5 rounded-4 shadow-lg" style={{ background: 'rgba(0,0,0,0.7)' }}>
                    <i className="bi bi-shield-x display-1 text-danger mb-4 d-block"></i>
                    <h1 className="display-5 fw-bold mb-3">403 – Truy Cập Bị Từ Chối</h1>
                    <p className="lead mb-4">Bạn không có quyền truy cập vào trang quản trị</p>
                    <div className="d-flex justify-content-center gap-3">
                        <button onClick={() => navigate('/admin/login')} className="btn btn-danger btn-lg px-4">
                            <i className="bi bi-box-arrow-in-right me-2"></i>Đăng nhập lại
                        </button>
                        <button onClick={() => navigate('/')} className="btn btn-outline-light btn-lg px-4">
                            <i className="bi bi-house me-2"></i>Về trang chủ
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const navLinkClass = ({ isActive }) =>
        `nav-link d-flex align-items-center gap-3 px-3 py-3 rounded-3 mb-1 sidebar-nav-link ${isActive ? 'sidebar-nav-link--active' : ''}`;

    // ── STAT CARDS config ────────────────────────────────────────
    const statCards = [
        {
            label:      'Tổng đơn hàng',
            value:      formatCount(stats.totalOrders),
            icon:       'bi-cart-check',
            gradient:   'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            loading:    statsLoading,
        },
        {
            label:      'Doanh thu (đã TT)',
            value:      formatRevenue(stats.totalRevenue),
            icon:       'bi-currency-exchange',
            gradient:   'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
            loading:    statsLoading,
        },
        {
            label:      'Sản phẩm',
            value:      formatCount(stats.totalProducts),
            icon:       'bi-bag',
            gradient:   'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
            loading:    statsLoading,
        },
        {
            label:      'Khách hàng',
            value:      formatCount(stats.totalUsers),
            icon:       'bi-people',
            gradient:   'linear-gradient(135deg, #36d1dc 0%, #5b86e5 100%)',
            loading:    statsLoading,
        },
    ];

    return (
        <>
        <style>{`
            .sidebar-nav-link {
                color: rgba(255,255,255,0.68) !important;
                transition: background 0.18s ease, color 0.18s ease;
                text-decoration: none;
            }
            .sidebar-nav-link:hover {
                background: rgba(255,255,255,0.10) !important;
                color: #ffffff !important;
            }
            .sidebar-nav-link--active {
                background: rgba(255,255,255,0.16) !important;
                color: #ffffff !important;
                border-left: 3px solid rgba(255,255,255,0.9);
                padding-left: calc(0.75rem - 3px) !important;
            }
            .sidebar-nav-link--active .sidebar-icon {
                opacity: 1;
            }
            .sidebar-icon {
                width: 22px;
                text-align: center;
                flex-shrink: 0;
                opacity: 0.75;
            }
            .sidebar-nav-link:hover .sidebar-icon,
            .sidebar-nav-link--active .sidebar-icon {
                opacity: 1;
            }
        `}</style>
        <div className="d-flex vh-100 overflow-hidden bg-light">

            {/* ══════════ SIDEBAR ══════════ */}
            <div className="d-flex flex-column flex-shrink-0 p-0 text-white"
                 style={{ width: '275px', background: 'linear-gradient(180deg, #1e3c72 0%, #2a5298 100%)', boxShadow: '4px 0 20px rgba(0,0,0,0.15)' }}>

                {/* Logo */}
                <div className="p-4 border-bottom border-white border-opacity-10">
                    <div className="d-flex align-items-center gap-3">
                        <div className="bg-white rounded-2 d-flex align-items-center justify-content-center"
                             style={{ width: '42px', height: '42px', flexShrink: 0 }}>
                            <i className="bi bi-shop text-primary fs-5"></i>
                        </div>
                        <div>
                            <h5 className="fw-bold mb-0 text-white"> Sporting Shop</h5>
                            <small className="text-white text-opacity-60">Admin Panel</small>
                        </div>
                    </div>
                </div>

                {/* Avatar admin */}
                <div className="px-4 py-3 border-bottom border-white border-opacity-10">
                    <div className="d-flex align-items-center gap-3">
                        <div className="position-relative">
                            <img
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(savedUser?.name || 'Admin')}&background=ffffff&color=1e3c72&bold=true&size=128`}
                                alt="Admin"
                                className="rounded-circle border border-2 border-white border-opacity-50"
                                width="44" height="44"
                            />
                            <span className="position-absolute bottom-0 end-0 bg-success border border-2 border-white rounded-circle"
                                  style={{ width: '11px', height: '11px' }} />
                        </div>
                        <div className="overflow-hidden">
                            <div className="fw-bold text-white text-truncate" style={{ fontSize: '14px' }}>
                                {savedUser?.name || 'Quản trị viên'}
                            </div>
                            <small className="text-white text-opacity-60 d-flex align-items-center gap-1">
                                <i className="bi bi-shield-check"></i> Quản trị viên
                            </small>
                        </div>
                    </div>
                </div>

                {/* Menu */}
                <div className="overflow-auto flex-grow-1 p-3">
                    <ul className="nav flex-column">

                        <li className="nav-item mb-1">
                            <NavLink to="/admin" end className={navLinkClass}>
                                <i className="bi bi-speedometer2 fs-5 sidebar-icon"></i>
                                <span className="fw-medium">Tổng quan</span>
                            </NavLink>
                        </li>

                        <li className="mt-3 mb-2 px-3">
                            <small className="text-white text-opacity-50 fw-bold text-uppercase" style={{ letterSpacing: '0.08em' }}>
                                Quản lý kho hàng
                            </small>
                        </li>
                        <li className="nav-item mb-1">
                            <NavLink to="/admin/products" className={navLinkClass}>
                                <i className="bi bi-bag fs-5 sidebar-icon"></i>
                                <span className="fw-medium">Sản phẩm</span>
                            </NavLink>
                        </li>
                        <li className="nav-item mb-1">
                            <NavLink to="/admin/categories" className={navLinkClass}>
                                <i className="bi bi-folder2-open fs-5 sidebar-icon"></i>
                                <span className="fw-medium">Danh mục</span>
                            </NavLink>
                        </li>
                        <li className="nav-item mb-1">
                            <NavLink to="/admin/sizes" className={navLinkClass}>
                                <i className="bi bi-rulers fs-5 sidebar-icon"></i>
                                <span className="fw-medium">Kích cỡ</span>
                            </NavLink>
                        </li>

                        <li className="mt-3 mb-2 px-3">
                            <small className="text-white text-opacity-50 fw-bold text-uppercase" style={{ letterSpacing: '0.08em' }}>
                                Quản lý kinh doanh
                            </small>
                        </li>
                        <li className="nav-item mb-1">
                            <NavLink to="/admin/orders" className={navLinkClass}>
                                <i className="bi bi-cart-check fs-5 sidebar-icon"></i>
                                <span className="fw-medium">Đơn hàng</span>
                            </NavLink>
                        </li>
                        <li className="nav-item mb-1">
                            <NavLink to="/admin/payments" className={navLinkClass}>
                                <i className="bi bi-credit-card fs-5 sidebar-icon"></i>
                                <span className="fw-medium">Giao dịch</span>
                            </NavLink>
                        </li>

                        <li className="mt-3 mb-2 px-3">
                            <small className="text-white text-opacity-50 fw-bold text-uppercase" style={{ letterSpacing: '0.08em' }}>
                                Quản lý hệ thống
                            </small>
                        </li>
                        <li className="nav-item mb-1">
                            <NavLink to="/admin/users" className={navLinkClass}>
                                <i className="bi bi-people fs-5 sidebar-icon"></i>
                                <span className="fw-medium">Người dùng</span>
                            </NavLink>
                        </li>

                    </ul>
                </div>

                {/* Logout */}
                <div className="p-3 border-top border-white border-opacity-10">
                    <button
                        onClick={logout}
                        className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3"
                        style={{ fontSize: '14px' }}
                    >
                        <i className="bi bi-box-arrow-right"></i> Đăng xuất
                    </button>
                </div>
            </div>

            {/* ══════════ MAIN CONTENT ══════════ */}
            <div className="flex-grow-1 d-flex flex-column overflow-hidden">

                {/* Header */}
                <header className="bg-white shadow-sm py-3 px-4 d-flex justify-content-between align-items-center"
                        style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <div className="d-flex align-items-center gap-3">
                        <div className="bg-primary bg-opacity-10 text-primary rounded-2 p-2">
                            <i className="bi bi-calendar-date fs-5"></i>
                        </div>
                        <div>
                            <h6 className="mb-0 text-dark fw-bold">
                                {new Date().toLocaleDateString('vi-VN', {
                                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                                })}
                            </h6>
                            <small className="text-muted">Hệ thống quản lý –  Sporting Shop</small>
                        </div>
                    </div>

                    <div className="d-flex align-items-center gap-3">
                        {/* Bell */}
                        <div className="dropdown">
                            <button className="btn btn-light d-flex align-items-center gap-2 rounded-3"
                                    type="button" data-bs-toggle="dropdown">
                                <i className="bi bi-bell fs-5"></i>
                            </button>
                            <div className="dropdown-menu dropdown-menu-end shadow border-0 p-3" style={{ width: '280px' }}>
                                <h6 className="fw-bold mb-3 text-dark">Thông báo</h6>
                                <p className="text-muted small text-center py-3 mb-0">Không có thông báo mới</p>
                            </div>
                        </div>
                        <div className="vr" />
                        <button onClick={logout} className="btn btn-danger d-flex align-items-center gap-2 rounded-3">
                            <i className="bi bi-box-arrow-right"></i> Đăng xuất
                        </button>
                    </div>
                </header>

                {/* ── STAT CARDS (số liệu thật) ── */}
{isDashboard && (
    <div className="px-4 pt-4 pb-0">
        <div className="row g-3">
            {statCards.map((card, i) => (
                <div key={i} className="col-md-3">
                    <div className="card border-0 shadow-sm text-white h-100"
                         style={{ background: card.gradient, borderRadius: '14px' }}>
                        <div className="card-body py-3 px-4">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="text-white text-opacity-75 mb-1"
                                         style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.04em' }}>
                                        {card.label.toUpperCase()}
                                    </div>
                                    {card.loading ? (
                                        <div className="placeholder-glow">
                                            <span className="placeholder col-6 rounded" style={{ height: '32px' }} />
                                        </div>
                                    ) : (
                                        <h3 className="mb-0 fw-bold" style={{ fontSize: '1.7rem' }}>
                                            {card.value}
                                        </h3>
                                    )}
                                </div>
                                <i className={`bi ${card.icon} fs-2 opacity-50`}></i>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
)}

                {/* Main Content (Outlet) */}
                <div className="flex-grow-1 overflow-auto p-4">
                    <div className="bg-white rounded-4 shadow-sm border p-4 h-100">
                        <Outlet />
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-white border-top py-3 px-4">
                    <div className="d-flex justify-content-between align-items-center text-muted small">
                        <div>© 2026 Sporting Shop Admin. All rights reserved.</div>
                        <div className="d-flex gap-3">
                            <span>Version 2.2.0</span>
                            <span>•</span>
                            <span>
                                Đăng nhập lúc:{' '}
                                {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
        </>
    );
};

export default AdminLayout;
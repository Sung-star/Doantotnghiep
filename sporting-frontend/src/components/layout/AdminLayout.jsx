import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
    FaTachometerAlt, FaBox, FaList, FaShoppingCart, 
    FaUsers, FaSignOutAlt, FaBars, FaUserCircle, FaSearch,
    FaTicketAlt, FaCreditCard, FaRuler, FaStar, FaCommentDots
} from 'react-icons/fa';

const AdminLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const savedUser = JSON.parse(localStorage.getItem('user') || '{}');

    const getAvatar = (url, name) => {
        if (!url) return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'A')}&background=0d6efd&color=fff&bold=true`;
        if (url.startsWith('http') || url.startsWith('data:')) return url;
        return `http://localhost:8081${url.startsWith('/') ? '' : '/'}${url}`;
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <div className="admin-wrapper d-flex">
            <style>{`
                :root {
                    --sidebar-width: 250px;
                    --primary-color: #4e73df;
                    --secondary-color: #858796;
                    --dark-bg: #224abe;
                }
                .sidebar {
                    width: var(--sidebar-width);
                    min-height: 100vh;
                    background: linear-gradient(180deg, #4e73df 10%, #224abe 100%);
                    transition: all 0.3s;
                }
                .sidebar .nav-link {
                    color: rgba(255,255,255,.8);
                    padding: 1rem 1.5rem;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    border-radius: 0;
                }
                .sidebar .nav-link:hover, .sidebar .nav-link.active {
                    color: #fff;
                    background: rgba(255,255,255,.1);
                }
                .sidebar .brand {
                    padding: 1.5rem;
                    color: #fff;
                    font-weight: 800;
                    font-size: 1.2rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .main-content {
                    flex: 1;
                    background-color: #f8f9fc;
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    overflow: visible; /* Cho phép nội dung tràn ra ngoài để toàn trang cuộn */
                }
                .topbar {
                    height: 70px;
                    background: #fff;
                    box-shadow: 0 .15rem 1.75rem 0 rgba(58,59,69,.15);
                    padding: 0 1.5rem;
                }
                .card {
                    border: none;
                    box-shadow: 0 .15rem 1.75rem 0 rgba(58,59,69,.15);
                    border-radius: 8px;
                    overflow: visible !important; /* Quan trọng: để dropdown không bị cắt */
                }
                /* Sửa lỗi dropdown bị cắt trong table-responsive */
                .table-responsive {
                    overflow: visible !important;
                    padding-bottom: 60px; /* Tạo khoảng trống cho dropdown ở dòng cuối */
                }
                @media (max-width: 768px) {
                    .table-responsive {
                        overflow-x: auto !important;
                        overflow-y: visible !important;
                    }
                }
                .btn-primary { background-color: var(--primary-color); border: none; }
                .btn-sm { border-radius: 4px; padding: .25rem .5rem; }
                .table thead th {
                    background-color: #f8f9fc;
                    text-transform: uppercase;
                    font-size: 12px;
                    color: #4e73df;
                    border-top: none;
                }
                .product-thumb {
                    width: 60px;
                    height: 60px;
                    object-fit: cover;
                    border-radius: 4px;
                    border: 1px solid #e3e6f0;
                }
            `}</style>

            {/* Sidebar */}
            <nav className="sidebar d-none d-md-block">
                <div className="brand d-flex align-items-center gap-2">
                    <FaBox /> <span>SPORT ADMIN</span>
                </div>
                <hr className="mx-3 my-0 border-white opacity-25" />
                <ul className="nav flex-column mt-3">
                    <li className="nav-item">
                        <Link to="/admin" className={`nav-link ${isActive('/admin')}`}>
                            <FaTachometerAlt /> Dashboard
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/admin/products" className={`nav-link ${isActive('/admin/products')}`}>
                            <FaBox /> Quản lý sản phẩm
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/admin/categories" className={`nav-link ${isActive('/admin/categories')}`}>
                            <FaList /> Danh mục
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/admin/orders" className={`nav-link ${isActive('/admin/orders')}`}>
                            <FaShoppingCart /> Đơn hàng
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/admin/users" className={`nav-link ${isActive('/admin/users')}`}>
                            <FaUsers /> Người dùng
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/admin/vouchers" className={`nav-link ${isActive('/admin/vouchers')}`}>
                            <FaTicketAlt /> Mã giảm giá
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/admin/payments" className={`nav-link ${isActive('/admin/payments')}`}>
                            <FaCreditCard /> Thanh toán
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/admin/sizes" className={`nav-link ${isActive('/admin/sizes')}`}>
                            <FaRuler /> Quản lý Size
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/admin/reviews" className={`nav-link ${isActive('/admin/reviews')}`}>
                            <FaStar /> Đánh giá
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/admin/chat" className={`nav-link ${isActive('/admin/chat')}`}>
                            <FaCommentDots /> Chat khách hàng
                        </Link>
                    </li>
                </ul>
                <div className="mt-auto p-3">
                    <button onClick={handleLogout} className="btn btn-outline-light btn-sm w-100 d-flex align-items-center justify-content-center gap-2">
                        <FaSignOutAlt /> Đăng xuất
                    </button>
                </div>
            </nav>

            {/* Main Content Area */}
            <div className="main-content d-flex flex-column">
                {/* Topbar */}
                <header className="topbar d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                        <button className="btn d-md-none text-primary me-3">
                            <FaBars />
                        </button>
                        <div className="input-group d-none d-sm-flex" style={{ width: '300px' }}>
                            <input type="text" className="form-control bg-light border-0 small" placeholder="Tìm kiếm..." />
                            <button className="btn btn-primary" type="button">
                                <FaSearch />
                            </button>
                        </div>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        <div className="text-end d-none d-sm-block">
                            <div className="fw-bold text-dark small">{savedUser.name || 'Admin'}</div>
                            <div className="text-muted" style={{ fontSize: '11px' }}>Quản trị viên</div>
                        </div>
                        <div className="flex-shrink-0">
                            <img 
                                src={getAvatar(savedUser.imgUrl, savedUser.name)} 
                                className="rounded-circle border border-2 border-white shadow-sm"
                                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                alt="admin"
                            />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4">
                    <Outlet />
                </main>

                <footer className="mt-auto py-3 bg-white text-center text-muted small border-top">
                    Copyright &copy; Sporting Shop 2026
                </footer>
            </div>
        </div>
    );
};

export default AdminLayout;
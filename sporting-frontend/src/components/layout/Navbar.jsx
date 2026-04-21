import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, User, ShoppingBag, Search, Menu, X,
  LogOut, Package, LogIn, UserPlus, ShieldCheck, ChevronDown, Heart
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import MiniCartSidebar from './MiniCartSidebar';
import api from '../../api/axiosConfig';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { user, logout } = useAuth();
  const { cartItems, openMiniCart } = useCart();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data);
      } catch (err) {
        console.error("Lỗi fetch danh mục Navbar:", err);
      }
    };
    fetchCategories();
  }, []);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getAvatar = (imgUrl, name) => {
    if (!imgUrl) return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0f172a&color=fff&bold=true`;
    if (imgUrl.startsWith('http') || imgUrl.startsWith('data:')) return imgUrl;
    return `http://localhost:8081${imgUrl.startsWith('/') ? '' : '/'}${imgUrl}`;
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-custom sticky-top luxury-nav">
        <div className="container-fluid px-md-5">

          {/* 1. LOGO */}
          <div className="d-flex align-items-center">
            <button
              className="navbar-toggler me-2 border-0 shadow-none"
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <Link className="navbar-brand d-flex align-items-center me-4" to="/">
              <div className="logo-box bg-dark text-white rounded-3 p-2 me-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                <ShoppingBag size={22} />
              </div>
              <span className="fw-black text-dark text-uppercase tracking-tighter fs-4" style={{ letterSpacing: '-1px' }}>
                SPORTING <span style={{ color: 'var(--accent)' }}>SHOP</span>
              </span>
            </Link>
          </div>

          {/* 2. MAIN NAVIGATION */}
          <div className="d-none d-lg-flex align-items-center">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-4">
              <li className="nav-item">
                <Link className="nav-link nav-link-luxury" to="/">TRANG CHỦ</Link>
              </li>

              <li className="nav-item has-mega-menu">
                <Link className="nav-link nav-link-luxury d-flex align-items-center" to="/products">
                  BỘ SƯU TẬP <ChevronDown size={14} className="ms-1" />
                </Link>

                <div className="mega-menu luxury-shadow border-0">
                  <div className="container-fluid px-4 py-4">
                    <div className="row g-4">
                      <div className="col-lg-3">
                        <div className="mega-promo p-4 rounded-4 text-white d-flex flex-column justify-content-end" 
                             style={{ 
                               background: 'linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.8)), url("https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800")',
                               backgroundSize: 'cover',
                               height: '250px'
                             }}>
                          <h5 className="fw-black mb-1">XU HƯỚNG MỚI</h5>
                          <p className="small mb-2 text-white-50">Khám phá phong cách đẳng cấp cùng Sporting Shop.</p>
                          <Link to="/products" className="btn btn-light btn-sm fw-bold rounded-pill px-3" style={{ width: 'fit-content' }}>XEM NGAY</Link>
                        </div>
                      </div>

                      {categories.filter(c => !c.parent).map(rootCategory => (
                        <div className="col-lg-3" key={rootCategory.id}>
                          <h6 className="fw-black mb-3 text-uppercase small text-muted tracking-widest">{rootCategory.name}</h6>
                          <ul className="list-unstyled">
                            {categories.filter(c => c.parent && c.parent.id === rootCategory.id).map(child => (
                              <li key={child.id} className="mb-2">
                                <span onClick={() => handleCategoryClick(child.name)} style={{cursor: 'pointer'}} className="d-block py-1 mega-link-luxury">
                                  {child.name}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </li>

              <li className="nav-item">
                <Link className="nav-link nav-link-luxury" to="/about">CÂU CHUYỆN</Link>
              </li>
            </ul>
          </div>

          {/* 3. SEARCH & ACTIONS */}
          <div className="d-flex align-items-center gap-2 gap-md-3">
            <form onSubmit={handleSearch} className="d-none d-md-flex me-2">
              <div className="input-group search-group-luxury">
                <span className="input-group-text border-0 bg-transparent ps-3"><Search size={18} className="text-muted" /></span>
                <input
                  type="text"
                  className="form-control border-0 shadow-none bg-transparent ps-2"
                  placeholder="Tìm phong cách của bạn..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </form>

            <Link to="/wishlist" className="luxury-icon-btn">
              <Heart size={20} />
            </Link>

            <button type="button" className="luxury-icon-btn position-relative" onClick={openMiniCart}>
              <ShoppingCart size={20} />
              {cartCount > 0 && <span className="luxury-badge">{cartCount}</span>}
            </button>

            {/* USER PROFILE */}
            <div className="dropdown">
              <button
                className="btn d-flex align-items-center gap-2 border-0 shadow-none p-0"
                type="button"
                data-bs-toggle="dropdown"
              >
                {user ? (
                  <img 
                    src={getAvatar(user.imgUrl, user.name)} 
                    className="avatar-nav border border-2 border-white shadow-sm"
                    alt="user"
                  />
                ) : (
                  <div className="luxury-icon-btn">
                    <User size={20} />
                  </div>
                )}
              </button>

              <ul className="dropdown-menu dropdown-menu-end border-0 luxury-shadow mt-3 p-2 rounded-4">
                {user ? (
                  <>
                    <li className="p-3 mb-2 bg-light rounded-4">
                      <div className="d-flex align-items-center gap-3">
                        <img 
                          src={getAvatar(user.imgUrl, user.name)} 
                          className="rounded-circle border border-2 border-white"
                          width="45" height="45" alt="user"
                        />
                        <div className="overflow-hidden">
                          <div className="fw-black text-dark text-truncate">{user.name}</div>
                          <div className="small text-muted text-truncate">{user.email}</div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <Link className="dropdown-item luxury-dropdown-item" to="/profile">
                        <User size={18} className="me-3" /> Tài khoản của tôi
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item luxury-dropdown-item" to="/orders">
                        <Package size={18} className="me-3" /> Lịch sử đơn hàng
                      </Link>
                    </li>
                    {user.roles && user.roles.some(r => (r.authority === 'ROLE_ADMIN' || r.name === 'ROLE_ADMIN')) && (
                      <li>
                        <Link className="dropdown-item luxury-dropdown-item text-primary" to="/admin">
                          <ShieldCheck size={18} className="me-3" /> Trang quản trị
                        </Link>
                      </li>
                    )}
                    <li><hr className="dropdown-divider opacity-10" /></li>
                    <li>
                      <button className="dropdown-item luxury-dropdown-item text-danger" onClick={handleLogout}>
                        <LogOut size={18} className="me-3" /> Đăng xuất
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link className="dropdown-item luxury-dropdown-item" to="/login">
                        <LogIn size={18} className="me-3" /> Đăng nhập
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item luxury-dropdown-item" to="/register">
                        <UserPlus size={18} className="me-3" /> Đăng ký thành viên
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>

          </div>
        </div>
      </nav>
      <MiniCartSidebar />
    </>
  );
};

export default Navbar;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, User, ShoppingBag, Search, Menu, X,
  LogOut, Package, LogIn, UserPlus, ShieldCheck, ChevronDown, Heart
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import api from '../../api/axiosConfig';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
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
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-custom sticky-top">
        <div className="container">

          {/* 1. LOGO & MOBILE TOGGLE */}
          <div className="d-flex align-items-center">
            <button
              className="navbar-toggler me-2 border-0 shadow-none"
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <Link className="navbar-brand fw-bold d-flex align-items-center me-4" to="/">
              <ShoppingBag size={28} className="text-dark me-2" />
              <span className="d-none d-md-inline text-dark">
                Sporting <span style={{ color: '#E31837' }}>Shop</span>
              </span>
              <span className="d-md-none text-dark">Sporting Shop</span>
            </Link>
          </div>

          {/* 2. MENU CHÍNH – MEGA MENU */}
          <div className="d-none d-lg-flex align-items-center">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-3">
              <li className="nav-item">
                <Link className="nav-link fw-bold" to="/">TRANG CHỦ</Link>
              </li>

              {/* MEGA MENU – SẢN PHẨM */}
              <li className="nav-item has-mega-menu">
                <Link className="nav-link fw-bold d-flex align-items-center" to="/products">
                  SẢN PHẨM <ChevronDown size={14} className="ms-1" />
                </Link>

                <div className="mega-menu">
                  <div className="container">
                    <div className="row">

                      {/* Cột ảnh */}
                      <div className="col-lg-3">
                        <img
                          src="https://images.unsplash.com/photo-1542291026-7eec264c27ab?w=800&auto=format&fit=crop"
                          alt="Sporting Shop"
                          className="mega-img shadow-sm"
                        />
                      </div>

                      {/* Render dynamic categories */}
                      {categories.filter(c => !c.parent).map(rootCategory => (
                        <div className="col-lg-3" key={rootCategory.id}>
                          <h6 className="fw-bold mb-3 border-bottom pb-2 text-uppercase">{rootCategory.name}</h6>
                          <ul className="list-unstyled">
                            {categories.filter(c => c.parent && c.parent.id === rootCategory.id).map(child => (
                              <li key={child.id}>
                                <span onClick={() => handleCategoryClick(child.name)} style={{cursor: 'pointer'}} className="d-block py-1 mega-link">
                                  {child.name}
                                </span>
                              </li>
                            ))}
                            {categories.filter(c => c.parent && c.parent.id === rootCategory.id).length === 0 && (
                               <li>
                                  <span onClick={() => handleCategoryClick(rootCategory.name)} style={{cursor: 'pointer'}} className="d-block py-1 mega-link">
                                    Xem tất cả {rootCategory.name}
                                  </span>
                               </li>
                            )}
                          </ul>
                        </div>
                      ))}

                    </div>
                  </div>
                </div>
              </li>

              <li className="nav-item">
                <Link className="nav-link fw-bold" to="/about">GIỚI THIỆU</Link>
              </li>
            </ul>
          </div>

          {/* 3. THANH TÌM KIẾM */}
          <form onSubmit={handleSearch} className="d-none d-lg-flex flex-grow-1 mx-4" style={{ maxWidth: '400px' }}>
            <div className="input-group">
              <input
                type="text"
                className="form-control border-0 bg-light ps-4"
                placeholder="Tìm sản phẩm Adidas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ borderRadius: '20px 0 0 20px' }}
              />
              <button
                className="btn btn-light border-0 px-3 text-secondary"
                type="submit"
                style={{ borderRadius: '0 20px 20px 0' }}
              >
                <Search size={18} />
              </button>
            </div>
          </form>

          {/* 4. ICONS & USER DROPDOWN */}
          <div className="d-flex align-items-center gap-3">

            {/* Wishlist */}
            <Link to="/wishlist" className="nav-icon-btn text-dark">
              <Heart size={22} />
            </Link>

            {/* Cart */}
            <Link to="/cart" className="nav-icon-btn text-dark">
              <ShoppingCart size={22} />
              {cartCount > 0 && <span className="badge-count">{cartCount}</span>}
            </Link>

            {/* User Dropdown */}
            <div className="dropdown ms-1">
              <button
                className="btn d-flex align-items-center gap-2 dropdown-toggle border-0 shadow-none p-0"
                type="button"
                data-bs-toggle="dropdown"
              >
                <div className="bg-light rounded-circle p-2 d-flex align-items-center justify-content-center border hover-shadow">
                  <User size={20} className="text-dark" />
                </div>
              </button>

              <ul
                className="dropdown-menu dropdown-menu-end shadow-lg border-0 mt-3 py-2 px-2 rounded-4 animate slideIn"
                style={{ minWidth: '240px' }}
              >
                {user ? (
                  <>
                    <li className="px-3 py-2 mb-1">
                      <div className="fw-bold text-dark">{user.name}</div>
                      <div className="text-secondary small text-truncate">{user.email}</div>
                    </li>
                    <li><hr className="dropdown-divider opacity-50" /></li>
                    <li>
                      <Link className="dropdown-item d-flex align-items-center gap-3 py-2 rounded-3" to="/profile">
                        <User size={18} className="text-primary" />
                        <div><div className="fw-bold small">Tài khoản</div></div>
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item d-flex align-items-center gap-3 py-2 rounded-3" to="/orders">
                        <Package size={18} className="text-success" />
                        <div><div className="fw-bold small">Đơn hàng</div></div>
                      </Link>
                    </li>
                    {user.role === 'ADMIN' && (
                      <li>
                        <Link className="dropdown-item d-flex align-items-center gap-3 py-2 rounded-3" to="/admin">
                          <ShieldCheck size={18} style={{ color: '#E31837' }} />
                          <div><div className="fw-bold small" style={{ color: '#E31837' }}>Quản trị</div></div>
                        </Link>
                      </li>
                    )}
                    <li><hr className="dropdown-divider opacity-50" /></li>
                    <li>
                      <button
                        className="dropdown-item d-flex align-items-center gap-3 py-2 rounded-3"
                        style={{ color: '#E31837' }}
                        onClick={handleLogout}
                      >
                        <LogOut size={18} />
                        <span className="fw-bold small">Đăng xuất</span>
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link className="dropdown-item d-flex align-items-center gap-3 py-2 rounded-3" to="/login">
                        <LogIn size={18} className="text-primary" />
                        <div className="fw-bold small">Đăng nhập</div>
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item d-flex align-items-center gap-3 py-2 rounded-3" to="/register">
                        <UserPlus size={18} className="text-success" />
                        <div className="fw-bold small">Đăng ký</div>
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>

          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
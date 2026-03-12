import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';

import ChatAI from './components/common/ChatAI';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AdminLayout from './components/layout/AdminLayout';
import ProductList from './components/product/ProductList';

// Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// User
import Home from './pages/user/Home';
import About from './pages/About';
import ProductDetail from './pages/user/ProductDetail';
import Cart from './pages/user/Cart';
import Checkout from './pages/user/Checkout';
import Profile from './pages/user/Profile';
import Orders from './pages/user/Orders';
import Wishlist from './pages/user/Wishlist';

// Admin
import AdminDashboard  from './pages/admin/Dashboard';
import AdminCategories from './pages/admin/Categories';
import AdminProducts   from './pages/admin/Products';
import AdminOrders     from './pages/admin/Orders';
import AdminUsers      from './pages/admin/Users';
import AdminLogin      from './pages/admin/Login';
import AdminPayments   from './pages/admin/Payments';   // ← MỚI
import AdminSizes      from './pages/admin/Sizes';      // ← MỚI

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const isAuthPage  = location.pathname === '/login' || location.pathname === '/register';
  const isAdminPage = location.pathname.startsWith('/admin');
  return (
    <div className="d-flex flex-column min-vh-100">
      {!isAuthPage && !isAdminPage && <Navbar />}
      <main className="flex-grow-1">{children}</main>
      {!isAuthPage && !isAdminPage && <Footer />}
      {!isAuthPage && !isAdminPage && <ChatAI />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <ScrollToTop />
            <LayoutWrapper>
              <Routes>
                {/* Public */}
                <Route path="/"         element={<Home />} />
                <Route path="/about"    element={<About />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart"     element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/wishlist" element={<Wishlist />} />

                {/* Auth */}
                <Route path="/login"    element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected */}
                <Route path="/profile"  element={<Profile />} />
                <Route path="/orders"   element={<Orders />} />

                {/* Admin */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index              element={<AdminDashboard />} />
                  <Route path="products"   element={<AdminProducts />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="orders"     element={<AdminOrders />} />
                  <Route path="users"      element={<AdminUsers />} />
                  <Route path="payments"   element={<AdminPayments />} />  {/* ← MỚI */}
                  <Route path="sizes"      element={<AdminSizes />} />     {/* ← MỚI */}
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </LayoutWrapper>
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

const NotFound = () => (
  <div className="container text-center mt-5" style={{ paddingTop: '100px' }}>
    <h1 className="display-1 fw-bold">404</h1>
    <h2>Không tìm thấy trang</h2>
    <p className="text-muted">Trang bạn tìm kiếm có thể đã bị xóa hoặc đường dẫn không đúng.</p>
    <a href="/" className="btn btn-dark mt-3">Về trang chủ</a>
  </div>
);

export default App;
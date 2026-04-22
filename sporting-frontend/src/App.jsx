import { useEffect, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';

import SupportCenter from './components/common/SupportCenter';
import ProtectedRoute from './components/common/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import { SuspenseWrapper } from './components/common/SuspenseWrapper';
import FloatingActions from './components/common/FloatingActions';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AdminLayout from './components/layout/AdminLayout';
import ProductList from './components/product/ProductList';

// Lazy-loaded pages
const Home = lazy(() => import('./pages/user/Home'));
const About = lazy(() => import('./pages/About'));
const ProductDetail = lazy(() => import('./pages/user/ProductDetail'));
const Cart = lazy(() => import('./pages/user/Cart'));
const Checkout = lazy(() => import('./pages/user/Checkout'));
const Profile = lazy(() => import('./pages/user/Profile'));
const Orders = lazy(() => import('./pages/user/Orders'));
const Wishlist = lazy(() => import('./pages/user/Wishlist'));
const PaymentResult = lazy(() => import('./pages/user/PaymentResult'));

// Auth pages
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));

// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminCategories = lazy(() => import('./pages/admin/Categories'));
const AdminProducts = lazy(() => import('./pages/admin/Products'));
const AdminOrders = lazy(() => import('./pages/admin/Orders'));
const AdminUsers = lazy(() => import('./pages/admin/Users'));
const AdminPayments = lazy(() => import('./pages/admin/Payments'));
const AdminSizes = lazy(() => import('./pages/admin/Sizes'));
const AdminVouchers = lazy(() => import('./pages/admin/Vouchers'));
const AdminReviews = lazy(() => import('./pages/admin/Reviews'));
const AdminChat = lazy(() => import('./pages/admin/Chat'));

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
      {!isAuthPage && !isAdminPage && <SupportCenter />}
      {!isAuthPage && !isAdminPage && <FloatingActions />}
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Router>
              <ScrollToTop />
              <LayoutWrapper>
                <Routes>
                {/* Public */}
                <Route path="/" element={<SuspenseWrapper><Home /></SuspenseWrapper>} />
                <Route path="/about" element={<SuspenseWrapper><About /></SuspenseWrapper>} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/product/:id" element={<SuspenseWrapper><ProductDetail /></SuspenseWrapper>} />
                <Route path="/cart" element={<SuspenseWrapper><Cart /></SuspenseWrapper>} />
                <Route path="/checkout" element={<SuspenseWrapper><Checkout /></SuspenseWrapper>} />
                <Route path="/wishlist" element={<SuspenseWrapper><Wishlist /></SuspenseWrapper>} />

                {/* Auth */}
                <Route path="/login" element={<SuspenseWrapper><Login /></SuspenseWrapper>} />
                <Route path="/register" element={<SuspenseWrapper><Register /></SuspenseWrapper>} />

                {/* Protected */}
                <Route path="/profile" element={<ProtectedRoute><SuspenseWrapper><Profile /></SuspenseWrapper></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><SuspenseWrapper><Orders /></SuspenseWrapper></ProtectedRoute>} />

                {/* Admin */}
                <Route path="/admin" element={<ProtectedRoute requiredRole="ADMIN"><AdminLayout /></ProtectedRoute>}>
                  <Route index element={<SuspenseWrapper><AdminDashboard /></SuspenseWrapper>} />
                  <Route path="products" element={<SuspenseWrapper><AdminProducts /></SuspenseWrapper>} />
                  <Route path="categories" element={<SuspenseWrapper><AdminCategories /></SuspenseWrapper>} />
                  <Route path="orders" element={<SuspenseWrapper><AdminOrders /></SuspenseWrapper>} />
                  <Route path="users" element={<SuspenseWrapper><AdminUsers /></SuspenseWrapper>} />
                  <Route path="payments" element={<SuspenseWrapper><AdminPayments /></SuspenseWrapper>} />
                  <Route path="sizes" element={<SuspenseWrapper><AdminSizes /></SuspenseWrapper>} />
                  <Route path="vouchers" element={<SuspenseWrapper><AdminVouchers /></SuspenseWrapper>} />
                  <Route path="reviews" element={<SuspenseWrapper><AdminReviews /></SuspenseWrapper>} />
                  <Route path="chat" element={<SuspenseWrapper><AdminChat /></SuspenseWrapper>} />
                </Route>
                <Route path="/payment-result" element={<SuspenseWrapper><PaymentResult /></SuspenseWrapper>} />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </LayoutWrapper>
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
    </ErrorBoundary>
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
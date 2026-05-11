import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Kiểm tra quyền linh hoạt (Backend có thể trả về Object {authority: '...'} hoặc String '...')
  const userRoles = user.roles || [];
  const isAdmin = userRoles.some(role => {
    const auth = typeof role === 'string' ? role : role.authority;
    return auth === 'ROLE_ADMIN' || auth === 'ADMIN';
  });

  if (requiredRole === 'ADMIN' && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

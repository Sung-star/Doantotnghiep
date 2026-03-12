import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import instance from "../../api/axiosConfig";
import { useAuth } from "../../contexts/AuthContext";
import { FaEnvelope, FaLock, FaUserPlus, FaSignInAlt } from 'react-icons/fa';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await instance.post('/users/login', credentials);
            if (response.status === 200) {
                const data = response.data;
                const token = data.token || data.accessToken;
                const user = data.user || data;

                localStorage.setItem('user', JSON.stringify(user));
                if (token) localStorage.setItem('token', token);
                localStorage.removeItem('isAdminSession');

                if (typeof login === 'function') login(user);

                alert("Chào mừng bạn trở lại!");
                navigate('/');
            }
        } catch (error) {
    console.error("Chi tiết lỗi đăng nhập:", error); // Sử dụng biến error ở đây
    alert("Email hoặc mật khẩu không chính xác. Vui lòng thử lại!");
    } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100" 
             style={{ backgroundColor: '#f4f7f6' }}>
            <div className="card shadow-lg border-0" style={{ width: '420px', borderRadius: '20px' }}>
                <div className="card-body p-5">
                    {/* Logo hoặc Tên Shop */}
                    <div className="text-center mb-4">
                        <div className="bg-dark text-white d-inline-block p-3 rounded-circle mb-3 shadow">
                            <FaSignInAlt size={30} />
                        </div>
                        <h2 className="fw-bold text-dark mb-1">Sporting Shop</h2>
                        <p className="text-muted small">Đăng nhập để khám phá xu hướng mới nhất</p>
                    </div>

                    <form onSubmit={handleLogin}>
                        {/* Email Input */}
                        <div className="mb-4">
                            <label className="form-label fw-semibold small">Địa chỉ Email</label>
                            <div className="input-group border rounded-pill px-3 py-1 bg-light">
                                <span className="input-group-text bg-transparent border-0 text-muted">
                                    <FaEnvelope />
                                </span>
                                <input 
                                    type="email" 
                                    className="form-control bg-transparent border-0 shadow-none" 
                                    placeholder="email@example.com"
                                    required
                                    onChange={(e) => setCredentials({...credentials, email: e.target.value})} 
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="mb-4">
                            <label className="form-label fw-semibold small">Mật khẩu</label>
                            <div className="input-group border rounded-pill px-3 py-1 bg-light">
                                <span className="input-group-text bg-transparent border-0 text-muted">
                                    <FaLock />
                                </span>
                                <input 
                                    type="password" 
                                    className="form-control bg-transparent border-0 shadow-none" 
                                    placeholder="••••••••"
                                    required
                                    onChange={(e) => setCredentials({...credentials, password: e.target.value})} 
                                />
                            </div>
                        </div>

                        {/* Nút Đăng nhập */}
                        <button 
                            className="btn btn-dark w-100 py-3 rounded-pill fw-bold shadow-sm mb-4" 
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="spinner-border spinner-border-sm me-2"></span>
                            ) : null}
                            {loading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG NHẬP'}
                        </button>

                        {/* Link Đăng ký */}
                        <div className="text-center border-top pt-4">
                            <p className="text-muted mb-2">Bạn chưa có tài khoản?</p>
                            <Link 
                                to="/register" 
                                className="btn btn-outline-dark w-100 py-2 rounded-pill fw-bold"
                                style={{ fontSize: '0.9rem' }}
                            >
                                <FaUserPlus className="me-2" /> ĐĂNG KÝ NGAY
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
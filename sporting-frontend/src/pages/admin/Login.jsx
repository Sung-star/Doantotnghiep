import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import instance from "../../api/axiosConfig";
import { useAuth } from "../../contexts/AuthContext";

const AdminLogin = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await instance.post('/users/login', credentials);
            if (response.status === 200) {
                const data = response.data;
                const token = data.token || data.accessToken;
                const user = data.user || data;

                // 1. Kiểm tra quyền ROLE_ADMIN từ Java Backend
                const isAdmin = (user.roles && user.roles.some(r => r.authority === 'ROLE_ADMIN')) || 
                                (user.authorities && user.authorities.some(a => a.authority === 'ROLE_ADMIN'));

                if (isAdmin) {
                    // 2. Lưu token và user
                    if (token) localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(user));
                    
                    // 3. CẤP THẺ THÔNG HÀNH ADMIN
                    localStorage.setItem('isAdminSession', 'true');

                    if (typeof login === 'function') login(user);

                    alert("Chào mừng Quản trị viên!");
                    navigate('/admin'); 
                } else {
                    alert("Lỗi: Tài khoản này không có quyền quản trị!");
                    localStorage.clear();
                }
            }
        } catch (error) {
            alert("Sai tài khoản hoặc mật khẩu quản trị!");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
            <div className="card p-4 shadow-lg border-0" style={{ width: '380px', borderRadius: '15px' }}>
                <h3 className="text-center mb-4 text-danger fw-bold">ADMIN CONTROL PANEL</h3>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="text-muted small fw-bold text-uppercase">Admin Email</label>
                        <input type="email" className="form-control bg-light" required
                            placeholder="admin@clothing.com"
                            onChange={(e) => setCredentials({...credentials, email: e.target.value})} />
                    </div>
                    <div className="mb-3">
                        <label className="text-muted small fw-bold text-uppercase">Mật khẩu</label>
                        <input type="password" className="form-control bg-light" required
                            placeholder="******"
                            onChange={(e) => setCredentials({...credentials, password: e.target.value})} />
                    </div>
                    <button className="btn btn-danger w-100 py-2 fw-bold" type="submit">ĐĂNG NHẬP ADMIN</button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
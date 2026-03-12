import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { useAuth } from '../../contexts/AuthContext';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaUserPlus } from 'react-icons/fa';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/users', formData);
            
            if (res.status === 201 || res.status === 200) {
                const newUser = res.data;
                // Logic tự động đăng nhập
                localStorage.setItem('user', JSON.stringify(newUser));
                if (newUser.token) localStorage.setItem('token', newUser.token);
                if (typeof login === 'function') login(newUser);

                alert('Đăng ký thành công! Chào mừng bạn.');
                navigate('/');
            }
        } catch (error) {
            console.error("Lỗi đăng ký:", error);
            // Hiển thị thông báo lỗi cụ thể từ backend nếu có
            const errorMsg = error.response?.data && typeof error.response.data === 'string' 
                ? error.response.data 
                : (error.response?.data?.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.');
            alert(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // Style chung cho các ô input để đồng bộ và đẹp mắt
    const inputGroupStyle = "input-group border rounded-pill overflow-hidden bg-white shadow-sm";
    const iconStyle = "input-group-text bg-transparent border-0 text-secondary ps-3 pe-2";
    const inputFieldStyle = "form-control bg-transparent border-0 shadow-none ps-1 py-2";

    return (
        <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#eaeff2' }}>
            <div className="card shadow-lg border-0" style={{ width: '450px', borderRadius: '24px' }}>
                <div className="card-body p-5">
                    {/* Header */}
                    <div className="text-center mb-5">
                        <div className="bg-success bg-gradient text-white d-inline-flex align-items-center justify-content-center p-3 rounded-circle mb-3 shadow">
                            <FaUserPlus size={28} />
                        </div>
                        <h2 className="fw-bold text-dark mb-2">Tham Gia Ngay</h2>
                        <p className="text-muted small mb-0">Tài khoản của bạn sẽ sẵn sàng sau vài giây</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Họ và Tên */}
                        <div className="mb-3">
                            <label className="form-label fw-semibold small ps-2 text-secondary">Họ và Tên</label>
                            <div className={inputGroupStyle}>
                                <span className={iconStyle}><FaUser size={16} /></span>
                                <input type="text" className={inputFieldStyle} placeholder="Ví dụ: Tạ Văn Hoài Sung" required
                                    onChange={(e) => setFormData({...formData, name: e.target.value})} />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="mb-3">
                            <label className="form-label fw-semibold small ps-2 text-secondary">Địa chỉ Email</label>
                            <div className={inputGroupStyle}>
                                <span className={iconStyle}><FaEnvelope size={16} /></span>
                                <input type="email" className={inputFieldStyle} placeholder="email@example.com" required
                                    onChange={(e) => setFormData({...formData, email: e.target.value})} />
                            </div>
                        </div>

                        {/* Số điện thoại - ĐÃ SỬA LỖI PLACEHOLDER */}
                        <div className="mb-3">
                            <label className="form-label fw-semibold small ps-2 text-secondary">Số điện thoại</label>
                            <div className={inputGroupStyle}>
                                <span className={iconStyle}><FaPhone size={16} /></span>
                                <input type="tel" className={inputFieldStyle} placeholder="0912345xxx" required pattern="[0-9]{10,11}" title="Vui lòng nhập 10-11 số điện thoại"
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                            </div>
                        </div>

                        {/* Mật khẩu */}
                        <div className="mb-4">
                            <label className="form-label fw-semibold small ps-2 text-secondary">Mật khẩu</label>
                            <div className={inputGroupStyle}>
                                <span className={iconStyle}><FaLock size={16} /></span>
                                <input type="password" className={inputFieldStyle} placeholder="••••••••" required minLength={6}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})} />
                            </div>
                        </div>

                        {/* Nút Đăng ký */}
                        <button className="btn btn-dark bg-gradient w-100 py-3 rounded-pill fw-bold shadow mb-4" type="submit" disabled={loading}>
                            {loading ? <span><span className="spinner-border spinner-border-sm me-2"></span>Đang xử lý...</span> : 'ĐĂNG KÝ & ĐĂNG NHẬP'}
                        </button>

                        {/* Footer */}
                        <div className="text-center border-top pt-4">
                            <p className="text-muted mb-2 small">Bạn đã có tài khoản?</p>
                            <Link to="/login" className="btn btn-outline-secondary text-dark fw-bold rounded-pill px-4 small">
                                Quay lại đăng nhập
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/axiosConfig';
import { Camera, User, Phone, Mail, Shield, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, updateUserInfo } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', imgUrl: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({ 
        name: user.name || '', 
        phone: user.phone || '', 
        email: user.email || '',
        imgUrl: user.imgUrl || ''
      });
    }
  }, [user]);

  const getAvatar = (imgUrl) => {
    if (!imgUrl) return `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=fff&color=000&bold=true&size=200`;
    if (imgUrl.startsWith('http') || imgUrl.startsWith('data:')) return imgUrl;
    return `http://localhost:8081${imgUrl.startsWith('/') ? '' : '/'}${imgUrl}`;
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      
      try {
        const res = await api.post('/api/upload/avatar', uploadFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setFormData({ ...formData, imgUrl: res.data });
      } catch (err) {
        alert("Lỗi upload avatar: " + (err.response?.data || err.message));
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // URL chuẩn: /users/{id}
      const res = await api.put(`/users/${user.id}`, formData);
      if (res.status === 200) {
        updateUserInfo(res.data);
        alert("💎 Tuyệt vời! Hồ sơ của bạn đã được nâng cấp.");
      }
    } catch (error) {
      alert("Lỗi: " + (error.response?.data?.message || "Không thể cập nhật hồ sơ"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page py-5 bg-white min-vh-100" style={{ fontFamily: '"Inter", sans-serif' }}>
      <div className="container">
        {/* Back Link */}
        <button onClick={() => navigate(-1)} className="btn btn-link text-dark text-decoration-none fw-bold mb-4 d-flex align-items-center gap-2 p-0">
            <ArrowLeft size={20} /> QUAY LẠI
        </button>

        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-8">
            <div className="luxury-card border-0 shadow-lg p-0 overflow-hidden" style={{ borderRadius: '30px' }}>
              <div className="row g-0">
                
                {/* Left Side: Avatar & Summary */}
                <div className="col-md-5 bg-dark text-white p-5 d-flex flex-column align-items-center text-center justify-content-center">
                    <div className="avatar-upload mb-4">
                        <img 
                            src={getAvatar(formData.imgUrl)} 
                            className="avatar-preview"
                            alt="Profile"
                        />
                        <label htmlFor="avatar-input" className="avatar-edit-btn">
                            <Camera size={16} />
                        </label>
                        <input id="avatar-input" type="file" hidden accept="image/*" onChange={handleImageChange} />
                    </div>
                    <h3 className="fw-black text-uppercase tracking-tighter mb-1">{formData.name || 'THÀNH VIÊN'}</h3>
                    <p className="text-white-50 small mb-4">{user?.roles?.some(r => r.authority === 'ROLE_ADMIN' || r.name === 'ROLE_ADMIN') ? 'MASTER ADMIN' : 'PREMIUM MEMBER'}</p>
                    
                    <div className="w-100 mt-2 p-3 bg-white bg-opacity-10 rounded-4 text-start">
                        <div className="small fw-bold text-white-50 mb-1">MÃ TÀI KHOẢN</div>
                        <div className="fw-black">#USER-{user?.id}</div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="col-md-7 p-5 bg-white">
                    <div className="d-flex align-items-center gap-2 mb-4">
                        <div className="bg-dark" style={{ width: '30px', height: '2px' }}></div>
                        <h5 className="fw-black text-dark text-uppercase m-0 tracking-widest">THÔNG TIN CHI TIẾT</h5>
                    </div>

                    <form onSubmit={handleUpdate} className="row g-4">
                        <div className="col-12">
                            <label className="fw-bold small text-muted mb-2 text-uppercase d-flex align-items-center gap-2">
                                <User size={14} /> Họ và tên của bạn
                            </label>
                            <input type="text" className="luxury-input w-100" placeholder="VD: NGUYỄN VĂN A" 
                                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                        </div>

                        <div className="col-md-6">
                            <label className="fw-bold small text-muted mb-2 text-uppercase d-flex align-items-center gap-2">
                                <Phone size={14} /> Số điện thoại
                            </label>
                            <input type="text" className="luxury-input w-100" placeholder="VD: 0901234567" 
                                value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                        </div>

                        <div className="col-md-6">
                            <label className="fw-bold small text-muted mb-2 text-uppercase d-flex align-items-center gap-2">
                                <Shield size={14} /> Vai trò hiện tại
                            </label>
                            <input type="text" className="luxury-input w-100 bg-light" value={user?.roles?.some(r => r.authority === 'ROLE_ADMIN' || r.name === 'ROLE_ADMIN') ? 'Quản trị viên' : 'Thành viên'} disabled />
                        </div>

                        <div className="col-12">
                            <label className="fw-bold small text-muted mb-2 text-uppercase d-flex align-items-center gap-2">
                                <Mail size={14} /> Địa chỉ Email
                            </label>
                            <input type="email" className="luxury-input w-100 bg-light text-muted" value={formData.email} disabled />
                            <p className="small text-muted mt-2 mb-0 italic">* Email đã xác thực và không thể thay đổi.</p>
                        </div>

                        <div className="col-12 pt-3">
                            <button type="submit" className="luxury-button w-100 py-3 d-flex align-items-center justify-content-center gap-2" disabled={loading}>
                                {loading ? (
                                    <div className="spinner-border spinner-border-sm" role="status"></div>
                                ) : (
                                    <><Save size={20} /> LƯU THÔNG TIN THAY ĐỔI</>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
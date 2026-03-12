import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/axiosConfig';

const Profile = () => {
  const { user, updateUserInfo } = useAuth();
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });

  // Load dữ liệu cũ vào form khi mở trang
  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || '', phone: user.phone || '', email: user.email || '' });
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Gọi API cập nhật theo đúng URL: /api/users/{id}
      const res = await api.put(`/api/users/${user.id}`, formData);
      if (res.status === 200) {
        updateUserInfo(res.data); // Cập nhật lại Context để UI đổi tên ngay
        alert("Cập nhật thông tin thành công!");
      }
    } catch (error) {
      alert("Lỗi: " + (error.response?.data?.message || "Không thể cập nhật hồ sơ"));
    }
  };

  return (
    <div className="container mt-5">
      <div className="card mx-auto shadow-sm border-0" style={{maxWidth: '600px', borderRadius: '15px'}}>
        <div className="card-body p-4">
          <h4 className="fw-bold mb-4">Thông tin cá nhân</h4>
          <form onSubmit={handleUpdate}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label fw-bold">Họ và tên</label>
                <input type="text" className="form-control" value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Số điện thoại</label>
                <input type="text" className="form-control" value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              </div>
            </div>
            <div className="mb-4">
              <label className="form-label fw-bold">Email</label>
              <input type="email" className="form-control bg-light" value={formData.email} disabled />
              <small className="text-muted">Email là định danh tài khoản và không thể thay đổi.</small>
            </div>
            <button type="submit" className="btn btn-dark btn-lg px-5 shadow-sm fw-bold">CẬP NHẬT HỒ SƠ</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
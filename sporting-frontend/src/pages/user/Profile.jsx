import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/axiosConfig';
import { Camera, User, Phone, Mail, Shield, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';

const Profile = () => {
  const { user, updateUserInfo } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'addresses'
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', imgUrl: '' });
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [addressFormData, setAddressFormData] = useState({
    fullName: '', phone: '', province: '', district: '', ward: '', detail: '', isDefault: false
  });
  
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        imgUrl: user.imgUrl || ''
      });
      fetchAddresses();
    }
  }, [user]);

  const fetchAddresses = async () => {
    try {
      const res = await api.get(`/addresses/user/${user.id}`);
      setAddresses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

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
        const res = await api.post('/upload/avatar', uploadFormData, {
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
      const res = await api.put(`/users/${user.id}`, formData);
      if (res.status === 200) {
        updateUserInfo(res.data);
        alert("Tuyệt vời! Hồ sơ của bạn đã được cập nhật.");
      }
    } catch (error) {
      alert("Lỗi: " + (error.response?.data?.message || "Không thể cập nhật hồ sơ"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch('https://provinces.open-api.vn/api/?depth=1')
      .then(res => res.json())
      .then(data => setProvinces(data));
  }, []);

  const handleProvinceChange = (e) => {
    const code = e.target.value;
    const name = provinces.find(p => p.code == code)?.name || '';
    setAddressFormData({ ...addressFormData, province: name, district: '', ward: '' });
    fetch(`https://provinces.open-api.vn/api/p/${code}?depth=2`)
      .then(res => res.json())
      .then(data => setDistricts(data.districts));
  };

  const handleDistrictChange = (e) => {
    const code = e.target.value;
    const name = districts.find(d => d.code == code)?.name || '';
    setAddressFormData({ ...addressFormData, district: name, ward: '' });
    fetch(`https://provinces.open-api.vn/api/d/${code}?depth=2`)
      .then(res => res.json())
      .then(data => setWards(data.wards));
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/addresses/user/${user.id}`, addressFormData);
      setShowAddAddress(false);
      fetchAddresses();
      setAddressFormData({ fullName: '', phone: '', province: '', district: '', ward: '', detail: '', isDefault: false });
    } catch (err) {
      alert("Lỗi khi lưu địa chỉ");
    }
  };

  const handleDeleteAddress = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) {
      await api.delete(`/addresses/${id}`);
      fetchAddresses();
    }
  };

  const handleSetDefault = async (id) => {
    await api.put(`/addresses/${id}/set-default/user/${user.id}`);
    fetchAddresses();
  };

  return (
    <div className="profile-page py-5 bg-light min-vh-100" style={{ fontFamily: '"Inter", sans-serif' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-11">
            
            <div className="d-flex align-items-center justify-content-between mb-4">
                <button onClick={() => navigate(-1)} className="btn btn-link text-dark text-decoration-none fw-bold d-flex align-items-center gap-2 p-0">
                    <ArrowLeft size={20} /> QUAY LẠI
                </button>
                <div className="bg-white p-1 rounded-4 shadow-sm d-flex gap-1">
                    <button onClick={() => setActiveTab('profile')} className={`px-4 py-2 rounded-3 border-0 fw-bold transition-all ${activeTab === 'profile' ? 'bg-dark text-white' : 'bg-transparent text-muted'}`}>
                        HỒ SƠ CỦA TÔI
                    </button>
                    <button onClick={() => setActiveTab('addresses')} className={`px-4 py-2 rounded-3 border-0 fw-bold transition-all ${activeTab === 'addresses' ? 'bg-dark text-white' : 'bg-transparent text-muted'}`}>
                        SỔ ĐỊA CHỈ ({addresses.length})
                    </button>
                </div>
            </div>

            <div className="luxury-card border-0 shadow-lg p-0 overflow-hidden" style={{ borderRadius: '30px' }}>
              {activeTab === 'profile' ? (
                <div className="row g-0">
                    {/* Left Side: Avatar & Summary */}
                    <div className="col-md-5 bg-dark text-white p-5 d-flex flex-column align-items-center text-center justify-content-center">
                    <div className="avatar-upload mb-4">
                        <img src={getAvatar(formData.imgUrl)} className="avatar-preview" alt="Profile" />
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
                    <div className="col-md-7 p-5 bg-white text-start">
                    <div className="d-flex align-items-center gap-2 mb-4">
                        <div className="bg-dark" style={{ width: '30px', height: '2px' }}></div>
                        <h5 className="fw-black text-dark text-uppercase m-0 tracking-widest">THÔNG TIN CHI TIẾT</h5>
                    </div>

                    <form onSubmit={handleUpdate} className="row g-4">
                        <div className="col-12">
                        <label className="fw-bold small text-muted mb-2 text-uppercase d-flex align-items-center gap-2"><User size={14} /> Họ và tên</label>
                        <input type="text" className="luxury-input w-100" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                        </div>
                        <div className="col-md-6">
                        <label className="fw-bold small text-muted mb-2 text-uppercase d-flex align-items-center gap-2"><Phone size={14} /> Số điện thoại</label>
                        <input type="text" className="luxury-input w-100" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                        </div>
                        <div className="col-md-6">
                        <label className="fw-bold small text-muted mb-2 text-uppercase d-flex align-items-center gap-2"><Shield size={14} /> Vai trò</label>
                        <input type="text" className="luxury-input w-100 bg-light" value={user?.roles?.some(r => r.authority === 'ROLE_ADMIN' || r.name === 'ROLE_ADMIN') ? 'Quản trị viên' : 'Thành viên'} disabled />
                        </div>
                        <div className="col-12">
                        <label className="fw-bold small text-muted mb-2 text-uppercase d-flex align-items-center gap-2"><Mail size={14} /> Email</label>
                        <input type="email" className="luxury-input w-100 bg-light text-muted" value={formData.email} disabled />
                        </div>
                        <div className="col-12 pt-3">
                        <button type="submit" className="luxury-button w-100 py-3" disabled={loading}>
                            {loading ? <div className="spinner-border spinner-border-sm" /> : "LƯU THAY ĐỔI"}
                        </button>
                        </div>
                    </form>
                    </div>
                </div>
              ) : (
                <div className="p-5 bg-white text-start">
                    <div className="d-flex align-items-center justify-content-between mb-5">
                        <div className="d-flex align-items-center gap-2">
                            <div className="bg-dark" style={{ width: '30px', height: '2px' }}></div>
                            <h5 className="fw-black text-dark text-uppercase m-0 tracking-widest">SỔ ĐỊA CHỈ GIAO HÀNG</h5>
                        </div>
                        <button onClick={() => setShowAddAddress(!showAddAddress)} className="luxury-button" style={{padding: '0.6rem 1.5rem'}}>
                            {showAddAddress ? "HỦY BỎ" : "+ THÊM ĐỊA CHỈ MỚI"}
                        </button>
                    </div>

                    {showAddAddress && (
                        <div className="mb-5 p-4 bg-light rounded-4 border animate__animated animate__fadeIn">
                            <form onSubmit={handleAddAddress} className="row g-3">
                                <div className="col-md-6">
                                    <label className="fw-bold small text-muted text-uppercase mb-2">Họ tên người nhận</label>
                                    <input type="text" className="luxury-input w-100" required value={addressFormData.fullName} 
                                        onChange={e => setAddressFormData({...addressFormData, fullName: e.target.value})} />
                                </div>
                                <div className="col-md-6">
                                    <label className="fw-bold small text-muted text-uppercase mb-2">Số điện thoại</label>
                                    <input type="text" className="luxury-input w-100" required value={addressFormData.phone}
                                        onChange={e => setAddressFormData({...addressFormData, phone: e.target.value})} />
                                </div>
                                <div className="col-md-4">
                                    <label className="fw-bold small text-muted text-uppercase mb-2">Tỉnh / Thành</label>
                                    <select className="luxury-input w-100" required onChange={handleProvinceChange}>
                                        <option value="">Chọn...</option>
                                        {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <label className="fw-bold small text-muted text-uppercase mb-2">Quận / Huyện</label>
                                    <select className="luxury-input w-100" required onChange={handleDistrictChange} disabled={!addressFormData.province}>
                                        <option value="">Chọn...</option>
                                        {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <label className="fw-bold small text-muted text-uppercase mb-2">Phường / Xã</label>
                                    <select className="luxury-input w-100" required onChange={e => setAddressFormData({...addressFormData, ward: wards.find(w => w.code == e.target.value)?.name})} disabled={!addressFormData.district}>
                                        <option value="">Chọn...</option>
                                        {wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
                                    </select>
                                </div>
                                <div className="col-12">
                                    <label className="fw-bold small text-muted text-uppercase mb-2">Địa chỉ cụ thể</label>
                                    <input type="text" className="luxury-input w-100" required value={addressFormData.detail}
                                        onChange={e => setAddressFormData({...addressFormData, detail: e.target.value})} />
                                </div>
                                <div className="col-12">
                                    <div className="form-check form-switch">
                                        <input className="form-check-input" type="checkbox" id="isDefault" checked={addressFormData.isDefault}
                                            onChange={e => setAddressFormData({...addressFormData, isDefault: e.target.checked})} />
                                        <label className="form-check-label fw-bold small" htmlFor="isDefault">Đặt làm địa chỉ mặc định</label>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <button type="submit" className="luxury-button w-100 py-3">LƯU ĐỊA CHỈ</button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="row g-4">
                        {addresses.map(addr => (
                            <div key={addr.id} className="col-12">
                                <div className={`p-4 border-2 rounded-4 d-flex justify-content-between align-items-center transition-all ${addr.isDefault ? 'border-dark bg-light' : 'border-light'}`}>
                                    <div className="d-flex align-items-start gap-3">
                                        <div className={`mt-1 p-2 rounded-circle ${addr.isDefault ? 'bg-dark text-white' : 'bg-light text-muted'}`}>
                                            <FaMapMarkerAlt size={18} />
                                        </div>
                                        <div>
                                            <div className="d-flex align-items-center gap-2 mb-1">
                                                <span className="fw-black text-uppercase">{addr.fullName}</span>
                                                <span className="text-muted">|</span>
                                                <span className="text-muted fw-bold">{addr.phone}</span>
                                                {addr.isDefault && <span className="badge bg-dark text-white px-3 ms-2">MẶC ĐỊNH</span>}
                                            </div>
                                            <p className="text-muted mb-0">{addr.detail}</p>
                                            <p className="text-muted mb-0 small">{addr.ward}, {addr.district}, {addr.province}</p>
                                        </div>
                                    </div>
                                    <div className="d-flex gap-2">
                                        {!addr.isDefault && (
                                            <button onClick={() => handleSetDefault(addr.id)} className="btn btn-sm btn-outline-dark fw-bold px-3">THIẾT LẬP MẶC ĐỊNH</button>
                                        )}
                                        <button onClick={() => handleDeleteAddress(addr.id)} className="btn btn-sm btn-outline-danger fw-bold px-3">XÓA</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
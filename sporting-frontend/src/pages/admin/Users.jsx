import React, { useEffect, useState } from 'react';
import userApi from '../../api/userApi';
import api from '../../api/axiosConfig';
import { 
    FaUserPlus, FaUserEdit, FaUserShield, FaTrash, FaTimes, 
    FaSave, FaSearch, FaEnvelope, FaPhoneAlt, FaUserCircle 
} from 'react-icons/fa';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [formData, setFormData] = useState({ 
        id: null, 
        name: '', 
        email: '', 
        phone: '', 
        password: '',
        roleName: 'ROLE_CLIENT',
        imgUrl: ''
    });

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const uploadFormData = new FormData();
            uploadFormData.append('file', file);
            
            try {
                const res = await api.post('/api/upload/avatar', uploadFormData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setFormData({ ...formData, imgUrl: res.data }); // URL từ server
            } catch (err) {
                alert("Lỗi upload avatar: " + (err.response?.data || err.message));
            }
        }
    };

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await userApi.getAll();
            setUsers(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Lỗi tải users:", error);
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleAddNew = () => {
        setFormData({ id: null, name: '', email: '', phone: '', password: '', roleName: 'ROLE_CLIENT', imgUrl: '' });
        setIsEdit(false);
        setShowModal(true);
    };

    const handleEdit = (user) => {
        const currentRole = user.roles && user.roles.length > 0 ? (user.roles[0].name || user.roles[0].authority) : 'ROLE_CLIENT';
        setFormData({ 
            id: user.id, 
            name: user.name, 
            email: user.email, 
            phone: user.phone || '', 
            password: '',
            roleName: currentRole,
            imgUrl: user.imgUrl || ''
        });
        setIsEdit(true);
        setShowModal(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await userApi.update(formData.id, formData);
                alert("Đã cập nhật tài khoản!");
            } else {
                await userApi.create(formData);
                alert("Đã tạo tài khoản mới!");
            }
            setShowModal(false);
            fetchUsers();
        } catch (error) {
            alert("Lỗi: " + (error.response?.data?.message || error.message));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) {
            try {
                await userApi.delete(id);
                fetchUsers();
            } catch (error) { alert("Không thể xóa tài khoản quản trị chính!"); }
        }
    };

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getAvatar = (user) => {
        if (!user.imgUrl) return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4e73df&color=fff&bold=true`;
        if (user.imgUrl.startsWith('http') || user.imgUrl.startsWith('data:')) return user.imgUrl;
        return `http://localhost:8081${user.imgUrl.startsWith('/') ? '' : '/'}${user.imgUrl}`;
    };

    return (
        <div className="container-fluid">
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Quản lý Người dùng</h1>
                <div className="d-flex gap-2">
                    <div className="input-group" style={{ width: '250px' }}>
                        <input type="text" className="form-control form-control-sm" placeholder="Tìm tên hoặc email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        <span className="input-group-text bg-white border-start-0"><FaSearch size={12} className="text-muted"/></span>
                    </div>
                    <button className="btn btn-primary btn-sm shadow-sm" onClick={handleAddNew}>
                        <FaUserPlus className="me-2" /> Thêm tài khoản
                    </button>
                </div>
            </div>

            <div className="card shadow mb-4">
                <div className="card-header py-3 bg-white">
                    <h6 className="m-0 font-weight-bold text-primary">Danh sách tài khoản hệ thống</h6>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0 align-middle">
                            <thead>
                                <tr>
                                    <th className="px-4">Người dùng</th>
                                    <th>Email</th>
                                    <th>Số điện thoại</th>
                                    <th>Vai trò</th>
                                    <th className="text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" className="text-center py-5"><div className="spinner-border text-primary"></div></td></tr>
                                ) : filteredUsers.length > 0 ? filteredUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td className="px-4">
                                            <div className="d-flex align-items-center">
                                                <img 
                                                    src={getAvatar(user)} 
                                                    className="rounded-circle me-3 border" 
                                                    width="40" height="40" alt="avatar" 
                                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/40'; }}
                                                />
                                                <div>
                                                    <div className="font-weight-bold text-dark">{user.name}</div>
                                                    <div className="small text-muted">ID: #{user.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{user.email}</td>
                                        <td>{user.phone || '---'}</td>
                                        <td>
                                            {user.roles && user.roles.some(r => (r.name || r.authority).includes('ADMIN')) ? (
                                                <span className="badge bg-danger text-uppercase" style={{ fontSize: '10px' }}>
                                                    <FaUserShield className="me-1" /> Admin
                                                </span>
                                            ) : (
                                                <span className="badge bg-secondary text-uppercase" style={{ fontSize: '10px' }}>
                                                    Khách hàng
                                                </span>
                                            )}
                                        </td>
                                        <td className="text-center">
                                            <div className="btn-group shadow-sm">
                                                <button className="btn btn-white btn-sm text-primary border" onClick={() => handleEdit(user)}><FaUserEdit /></button>
                                                <button className="btn btn-white btn-sm text-danger border" onClick={() => handleDelete(user.id)}><FaTrash /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="5" className="text-center py-4 text-muted">Không tìm thấy tài khoản nào.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Tài khoản */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content shadow border-0">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title font-weight-bold">
                                    {isEdit ? 'Chỉnh sửa tài khoản' : 'Tạo tài khoản mới'}
                                </h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleSave}>
                                <div className="modal-body p-4">
                                    <div className="text-center mb-4">
                                        <div className="avatar-upload" style={{ width: '120px', height: '120px' }}>
                                            <img 
                                                src={getAvatar(formData)} 
                                                className="avatar-preview"
                                                alt="User Preview"
                                            />
                                            <label htmlFor="user-avatar-input" className="avatar-edit-btn">
                                                <FaUserCircle size={16} />
                                            </label>
                                            <input id="user-avatar-input" type="file" hidden accept="image/*" onChange={handleImageChange} />
                                        </div>
                                        <p className="small text-muted mt-2">Tải lên ảnh đại diện</p>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small font-weight-bold">Họ và Tên</label>
                                        <input type="text" className="form-control" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label small font-weight-bold">Email</label>
                                            <input type="email" className="form-control" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label small font-weight-bold">Số điện thoại</label>
                                            <input type="text" className="form-control" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small font-weight-bold">Vai trò hệ thống</label>
                                        <select className="form-select" value={formData.roleName} onChange={e => setFormData({...formData, roleName: e.target.value})}>
                                            <option value="ROLE_CLIENT">Khách hàng</option>
                                            <option value="ROLE_ADMIN">Quản trị viên</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small font-weight-bold">
                                            {isEdit ? 'Mật khẩu mới (Để trống nếu không đổi)' : 'Mật khẩu khởi tạo'}
                                        </label>
                                        <input type="password" className="form-control" required={!isEdit} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                                    </div>
                                </div>
                                <div className="modal-footer bg-light">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Hủy bỏ</button>
                                    <button type="submit" className="btn btn-primary px-4">Lưu thay đổi</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
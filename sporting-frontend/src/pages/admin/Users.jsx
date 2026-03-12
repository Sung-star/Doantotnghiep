import React, { useEffect, useState } from 'react';
import userApi from '../../api/userApi';

const AdminUsers = () => {
    // --- KHAI BÁO STATE ---
    const [users, setUsers] = useState([]);           // Chứa danh sách user
    const [loading, setLoading] = useState(true);     // Trạng thái load
    const [showModal, setShowModal] = useState(false);// Ẩn/Hiện Popup
    const [isEdit, setIsEdit] = useState(false);      // Đang thêm hay đang sửa?
    
    // Dữ liệu form
    const [formData, setFormData] = useState({ 
        id: null, 
        name: '', 
        email: '', 
        phone: '', 
        password: '',
        roleName: 'ROLE_CLIENT' // Mặc định là khách hàng
    });

    // --- 1. GỌI DỮ LIỆU TỪ SERVER (READ) ---
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await userApi.getAll();
            setUsers(response.data); // Giả sử API trả về List<User>
            setLoading(false);
        } catch (error) {
            console.error("Lỗi tải danh sách users:", error);
            setLoading(false);
        }
    };

    // --- 2. XỬ LÝ FORM (CREATE / UPDATE) ---
    const handleAddNew = () => {
        setFormData({ id: null, name: '', email: '', phone: '', password: '', roleName: 'ROLE_CLIENT' });
        setIsEdit(false);
        setShowModal(true);
    };

    const handleEdit = (user) => {
        // Lấy role đầu tiên để hiển thị (đơn giản hóa)
        const currentRole = user.roles && user.roles.length > 0 ? user.roles[0].name : 'ROLE_CLIENT';
        
        setFormData({ 
            id: user.id, 
            name: user.name, 
            email: user.email, 
            phone: user.phone || '', 
            password: '', // Không hiển thị mật khẩu cũ
            roleName: currentRole
        });
        setIsEdit(true);
        setShowModal(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await userApi.update(formData.id, formData);
                alert("✅ Cập nhật thành công!");
            } else {
                await userApi.create(formData);
                alert("✅ Thêm mới thành công!");
            }
            setShowModal(false); // Đóng modal
            fetchUsers();        // Load lại bảng
        } catch (error) {
            alert("❌ Có lỗi xảy ra: " + (error.response?.data?.message || error.message));
        }
    };

    // --- 3. XỬ LÝ XÓA (DELETE) ---
    const handleDelete = async (id) => {
        if (window.confirm("⚠️ Bạn có chắc chắn muốn xóa người dùng này không?")) {
            try {
                await userApi.delete(id);
                fetchUsers();
            } catch (error) {
                alert("❌ Không thể xóa người dùng này.");
            }
        }
    };

    // --- RENDER GIAO DIỆN ---
    if (loading) return <div className="p-4 text-center">⏳ Đang tải dữ liệu...</div>;

    return (
        <div className="container-fluid mt-4">
            {/* Header & Nút Thêm */}
            <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-white rounded shadow-sm">
                <h4 className="mb-0 text-primary fw-bold">👥 Quản Lý Người Dùng</h4>
                <button className="btn btn-success" onClick={handleAddNew}>
                    <i className="bi bi-plus-lg me-2"></i>+ Thêm Mới
                </button>
            </div>

            {/* Bảng Dữ Liệu */}
            <div className="card shadow-sm border-0">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light text-secondary">
                                <tr>
                                    <th className="ps-4">ID</th>
                                    <th>Họ Tên</th>
                                    <th>Email / SĐT</th>
                                    <th>Vai Trò</th>
                                    <th className="text-end pe-4">Hành Động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td className="ps-4 fw-bold">#{user.id}</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <img 
                                                    src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} 
                                                    className="rounded-circle me-3" 
                                                    width="35" alt="avt" 
                                                />
                                                <span className="fw-bold text-dark">{user.name}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="small">{user.email}</div>
                                            <div className="text-muted small">{user.phone}</div>
                                        </td>
                                       {/* Thay đoạn hiển thị Badge cũ bằng đoạn này */}
<td>
    {user.roles && user.roles.some(r => 
        (r.name === 'ROLE_ADMIN') || 
        (r.authority === 'ROLE_ADMIN') || 
        (r.name === 'ADMIN') // Phòng hờ trường hợp lưu thiếu chữ ROLE_
    ) ? (
        <span className="badge bg-danger">QUẢN TRỊ VIÊN</span>
    ) : (
        <span className="badge bg-info text-dark">KHÁCH HÀNG</span>
    )}
    
    {/* Dòng này để Debug: In thẳng role ra màn hình xem nó là gì */}
    <div style={{fontSize: '10px', color: '#888'}}>
        {user.roles && user.roles.map(r => r.name || r.authority).join(', ')}
    </div>
</td>
                                        <td className="text-end pe-4">
                                            <button 
                                                className="btn btn-sm btn-outline-primary me-2"
                                                onClick={() => handleEdit(user)}
                                            >
                                                Sửa
                                            </button>
                                            <button 
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleDelete(user.id)}
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr><td colSpan="5" className="text-center py-4">Chưa có người dùng nào.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* --- MODAL (POPUP) THÊM/SỬA --- */}
            {showModal && (
                <>
                    <div className="modal-backdrop fade show"></div>
                    <div className="modal fade show d-block" tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header bg-primary text-white">
                                    <h5 className="modal-title">
                                        {isEdit ? '✏️ Cập Nhật Thông Tin' : '➕ Thêm Người Dùng Mới'}
                                    </h5>
                                    <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                                </div>
                                <form onSubmit={handleSave}>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label className="form-label">Họ và Tên</label>
                                            <input type="text" className="form-control" required
                                                value={formData.name}
                                                onChange={e => setFormData({...formData, name: e.target.value})}
                                            />
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Email</label>
                                                <input type="email" className="form-control" required
                                                    value={formData.email}
                                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Số Điện Thoại</label>
                                                <input type="text" className="form-control"
                                                    value={formData.phone}
                                                    onChange={e => setFormData({...formData, phone: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="mb-3">
                                            <label className="form-label">Vai Trò</label>
                                            <select className="form-select" 
                                                value={formData.roleName}
                                                onChange={e => setFormData({...formData, roleName: e.target.value})}
                                            >
                                                <option value="ROLE_CLIENT">Khách Hàng (Client)</option>
                                                <option value="ROLE_ADMIN">Quản Trị Viên (Admin)</option>
                                            </select>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">
                                                {isEdit ? 'Mật Khẩu Mới (Bỏ trống nếu không đổi)' : 'Mật Khẩu'}
                                            </label>
                                            <input type="password" className="form-control" 
                                                required={!isEdit}
                                                value={formData.password}
                                                onChange={e => setFormData({...formData, password: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Đóng</button>
                                        <button type="submit" className="btn btn-primary">
                                            {isEdit ? 'Lưu Thay Đổi' : 'Tạo Mới'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminUsers;
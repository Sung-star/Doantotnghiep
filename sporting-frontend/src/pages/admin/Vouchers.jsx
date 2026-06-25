import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import { FaTrash, FaEdit, FaPlus, FaTicketAlt, FaCheck, FaTimes } from 'react-icons/fa';

const AdminVouchers = () => {
    const [vouchers, setVouchers] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingVoucher, setEditingVoucher] = useState(null);
    const [formData, setFormData] = useState({
        code: '',
        description: '',
        discountPercent: 0,
        maxDiscountAmount: 0,
        minOrderAmount: 0,
        expiryDate: '',
        active: true,
        startDate: '',
        usageLimit: '',
        assignedToAll: true,
        assignedUserIds: []
    });

    const fetchVouchers = async () => {
        setLoading(true);
        try {
            const res = await api.get('/vouchers');
            setVouchers(res.data);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users');
            setUsers(res.data || []);
        } catch (err) {
            console.error('Không lấy được danh sách người dùng', err);
        }
    };

    useEffect(() => { fetchVouchers(); fetchUsers(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSubmit = { 
                ...formData, 
                expiryDate: new Date(formData.expiryDate).toISOString(),
                startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
                usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
                assignedUserIds: formData.assignedToAll ? [] : formData.assignedUserIds
            };
            if (editingVoucher) {
                await api.put(`/vouchers/${editingVoucher.id}`, dataToSubmit);
            } else {
                await api.post('/vouchers', dataToSubmit);
            }
            setShowModal(false);
            fetchVouchers();
            setEditingVoucher(null);
            setFormData({ code: '', description: '', discountPercent: 0, maxDiscountAmount: 0, minOrderAmount: 0, expiryDate: '', active: true, startDate: '', usageLimit: '', assignedToAll: true, assignedUserIds: [] });
        } catch (err) {
            alert("Lỗi khi lưu voucher!");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Xóa mã giảm giá này?")) {
            await api.delete(`/vouchers/${id}`);
            fetchVouchers();
        }
    };

    const openEdit = (v) => {
        setEditingVoucher(v);
        setFormData({
            code: v.code,
            description: v.description,
            discountPercent: v.discountPercent,
            maxDiscountAmount: v.maxDiscountAmount,
            minOrderAmount: v.minOrderAmount,
            expiryDate: v.expiryDate ? new Date(v.expiryDate).toISOString().slice(0, 16) : '',
            active: v.active,
            startDate: v.startDate ? new Date(v.startDate).toISOString().slice(0, 16) : '',
            usageLimit: v.usageLimit ?? '',
            assignedToAll: v.assignedToAll ?? true,
            assignedUserIds: Array.isArray(v.assignedUsers) ? v.assignedUsers.map(u => u.id) : []
        });
        setShowModal(true);
    };

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h3 mb-0 text-gray-800">Quản lý Mã giảm giá</h1>
                <button className="btn btn-primary" onClick={() => { setEditingVoucher(null); setShowModal(true); }}>
                    <FaPlus className="me-2"/> Thêm Mã Mới
                </button>
            </div>

            <div className="card shadow mb-4">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="px-4">Mã CODE</th>
                                    <th>Mô tả</th>
                                    <th>Giảm (%)</th>
                                    <th>Giảm tối đa</th>
                                    <th>Đơn tối thiểu</th>
                                    <th>Hết hạn</th>
                                    <th>Loại</th>
                                    <th>Trạng thái</th>
                                    <th className="text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vouchers.map(v => (
                                    <tr key={v.id}>
                                        <td className="px-4 fw-bold text-primary">{v.code}</td>
                                        <td>{v.description}</td>
                                        <td className="fw-bold text-success">{v.discountPercent}%</td>
                                        <td>{v.maxDiscountAmount?.toLocaleString()}đ</td>
                                        <td>{v.minOrderAmount?.toLocaleString()}đ</td>
                                        <td>{new Date(v.expiryDate).toLocaleDateString('vi-VN')}</td>
                                        <td>
                                            {v.assignedToAll ? (
                                                <span className="badge bg-info text-dark">Phát cho tất cả</span>
                                            ) : (
                                                <span className="badge bg-warning text-dark">Gán riêng ({v.assignedUsers?.length || 0})</span>
                                            )}
                                        </td>
                                        <td>
                                            {v.active ? <span className="badge bg-success">Đang chạy</span> : <span className="badge bg-secondary">Tắt</span>}
                                        </td>
                                        <td className="text-center">
                                            <button className="btn btn-sm btn-outline-info me-2" onClick={() => openEdit(v)}><FaEdit/></button>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(v.id)}><FaTrash/></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Form */}
            {showModal && (
                <div className="modal show d-block" style={{background: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg" style={{borderRadius: '20px'}}>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-header bg-dark text-white" style={{borderRadius: '20px 20px 0 0'}}>
                                    <h5 className="modal-title fw-bold"><FaTicketAlt className="me-2"/> {editingVoucher ? 'Cập nhật Voucher' : 'Thêm Voucher Mới'}</h5>
                                    <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                                </div>
                                <div className="modal-body p-4">
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="fw-bold small text-muted text-uppercase mb-1">Mã Code (In hoa)</label>
                                            <input type="text" className="form-control" required value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="fw-bold small text-muted text-uppercase mb-1">Phần trăm giảm (%)</label>
                                            <input type="number" className="form-control" required value={formData.discountPercent} onChange={e => setFormData({...formData, discountPercent: e.target.value})} />
                                        </div>
                                        <div className="col-12">
                                            <label className="fw-bold small text-muted text-uppercase mb-1">Mô tả</label>
                                            <input type="text" className="form-control" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="fw-bold small text-muted text-uppercase mb-1">Giảm tối đa (đ)</label>
                                            <input type="number" className="form-control" required value={formData.maxDiscountAmount} onChange={e => setFormData({...formData, maxDiscountAmount: e.target.value})} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="fw-bold small text-muted text-uppercase mb-1">Đơn tối thiểu (đ)</label>
                                            <input type="number" className="form-control" required value={formData.minOrderAmount} onChange={e => setFormData({...formData, minOrderAmount: e.target.value})} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="fw-bold small text-muted text-uppercase mb-1">Ngày bắt đầu</label>
                                            <input type="datetime-local" className="form-control" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="fw-bold small text-muted text-uppercase mb-1">Ngày hết hạn</label>
                                            <input type="datetime-local" className="form-control" required value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="fw-bold small text-muted text-uppercase mb-1">Số lượt dùng tối đa</label>
                                            <input type="number" className="form-control" min="1" value={formData.usageLimit} onChange={e => setFormData({...formData, usageLimit: e.target.value})} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="fw-bold small text-muted text-uppercase mb-1">Trạng thái</label>
                                            <select className="form-select" value={formData.active} onChange={e => setFormData({...formData, active: e.target.value === 'true'})}>
                                                <option value="true">Hoạt động</option>
                                                <option value="false">Tạm dừng</option>
                                            </select>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-check form-switch mb-3">
                                                <input className="form-check-input" type="checkbox" id="assignedToAll" checked={formData.assignedToAll} onChange={e => setFormData({...formData, assignedToAll: e.target.checked})} />
                                                <label className="form-check-label fw-bold small" htmlFor="assignedToAll">Phát cho tất cả người dùng</label>
                                            </div>
                                        </div>
                                        {!formData.assignedToAll && (
                                            <div className="col-12">
                                                <label className="fw-bold small text-muted text-uppercase mb-1">Chọn người dùng nhận voucher</label>
                                                <select className="form-select" multiple value={formData.assignedUserIds} onChange={e => setFormData({...formData, assignedUserIds: Array.from(e.target.selectedOptions, option => Number(option.value))})}>
                                                    {users.map(user => (
                                                        <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                                                    ))}
                                                </select>
                                                <div className="form-text">Giữ Ctrl/Cmd để chọn nhiều người dùng.</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="modal-footer border-0 p-4 pt-0">
                                    <button type="button" className="btn btn-light px-4" onClick={() => setShowModal(false)}>Hủy</button>
                                    <button type="submit" className="btn btn-dark px-5">LƯU VOUCHER</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminVouchers;

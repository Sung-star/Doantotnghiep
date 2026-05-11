import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import { FaTrash, FaEdit, FaPlus, FaTicketAlt, FaCheck, FaTimes } from 'react-icons/fa';

const AdminVouchers = () => {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingVoucher, setEditingVoucher] = useState(null);
    const [formData, setFormData] = useState({
        code: '', description: '', discountPercent: 0, maxDiscountAmount: 0, minOrderAmount: 0, expiryDate: '', active: true
    });

    const fetchVouchers = async () => {
        setLoading(true);
        try {
            const res = await api.get('/vouchers');
            setVouchers(res.data);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    useEffect(() => { fetchVouchers(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSubmit = { 
                ...formData, 
                expiryDate: new Date(formData.expiryDate).toISOString() 
            };
            if (editingVoucher) {
                await api.put(`/vouchers/${editingVoucher.id}`, dataToSubmit);
            } else {
                await api.post('/vouchers', dataToSubmit);
            }
            setShowModal(false);
            fetchVouchers();
            setEditingVoucher(null);
            setFormData({ code: '', description: '', discountPercent: 0, maxDiscountAmount: 0, minOrderAmount: 0, expiryDate: '', active: true });
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
            active: v.active
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
                                            <label className="fw-bold small text-muted text-uppercase mb-1">Ngày hết hạn</label>
                                            <input type="datetime-local" className="form-control" required value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="fw-bold small text-muted text-uppercase mb-1">Trạng thái</label>
                                            <select className="form-select" value={formData.active} onChange={e => setFormData({...formData, active: e.target.value === 'true'})}>
                                                <option value="true">Hoạt động</option>
                                                <option value="false">Tạm dừng</option>
                                            </select>
                                        </div>
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

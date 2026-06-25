import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { FaHistory, FaEdit, FaStar, FaMedal } from 'react-icons/fa';

const AdminLoyalty = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [historyModal, setHistoryModal] = useState({ show: false, userId: null, history: [], loading: false, userName: '' });
    const [adjustModal, setAdjustModal] = useState({ show: false, userId: null, userName: '', delta: 0, reason: '' });

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/loyalty/users');
            setUsers(res.data);
        } catch (error) {
            console.error("Error fetching loyalty users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleViewHistory = async (userId, userName) => {
        setHistoryModal({ show: true, userId, history: [], loading: true, userName });
        try {
            const res = await api.get(`/admin/loyalty/history/${userId}`);
            setHistoryModal(prev => ({ ...prev, history: res.data, loading: false }));
        } catch (error) {
            console.error("Error fetching history:", error);
            setHistoryModal(prev => ({ ...prev, loading: false }));
        }
    };

    const handleAdjustPointsSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/loyalty/adjust', {
                userId: adjustModal.userId,
                delta: parseInt(adjustModal.delta),
                reason: adjustModal.reason
            });
            alert("Điều chỉnh điểm thành công!");
            setAdjustModal({ show: false, userId: null, userName: '', delta: 0, reason: '' });
            fetchUsers();
        } catch (error) {
            console.error("Error adjusting points:", error);
            alert("Lỗi điều chỉnh điểm: " + (error.response?.data?.error || "Unknown"));
        }
    };

    const getTierBadgeClass = (tier) => {
        switch (tier) {
            case 'PLATINUM': return 'bg-dark text-white';
            case 'GOLD': return 'bg-warning text-dark';
            case 'SILVER': return 'bg-secondary text-white';
            default: return 'bg-primary text-white';
        }
    };

    const getTierEmoji = (tier) => {
        switch (tier) {
            case 'PLATINUM': return '👑';
            case 'GOLD': return '🥇';
            case 'SILVER': return '🥈';
            default: return '🥉';
        }
    };

    return (
        <div className="container-fluid py-4">
            <h2 className="mb-4 d-flex align-items-center gap-2">
                <FaStar className="text-warning" /> Quản lý Điểm thưởng & Thành viên
            </h2>

            <div className="card shadow-sm border-0">
                <div className="card-body p-0">
                    {loading ? (
                        <div className="text-center p-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="text-center p-5 text-muted">Chưa có dữ liệu thành viên</div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>ID</th>
                                        <th>Khách hàng</th>
                                        <th>Hạng</th>
                                        <th>Điểm hiện có</th>
                                        <th>Tổng điểm tích lũy</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u.userId}>
                                            <td>#{u.userId}</td>
                                            <td>
                                                <div className="fw-bold">{u.name}</div>
                                                <div className="text-muted small">{u.email}</div>
                                            </td>
                                            <td>
                                                <span className={`badge px-3 py-2 rounded-pill ${getTierBadgeClass(u.tier)}`}>
                                                    {getTierEmoji(u.tier)} {u.tier}
                                                </span>
                                            </td>
                                            <td className="fw-bold text-success">{(u.availablePoints || 0).toLocaleString()}</td>
                                            <td>{(u.totalPoints || 0).toLocaleString()}</td>
                                            <td>
                                                <button className="btn btn-outline-primary btn-sm me-2" onClick={() => handleViewHistory(u.userId, u.name)}>
                                                    <FaHistory className="me-1" /> Lịch sử
                                                </button>
                                                <button className="btn btn-outline-warning btn-sm" onClick={() => setAdjustModal({ show: true, userId: u.userId, userName: u.name, delta: 0, reason: '' })}>
                                                    <FaEdit className="me-1" /> Điều chỉnh
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* History Modal */}
            {historyModal.show && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">📜 Lịch sử điểm — {historyModal.userName}</h5>
                                <button type="button" className="btn-close" onClick={() => setHistoryModal(prev => ({ ...prev, show: false }))}></button>
                            </div>
                            <div className="modal-body">
                                {historyModal.loading ? (
                                    <div className="text-center p-3">
                                        <div className="spinner-border text-primary" role="status"></div>
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-striped table-bordered table-sm align-middle">
                                            <thead>
                                                <tr>
                                                    <th>Ngày</th>
                                                    <th>Loại</th>
                                                    <th>Số điểm</th>
                                                    <th>Mô tả</th>
                                                    <th>Sau GD</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {historyModal.history.length === 0 ? (
                                                    <tr><td colSpan="5" className="text-center text-muted py-3">Chưa có giao dịch nào</td></tr>
                                                ) : (
                                                    historyModal.history.map(tx => (
                                                        <tr key={tx.id}>
                                                            <td>{new Date(tx.createdAt).toLocaleString('vi-VN')}</td>
                                                            <td>
                                                                <span className={`badge ${tx.pointsChanged > 0 ? 'bg-success' : 'bg-danger'}`}>
                                                                    {tx.transactionType}
                                                                </span>
                                                            </td>
                                                            <td className={tx.pointsChanged > 0 ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                                                                {tx.pointsChanged > 0 ? '+' : ''}{tx.pointsChanged}
                                                            </td>
                                                            <td>{tx.description}</td>
                                                            <td>{tx.balanceAfter}</td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setHistoryModal(prev => ({ ...prev, show: false }))}>Đóng</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Adjust Points Modal */}
            {adjustModal.show && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">⚙️ Điều chỉnh điểm — {adjustModal.userName}</h5>
                                <button type="button" className="btn-close" onClick={() => setAdjustModal(prev => ({ ...prev, show: false }))}></button>
                            </div>
                            <form onSubmit={handleAdjustPointsSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Số điểm (Cộng hoặc trừ)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            required
                                            value={adjustModal.delta}
                                            onChange={e => setAdjustModal({ ...adjustModal, delta: e.target.value })}
                                        />
                                        <div className="form-text">Nhập số âm (VD: -50) để trừ điểm, số dương (VD: 100) để cộng điểm.</div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Lý do</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            required
                                            value={adjustModal.reason}
                                            onChange={e => setAdjustModal({ ...adjustModal, reason: e.target.value })}
                                            placeholder="VD: Bồi thường lỗi đơn hàng"
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setAdjustModal(prev => ({ ...prev, show: false }))}>Hủy</button>
                                    <button type="submit" className="btn btn-primary">Xác nhận</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminLoyalty;

import React, { useEffect, useState } from 'react';
import instance from '../../api/axiosConfig';
import { 
  FaSync, FaCheck, FaTimes, FaUndo, 
  FaInfoCircle, FaCoins, FaRegStickyNote, FaExchangeAlt, FaArrowLeft
} from 'react-icons/fa';

const AdminReturns = () => {
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [selectedReturn, setSelectedReturn] = useState(null);
    const [showRefundModal, setShowRefundModal] = useState(false);
    const [refundMethod, setRefundMethod] = useState('BANK_TRANSFER');
    const [refundNote, setRefundNote] = useState('');

    const fetchReturns = async () => {
        setLoading(true);
        try {
            const res = await instance.get('/returns');
            setReturns(res.data.sort((a, b) => b.id - a.id));
        } catch (err) {
            console.error('Error fetching return requests:', err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchReturns();
    }, []);

    const handleApprove = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn duyệt yêu cầu này?")) {
            try {
                await instance.put(`/returns/${id}/approve`);
                alert("Duyệt yêu cầu thành công!");
                fetchReturns();
            } catch (err) {
                alert("Lỗi khi duyệt yêu cầu!");
            }
        }
    };

    const handleReject = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn từ chối yêu cầu này?")) {
            try {
                await instance.put(`/returns/${id}/reject`);
                alert("Đã từ chối yêu cầu!");
                fetchReturns();
            } catch (err) {
                alert("Lỗi khi từ chối yêu cầu!");
            }
        }
    };

    const openRefundModal = (ret) => {
        setSelectedReturn(ret);
        setRefundMethod('BANK_TRANSFER');
        setRefundNote('');
        setShowRefundModal(true);
    };

    const handleConfirmRefund = async (e) => {
        e.preventDefault();
        if (!selectedReturn) return;
        if (!refundNote.trim()) return alert("Vui lòng nhập ghi chú hoàn tiền!");

        try {
            await instance.put(`/returns/${selectedReturn.id}/confirm-refund`, {
                refundMethod,
                refundNote
            });
            alert("Xác nhận đã hoàn tiền thành công!");
            setShowRefundModal(false);
            fetchReturns();
        } catch (err) {
            alert("Lỗi khi xác nhận hoàn tiền!");
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'PENDING':
                return <span className="badge bg-warning text-dark px-3 py-2">Đang chờ duyệt</span>;
            case 'APPROVED':
                return <span className="badge bg-primary px-3 py-2">Đã duyệt (Chờ hoàn tiền)</span>;
            case 'REJECTED':
                return <span className="badge bg-danger px-3 py-2">Đã từ chối</span>;
            case 'REFUND_COMPLETED':
                return <span className="badge bg-success px-3 py-2">Đã hoàn tiền</span>;
            default:
                return <span className="badge bg-secondary px-3 py-2">{status}</span>;
        }
    };

    const getRefundMethodText = (method) => {
        switch (method) {
            case 'BANK_TRANSFER': return 'Chuyển khoản ngân hàng';
            case 'LOYALTY_POINTS': return 'Hoàn điểm tích lũy';
            case 'CASH': return 'Tiền mặt';
            default: return method || 'Chưa xác định';
        }
    };

    const filteredReturns = filterStatus === 'ALL' 
        ? returns 
        : returns.filter(r => r.status === filterStatus);

    return (
        <div className="container-fluid py-4" style={{ fontFamily: '"Inter", sans-serif' }}>
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800 fw-bold">Quản lý Yêu cầu Hoàn trả</h1>
                <button className="btn btn-dark shadow-sm rounded-3 d-flex align-items-center gap-2" onClick={fetchReturns} disabled={loading}>
                    <FaSync className={loading ? 'fa-spin' : ''} /> Làm mới dữ liệu
                </button>
            </div>

            {/* Filter buttons */}
            <div className="d-flex flex-wrap gap-2 mb-4">
                {['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'REFUND_COMPLETED'].map(status => (
                    <button
                        key={status}
                        className={`btn rounded-pill px-4 ${filterStatus === status ? 'btn-dark' : 'btn-light border'}`}
                        onClick={() => setFilterStatus(status)}
                    >
                        {status === 'ALL' ? 'Tất cả' : 
                         status === 'PENDING' ? 'Chờ duyệt' : 
                         status === 'APPROVED' ? 'Đã duyệt' : 
                         status === 'REJECTED' ? 'Từ chối' : 'Đã hoàn tiền'}
                    </button>
                ))}
            </div>

            {/* Main Return Requests Table */}
            <div className="card shadow border-0 rounded-4 overflow-hidden">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0 align-middle">
                            <thead className="bg-light table-light">
                                <tr>
                                    <th className="px-4 py-3">Mã Yêu Cầu</th>
                                    <th>Mã Đơn Hàng</th>
                                    <th>Khách Hàng</th>
                                    <th>Phân Loại</th>
                                    <th>Lý Do</th>
                                    <th>Tiền Hoàn</th>
                                    <th>Trạng Thái</th>
                                    <th className="text-center">Thao Tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="8" className="text-center py-5">
                                            <div className="spinner-border text-dark"></div>
                                        </td>
                                    </tr>
                                ) : filteredReturns.length > 0 ? filteredReturns.map(ret => (
                                    <tr key={ret.id}>
                                        <td className="px-4 fw-bold">#RET-{ret.id}</td>
                                        <td className="fw-bold">#ORD-{ret.order?.id}</td>
                                        <td>
                                            <div className="fw-bold">{ret.order?.shippingName || ret.order?.client?.name}</div>
                                            <small className="text-muted">{ret.order?.shippingEmail || ret.order?.client?.email}</small>
                                        </td>
                                        <td>
                                            {ret.type === 'EXCHANGE' ? (
                                                <span className="badge bg-info text-white px-3 py-1"><FaExchangeAlt className="me-1"/> Đổi hàng</span>
                                            ) : (
                                                <span className="badge bg-danger text-white px-3 py-1"><FaUndo className="me-1"/> Trả hàng</span>
                                            )}
                                        </td>
                                        <td className="text-truncate" style={{ maxWidth: '200px' }} title={ret.reason}>{ret.reason}</td>
                                        <td className="fw-bold text-danger">
                                            {ret.refundAmount ? `${ret.refundAmount.toLocaleString()}đ` : '—'}
                                        </td>
                                        <td>{getStatusBadge(ret.status)}</td>
                                        <td className="text-center">
                                            <div className="btn-group gap-2 justify-content-center">
                                                {ret.status === 'PENDING' && (
                                                    <>
                                                        <button 
                                                            className="btn btn-sm btn-success rounded-3 px-3 d-flex align-items-center gap-1"
                                                            onClick={() => handleApprove(ret.id)}
                                                        >
                                                            <FaCheck /> Duyệt
                                                        </button>
                                                        <button 
                                                            className="btn btn-sm btn-outline-danger rounded-3 px-3 d-flex align-items-center gap-1"
                                                            onClick={() => handleReject(ret.id)}
                                                        >
                                                            <FaTimes /> Từ chối
                                                        </button>
                                                    </>
                                                )}
                                                {ret.status === 'APPROVED' && ret.type !== 'EXCHANGE' && (
                                                    <button 
                                                        className="btn btn-sm btn-primary rounded-3 px-3 d-flex align-items-center gap-1"
                                                        onClick={() => openRefundModal(ret)}
                                                    >
                                                        <FaCoins /> Xác nhận hoàn tiền
                                                    </button>
                                                )}
                                                <button 
                                                    className="btn btn-sm btn-outline-dark rounded-3 px-3 d-flex align-items-center gap-1"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#returnDetailModal"
                                                    onClick={() => setSelectedReturn(ret)}
                                                >
                                                    <FaInfoCircle /> Chi tiết
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="8" className="text-center py-5 text-muted">
                                            Không tìm thấy yêu cầu hoàn trả nào.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Chi tiết yêu cầu hoàn trả */}
            <div className="modal fade" id="returnDetailModal" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content shadow border-0 rounded-4">
                        <div className="modal-header bg-dark text-white p-4">
                            <h5 className="modal-title fw-bold"><FaInfoCircle className="me-2"/> Chi tiết yêu cầu #RET-{selectedReturn?.id}</h5>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body p-4">
                            {selectedReturn && (
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">Thông tin hoàn trả</h6>
                                        <p className="mb-2"><strong>Mã yêu cầu:</strong> #RET-{selectedReturn.id}</p>
                                        <p className="mb-2"><strong>Loại yêu cầu:</strong> {selectedReturn.type === 'EXCHANGE' ? 'Đổi hàng' : 'Trả hàng & Hoàn tiền'}</p>
                                        <p className="mb-2"><strong>Lý do:</strong> {selectedReturn.reason}</p>
                                        <p className="mb-2"><strong>Thời gian tạo:</strong> {new Date(selectedReturn.createdAt).toLocaleString('vi-VN')}</p>
                                        <p className="mb-2"><strong>Trạng thái:</strong> {getStatusBadge(selectedReturn.status)}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">Thông tin tài chính</h6>
                                        <p className="mb-2"><strong>Tổng giá trị đơn hàng:</strong> {selectedReturn.order?.total?.toLocaleString()}đ</p>
                                        <p className="mb-2"><strong>Số tiền hoàn trả:</strong> <span className="text-danger fw-bold">{selectedReturn.refundAmount ? `${selectedReturn.refundAmount.toLocaleString()}đ` : '—'}</span></p>
                                        {selectedReturn.status === 'REFUND_COMPLETED' && (
                                            <div className="bg-light p-3 rounded-3 mt-2">
                                                <p className="mb-1"><strong><FaCoins className="me-1"/> Phương thức:</strong> {getRefundMethodText(selectedReturn.refundMethod)}</p>
                                                <p className="mb-0"><strong><FaRegStickyNote className="me-1"/> Ghi chú hoàn tiền:</strong> {selectedReturn.refundNote}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-12">
                                        <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">Sản phẩm thuộc đơn hàng #ORD-{selectedReturn.order?.id}</h6>
                                        <div className="table-responsive">
                                            <table className="table border align-middle">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>Sản phẩm</th>
                                                        <th className="text-center">Size</th>
                                                        <th className="text-center">Số lượng</th>
                                                        <th className="text-end">Đơn giá</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selectedReturn.order?.items?.map((item, idx) => (
                                                        <tr key={idx}>
                                                            <td>
                                                                <div className="fw-bold">{item.product?.name}</div>
                                                                <small className="text-muted">{item.product?.brand}</small>
                                                            </td>
                                                            <td className="text-center font-monospace">{item.size || 'N/A'}</td>
                                                            <td className="text-center">{item.quantity}</td>
                                                            <td className="text-end fw-bold">{item.price?.toLocaleString()}đ</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Refund Confirmation Modal (Using React State for showing) */}
            {showRefundModal && selectedReturn && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content shadow border-0 rounded-4">
                            <div className="modal-header bg-primary text-white p-4">
                                <h5 className="modal-title fw-bold"><FaCoins className="me-2"/> Xác nhận đã hoàn tiền xong</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowRefundModal(false)}></button>
                            </div>
                            <form onSubmit={handleConfirmRefund}>
                                <div className="modal-body p-4">
                                    <div className="alert alert-info">
                                        Vui lòng thực hiện chuyển khoản số tiền <strong>{selectedReturn.refundAmount?.toLocaleString()}đ</strong> cho khách hàng trước khi xác nhận.
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Phương thức hoàn tiền</label>
                                        <select 
                                            className="form-select border rounded-3 p-2"
                                            value={refundMethod}
                                            onChange={e => setRefundMethod(e.target.value)}
                                        >
                                            <option value="BANK_TRANSFER">Chuyển khoản ngân hàng</option>
                                            <option value="LOYALTY_POINTS">Hoàn điểm tích lũy</option>
                                            <option value="CASH">Tiền mặt</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Ghi chú giao dịch</label>
                                        <textarea 
                                            className="form-control border rounded-3 p-2" 
                                            rows="3" 
                                            placeholder="Ví dụ: Đã chuyển khoản qua Techcombank, mã GD: FT123456 hoặc thông tin số tài khoản nhận tiền..."
                                            value={refundNote}
                                            onChange={e => setRefundNote(e.target.value)}
                                            required
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer p-3 bg-light">
                                    <button type="button" className="btn btn-outline-secondary rounded-3" onClick={() => setShowRefundModal(false)}>Hủy</button>
                                    <button type="submit" className="btn btn-primary rounded-3 px-4">Xác nhận hoàn tất</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminReturns;
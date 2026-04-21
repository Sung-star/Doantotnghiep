import React, { useEffect, useState } from 'react';
import instance from '../../api/axiosConfig';
import { 
    FaSync, FaSearch, FaChevronLeft, FaChevronRight, 
    FaFileInvoiceDollar, FaCheckCircle, FaHourglassHalf, FaCalendarDay 
} from 'react-icons/fa';

const AdminPayments = () => {
    const [payments, setPayments]   = useState([]);
    const [filtered, setFiltered]   = useState([]);
    const [loading, setLoading]     = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [page, setPage]           = useState(0);
    const PAGE_SIZE = 12;

    const [summary, setSummary] = useState({ total: 0, revenue: 0, pending: 0 });

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const res = await instance.get('/orders');
            const orders = Array.isArray(res.data) ? res.data : (res.data.content || []);

            const txList = orders.map(o => ({
                id:          o.id,
                orderId:     o.id,
                clientName:  o.client?.name || 'KHÁCH VÃNG LAI',
                clientEmail: o.client?.email || '—',
                amount:      o.total || 0,
                moment:      o.payment?.moment || o.moment,
                isPaid:      o.orderStatus === 'PAID' || o.orderStatus === 'DELIVERED' || o.orderStatus === 'SHIPPED',
            }));

            txList.sort((a, b) => new Date(b.moment) - new Date(a.moment));
            setPayments(txList);

            const paid = txList.filter(t => t.isPaid);
            setSummary({
                total:   txList.length,
                revenue: paid.reduce((s, t) => s + t.amount, 0),
                pending: txList.length - paid.length,
            });
        } catch (err) {
            console.error('Lỗi tải giao dịch:', err);
        }
        setLoading(false);
    };

    useEffect(() => { fetchPayments(); }, []);

    useEffect(() => {
        let result = [...payments];
        if (statusFilter !== 'ALL') {
            result = result.filter(t => statusFilter === 'PAID' ? t.isPaid : !t.isPaid);
        }
        if (searchTerm.trim()) {
            const q = searchTerm.toLowerCase();
            result = result.filter(t =>
                t.clientName.toLowerCase().includes(q) ||
                t.clientEmail.toLowerCase().includes(q) ||
                String(t.orderId).includes(q)
            );
        }
        setFiltered(result);
        setPage(0);
    }, [payments, statusFilter, searchTerm]);

    const totalPages  = Math.ceil(filtered.length / PAGE_SIZE);
    const pageData    = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

    return (
        <div className="admin-payments p-4 bg-white min-vh-100" style={{ fontFamily: '"Inter", sans-serif' }}>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h2 className="fw-black text-dark mb-1 text-uppercase" style={{ letterSpacing: '-1px', fontWeight: 900 }}>LỊCH SỬ GIAO DỊCH</h2>
                    <p className="text-muted small">Theo dõi dòng tiền và trạng thái thanh toán từ hệ thống.</p>
                </div>
                <button className="btn btn-dark rounded-0 px-4 fw-bold d-flex align-items-center gap-2" onClick={fetchPayments} disabled={loading}>
                    <FaSync className={loading ? 'fa-spin' : ''} /> {loading ? "ĐANG TẢI..." : "LÀM MỚI"}
                </button>
            </div>

            {/* Summary Cards */}
            <div className="row g-3 mb-5">
                <div className="col-md-4">
                    <div className="card border-2 border-dark rounded-0 p-4 bg-dark text-white shadow-sm">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="fw-black text-uppercase small m-0" style={{ letterSpacing: '1px' }}>TỔNG DOANH THU</h6>
                            <FaFileInvoiceDollar size={24} className="text-white-50" />
                        </div>
                        <h2 className="fw-black mb-0" style={{ letterSpacing: '-1px' }}>{summary.revenue.toLocaleString()} ₫</h2>
                        <div className="mt-2 small text-white-50 fw-bold">Dựa trên {summary.total - summary.pending} giao dịch thành công.</div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-2 border-dark rounded-0 p-4 bg-white text-dark shadow-sm">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="fw-black text-uppercase small m-0" style={{ letterSpacing: '1px' }}>GIAO DỊCH CHỜ</h6>
                            <FaHourglassHalf size={24} className="text-muted" />
                        </div>
                        <h2 className="fw-black mb-0" style={{ letterSpacing: '-1px' }}>{summary.pending}</h2>
                        <div className="mt-2 small text-muted fw-bold text-uppercase">Yêu cầu chưa hoàn tất thanh toán.</div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-2 border-dark rounded-0 p-4 bg-white text-dark shadow-sm">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="fw-black text-uppercase small m-0" style={{ letterSpacing: '1px' }}>QUY MÔ GIAO DỊCH</h6>
                            <FaCheckCircle size={24} className="text-muted" />
                        </div>
                        <h2 className="fw-black mb-0" style={{ letterSpacing: '-1px' }}>{summary.total}</h2>
                        <div className="mt-2 small text-muted fw-bold text-uppercase">Tổng số đơn hàng phát sinh.</div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-light p-4 mb-4 border border-2 shadow-sm">
                <div className="row g-3 align-items-center">
                    <div className="col-lg-6">
                        <div className="position-relative">
                            <FaSearch className="position-absolute top-50 translate-middle-y ms-3 text-muted" />
                            <input 
                                type="text" 
                                className="form-control rounded-0 border-2 ps-5" 
                                placeholder="Tìm kiếm mã đơn, tên hoặc email..." 
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-lg-3">
                        <select className="form-select rounded-0 border-2 fw-bold" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                            <option value="ALL">TẤT CẢ TRẠNG THÁI</option>
                            <option value="PAID">ĐÃ THANH TOÁN</option>
                            <option value="PENDING">CHỜ THANH TOÁN</option>
                        </select>
                    </div>
                    <div className="col-lg-3 text-lg-end">
                        <span className="fw-black text-uppercase small text-muted">KẾT QUẢ: {filtered.length} GIAO DỊCH</span>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="table-responsive border border-2 overflow-hidden shadow-sm">
                <table className="table table-hover align-middle mb-0">
                    <thead className="bg-dark text-white border-bottom-0">
                        <tr className="text-uppercase small fw-black" style={{ letterSpacing: '1px' }}>
                            <th className="py-3 ps-4">ID Giao dịch</th>
                            <th className="py-3">Khách hàng</th>
                            <th className="py-3">Thời gian</th>
                            <th className="py-3">Số tiền</th>
                            <th className="py-3">Trạng thái</th>
                            <th className="py-3 text-end pe-4">Đơn hàng gốc</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageData.length > 0 ? pageData.map(tx => (
                            <tr key={tx.id} className="border-bottom border-2">
                                <td className="ps-4 py-3 fw-black text-dark">#TX-{String(tx.id).padStart(5, '0')}</td>
                                <td>
                                    <div className="fw-bold text-dark text-uppercase">{tx.clientName}</div>
                                    <div className="text-muted small fw-medium">{tx.clientEmail}</div>
                                </td>
                                <td>
                                    <div className="small fw-bold text-muted text-uppercase">
                                        <FaCalendarDay className="me-2" />
                                        {new Date(tx.moment).toLocaleString('vi-VN')}
                                    </div>
                                </td>
                                <td>
                                    <div className="fw-black text-dark fs-6">{tx.amount?.toLocaleString()}đ</div>
                                </td>
                                <td>
                                    {tx.isPaid ? (
                                        <span className="badge bg-dark rounded-0 px-3 py-2 fw-bold">
                                            <FaCheckCircle className="me-1" /> ĐÃ THANH TOÁN
                                        </span>
                                    ) : (
                                        <span className="badge bg-secondary rounded-0 px-3 py-2 fw-bold">
                                            <FaHourglassHalf className="me-1" /> CHỜ XỬ LÝ
                                        </span>
                                    )}
                                </td>
                                <td className="text-end pe-4">
                                    <span className="fw-black text-muted small border-bottom border-2 border-muted pb-1">
                                        #ORD-{tx.orderId}
                                    </span>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" className="text-center py-5">
                                    <FaFileInvoiceDollar size={48} className="text-muted mb-3 d-block mx-auto opacity-25" />
                                    <p className="fw-bold text-muted text-uppercase">Không tìm thấy giao dịch nào phù hợp.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="d-flex justify-content-center align-items-center mt-4 gap-3">
                    <button className="btn btn-sm btn-dark rounded-0 p-2 px-3" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
                        <FaChevronLeft />
                    </button>
                    <span className="fw-black text-uppercase small">TRANG {page + 1} / {totalPages}</span>
                    <button className="btn btn-sm btn-dark rounded-0 p-2 px-3" disabled={page + 1 >= totalPages} onClick={() => setPage(p => p + 1)}>
                        <FaChevronRight />
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminPayments;
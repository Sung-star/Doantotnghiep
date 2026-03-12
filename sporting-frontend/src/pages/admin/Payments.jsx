import React, { useEffect, useState } from 'react';
import instance from '../../api/axiosConfig';
import { FaSync, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const AdminPayments = () => {
    const [payments, setPayments]   = useState([]);
    const [filtered, setFiltered]   = useState([]);
    const [loading, setLoading]     = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [page, setPage]           = useState(0);
    const PAGE_SIZE = 10;

    // ── Tổng hợp ────────────────────────────────────────────────
    const [summary, setSummary] = useState({ total: 0, revenue: 0, pending: 0 });

    const fetchPayments = async () => {
        setLoading(true);
        try {
            // Lấy danh sách orders (mỗi order có thể có payment)
            const res = await instance.get('/orders');
            const orders = Array.isArray(res.data) ? res.data : (res.data.content || []);

            // Chuẩn hóa thành danh sách giao dịch
            const txList = orders.map(o => ({
                id:          o.id,
                orderId:     o.id,
                clientName:  o.client?.name || 'Không rõ',
                clientEmail: o.client?.email || '—',
                amount:      o.total || 0,
                moment:      o.payment?.moment || o.moment,
                orderStatus: o.orderStatus,
                isPaid:      o.orderStatus === 'PAID' || o.orderStatus === 'DELIVERED' || o.orderStatus === 'SHIPPED',
            }));

            txList.sort((a, b) => new Date(b.moment) - new Date(a.moment));
            setPayments(txList);

            // Summary
            const paid    = txList.filter(t => t.isPaid);
            const pending = txList.filter(t => !t.isPaid);
            setSummary({
                total:   txList.length,
                revenue: paid.reduce((s, t) => s + t.amount, 0),
                pending: pending.length,
            });
        } catch (err) {
            console.error('Lỗi tải giao dịch:', err);
        }
        setLoading(false);
    };

    useEffect(() => { fetchPayments(); }, []);

    // ── Lọc + tìm kiếm ──────────────────────────────────────────
    useEffect(() => {
        let result = [...payments];
        if (statusFilter !== 'ALL') {
            result = result.filter(t =>
                statusFilter === 'PAID' ? t.isPaid : !t.isPaid
            );
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

    // ── Phân trang ───────────────────────────────────────────────
    const totalPages  = Math.ceil(filtered.length / PAGE_SIZE);
    const pageData    = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

    const formatMoney = (n) => n?.toLocaleString('vi-VN') + ' ₫';
    const formatDate  = (d) => d ? new Date(d).toLocaleString('vi-VN') : '—';

    const statusBadge = (isPaid) => isPaid
        ? <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-3 py-1 fw-semibold">✓ Đã thanh toán</span>
        : <span className="badge rounded-pill bg-danger-subtle text-danger border border-danger-subtle px-3 py-1 fw-semibold">⏳ Chờ thanh toán</span>;

    return (
        <div className="container-fluid py-4 bg-light min-vh-100">

            {/* ── Tiêu đề ── */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold border-start border-4 border-primary ps-3 m-0" style={{ fontSize: '1.4rem' }}>
                    QUẢN LÝ GIAO DỊCH
                </h2>
                <button className="btn btn-dark shadow-sm rounded-3 px-4" onClick={fetchPayments} disabled={loading}>
                    <FaSync className={loading ? 'fa-spin me-2' : 'me-2'} />
                    {loading ? 'Đang tải...' : 'Làm mới'}
                </button>
            </div>

            {/* ── Summary cards ── */}
            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
                        <div className="card-body d-flex align-items-center gap-3">
                            <div className="rounded-3 p-3 d-flex" style={{ background: '#e8f4fd' }}>
                                <i className="bi bi-receipt fs-4 text-primary"></i>
                            </div>
                            <div>
                                <div className="text-muted small fw-semibold">TỔNG GIAO DỊCH</div>
                                <div className="fw-bold fs-4">{summary.total.toLocaleString()}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
                        <div className="card-body d-flex align-items-center gap-3">
                            <div className="rounded-3 p-3 d-flex" style={{ background: '#e8fdf4' }}>
                                <i className="bi bi-currency-exchange fs-4 text-success"></i>
                            </div>
                            <div>
                                <div className="text-muted small fw-semibold">DOANH THU ĐÃ THU</div>
                                <div className="fw-bold fs-4 text-success">{formatMoney(summary.revenue)}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
                        <div className="card-body d-flex align-items-center gap-3">
                            <div className="rounded-3 p-3 d-flex" style={{ background: '#fdf1e8' }}>
                                <i className="bi bi-hourglass-split fs-4 text-warning"></i>
                            </div>
                            <div>
                                <div className="text-muted small fw-semibold">CHỜ THANH TOÁN</div>
                                <div className="fw-bold fs-4 text-warning">{summary.pending.toLocaleString()}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Bộ lọc & tìm kiếm ── */}
            <div className="card border-0 shadow-sm mb-4 p-3" style={{ borderRadius: '12px' }}>
                <div className="row g-3 align-items-center">
                    <div className="col-md-6">
                        <div className="input-group">
                            <span className="input-group-text bg-white border-end-0">
                                <FaSearch className="text-muted" />
                            </span>
                            <input
                                type="text"
                                className="form-control border-start-0 shadow-none"
                                placeholder="Tìm theo tên, email hoặc mã đơn hàng..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <select
                            className="form-select shadow-none"
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                        >
                            <option value="ALL">Tất cả trạng thái</option>
                            <option value="PAID">Đã thanh toán</option>
                            <option value="PENDING">Chờ thanh toán</option>
                        </select>
                    </div>
                    <div className="col-md-3 text-end text-muted small">
                        Hiển thị <strong>{filtered.length}</strong> giao dịch
                    </div>
                </div>
            </div>

            {/* ── Bảng giao dịch ── */}
            <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: '12px' }}>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-dark text-uppercase" style={{ fontSize: '12px' }}>
                            <tr>
                                <th className="ps-4">Mã giao dịch</th>
                                <th>Khách hàng</th>
                                <th>Thời gian</th>
                                <th>Số tiền</th>
                                <th>Trạng thái</th>
                                <th className="text-center">Đơn hàng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i}>
                                        {[...Array(6)].map((__, j) => (
                                            <td key={j}>
                                                <div className="placeholder-glow">
                                                    <span className="placeholder col-8 rounded" />
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : pageData.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-5 text-muted">
                                        <i className="bi bi-inbox fs-1 d-block mb-2 opacity-30"></i>
                                        Không tìm thấy giao dịch nào
                                    </td>
                                </tr>
                            ) : pageData.map(tx => (
                                <tr key={tx.id}>
                                    <td className="ps-4">
                                        <span className="fw-bold text-primary">#TX{String(tx.id).padStart(4, '0')}</span>
                                    </td>
                                    <td>
                                        <div className="fw-semibold text-dark">{tx.clientName}</div>
                                        <small className="text-muted">{tx.clientEmail}</small>
                                    </td>
                                    <td>
                                        <small className="text-muted">
                                            <i className="bi bi-calendar2 me-1"></i>
                                            {formatDate(tx.moment)}
                                        </small>
                                    </td>
                                    <td>
                                        <span className="fw-bold text-dark">{formatMoney(tx.amount)}</span>
                                    </td>
                                    <td>{statusBadge(tx.isPaid)}</td>
                                    <td className="text-center">
                                        <span className="badge bg-secondary-subtle text-secondary border px-3">
                                            #DH{tx.orderId}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Phân trang */}
                {totalPages > 1 && (
                    <div className="d-flex justify-content-center align-items-center p-3 border-top bg-light gap-3">
                        <button
                            className="btn btn-sm btn-outline-dark rounded-circle"
                            disabled={page === 0}
                            onClick={() => setPage(p => p - 1)}
                        >
                            <FaChevronLeft />
                        </button>
                        <span className="small fw-bold text-muted">
                            Trang {page + 1} / {totalPages}
                        </span>
                        <button
                            className="btn btn-sm btn-outline-dark rounded-circle"
                            disabled={page + 1 >= totalPages}
                            onClick={() => setPage(p => p + 1)}
                        >
                            <FaChevronRight />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPayments;
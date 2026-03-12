import React, { useEffect, useState } from 'react';
import instance from '../../api/axiosConfig';
import { FaSync, FaSearch, FaChevronLeft, FaChevronRight, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

const AdminSizes = () => {
    const [products, setProducts]     = useState([]);
    const [filtered, setFiltered]     = useState([]);
    const [loading, setLoading]       = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage]             = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Inline editing
    const [editingCell, setEditingCell] = useState(null); // { productId, sizeId, value }
    const [saving, setSaving]           = useState(false);

    const PAGE_SIZE = 8;

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const url = `/products?page=${page}&size=${PAGE_SIZE}&name=${encodeURIComponent(searchTerm)}`;
            const res = await instance.get(url);
            const data = res.data;
            const list = Array.isArray(data) ? data : (data.content || []);
            setProducts(list);
            setFiltered(list);
            setTotalPages(data.totalPages || Math.ceil((data.totalElements || list.length) / PAGE_SIZE));
        } catch (err) {
            console.error('Lỗi tải sản phẩm:', err);
        }
        setLoading(false);
    };

    useEffect(() => { fetchProducts(); }, [page]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(0);
        fetchProducts();
    };

    // ── Inline chỉnh số lượng size ──────────────────────────────
    const startEdit = (productId, sizeId, currentQty) => {
        setEditingCell({ productId, sizeId, value: currentQty });
    };

    const handleSaveSize = async () => {
        if (!editingCell) return;
        setSaving(true);
        try {
            await instance.put(`/product-sizes/${editingCell.sizeId}`, {
                quantity: parseInt(editingCell.value) || 0,
            });
            // Cập nhật local state
            setProducts(prev => prev.map(p => {
                if (p.id !== editingCell.productId) return p;
                return {
                    ...p,
                    productSizes: p.productSizes.map(s =>
                        s.id === editingCell.sizeId
                            ? { ...s, quantity: parseInt(editingCell.value) || 0 }
                            : s
                    ),
                };
            }));
            setEditingCell(null);
        } catch (err) {
            // Nếu endpoint khác, thử PUT /products/{id}/sizes hoặc PATCH
            console.error('Lỗi cập nhật size:', err);
            alert('Không thể cập nhật. Vui lòng kiểm tra endpoint backend!');
        }
        setSaving(false);
    };

    const stockBadge = (qty) => {
        if (qty === 0)   return 'bg-danger-subtle text-danger border-danger-subtle';
        if (qty <= 5)    return 'bg-warning-subtle text-warning border-warning-subtle';
        return               'bg-success-subtle text-success border-success-subtle';
    };

    return (
        <div className="container-fluid py-4 bg-light min-vh-100">

            {/* ── Tiêu đề ── */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold border-start border-4 border-primary ps-3 m-0" style={{ fontSize: '1.4rem' }}>
                    QUẢN LÝ KÍCH CỠ & TỒN KHO
                </h2>
                <button className="btn btn-dark shadow-sm rounded-3 px-4" onClick={fetchProducts} disabled={loading}>
                    <FaSync className={loading ? 'fa-spin me-2' : 'me-2'} />
                    {loading ? 'Đang tải...' : 'Làm mới'}
                </button>
            </div>

            {/* ── Hướng dẫn ── */}
            <div className="alert alert-info border-0 rounded-3 mb-4 d-flex align-items-center gap-2" style={{ fontSize: '13px' }}>
                <i className="bi bi-info-circle-fill fs-5"></i>
                <span>
                    Click vào <strong>số lượng</strong> của một size để chỉnh sửa trực tiếp.
                    Nhấn <kbd>✓</kbd> để lưu hoặc <kbd>✕</kbd> để hủy.
                </span>
            </div>

            {/* ── Tìm kiếm ── */}
            <div className="card border-0 shadow-sm mb-4 p-3" style={{ borderRadius: '12px' }}>
                <form onSubmit={handleSearch}>
                    <div className="input-group" style={{ maxWidth: '500px' }}>
                        <span className="input-group-text bg-white border-end-0">
                            <FaSearch className="text-muted" />
                        </span>
                        <input
                            type="text"
                            className="form-control border-start-0 shadow-none"
                            placeholder="Tìm theo tên sản phẩm..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary px-4">Tìm</button>
                    </div>
                </form>
            </div>

            {/* ── Bảng kích cỡ ── */}
            <div className="d-flex flex-column gap-3">
                {loading ? (
                    [...Array(4)].map((_, i) => (
                        <div key={i} className="card border-0 shadow-sm p-4" style={{ borderRadius: '12px' }}>
                            <div className="placeholder-glow">
                                <span className="placeholder col-4 rounded mb-3 d-block" style={{ height: '20px' }} />
                                <span className="placeholder col-8 rounded" style={{ height: '36px' }} />
                            </div>
                        </div>
                    ))
                ) : products.length === 0 ? (
                    <div className="card border-0 shadow-sm p-5 text-center text-muted" style={{ borderRadius: '12px' }}>
                        <i className="bi bi-inbox fs-1 mb-2 opacity-30 d-block"></i>
                        Không tìm thấy sản phẩm nào
                    </div>
                ) : products.map(p => (
                    <div key={p.id} className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
                        <div className="card-body p-4">
                            {/* Header sản phẩm */}
                            <div className="d-flex align-items-center gap-3 mb-3">
                                <img
                                    src={p.imgUrl}
                                    alt={p.name}
                                    width="48" height="60"
                                    className="rounded object-fit-cover border"
                                />
                                <div className="flex-grow-1">
                                    <div className="fw-bold text-dark">{p.name}</div>
                                    <small className="text-muted">
                                        ID #{p.id} &nbsp;·&nbsp;
                                        {p.brand || '—'} &nbsp;·&nbsp;
                                        {p.categories?.[0]?.name || '—'}
                                    </small>
                                </div>
                                <div className="text-end">
                                    <div className="fw-bold text-danger">{p.price?.toLocaleString('vi-VN')} ₫</div>
                                    <small className="text-muted">
                                        {p.productSizes?.length || 0} size &nbsp;·&nbsp;
                                        {p.productSizes?.reduce((s, x) => s + (x.quantity || 0), 0) || 0} sản phẩm
                                    </small>
                                </div>
                            </div>

                            {/* Size chips */}
                            {p.productSizes && p.productSizes.length > 0 ? (
                                <div className="d-flex flex-wrap gap-2">
                                    {p.productSizes
                                        .slice()
                                        .sort((a, b) => a.size.localeCompare(b.size, undefined, { numeric: true }))
                                        .map(s => {
                                            const isEditing =
                                                editingCell?.productId === p.id &&
                                                editingCell?.sizeId    === s.id;

                                            return (
                                                <div
                                                    key={s.id || s.size}
                                                    className={`border rounded-3 px-3 py-2 d-flex flex-column align-items-center ${stockBadge(s.quantity)}`}
                                                    style={{ minWidth: '64px', cursor: 'pointer', position: 'relative' }}
                                                >
                                                    <span className="fw-bold" style={{ fontSize: '13px' }}>{s.size}</span>

                                                    {isEditing ? (
                                                        <div className="d-flex align-items-center gap-1 mt-1">
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                className="form-control form-control-sm text-center p-0 border-0 bg-transparent fw-bold"
                                                                style={{ width: '40px', fontSize: '13px' }}
                                                                value={editingCell.value}
                                                                autoFocus
                                                                onChange={e => setEditingCell({ ...editingCell, value: e.target.value })}
                                                                onKeyDown={e => { if (e.key === 'Enter') handleSaveSize(); if (e.key === 'Escape') setEditingCell(null); }}
                                                            />
                                                            <button
                                                                className="btn btn-success btn-sm p-0 d-flex align-items-center justify-content-center"
                                                                style={{ width: '20px', height: '20px', fontSize: '10px' }}
                                                                onClick={handleSaveSize}
                                                                disabled={saving}
                                                            >
                                                                <FaSave />
                                                            </button>
                                                            <button
                                                                className="btn btn-light btn-sm p-0 d-flex align-items-center justify-content-center border"
                                                                style={{ width: '20px', height: '20px', fontSize: '10px' }}
                                                                onClick={() => setEditingCell(null)}
                                                            >
                                                                <FaTimes />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span
                                                            className="small fw-semibold"
                                                            title="Click để chỉnh sửa"
                                                            onClick={() => startEdit(p.id, s.id, s.quantity)}
                                                        >
                                                            {s.quantity}
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                </div>
                            ) : (
                                <p className="text-muted small mb-0 fst-italic">Chưa có thông tin kích cỡ</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Phân trang */}
            {totalPages > 1 && (
                <div className="d-flex justify-content-center align-items-center mt-4 gap-3">
                    <button
                        className="btn btn-sm btn-outline-dark rounded-circle"
                        disabled={page === 0}
                        onClick={() => setPage(p => p - 1)}
                    >
                        <FaChevronLeft />
                    </button>
                    <span className="small fw-bold text-muted">Trang {page + 1} / {totalPages}</span>
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
    );
};

export default AdminSizes;
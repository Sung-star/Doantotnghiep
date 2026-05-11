import React, { useEffect, useState } from 'react';
import instance from '../../api/axiosConfig';
import { 
  FaTrash, FaCheck, FaInfoCircle, FaSync, 
  FaUser, FaPhoneAlt, FaMapMarkerAlt, FaCalendarAlt,
  FaReceipt, FaShippingFast, FaCheckCircle, FaExclamationCircle, FaTimes, FaEye, FaClock
} from 'react-icons/fa';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await instance.get('/orders');
            const data = Array.isArray(res.data) ? res.data : (res.data.content || []);
            setOrders(data.sort((a, b) => b.id - a.id));
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    useEffect(() => { fetchOrders(); }, []);

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await instance.put(`/orders/${id}/status`, `"${newStatus}"`, {
                headers: { "Content-Type": "application/json" }
            });
            fetchOrders();
        } catch (err) {
            alert("Lỗi khi cập nhật trạng thái!");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm(`Bạn có chắc chắn muốn hủy đơn hàng #ORD-${id}?`)) {
            try {
                await instance.delete(`/orders/${id}`);
                setOrders(orders.filter(o => o.id !== id));
            } catch (err) { alert("Không thể xóa đơn hàng đã thanh toán!"); }
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'PENDING': return { text: 'Chờ duyệt', color: 'bg-warning', icon: <FaExclamationCircle /> };
            case 'CONFIRMED': return { text: 'Đã xác nhận', color: 'bg-primary', icon: <FaCheck /> };
            case 'SHIPPING': return { text: 'Đang giao hàng', color: 'bg-info', icon: <FaShippingFast /> };
            case 'DELIVERED': return { text: 'Đã giao hàng', color: 'bg-success', icon: <FaCheckCircle /> };
            case 'COMPLETED': return { text: 'Hoàn tất', color: 'bg-dark', icon: <FaCheckCircle /> };
            case 'CANCELLED': return { text: 'Đã hủy', color: 'bg-danger', icon: <FaTimes /> };
            case 'PAID': return { text: 'Đã thanh toán', color: 'bg-success', icon: <FaCheckCircle /> };
            case 'WAITING_PAYMENT': return { text: 'Chờ thanh toán', color: 'bg-secondary', icon: <FaClock /> };
            default: return { text: status, color: 'bg-secondary', icon: null };
        }
    };

    const getImageUrl = (url) => {
        if (!url) return 'https://placehold.co/50';
        const firstUrl = url.split('|')[0].trim();
        if (firstUrl.startsWith('http') || firstUrl.startsWith('data:')) return firstUrl;
        return `http://localhost:8081${firstUrl}`;
    };

    return (
        <div className="container-fluid">
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Quản lý Đơn hàng</h1>
                <button className="btn btn-primary shadow-sm" onClick={fetchOrders} disabled={loading}>
                    <FaSync className={`me-2 ${loading ? 'fa-spin' : ''}`} /> Làm mới dữ liệu
                </button>
            </div>

            <div className="card shadow mb-4">
                <div className="card-header py-3 bg-white">
                    <h6 className="m-0 font-weight-bold text-primary">Danh sách đơn hàng gần đây</h6>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0 align-middle">
                            <thead>
                                <tr>
                                    <th className="px-4">Mã Đơn</th>
                                    <th>Ngày đặt</th>
                                    <th>Khách hàng</th>
                                    <th>Tổng tiền</th>
                                    <th>Trạng thái</th>
                                    <th className="text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="6" className="text-center py-5"><div className="spinner-border text-primary"></div></td></tr>
                                ) : orders.length > 0 ? orders.map(o => {
                                    const status = getStatusLabel(o.orderStatus);
                                    return (
                                        <tr key={o.id}>
                                            <td className="px-4 font-weight-bold">#ORD-{o.id}</td>
                                            <td>{new Date(o.moment).toLocaleString('vi-VN')}</td>
                                            <td>
                                                <div className="font-weight-bold">{o.client?.name || 'Khách vãng lai'}</div>
                                                <div className="small text-muted">{o.client?.email}</div>
                                            </td>
                                            <td className="font-weight-bold text-danger">{o.total?.toLocaleString()}đ</td>
                                            <td>
                                                <div className="dropdown">
                                                    <button className={`btn btn-sm ${status.color} text-white dropdown-toggle`} type="button" data-bs-toggle="dropdown">
                                                        {status.text}
                                                    </button>
                                                    <ul className="dropdown-menu shadow">
                                                        <li><button className="dropdown-item small" onClick={() => handleUpdateStatus(o.id, 'PENDING')}>Chờ duyệt</button></li>
                                                        <li><button className="dropdown-item small" onClick={() => handleUpdateStatus(o.id, 'CONFIRMED')}>Xác nhận đơn</button></li>
                                                        <li><button className="dropdown-item small" onClick={() => handleUpdateStatus(o.id, 'SHIPPING')}>Giao hàng</button></li>
                                                        <li><button className="dropdown-item small" onClick={() => handleUpdateStatus(o.id, 'DELIVERED')}>Đã nhận hàng</button></li>
                                                        <li><button className="dropdown-item small" onClick={() => handleUpdateStatus(o.id, 'COMPLETED')}>Hoàn tất</button></li>
                                                        <li><hr className="dropdown-divider"/></li>
                                                        <li><button className="dropdown-item small" onClick={() => handleUpdateStatus(o.id, 'PAID')}>Xác nhận đã trả tiền</button></li>
                                                        <li><button className="dropdown-item small text-danger" onClick={() => handleUpdateStatus(o.id, 'CANCELLED')}>Hủy đơn hàng</button></li>
                                                    </ul>
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <div className="btn-group shadow-sm">
                                                    <button className="btn btn-white btn-sm text-primary border" title="Xem chi tiết" data-bs-toggle="modal" data-bs-target="#orderInvoiceModal" onClick={() => setSelectedOrder(o)}>
                                                        <FaEye />
                                                    </button>
                                                    <button className="btn btn-white btn-sm text-danger border" title="Hủy đơn" onClick={() => handleDelete(o.id)}>
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr><td colSpan="6" className="text-center py-4">Chưa có đơn hàng nào.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Chi tiết đơn hàng */}
            <div className="modal fade" id="orderInvoiceModal" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content shadow border-0">
                        <div className="modal-header bg-primary text-white">
                            <h5 className="modal-title font-weight-bold"><FaReceipt className="me-2"/> Chi tiết đơn hàng #ORD-{selectedOrder?.id}</h5>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body p-4">
                            {selectedOrder && (
                                <div className="row">
                                    <div className="col-md-6 mb-4">
                                        <h6 className="font-weight-bold text-primary border-bottom pb-2 mb-3">Thông tin khách hàng</h6>
                                        <p className="mb-1"><strong><FaUser className="me-2 text-muted"/></strong> {selectedOrder.shippingName || selectedOrder.client?.name}</p>
                                        <p className="mb-1"><strong><FaPhoneAlt className="me-2 text-muted"/></strong> {selectedOrder.shippingPhone || selectedOrder.client?.phone}</p>
                                        <p className="mb-1"><strong><FaMapMarkerAlt className="me-2 text-muted"/></strong> {selectedOrder.shippingAddress || "N/A"}</p>
                                    </div>
                                    <div className="col-md-6 mb-4">
                                        <h6 className="font-weight-bold text-primary border-bottom pb-2 mb-3">Tóm tắt đơn hàng</h6>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span>Trạng thái:</span>
                                            <span className="badge bg-primary">{selectedOrder.orderStatus}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span>Tổng thanh toán:</span>
                                            <span className="font-weight-bold text-danger">{selectedOrder.total?.toLocaleString()}đ</span>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <h6 className="font-weight-bold text-primary border-bottom pb-2 mb-3">Danh sách sản phẩm</h6>
                                        <div className="table-responsive">
                                            <table className="table table-hover align-middle border">
                                                <thead className="table-light">
                                                    <tr className="small text-uppercase fw-bold text-muted">
                                                        <th style={{width: '80px'}}>Ảnh</th>
                                                        <th>Sản phẩm</th>
                                                        <th className="text-center">Số lượng</th>
                                                        <th className="text-center">Size</th>
                                                        <th className="text-end">Đơn giá</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selectedOrder.items?.map((item, idx) => (
                                                        <tr key={idx}>
                                                            <td>
                                                                <img 
                                                                    src={getImageUrl(item.product?.imgUrl)} 
                                                                    alt={item.product?.name} 
                                                                    className="rounded shadow-sm"
                                                                    style={{width: '50px', height: '60px', objectFit: 'cover'}}
                                                                />
                                                            </td>
                                                            <td>
                                                                <div className="fw-bold">{item.product?.name}</div>
                                                                <small className="text-muted">{item.product?.brand}</small>
                                                            </td>
                                                            <td className="text-center fw-bold">{item.quantity}</td>
                                                            <td className="text-center">
                                                                <span className="badge bg-light text-dark border">{item.size || 'N/A'}</span>
                                                            </td>
                                                            <td className="text-end fw-bold">{item.price?.toLocaleString()}đ</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Tổng kết tiền bạc minh bạch */}
                                        <div className="mt-4 p-3 bg-light rounded-3 border">
                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="text-muted">Tổng tiền hàng:</span>
                                                <span className="fw-bold">{selectedOrder.items?.reduce((acc, i) => acc + (i.price * i.quantity), 0).toLocaleString()}đ</span>
                                            </div>
                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="text-muted">Phí vận chuyển:</span>
                                                <span className="text-success fw-bold">+{selectedOrder.shippingFee?.toLocaleString() || 0}đ</span>
                                            </div>
                                            {selectedOrder.discountAmount > 0 && (
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span className="text-muted">Giảm giá:</span>
                                                    <span className="text-danger fw-bold">-{selectedOrder.discountAmount?.toLocaleString()}đ</span>
                                                </div>
                                            )}
                                            <hr />
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="fw-bold">TỔNG THANH TOÁN:</span>
                                                <span className="fs-4 fw-black text-primary">{selectedOrder.total?.toLocaleString()}đ</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;
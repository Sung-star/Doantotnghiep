import React, { useEffect, useState } from 'react';
import instance from '../../api/axiosConfig';
import { 
  FaTrash, FaCheck, FaInfoCircle, FaSync, 
  FaUser, FaPhoneAlt, FaMapMarkerAlt, FaCalendarAlt 
} from 'react-icons/fa';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await instance.get('/orders');
            setOrders(res.data.sort((a, b) => b.id - a.id));
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    useEffect(() => { fetchOrders(); }, []);

    // HÀM CẬP NHẬT TRẠNG THÁI
    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await instance.put(`/orders/${id}/status`, `"${newStatus}"`, {
                headers: { "Content-Type": "application/json" }
            });
            fetchOrders(); // Load lại bảng
        } catch (err) {
            alert("Lỗi khi cập nhật trạng thái!");
        }
    };

    // HÀM XÓA
    const handleDelete = async (id) => {
        if (window.confirm(`Hủy đơn hàng #DH${id}?`)) {
            try {
                await instance.delete(`/orders/${id}`);
                setOrders(orders.filter(o => o.id !== id));
            } catch (err) { alert("Không thể xóa!"); }
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'PAID': return 'bg-success';
            case 'WAITING_PAYMENT': return 'bg-danger';
            case 'SHIPPED': return 'bg-info';
            case 'DELIVERED': return 'bg-primary';
            default: return 'bg-secondary';
        }
    };

    return (
        <div className="container-fluid py-4 bg-light min-vh-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-uppercase text-primary">Quản lý Đơn hàng</h2>
                <button className="btn btn-dark shadow-sm" onClick={fetchOrders} disabled={loading}>
                    <FaSync className={loading ? 'fa-spin' : ''} /> {loading ? "Đang tải..." : "Làm mới"}
                </button>
            </div>

            <div className="card shadow-sm border-0 rounded-3">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-dark">
                            <tr>
                                <th className="ps-4">Mã ĐH</th>
                                <th>Khách hàng / Ngày đặt</th>
                                <th>Tổng tiền</th>
                                <th>Trạng thái hiện tại</th>
                                <th className="text-center">Thao tác xử lý</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(o => (
                                <tr key={o.id}>
                                    <td className="ps-4 fw-bold text-primary">#DH{o.id}</td>
                                    <td>
                                        <div className="fw-bold">{o.client.name}</div>
                                        <small className="text-muted"><FaCalendarAlt /> {new Date(o.moment).toLocaleString('vi-VN')}</small>
                                    </td>
                                    <td className="text-danger fw-bold fs-5">{o.total?.toLocaleString()}đ</td>
                                    <td>
                                        <select 
                                            className={`form-select form-select-sm fw-bold text-white border-0 ${getStatusClass(o.orderStatus)}`}
                                            value={o.orderStatus}
                                            onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                                            style={{ width: '160px', borderRadius: '20px', paddingLeft: '15px' }}
                                        >
                                            <option value="WAITING_PAYMENT">Chờ thanh toán</option>
                                            <option value="PAID">Đã thanh toán</option>
                                            <option value="SHIPPED">Đang giao hàng</option>
                                            <option value="DELIVERED">Đã giao hoàn tất</option>
                                            <option value="CANCELED">Đã hủy đơn</option>
                                        </select>
                                    </td>
                                    <td className="text-center">
                                        <div className="d-flex justify-content-center gap-2">
                                            {/* NÚT THU TIỀN: CHỈ HIỆN KHI CHƯA THANH TOÁN */}
                                            {o.orderStatus === 'WAITING_PAYMENT' ? (
                                                <button className="btn btn-success btn-sm px-3 shadow-sm fw-bold" 
                                                        onClick={() => handleUpdateStatus(o.id, 'PAID')}>
                                                    <FaCheck /> THU TIỀN
                                                </button>
                                            ) : (
                                                <button className="btn btn-outline-success btn-sm disabled border-0 fw-bold">
                                                    <FaCheck /> ĐÃ THU
                                                </button>
                                            )}

                                            {/* NÚT CHI TIẾT */}
                                            <button 
                                                className="btn btn-primary btn-sm px-3 shadow-sm" 
                                                data-bs-toggle="modal" data-bs-target="#adminOrderModal"
                                                onClick={() => setSelectedOrder(o)}
                                            >
                                                <FaInfoCircle /> CHI TIẾT
                                            </button>

                                            {/* NÚT XÓA */}
                                            <button className="btn btn-outline-danger btn-sm px-3" onClick={() => handleDelete(o.id)}>
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- MODAL CHI TIẾT ĐƠN HÀNG --- */}
            <div className="modal fade" id="adminOrderModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-lg border-0">
                    <div className="modal-content shadow-lg border-0 rounded-4">
                        <div className="modal-header bg-primary text-white py-3">
                            <h5 className="modal-title fw-bold"> CHI TIẾT ĐƠN HÀNG #DH{selectedOrder?.id}</h5>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body p-4">
                            {selectedOrder && (
                                <div className="row">
                                    {/* THÔNG TIN GIAO HÀNG */}
                                    <div className="col-md-7 mb-4">
                                        <h6 className="text-primary fw-bold border-bottom pb-2">THÔNG TIN GIAO HÀNG</h6>
                                        <p className="mb-2"><FaUser className="me-2 text-muted"/> <b>Người nhận:</b> {selectedOrder.shippingName || selectedOrder.client.name}</p>
                                        <p className="mb-2"><FaPhoneAlt className="me-2 text-muted"/> <b>Điện thoại:</b> {selectedOrder.shippingPhone || "Chưa có"}</p>
                                        <p className="mb-2"><FaMapMarkerAlt className="me-2 text-muted"/> <b>Địa chỉ:</b> {selectedOrder.shippingAddress || "Chưa có"}</p>
                                    </div>

                                    {/* THÔNG TIN TRẠNG THÁI */}
                                    <div className="col-md-5 mb-4 text-md-end bg-light p-3 rounded">
                                        <h6 className="text-dark fw-bold mb-2">HÓA ĐƠN</h6>
                                        <p className="small mb-1 text-muted">Mã khách hàng: #{selectedOrder.client.id}</p>
                                        <p className="small mb-1">Ngày đặt: {new Date(selectedOrder.moment).toLocaleString('vi-VN')}</p>
                                        <p className="small mb-0">Trạng thái: <b>{selectedOrder.orderStatus}</b></p>
                                    </div>

                                    {/* DANH SÁCH SẢN PHẨM */}
                                    <div className="col-12 mt-2">
                                        <h6 className="text-primary fw-bold border-bottom pb-2">DANH SÁCH SẢN PHẨM</h6>
                                        <table className="table table-sm">
                                            <thead>
                                                <tr className="table-secondary">
                                                    <th className="ps-2">Sản phẩm</th>
                                                    <th className="text-center">Số lượng</th>
                                                    <th className="text-end pe-2">Thành tiền</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedOrder.items?.map((item, idx) => (
                                                    <tr key={idx}>
                                                        <td className="ps-2 py-2">{item.product.name}</td>
                                                        <td className="text-center py-2">{item.quantity}</td>
                                                        <td className="text-end pe-2 py-2">{(item.price * item.quantity).toLocaleString()}đ</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <div className="text-end mt-4">
                                            <h3 className="fw-bold text-danger">TỔNG CỘNG: {selectedOrder.total?.toLocaleString()} VNĐ</h3>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;
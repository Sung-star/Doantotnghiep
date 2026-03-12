import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import { useAuth } from '../../contexts/AuthContext';
import { FaBoxOpen, FaReceipt, FaTrashAlt, FaEye, FaTimes } from 'react-icons/fa';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null); // Lưu đơn hàng để xem chi tiết
  const { user } = useAuth();

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      const myOrders = response.data.filter(order => order.client.id === user.id);
      myOrders.sort((a, b) => new Date(b.moment) - new Date(a.moment));
      setOrders(myOrders);
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  // HÀM XỬ LÝ XOÁ ĐƠN HÀNG
  const handleDeleteOrder = async (orderId) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa đơn hàng #DH${orderId}?`)) {
      try {
        await api.delete(`/orders/${orderId}`);
        alert("Đã xóa đơn hàng thành công!");
        fetchOrders(); // Load lại danh sách sau khi xóa
      } catch (error) {
        alert("Không thể xóa đơn hàng này. Có thể đơn hàng đã được xử lý!");
      }
    }
  };

  const renderStatus = (status) => {
    switch (status) {
      case 'WAITING_PAYMENT': return <span className="badge bg-danger">Chờ thanh toán</span>;
      case 'PAID': return <span className="badge bg-primary">Đã thanh toán</span>;
      case 'SHIPPED': return <span className="badge bg-info">Đang giao hàng</span>;
      case 'DELIVERED': return <span className="badge bg-success">Đã nhận hàng</span>;
      default: return <span className="badge bg-secondary">{status}</span>;
    }
  };

  if (loading) return <div className="container mt-5 text-center"><h4>Đang tải dữ liệu...</h4></div>;

  return (
    <div className="container mt-5 mb-5">
      <div className="d-flex align-items-center mb-4">
        <FaReceipt className="me-2 fs-3 text-primary" />
        <h2 className="mb-0 fw-bold">Lịch sử đơn hàng của bạn</h2>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-5 border rounded bg-light">
          <FaBoxOpen className="display-1 text-muted mb-3" />
          <h4>Bạn chưa có đơn hàng nào.</h4>
        </div>
      ) : (
        <div className="table-responsive shadow-sm rounded">
          <table className="table table-hover align-middle bg-white mb-0">
            <thead className="table-dark">
              <tr>
                <th className="py-3 ps-4">Mã đơn hàng</th>
                <th className="py-3">Ngày đặt</th>
                <th className="py-3">Tổng tiền</th>
                <th className="py-3 text-center">Trạng thái</th>
                <th className="py-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td className="ps-4"><span className="fw-bold">#DH{order.id}</span></td>
                  <td>{new Date(order.moment).toLocaleDateString('vi-VN')}</td>
                  <td className="text-danger fw-bold">{order.total?.toLocaleString()}đ</td>
                  <td className="text-center">{renderStatus(order.orderStatus)}</td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center gap-2">
                      {/* NÚT CHI TIẾT */}
                      <button 
                        className="btn btn-sm btn-outline-primary rounded-pill px-3"
                        data-bs-toggle="modal" 
                        data-bs-target="#orderDetailModal"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <FaEye className="me-1" /> Chi tiết
                      </button>

                      {/* NÚT XOÁ (Chỉ hiện nếu chưa thanh toán) */}
                      {order.orderStatus === 'WAITING_PAYMENT' && (
                        <button 
                          className="btn btn-sm btn-outline-danger rounded-pill px-3"
                          onClick={() => handleDeleteOrder(order.id)}
                        >
                          <FaTrashAlt className="me-1" /> Xoá
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- MODAL HIỆN CHI TIẾT ĐƠN HÀNG --- */}
      <div className="modal fade" id="orderDetailModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <div className="modal-header bg-dark text-white">
              <h5 className="modal-title fw-bold">Chi tiết đơn hàng #DH{selectedOrder?.id}</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body p-4">
              {selectedOrder ? (
                <>
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <p className="mb-1 text-muted small text-uppercase">Ngày đặt hàng</p>
                      <h6 className="fw-bold">{new Date(selectedOrder.moment).toLocaleString('vi-VN')}</h6>
                    </div>
                    <div className="col-md-6 text-md-end">
                      <p className="mb-1 text-muted small text-uppercase">Trạng thái hiện tại</p>
                      <h5>{renderStatus(selectedOrder.orderStatus)}</h5>
                    </div>
                  </div>

                  <table className="table table-borderless">
                    <thead className="border-bottom">
                      <tr>
                        <th>Sản phẩm</th>
                        <th className="text-center">Số lượng</th>
                        <th className="text-end">Đơn giá</th>
                        <th className="text-end">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Hiển thị danh sách sản phẩm trong đơn hàng */}
                      {selectedOrder.items && selectedOrder.items.map((item, index) => (
                        <tr key={index} className="border-bottom-0">
                          <td className="py-3">
                            <div className="fw-bold text-dark">{item.product.name}</div>
                            <small className="text-muted">Mã SP: {item.product.id}</small>
                          </td>
                          <td className="text-center py-3">{item.quantity}</td>
                          <td className="text-end py-3">{item.price.toLocaleString()}đ</td>
                          <td className="text-end py-3 fw-bold">{(item.price * item.quantity).toLocaleString()}đ</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="d-flex justify-content-between align-items-center mt-4 p-3 bg-light rounded">
                    <span className="h5 mb-0 fw-bold">TỔNG CỘNG:</span>
                    <span className="h4 mb-0 fw-bold text-danger">{selectedOrder.total?.toLocaleString()} VNĐ</span>
                  </div>
                </>
              ) : (
                <div className="text-center py-5">Đang tải thông tin chi tiết...</div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary px-4" data-bs-dismiss="modal">Đóng</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
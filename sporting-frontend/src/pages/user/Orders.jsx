import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { useAuth } from '../../contexts/AuthContext';
import { FaBoxOpen, FaReceipt, FaTrashAlt, FaEye, FaTimes } from 'react-icons/fa';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
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
      case 'PENDING': return <span className="badge bg-warning text-dark px-3">Đang chờ</span>;
      case 'CONFIRMED': return <span className="badge bg-primary px-3">Đã xác nhận</span>;
      case 'SHIPPING': return <span className="badge bg-info text-white px-3">Đang giao hàng</span>;
      case 'DELIVERED': return <span className="badge bg-success px-3">Đã giao hàng</span>;
      case 'COMPLETED': return <span className="badge bg-dark px-3">Hoàn tất</span>;
      case 'CANCELLED': return <span className="badge bg-danger px-3">Đã hủy</span>;
      case 'PAID': return <span className="badge bg-primary px-3">Đã thanh toán</span>;
      case 'WAITING_PAYMENT': return <span className="badge bg-secondary px-3">Chờ thanh toán</span>;
      default: return <span className="badge bg-secondary px-3">{status}</span>;
    }
  };

  const renderTimeline = (currentStatus) => {
    const steps = ['PENDING', 'CONFIRMED', 'SHIPPING', 'DELIVERED', 'COMPLETED'];
    const currentIdx = steps.indexOf(currentStatus);
    
    if (currentStatus === 'CANCELLED') {
        return (
            <div className="alert alert-danger py-2 text-center small fw-bold">ĐƠN HÀNG ĐÃ BỊ HỦY</div>
        );
    }

    return (
        <div className="order-timeline-container mb-5">
            <div className="order-timeline">
                {steps.map((step, idx) => {
                    const isActive = idx <= currentIdx;
                    const isDone = idx < currentIdx;
                    return (
                        <div key={step} className={`timeline-step ${isActive ? 'active' : ''}`}>
                            <div className="step-point">
                                {isDone ? '✓' : idx + 1}
                            </div>
                            <div className="step-label">{step === 'PENDING' ? 'Chờ duyệt' : step === 'CONFIRMED' ? 'Đã xác nhận' : step === 'SHIPPING' ? 'Đang giao' : step === 'DELIVERED' ? 'Đã nhận' : 'Hoàn tất'}</div>
                            {idx < steps.length - 1 && <div className="step-line"></div>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
  };

  if (loading) return (
    <div className="container py-5 text-center min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-dark"></div>
    </div>
  );

  return (
    <div className="orders-page py-5 bg-white min-vh-100" style={{ fontFamily: '"Inter", sans-serif' }}>
      <div className="container">
        <div className="d-flex align-items-center justify-content-between mb-5">
            <div>
                <h2 className="fw-black text-uppercase tracking-tighter m-0 italic">LỊCH SỬ ĐƠN HÀNG</h2>
                <p className="text-muted small fw-bold text-uppercase tracking-widest mt-1">Quản lý và theo dõi hành trình của bạn</p>
            </div>
            <div className="bg-light p-3 rounded-4">
                <span className="fw-bold small text-muted text-uppercase">Tổng số đơn:</span>
                <span className="ms-2 fw-black h5 mb-0">{orders.length}</span>
            </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-5 luxury-card bg-light border-0">
            <FaBoxOpen className="display-1 text-muted opacity-25 mb-3" />
            <h4 className="fw-bold text-muted">Bạn chưa có đơn hàng nào.</h4>
            <button className="luxury-button mt-3" onClick={() => navigate('/products')}>MUA SẮM NGAY</button>
          </div>
        ) : (
          <div className="row g-4">
            {orders.map(order => (
                <div key={order.id} className="col-12">
                    <div className="luxury-card p-4 border-0 shadow-sm hover-shadow transition-all">
                        <div className="row align-items-center">
                            <div className="col-md-2">
                                <div className="small text-muted fw-bold text-uppercase mb-1">Mã đơn hàng</div>
                                <div className="fw-black h5 mb-0">#ORD-{order.id}</div>
                            </div>
                            <div className="col-md-2">
                                <div className="small text-muted fw-bold text-uppercase mb-1">Ngày đặt</div>
                                <div className="fw-bold">{new Date(order.moment).toLocaleDateString('vi-VN')}</div>
                            </div>
                            <div className="col-md-3">
                                <div className="small text-muted fw-bold text-uppercase mb-1">Thanh toán</div>
                                <div className="fw-black text-danger h5 mb-0">{order.total?.toLocaleString()}đ</div>
                            </div>
                            <div className="col-md-2 text-center">
                                <div className="small text-muted fw-bold text-uppercase mb-1">Trạng thái</div>
                                {renderStatus(order.orderStatus)}
                            </div>
                            <div className="col-md-3 text-end">
                                <button 
                                    className="luxury-button"
                                    style={{padding: '0.7rem 2rem'}}
                                    data-bs-toggle="modal" 
                                    data-bs-target="#orderDetailModal"
                                    onClick={() => setSelectedOrder(order)}
                                >
                                    XEM CHI TIẾT
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
          </div>
        )}

        {/* --- MODAL HIỆN CHI TIẾT ĐƠN HÀNG --- */}
        <div className="modal fade" id="orderDetailModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '30px', overflow: 'hidden' }}>
              <div className="modal-body p-0">
                {selectedOrder ? (
                  <div className="row g-0">
                    <div className="col-lg-8 p-5 bg-white">
                        <div className="d-flex justify-content-between align-items-center mb-5">
                            <h3 className="fw-black text-uppercase tracking-tighter m-0 italic">CHI TIẾT ĐƠN #ORD-{selectedOrder.id}</h3>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>

                        {/* Timeline Visualization */}
                        {renderTimeline(selectedOrder.orderStatus)}

                        <div className="table-responsive">
                            <table className="table table-borderless align-middle">
                                <thead className="border-bottom">
                                    <tr className="small text-muted text-uppercase fw-bold">
                                        <th>Sản phẩm</th>
                                        <th className="text-center">Size</th>
                                        <th className="text-center">Số lượng</th>
                                        <th className="text-end">Đơn giá</th>
                                        <th className="text-end">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedOrder.items && selectedOrder.items.map((item, index) => (
                                        <tr key={index} className="border-bottom-light">
                                            <td className="py-4">
                                                <div className="d-flex align-items-center gap-3">
                                                    <img 
                                                        src={item.product.imgUrl ? (item.product.imgUrl.startsWith('data:') ? item.product.imgUrl : `http://localhost:8081${item.product.imgUrl.split('|')[0].trim()}`) : 'https://placehold.co/60'}
                                                        alt=""
                                                        style={{ width: '60px', height: '75px', objectFit: 'cover', borderRadius: '10px' }}
                                                    />
                                                    <div>
                                                        <div className="fw-black text-uppercase small">{item.product.name}</div>
                                                        <small className="text-muted d-block">ID: {item.product.id}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-center fw-bold">{item.size || 'N/A'}</td>
                                            <td className="text-center fw-bold">{item.quantity}</td>
                                            <td className="text-end fw-bold">{item.price?.toLocaleString()}đ</td>
                                            <td className="text-end fw-black">{(item.price * item.quantity).toLocaleString()}đ</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div className="col-lg-4 p-5 bg-light d-flex flex-column justify-content-between">
                        <div>
                            <div className="mb-4">
                                <div className="small text-muted fw-bold text-uppercase mb-2">Người nhận</div>
                                <div className="fw-black">{selectedOrder.shippingName}</div>
                                <div className="fw-bold">{selectedOrder.shippingPhone}</div>
                            </div>
                            <div className="mb-4">
                                <div className="small text-muted fw-bold text-uppercase mb-2">Địa chỉ giao hàng</div>
                                <div className="text-muted fw-medium lh-sm">{selectedOrder.shippingAddress}</div>
                            </div>
                            <div className="mb-4">
                                <div className="small text-muted fw-bold text-uppercase mb-2">Hình thức thanh toán</div>
                                <div className="badge bg-dark px-3 py-2 text-uppercase tracking-widest">{selectedOrder.payment ? 'Online (Đã trả)' : 'Thanh toán khi nhận hàng'}</div>
                            </div>
                        </div>

                        <div className="pt-4 border-top border-2">
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted fw-bold">Tổng tiền hàng:</span>
                                <span className="fw-bold">{selectedOrder.items?.reduce((acc, i) => acc + (i.price * i.quantity), 0).toLocaleString()}đ</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2 text-success">
                                <span className="fw-bold">Phí vận chuyển:</span>
                                <span className="fw-bold">+{selectedOrder.shippingFee?.toLocaleString()}đ</span>
                            </div>
                            {selectedOrder.discountAmount > 0 && (
                                <div className="d-flex justify-content-between mb-2 text-danger">
                                    <span className="fw-bold">Giảm giá:</span>
                                    <span className="fw-bold">-{selectedOrder.discountAmount?.toLocaleString()}đ</span>
                                </div>
                            )}
                            <div className="d-flex justify-content-between mt-3 h4 fw-black">
                                <span>TỔNG CỘNG:</span>
                                <span className="text-danger">{selectedOrder.total?.toLocaleString()}đ</span>
                            </div>
                        </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-5">
                      <div className="spinner-border text-dark"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FaArrowLeft, FaUndo, FaExchangeAlt, FaHourglassHalf, 
  FaCheckCircle, FaTimesCircle, FaMoneyBillWave, FaCoins, FaRegClipboard
} from 'react-icons/fa';

const ReturnRequest = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [order, setOrder] = useState(null);
    const [returnReq, setReturnReq] = useState(null);
    const [loading, setLoading] = useState(true);

    // Form states
    const [requestType, setRequestType] = useState('RETURN');
    const [reason, setReason] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            // 1. Fetch order details
            const orderRes = await api.get(`/orders/${orderId}`);
            setOrder(orderRes.data);

            // 2. Fetch return request if any
            try {
                const reqRes = await api.get(`/returns/order/${orderId}`);
                setReturnReq(reqRes.data);
            } catch (err) {
                // If 404, it means no return request exists yet
                setReturnReq(null);
            }
        } catch (error) {
            console.error("Lỗi khi tải thông tin hoàn trả:", error);
            alert("Không thể tải thông tin đơn hàng!");
            navigate('/orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (orderId) fetchData();
    }, [orderId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reason.trim()) return alert("Vui lòng nhập lý do hoàn trả!");

        setSubmitting(true);
        try {
            await api.post('/returns', {
                orderId: parseInt(orderId),
                reason,
                type: requestType
            });
            alert("Gửi yêu cầu hoàn trả thành công!");
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || "Gửi yêu cầu thất bại!");
        } finally {
            setSubmitting(false);
        }
    };

    const getTimelineStepClass = (stepIndex, currentStatus) => {
        const statuses = ['PENDING', 'APPROVED', 'REFUND_COMPLETED'];
        if (currentStatus === 'REJECTED') {
            return stepIndex === 0 ? 'active done' : stepIndex === 1 ? 'active rejected' : '';
        }
        
        const currentIdx = statuses.indexOf(currentStatus);
        if (stepIndex <= currentIdx) {
            return 'active done';
        }
        return '';
    };

    const getRefundMethodText = (method) => {
        switch (method) {
            case 'BANK_TRANSFER': return 'Chuyển khoản ngân hàng';
            case 'LOYALTY_POINTS': return 'Hoàn điểm tích lũy';
            case 'CASH': return 'Tiền mặt';
            default: return method || 'Chưa xác định';
        }
    };

    if (loading) {
        return (
            <div className="container py-5 text-center min-vh-100 d-flex align-items-center justify-content-center">
                <div className="spinner-border text-dark"></div>
            </div>
        );
    }

    return (
        <div className="return-request-page py-5 bg-white min-vh-100" style={{ fontFamily: '"Inter", sans-serif' }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                {/* Back button */}
                <button onClick={() => navigate('/orders')} className="btn btn-link text-dark p-0 text-decoration-none d-flex align-items-center gap-2 mb-4 fw-bold">
                    <FaArrowLeft /> QUAY LẠI LỊCH SỬ ĐƠN HÀNG
                </button>

                <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
                    <div>
                        <h2 className="fw-black text-uppercase tracking-tighter m-0 italic">YÊU CẦU HOÀN TRẢ / ĐỔI HÀNG</h2>
                        <p className="text-muted small fw-bold text-uppercase tracking-widest mt-1">Đơn hàng #ORD-{order?.id}</p>
                    </div>
                    {returnReq && (
                        <div className="text-end">
                            <span className="small text-muted fw-bold block mb-1">TRẠNG THÁI: </span>
                            {returnReq.status === 'PENDING' && <span className="badge bg-warning text-dark px-3 py-2 fw-bold">CHỜ DUYỆT</span>}
                            {returnReq.status === 'APPROVED' && <span className="badge bg-primary px-3 py-2 fw-bold">ĐÃ DUYỆT (CHỜ HOÀN TIỀN)</span>}
                            {returnReq.status === 'REJECTED' && <span className="badge bg-danger px-3 py-2 fw-bold">ĐÃ TỪ CHỐI</span>}
                            {returnReq.status === 'REFUND_COMPLETED' && <span className="badge bg-success px-3 py-2 fw-bold">HOÀN TẤT</span>}
                        </div>
                    )}
                </div>

                {/* Case 1: No request exists yet (Show Request Form) */}
                {!returnReq ? (
                    <div className="row g-4">
                        <div className="col-md-5">
                            <div className="card border-0 bg-light p-4 rounded-4 h-100 shadow-sm">
                                <h5 className="fw-bold mb-3 border-bottom pb-2">Thông tin đơn hàng</h5>
                                <div className="mb-3">
                                    <small className="text-muted fw-bold text-uppercase d-block mb-1">Người nhận</small>
                                    <span className="fw-bold">{order?.shippingName}</span>
                                </div>
                                <div className="mb-3">
                                    <small className="text-muted fw-bold text-uppercase d-block mb-1">Ngày đặt</small>
                                    <span>{new Date(order?.moment).toLocaleDateString('vi-VN')}</span>
                                </div>
                                <div className="mb-3">
                                    <small className="text-muted fw-bold text-uppercase d-block mb-1">Tổng thanh toán</small>
                                    <span className="fw-black text-danger h5">{order?.total?.toLocaleString()}đ</span>
                                </div>
                                <div className="mt-4 pt-3 border-top">
                                    <h6 className="fw-bold mb-2">Sản phẩm hoàn trả:</h6>
                                    {order?.items?.map((item, idx) => (
                                        <div key={idx} className="small d-flex justify-content-between mb-2">
                                            <span className="text-truncate" style={{ maxWidth: '70%' }}>{item.product?.name} ({item.size})</span>
                                            <span className="fw-bold">x{item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="col-md-7">
                            <div className="card border rounded-4 p-4 shadow-sm">
                                <h5 className="fw-black text-uppercase mb-4">Gửi yêu cầu hoàn trả</h5>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <label className="fw-bold small text-muted text-uppercase mb-2">Hình thức yêu cầu</label>
                                        <div className="row g-3">
                                            <div className="col-6">
                                                <div 
                                                    className={`p-3 border-2 rounded-4 text-center cursor-pointer transition-all ${requestType === 'RETURN' ? 'border-dark bg-dark text-white' : 'border-gray hover-bg-light'}`}
                                                    onClick={() => setRequestType('RETURN')}
                                                >
                                                    <FaUndo className="fs-3 mb-2" />
                                                    <div className="fw-bold small">TRẢ HÀNG & HOÀN TIỀN</div>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div 
                                                    className={`p-3 border-2 rounded-4 text-center cursor-pointer transition-all ${requestType === 'EXCHANGE' ? 'border-dark bg-dark text-white' : 'border-gray hover-bg-light'}`}
                                                    onClick={() => setRequestType('EXCHANGE')}
                                                >
                                                    <FaExchangeAlt className="fs-3 mb-2" />
                                                    <div className="fw-bold small">ĐỔI SẢN PHẨM KHÁC</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="fw-bold small text-muted text-uppercase mb-2">Lý do trả/đổi hàng</label>
                                        <textarea 
                                            className="form-control border rounded-3 p-3" 
                                            rows="4" 
                                            placeholder="Vui lòng cung cấp chi tiết lý do hoàn trả (ví dụ: sản phẩm bị lỗi, sai size, không giống hình, chất lượng không đạt...)"
                                            value={reason} 
                                            onChange={e => setReason(e.target.value)}
                                            required
                                        ></textarea>
                                    </div>

                                    <button 
                                        type="submit" 
                                        className="btn btn-dark w-100 py-3 fw-bold rounded-pill d-flex align-items-center justify-content-center gap-2"
                                        disabled={submitting}
                                    >
                                        {submitting ? (
                                            <div className="spinner-border spinner-border-sm"></div>
                                        ) : (
                                            <>GỬI YÊU CẦU HOÀN TRẢ</>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Case 2: Return Request Already Exists (Show Tracking Timeline and Details)
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden p-5 bg-light">
                        {/* Timeline */}
                        <div className="return-timeline mb-5">
                            <div className="row text-center position-relative">
                                {/* PENDING */}
                                <div className="col-4 position-relative">
                                    <div className={`timeline-circle mx-auto mb-2 d-flex align-items-center justify-content-center border-3 rounded-circle bg-white text-dark ${getTimelineStepClass(0, returnReq.status)}`} style={{ width: '50px', height: '50px' }}>
                                        <FaHourglassHalf />
                                    </div>
                                    <div className="fw-bold small text-uppercase">Yêu cầu đã gửi</div>
                                    <small className="text-muted d-block">{new Date(returnReq.createdAt).toLocaleDateString('vi-VN')}</small>
                                </div>

                                {/* APPROVED / REJECTED */}
                                <div className="col-4">
                                    <div className={`timeline-circle mx-auto mb-2 d-flex align-items-center justify-content-center border-3 rounded-circle bg-white text-dark ${getTimelineStepClass(1, returnReq.status)}`} style={{ width: '50px', height: '50px' }}>
                                        {returnReq.status === 'REJECTED' ? <FaTimesCircle className="text-danger" /> : <FaRegClipboard />}
                                    </div>
                                    <div className="fw-bold small text-uppercase">
                                        {returnReq.status === 'REJECTED' ? 'Bị từ chối' : 'Đang xử lý'}
                                    </div>
                                </div>

                                {/* REFUNDED / COMPLETED */}
                                <div className="col-4">
                                    <div className={`timeline-circle mx-auto mb-2 d-flex align-items-center justify-content-center border-3 rounded-circle bg-white text-dark ${getTimelineStepClass(2, returnReq.status)}`} style={{ width: '50px', height: '50px' }}>
                                        <FaCheckCircle />
                                    </div>
                                    <div className="fw-bold small text-uppercase">Hoàn tất</div>
                                </div>

                                {/* Line connecting steps */}
                                <div className="position-absolute top-25 start-0 end-0 translate-middle-y z-n1" style={{ top: '25px', zIndex: 0 }}>
                                    <div className="bg-secondary opacity-25" style={{ height: '3px', margin: '0 16%' }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Status Messages */}
                        <div className="card border-0 rounded-4 bg-white p-4 shadow-sm mb-4">
                            <h5 className="fw-black mb-3 text-uppercase">Chi tiết yêu cầu hoàn trả</h5>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <p className="mb-2"><strong>Hình thức:</strong> {returnReq.type === 'EXCHANGE' ? 'Đổi sản phẩm khác' : 'Trả hàng & Hoàn tiền'}</p>
                                    <p className="mb-2"><strong>Lý do gửi:</strong> {returnReq.reason}</p>
                                </div>
                                <div className="col-md-6 border-start-md ps-md-4">
                                    {returnReq.type === 'RETURN' ? (
                                        <>
                                            <p className="mb-2"><strong>Số tiền hoàn trả:</strong> <span className="text-danger fw-bold h5">{returnReq.refundAmount ? `${returnReq.refundAmount.toLocaleString()}đ` : '— (Tính khi duyệt)'}</span></p>
                                            {returnReq.status === 'REFUND_COMPLETED' && (
                                                <div className="bg-light p-3 rounded-3 mt-2">
                                                    <p className="mb-1"><strong><FaCoins className="me-1"/> Phương thức:</strong> {getRefundMethodText(returnReq.refundMethod)}</p>
                                                    <p className="mb-0"><strong><FaRegClipboard className="me-1"/> Ghi chú hoàn tiền:</strong> {returnReq.refundNote}</p>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="alert alert-info py-2">
                                            Yêu cầu Đổi sản phẩm: Shop đã hoàn lại kho sản phẩm cũ của bạn. Nhân viên CSKH sẽ liên hệ với bạn để gửi sản phẩm mới thay thế.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Order Summary in Tracking view */}
                        <div className="card border-0 rounded-4 bg-white p-4 shadow-sm">
                            <h6 className="fw-bold mb-3 border-bottom pb-2">Danh sách sản phẩm trong đơn hàng:</h6>
                            {order?.items?.map((item, idx) => (
                                <div key={idx} className="d-flex justify-content-between align-items-center mb-3">
                                    <div className="d-flex align-items-center gap-3">
                                        <img 
                                            src={item.product?.imgUrl ? (item.product?.imgUrl.startsWith('data:') ? item.product?.imgUrl : `http://localhost:8081${item.product?.imgUrl.split('|')[0].trim()}`) : 'https://placehold.co/50'}
                                            alt=""
                                            style={{ width: '50px', height: '65px', objectFit: 'cover', borderRadius: '5px' }}
                                        />
                                        <div>
                                            <div className="fw-bold small text-uppercase">{item.product?.name}</div>
                                            <small className="text-muted">Size: {item.size}</small>
                                        </div>
                                    </div>
                                    <span className="fw-bold text-dark">x{item.quantity}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
            {/* Custom styling inject for timeline active status */}
            <style dangerouslySetInnerHTML={{__html: `
                .timeline-circle.active.done {
                    background-color: #198754 !important;
                    border-color: #198754 !important;
                    color: white !important;
                }
                .timeline-circle.active.rejected {
                    background-color: #dc3545 !important;
                    border-color: #dc3545 !important;
                    color: white !important;
                }
                @media (min-width: 768px) {
                    .border-start-md {
                        border-left: 1px solid #dee2e6!important;
                    }
                }
            `}} />
        </div>
    );
};

export default ReturnRequest;
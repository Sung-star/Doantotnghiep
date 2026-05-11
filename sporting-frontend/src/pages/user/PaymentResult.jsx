import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaHome, FaBoxOpen } from 'react-icons/fa';

const PaymentResult = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState(null);
    const [orderId, setOrderId] = useState(null);

    useEffect(() => {
        const statusParam = searchParams.get('status');
        const orderIdParam = searchParams.get('orderId');
        setStatus(statusParam);
        setOrderId(orderIdParam);
    }, [searchParams]);

    const isSuccess = status === 'success';

    return (
        <div className="container py-5 min-vh-100 d-flex align-items-center justify-content-center" style={{fontFamily: '"Inter", sans-serif'}}>
            <div className="luxury-card p-5 text-center shadow-lg border-0" style={{maxWidth: '600px', borderRadius: '30px'}}>
                {isSuccess ? (
                    <>
                        <div className="mb-4">
                            <FaCheckCircle className="text-success display-1 animate__animated animate__bounceIn" />
                        </div>
                        <h2 className="fw-black text-dark text-uppercase tracking-tighter mb-2">THANH TOÁN THÀNH CÔNG!</h2>
                        <p className="text-muted mb-4 fs-5">Cảm ơn bạn! Đơn hàng <b>#ORD-{orderId}</b> của bạn đã được thanh toán và đang được xử lý.</p>
                        
                        <div className="bg-success bg-opacity-10 p-4 rounded-4 mb-5 text-start">
                            <div className="small fw-bold text-success text-uppercase mb-1">Ghi chú</div>
                            <div className="text-success-emphasis">Chúng tôi đã gửi email xác nhận chi tiết đơn hàng đến hộp thư của bạn.</div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="mb-4">
                            <FaTimesCircle className="text-danger display-1 animate__animated animate__shakeX" />
                        </div>
                        <h2 className="fw-black text-dark text-uppercase tracking-tighter mb-2">THANH TOÁN THẤT BẠI</h2>
                        <p className="text-muted mb-4 fs-5">Rất tiếc, đã có lỗi xảy ra trong quá trình thanh toán đơn hàng <b>#ORD-{orderId}</b>.</p>
                        
                        <div className="bg-danger bg-opacity-10 p-4 rounded-4 mb-5 text-start">
                            <div className="small fw-bold text-danger text-uppercase mb-1">Gợi ý</div>
                            <div className="text-danger-emphasis">Vui lòng kiểm tra lại số dư tài khoản hoặc thử lại với phương thức thanh toán khác.</div>
                        </div>
                    </>
                )}

                <div className="row g-3">
                    <div className="col-md-6">
                        <button className="luxury-button w-100 py-3 bg-dark text-white gap-2" onClick={() => navigate('/')}>
                            <FaHome /> TRANG CHỦ
                        </button>
                    </div>
                    <div className="col-md-6">
                        <button className="luxury-button w-100 py-3 bg-light text-dark border gap-2" onClick={() => navigate('/profile')}>
                            <FaBoxOpen /> ĐƠN HÀNG
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentResult;

import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';

const PaymentResult = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('loading'); // loading, success, failed, error
    const [orderId, setOrderId] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const paymentStatus = searchParams.get('status');
        const orderIdParam = searchParams.get('orderId');
        const messageParam = searchParams.get('message');

        setOrderId(orderIdParam);

        switch (paymentStatus) {
            case 'success':
                setStatus('success');
                setMessage('Thanh toán thành công! Cảm ơn bạn đã mua hàng tại Sporting Shop.');
                break;
            case 'failed':
                setStatus('failed');
                setMessage('Thanh toán không thành công. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.');
                break;
            case 'error':
                setStatus('error');
                if (messageParam === 'InvalidSignature') {
                    setMessage('Lỗi: Chữ ký không hợp lệ. Giao dịch không thể được xác thực.');
                } else {
                    setMessage('Đã có lỗi xảy ra trong quá trình xử lý thanh toán.');
                }
                break;
            default:
                setStatus('loading');
                setMessage('Đang xác thực và xử lý kết quả thanh toán...');
        }
    }, [searchParams]);

    const renderIcon = () => {
        switch (status) {
            case 'success':
                return <CheckCircle className="text-success" size={80} strokeWidth={1.5} />;
            case 'failed':
                return <XCircle className="text-danger" size={80} strokeWidth={1.5} />;
            case 'error':
                return <AlertTriangle className="text-warning" size={80} strokeWidth={1.5} />;
            default:
                return <Loader2 className="animate-spin text-primary" size={80} strokeWidth={1.5} />;
        }
    };

    return (
        <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
            <div className="card text-center p-4 p-md-5 shadow-sm border-0" style={{ maxWidth: '500px', borderRadius: '15px' }}>
                <div className="card-body">
                    <div className="mb-4">
                        {renderIcon()}
                    </div>
                    <h2 className="card-title fw-bold mb-3">
                        {status === 'success' && 'Giao dịch thành công'}
                        {status === 'failed' && 'Giao dịch thất bại'}
                        {status === 'error' && 'Giao dịch lỗi'}
                        {status === 'loading' && 'Đang xử lý'}
                    </h2>
                    <p className="text-muted mb-4">{message}</p>
                    {orderId && (
                        <p className="mb-4">Mã đơn hàng của bạn: <strong className="text-primary">#{orderId}</strong></p>
                    )}
                    <div className="d-grid gap-2 mt-4">
                        <Link to="/products" className="btn btn-primary fw-semibold">Tiếp tục mua sắm</Link>
                        {status !== 'loading' && (<Link to="/user/orders" className="btn btn-outline-secondary">Xem lịch sử đơn hàng</Link>)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentResult;
import React, { useState, useEffect } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { 
  FaQrcode, FaMoneyBillWave, FaCheckCircle, 
  FaMapMarkerAlt, FaUser, FaPhoneAlt, FaArrowLeft 
} from 'react-icons/fa';

const Checkout = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || '',
    phone: '',
    address: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [orderResponse, setOrderResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const MY_BANK = { 
    ID: "MB", 
    ACCOUNT_NO: "0335824996", 
    ACCOUNT_NAME: "NGUYEN VAN AN" 
  };

  useEffect(() => {
    if (cartItems.length === 0 && !orderResponse) {
      navigate('/');
    }
  }, [cartItems, orderResponse, navigate]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (!user) return alert("Vui lòng đăng nhập để tiếp tục!");
    
    if (!shippingInfo.fullName.trim() || !shippingInfo.phone.trim() || !shippingInfo.address.trim()) {
      return alert("Vui lòng điền đầy đủ thông tin giao hàng!");
    }

    setLoading(true);
    try {
      // SỬA LỖI TẠI ĐÂY: Thêm sizeName và các thông tin giao nhận
      const orderDto = {
        clientId: user.id,
        shippingName: shippingInfo.fullName,
        shippingPhone: shippingInfo.phone,
        shippingAddress: shippingInfo.address,
        items: cartItems.map(item => ({ 
          productId: item.id, 
          quantity: item.quantity,
          sizeName: item.selectedSize?.size // Backend yêu cầu String size ("M", "L"...)
        }))
      };

      const res = await api.post('/orders', orderDto);
      
      if (res.status === 200 || res.status === 201) {
        setOrderResponse(res.data);
        clearCart(); 
      }
    } catch (error) {
      console.error("Order Error:", error);
      // Hiển thị thông báo lỗi chi tiết từ Server nếu có
      const errorMsg = error.response?.data?.message || "Đặt hàng thất bại. Vui lòng kiểm tra lại tồn kho!";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // --- GIAO DIỆN SAU KHI ĐẶT HÀNG THÀNH CÔNG ---
  if (orderResponse) {
    return (
      <div className="container mt-5 text-center">
        <div className="card shadow-lg p-5 mx-auto border-0" style={{maxWidth: '600px', borderRadius: '15px'}}>
          <FaCheckCircle className="text-success display-1 mb-3" />
          <h2 className="fw-bold text-dark">Đặt hàng hoàn tất!</h2>
          <p className="text-muted fs-5">Mã đơn hàng: <span className="badge bg-dark">#DH{orderResponse.id}</span></p>
          
          <div className="my-4 p-4 rounded" style={{ backgroundColor: '#f8f9fa' }}>
            {paymentMethod === 'ONLINE' ? (
              <>
                <div className="alert alert-info fw-bold">
                  Quét mã QR để thanh toán: {orderResponse.total?.toLocaleString()} VNĐ
                </div>
                <img 
                  src={`https://img.vietqr.io/image/${MY_BANK.ID}-${MY_BANK.ACCOUNT_NO}-compact.png?amount=${orderResponse.total}&addInfo=THANH TOAN DH${orderResponse.id}&accountName=${MY_BANK.ACCOUNT_NAME}`} 
                  alt="QR Payment" 
                  className="img-fluid mb-3 shadow-sm border border-white" 
                  style={{maxWidth: '280px', borderRadius: '10px'}} 
                />
                <h5 className="text-primary fw-bold mb-0">Nội dung: DH{orderResponse.id}</h5>
                <small className="text-muted">Hệ thống sẽ xác nhận sau khi nhận được tiền</small>
              </>
            ) : (
              <div className="py-3">
                <FaMoneyBillWave className="text-success display-4 mb-3" />
                <h5>Bạn đã chọn: <b>Thanh toán khi nhận hàng (COD)</b></h5>
                <p className="text-muted">Vui lòng chuẩn bị số tiền <b>{orderResponse.total?.toLocaleString()}đ</b> khi shipper giao tới.</p>
              </div>
            )}
          </div>
          
          <button className="btn btn-primary btn-lg w-100 py-3 shadow-sm fw-bold" onClick={() => navigate('/')}>
            TIẾP TỤC MUA SẮM
          </button>
        </div>
      </div>
    );
  }

  // --- GIAO DIỆN TRANG NHẬP THÔNG TIN ---
  return (
    <div className="container mt-5 mb-5">
      <div className="row">
        <div className="col-md-7">
          <button onClick={() => navigate('/cart')} className="btn btn-link text-dark p-0 mb-3 text-decoration-none">
            <FaArrowLeft className="me-2" /> Quay lại giỏ hàng
          </button>
          
          <div className="card p-4 shadow-sm border-0 mb-4" style={{borderRadius: '12px'}}>
            <h4 className="fw-bold mb-4">1. Thông tin giao hàng</h4>
            <div className="mb-3">
              <label className="form-label fw-semibold"><FaUser className="me-2 text-primary"/>Họ và tên</label>
              <input type="text" className="form-control form-control-lg" value={shippingInfo.fullName} 
                onChange={(e) => setShippingInfo({...shippingInfo, fullName: e.target.value})} />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold"><FaPhoneAlt className="me-2 text-primary"/>Số điện thoại</label>
              <input type="text" className="form-control form-control-lg" placeholder="Ví dụ: 0912345xxx"
                value={shippingInfo.phone}
                onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})} />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold"><FaMapMarkerAlt className="me-2 text-primary"/>Địa chỉ nhận hàng</label>
              <textarea className="form-control" rows="3" placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                value={shippingInfo.address}
                onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}></textarea>
            </div>
          </div>

          <div className="card p-4 shadow-sm border-0" style={{borderRadius: '12px'}}>
            <h4 className="fw-bold mb-4">2. Phương thức thanh toán</h4>
            
            <div 
              className={`p-3 mb-3 border rounded-3 d-flex align-items-center transition-all ${paymentMethod === 'COD' ? 'border-primary bg-primary bg-opacity-10' : ''}`} 
              style={{cursor: 'pointer'}} 
              onClick={() => setPaymentMethod('COD')}
            >
              <FaMoneyBillWave className={`me-3 fs-3 ${paymentMethod === 'COD' ? 'text-primary' : 'text-muted'}`} />
              <div className="flex-grow-1">
                <div className="fw-bold">Thanh toán khi nhận hàng (COD)</div>
                <small className="text-muted">Nhận hàng rồi mới trả tiền</small>
              </div>
              <div className="rounded-circle border d-flex align-items-center justify-content-center" style={{width: '20px', height: '20px'}}>
                  {paymentMethod === 'COD' && <div className="bg-primary rounded-circle" style={{width: '12px', height: '12px'}}></div>}
              </div>
            </div>

            <div 
              className={`p-3 border rounded-3 d-flex align-items-center transition-all ${paymentMethod === 'ONLINE' ? 'border-primary bg-primary bg-opacity-10' : ''}`} 
              style={{cursor: 'pointer'}} 
              onClick={() => setPaymentMethod('ONLINE')}
            >
              <FaQrcode className={`me-3 fs-3 ${paymentMethod === 'ONLINE' ? 'text-primary' : 'text-muted'}`} />
              <div className="flex-grow-1">
                <div className="fw-bold">Chuyển khoản qua Mã QR (VietQR)</div>
                <small className="text-muted">Tạo mã QR tự động chính xác số tiền</small>
              </div>
              <div className="rounded-circle border d-flex align-items-center justify-content-center" style={{width: '20px', height: '20px'}}>
                  {paymentMethod === 'ONLINE' && <div className="bg-primary rounded-circle" style={{width: '12px', height: '12px'}}></div>}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-5">
          <div className="card p-4 shadow-sm border-0 sticky-top" style={{top: '20px', borderRadius: '12px'}}>
            <h4 className="fw-bold mb-4">Đơn hàng của bạn</h4>
            <div className="mb-3 overflow-auto" style={{maxHeight: '400px'}}>
              {cartItems.map((item, index) => (
                <div key={`${item.id}-${index}`} className="d-flex align-items-center mb-3">
                  <img src={item.imgUrl} alt={item.name} style={{width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px'}} className="me-3" />
                  <div className="flex-grow-1">
                    <div className="fw-bold small">{item.name}</div>
                    <small className="text-muted">SL: {item.quantity} | Size: {item.selectedSize?.size}</small>
                  </div>
                  <div className="fw-bold">{(item.price * item.quantity).toLocaleString()}đ</div>
                </div>
              ))}
            </div>
            <hr />
            <div className="d-flex justify-content-between h4 fw-bold text-danger mt-2 mb-4">
              <span>Tổng thanh toán:</span>
              <span>{getTotalPrice().toLocaleString()} VNĐ</span>
            </div>
            <button 
              className="btn btn-danger btn-lg w-100 fw-bold py-3 shadow" 
              onClick={handlePlaceOrder} 
              disabled={loading}
            >
              {loading && <span className="spinner-border spinner-border-sm me-2"></span>}
              {loading ? "ĐANG XỬ LÝ..." : "XÁC NHẬN ĐẶT HÀNG"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
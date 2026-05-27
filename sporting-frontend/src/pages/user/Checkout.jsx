import React, { useState, useEffect } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import VoucherSelector from './VoucherSelector';
import { 
  FaQrcode, FaMoneyBillWave, FaCheckCircle,
  FaMapMarkerAlt, FaUser, FaPhoneAlt, FaArrowLeft,
  FaChevronDown
} from 'react-icons/fa';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    address: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [shippingFee, setShippingFee] = useState(0);
  const [orderResponse, setOrderResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [detailAddress, setDetailAddress] = useState('');

  // Fetch saved addresses
  useEffect(() => {
    if (user?.id) {
      api.get(`/addresses/user/${user.id}`)
        .then(res => {
          setSavedAddresses(res.data);
          const defaultAddr = res.data.find(a => a.isDefault);
          if (defaultAddr) {
            applySavedAddress(defaultAddr);
          }
        })
        .catch(err => console.error("Error fetching addresses:", err));
    }
  }, [user]);

  const applySavedAddress = (addr) => {
    setShippingInfo({
      fullName: addr.fullName,
      phone: addr.phone,
      address: `${addr.detail}, ${addr.ward}, ${addr.district}, ${addr.province}`
    });
    setDetailAddress(addr.detail);
    
    // Attempt to match province/district/ward from strings
    const p = provinces.find(prov => prov.name === addr.province);
    if (p) {
      setSelectedProvince(p.code);
      fetch(`https://provinces.open-api.vn/api/p/${p.code}?depth=2`)
        .then(res => res.json())
        .then(data => {
          setDistricts(data.districts);
          const d = data.districts.find(dist => dist.name === addr.district);
          if (d) {
            setSelectedDistrict(d.code);
            return fetch(`https://provinces.open-api.vn/api/d/${d.code}?depth=2`);
          }
        })
        .then(res => res?.json())
        .then(data => {
          if (data) {
            setWards(data.wards);
            const w = data.wards.find(ward => ward.name === addr.ward);
            if (w) setSelectedWard(w.code);
          }
        })
        .catch(err => console.error("Sync error:", err));
    }
  };

  useEffect(() => {
    fetch('https://provinces.open-api.vn/api/?depth=1')
      .then(res => res.json())
      .then(data => setProvinces(data))
      .catch(err => console.error("Error fetching provinces:", err));
  }, []);

  const handleProvinceChange = (e) => {
    const pCode = e.target.value;
    setSelectedProvince(pCode);
    setSelectedDistrict('');
    setSelectedWard('');
    setDistricts([]);
    setWards([]);
    if (pCode) {
      fetch(`https://provinces.open-api.vn/api/p/${pCode}?depth=2`)
        .then(res => res.json())
        .then(data => setDistricts(data.districts))
        .catch(err => console.error("Error fetching districts:", err));
    }
  };

  const handleDistrictChange = (e) => {
    const dCode = e.target.value;
    setSelectedDistrict(dCode);
    setSelectedWard('');
    setWards([]);
    if (dCode) {
      fetch(`https://provinces.open-api.vn/api/d/${dCode}?depth=2`)
        .then(res => res.json())
        .then(data => setWards(data.wards))
        .catch(err => console.error("Error fetching wards:", err));
    }
  };

  // Sync address and calculate fee
  useEffect(() => {
    const pName = provinces.find(p => p.code == selectedProvince)?.name || '';
    const dName = districts.find(d => d.code == selectedDistrict)?.name || '';
    const wName = wards.find(w => w.code == selectedWard)?.name || '';
    
    if (pName) {
      const fullAddress = [detailAddress, wName, dName, pName].filter(Boolean).join(', ');
      setShippingInfo(prev => ({ ...prev, address: fullAddress }));
      
      // Dynamic Fee Simulation (North/Central/South)
      const addr = fullAddress.toLowerCase();
      if (addr.includes("hà nội") || addr.includes("hải phòng") || addr.includes("bắc ninh")) setShippingFee(30000);
      else if (addr.includes("hồ chí minh") || addr.includes("tphcm") || addr.includes("bình dương")) setShippingFee(35000);
      else setShippingFee(45000);
    }
  }, [selectedProvince, selectedDistrict, selectedWard, detailAddress, provinces, districts, wards]);

  // Tính toán Subtotal từ giỏ hàng
  const subtotal = getTotalPrice();

  // Logic tính tiền giảm (Thực hiện ngay trên Frontend để UX mượt mà)
  const calculateDiscountAmount = () => {
      if (!selectedVoucher || subtotal < selectedVoucher.minOrderAmount) return 0;
      let discount = subtotal * (selectedVoucher.discountPercent / 100);
      if (selectedVoucher.maxDiscountAmount && discount > selectedVoucher.maxDiscountAmount) {
          discount = selectedVoucher.maxDiscountAmount;
      }
      return discount;
  };

  const discountAmount = calculateDiscountAmount();
  const finalTotal = subtotal + shippingFee - discountAmount;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!user) return alert("Vui lòng đăng nhập!");
    if (!shippingInfo.address) return alert("Vui lòng nhập địa chỉ giao hàng!");

    setLoading(true);
    const orderDto = { // orderData was a floating snippet, now correctly defined as orderDto
      clientId: user.id,
      shippingName: shippingInfo.fullName,
      shippingPhone: shippingInfo.phone,
      shippingAddress: shippingInfo.address,
      voucherCode: selectedVoucher ? selectedVoucher.code : null, // Sử dụng mã từ selectedVoucher
      items: cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        sizeName: item.selectedSize?.size,
        color: item.selectedColor
      }))
    };
    try {
      const res = await api.post('/orders', orderDto);
      const newOrder = res.data;

      if (paymentMethod === 'VNPAY') {
        const paymentRes = await api.post('/payment/create-payment', {
          orderId: newOrder.id,
          amount: newOrder.total
        });
        window.location.href = paymentRes.data.url;
      } else {
        setOrderResponse(newOrder);
        clearCart();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Đặt hàng thất bại!");
    } finally {
      setLoading(false);
    }
  };

  if (orderResponse) {
    return (
      <div className="container py-5 text-center">
        <div className="luxury-card p-5 mx-auto" style={{maxWidth: '600px'}}>
          <FaCheckCircle className="text-success display-1 mb-4" />
          <h2 className="fw-black text-dark mb-2">ĐẶT HÀNG THÀNH CÔNG!</h2>
          <p className="text-muted mb-4">Cảm ơn bạn đã tin dùng Sporting Shop. Mã đơn hàng của bạn là <b>#ORD-{orderResponse.id}</b></p>
          <div className="bg-light p-4 rounded-4 mb-4 text-start">
              <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Tổng thanh toán:</span>
                  <span className="fw-black text-danger h5 mb-0">{orderResponse.total?.toLocaleString()}đ</span>
              </div>
              <div className="d-flex justify-content-between">
                  <span className="text-muted">Trạng thái:</span>
                  <span className="badge bg-warning text-dark px-3">CHỜ XÁC NHẬN</span>
              </div>
          </div>
          <button className="luxury-button w-100 py-3" onClick={() => navigate('/')}>TIẾP TỤC KHÁM PHÁ</button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page bg-white min-vh-100 py-5" style={{fontFamily: '"Inter", sans-serif'}}>
      <div className="container">
        <div className="row g-5">
          {/* Left: Shipping & Payment */}
          <div className="col-lg-7">
            <div className="d-flex align-items-center gap-3 mb-5">
                <div className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>1</div>
                <h3 className="fw-black text-uppercase m-0 tracking-widest">THÔNG TIN GIAO HÀNG</h3>
            </div>

            {/* Saved Addresses Selector */}
            {savedAddresses.length > 0 && (
                <div className="mb-4 p-4 border rounded-4 bg-light d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                        <FaMapMarkerAlt className="text-primary fs-4" />
                        <div>
                            <div className="fw-bold">Sử dụng địa chỉ đã lưu</div>
                            <small className="text-muted">Tiết kiệm thời gian nhập liệu</small>
                        </div>
                    </div>
                    <select className="form-select w-auto border-0 shadow-sm rounded-3" onChange={(e) => {
                        const addr = savedAddresses.find(a => a.id == e.target.value);
                        if (addr) applySavedAddress(addr);
                    }}>
                        <option value="">Chọn địa chỉ...</option>
                        {savedAddresses.map(addr => (
                            <option key={addr.id} value={addr.id}>{addr.detail} ({addr.fullName})</option>
                        ))}
                    </select>
                </div>
            )}

            <div className="row g-4 mb-5">
              <div className="col-md-6">
                <label className="fw-bold small text-muted text-uppercase mb-2">Họ và tên người nhận</label>
                <input type="text" className="luxury-input w-100" value={shippingInfo.fullName} 
                    onChange={e => setShippingInfo({...shippingInfo, fullName: e.target.value})} />
              </div>
              <div className="col-md-6">
                <label className="fw-bold small text-muted text-uppercase mb-2">Số điện thoại</label>
                <input type="text" className="luxury-input w-100" value={shippingInfo.phone} 
                    onChange={e => setShippingInfo({...shippingInfo, phone: e.target.value})} />
              </div>
              
              <div className="col-md-4">
                <label className="fw-bold small text-muted text-uppercase mb-2">Tỉnh / Thành phố</label>
                <select className="luxury-input w-100" value={selectedProvince} onChange={handleProvinceChange}>
                  <option value="">Chọn Tỉnh thành</option>
                  {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                </select>
              </div>
              <div className="col-md-4">
                <label className="fw-bold small text-muted text-uppercase mb-2">Quận / Huyện</label>
                <select className="luxury-input w-100" value={selectedDistrict} onChange={handleDistrictChange} disabled={!selectedProvince}>
                  <option value="">Chọn Quận huyện</option>
                  {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                </select>
              </div>
              <div className="col-md-4">
                <label className="fw-bold small text-muted text-uppercase mb-2">Phường / Xã</label>
                <select className="luxury-input w-100" value={selectedWard} onChange={e => setSelectedWard(e.target.value)} disabled={!selectedDistrict}>
                  <option value="">Chọn Phường xã</option>
                  {wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
                </select>
              </div>
              
              <div className="col-12">
                <label className="fw-bold small text-muted text-uppercase mb-2">Địa chỉ chi tiết</label>
                <textarea className="luxury-input w-100" style={{height: '100px'}} placeholder="Số nhà, tên đường..." 
                    value={detailAddress} onChange={e => setDetailAddress(e.target.value)}></textarea>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3 mb-5">
                <div className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>2</div>
                <h3 className="fw-black text-uppercase m-0 tracking-widest">PHƯƠNG THỨC THANH TOÁN</h3>
            </div>

            <div className="row g-3 mb-5">
                {[
                    { id: 'COD', name: 'THANH TOÁN KHI NHẬN HÀNG (COD)', sub: 'Trả tiền mặt cho shipper', icon: <FaMoneyBillWave /> },
                    { id: 'VNPAY', name: 'THANH TOÁN QUA VNPAY', sub: 'Thẻ ATM / QR Code / Ví điện tử', icon: <img src="https://vnpay.vn/wp-content/uploads/2020/07/vnpay-logo.png" style={{height: '20px'}} /> }
                ].map(method => (
                    <div key={method.id} className="col-12">
                        <div className={`p-4 border-2 rounded-4 d-flex align-items-center gap-4 transition-all cursor-pointer ${paymentMethod === method.id ? 'border-dark bg-light' : 'border-light'}`}
                             onClick={() => setPaymentMethod(method.id)}>
                            <div className="fs-3">{method.icon}</div>
                            <div className="flex-grow-1">
                                <div className="fw-black small">{method.name}</div>
                                <small className="text-muted">{method.sub}</small>
                            </div>
                            <div className={`rounded-circle border-2 ${paymentMethod === method.id ? 'bg-dark border-dark' : 'border-gray'}`} style={{width: '20px', height: '20px', padding: '2px'}}>
                                <div className="bg-white rounded-circle w-100 h-100"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          </div>

          {/* Right: Order Summary (Sticky) */}
          <div className="col-lg-5">
            <div className="sticky-top" style={{top: '100px', zIndex: 10}}>
                <div className="luxury-card p-5 border-0 shadow-2xl">
                    <h4 className="fw-black text-uppercase tracking-widest mb-4">TÓM TẮT ĐƠN HÀNG</h4>
                    
                    <div className="mb-4 overflow-auto" style={{maxHeight: '300px'}}>
                        {cartItems.map((item, index) => (
                            <div key={index} className="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom border-light">
                                <img src={item.image} alt="" className="rounded-3 shadow-sm" style={{width: '60px', height: '70px', objectFit: 'cover'}} />
                                <div className="flex-grow-1">
                                    <div className="fw-bold text-truncate" style={{maxWidth: '180px'}}>{item.name}</div>
                                    <small className="text-muted d-block">Size: {item.selectedSize?.size} | Màu: {item.selectedColor}</small>
                                    <div className="fw-black small">{item.price?.toLocaleString()}đ x {item.quantity}</div>
                                </div>
                                <div className="fw-black text-dark">{(item.price * item.quantity).toLocaleString()}đ</div>
                            </div>
                        ))}
                    </div>

                    {/* Voucher Section */}
                    <div className="mb-4">
                        <VoucherSelector 
                            subtotal={subtotal} 
                            onSelect={(v) => setSelectedVoucher(v)} 
                            selectedVoucher={selectedVoucher} 
                        />
                    </div>

                    <div className="space-y-3 mb-4">
                        <div className="d-flex justify-content-between text-muted">
                            <span>Tạm tính:</span>
                            <span className="fw-bold">{subtotal.toLocaleString()}đ</span>
                        </div>
                        <div className="d-flex justify-content-between text-muted">
                            <span>Phí vận chuyển:</span>
                            <span className="fw-bold text-success">+{shippingFee?.toLocaleString()}đ</span>
                        </div>
                        {discountAmount > 0 && (
                            <div className="d-flex justify-content-between text-danger">
                                <span>Giảm giá ({selectedVoucher.code}):</span>
                                <span className="fw-bold">-{discountAmount.toLocaleString()}đ</span>
                            </div>
                        )}
                        <hr className="my-3 border-light" />
                        <div className="d-flex justify-content-between h3 mb-0">
                            <span className="fw-black tracking-tighter">TỔNG CỘNG</span>
                            <span className="fw-black text-dark">{finalTotal.toLocaleString()}đ</span>
                        </div>
                    </div>

                    <button className="luxury-button w-100 py-4 fs-5 gap-3" onClick={handlePlaceOrder} disabled={loading}>
                        {loading ? <div className="spinner-border spinner-border-sm" /> : <><FaCheckCircle /> XÁC NHẬN THANH TOÁN</>}
                    </button>
                    
                    <p className="small text-center text-muted mt-4 mb-0">Bằng việc đặt hàng, bạn đồng ý với <a href="#" className="text-dark fw-bold">Điều khoản & Chính sách</a> của Sporting Shop.</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
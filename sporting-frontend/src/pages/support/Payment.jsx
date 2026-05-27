import { Link } from 'react-router-dom';
import { 
  CreditCard, Smartphone, Building, ShieldCheck, 
  ChevronRight, AlertTriangle, CheckCircle
} from 'lucide-react';
import './SupportPage.css';

const Payment = () => {
  const paymentMethods = [
    {
      icon: <CreditCard size={28}/>,
      title: 'Thẻ tín dụng / Ghi nợ',
      desc: 'Hỗ trợ thẻ Visa, Mastercard, JCB phát hành tại Việt Nam hoặc quốc tế.',
      features: ['Thanh toán an toàn qua cổng VNPay/OnePay', 'Không mất phí giao dịch', 'Hỗ trợ trả góp 0% cho đơn từ 3 triệu'],
      color: 'blue'
    },
    {
      icon: <Smartphone size={28}/>,
      title: 'Ví điện tử',
      desc: 'Thanh toán nhanh chóng, tiện lợi qua các ứng dụng ví điện tử phổ biến.',
      features: ['MoMo, ZaloPay, VNPay, ShopeePay', 'Nhận thêm ưu đãi từ đối tác ví', 'Xác nhận đơn hàng tức thì'],
      color: 'purple'
    },
    {
      icon: <Building size={28}/>,
      title: 'Chuyển khoản ngân hàng',
      desc: 'Chuyển khoản trực tiếp vào tài khoản công ty của SportingShop.',
      features: ['Hỗ trợ tất cả ngân hàng tại Việt Nam', 'Giao dịch qua mã QR tiện lợi', 'Đơn hàng được xác nhận trong 15-30 phút'],
      color: 'green'
    },
    {
      icon: <ShieldCheck size={28}/>,
      title: 'Thanh toán khi nhận hàng (COD)',
      desc: 'Thanh toán bằng tiền mặt hoặc chuyển khoản cho nhân viên giao hàng.',
      features: ['Kiểm tra hàng trước khi thanh toán', 'Áp dụng toàn quốc', 'Phí thu hộ (nếu có) tùy khu vực'],
      color: 'orange'
    }
  ];

  return (
    <div style={{ fontFamily: '"Inter", sans-serif' }}>
      <section className="support-hero">
        <div className="container position-relative" style={{ zIndex: 1 }}>
          <div className="support-breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span>/</span>
            <span style={{ color: 'rgba(255,255,255,0.8)' }}>Chính sách thanh toán</span>
          </div>
          <div className="support-hero-badge">
            <CreditCard size={14} /> Thanh toán an toàn
          </div>
          <h1>Đa dạng phương thức,<br /><span style={{ color: '#60a5fa' }}>bảo mật tuyệt đối</span></h1>
          <p>SportingShop cung cấp nhiều phương thức thanh toán linh hoạt, an toàn và tiện lợi nhất cho khách hàng, tuân thủ các tiêu chuẩn bảo mật quốc tế.</p>
        </div>
      </section>

      <section className="support-content">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="support-card">
                <div className="section-label">Phương thức thanh toán</div>
                <h3 className="section-title-lg">Các hình thức được chấp nhận</h3>
                <div className="row g-4 mt-2">
                  {paymentMethods.map((method, i) => (
                    <div className="col-md-6" key={i}>
                      <div className="p-4 rounded-4 border h-100" style={{ borderColor: '#f0f0f0' }}>
                        <div className={`support-card-icon ${method.color} mb-3`}>{method.icon}</div>
                        <h4 className="fw-bold mb-2">{method.title}</h4>
                        <p className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>{method.desc}</p>
                        <ul className="list-unstyled mb-0">
                          {method.features.map((feat, j) => (
                            <li key={j} className="d-flex align-items-start gap-2 mb-2" style={{ fontSize: '0.85rem' }}>
                              <CheckCircle size={14} className="text-success mt-1 flex-shrink-0" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="support-card">
                 <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="support-card-icon teal"><ShieldCheck size={22}/></div>
                  <div>
                    <div className="section-label">Cam kết bảo mật</div>
                    <h4 className="mb-0">An toàn thông tin thanh toán</h4>
                  </div>
                </div>
                <p>Chúng tôi sử dụng tiêu chuẩn bảo mật PCI DSS (Payment Card Industry Data Security Standard) để mã hóa và bảo vệ thông tin thanh toán của bạn.</p>
                <div className="highlight-box">
                  <h6 className="d-flex align-items-center gap-2"><ShieldCheck size={18}/> Không lưu trữ thông tin thẻ</h6>
                  <p>SportingShop KHÔNG lưu trữ thông tin thẻ tín dụng/ghi nợ của bạn trên hệ thống. Mọi giao dịch được xử lý thông qua cổng thanh toán bảo mật của đối tác.</p>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
               <div className="support-info-banner mb-4">
                <div className="position-relative" style={{ zIndex: 1 }}>
                  <h3 className="fw-black mb-3">Lỗi thanh toán?</h3>
                  <p className="mb-3">Nếu bạn gặp sự cố khi thanh toán hoặc bị trừ tiền nhưng đơn hàng chưa thành công, vui lòng liên hệ ngay với chúng tôi.</p>
                  <div className="warning-box mt-3 mb-0" style={{ padding: '15px' }}>
                    <div className="d-flex align-items-start gap-2">
                      <AlertTriangle size={18} className="text-warning flex-shrink-0 mt-1" />
                      <p className="mb-0 text-dark" style={{ fontSize: '0.85rem' }}>Cung cấp <strong>Mã giao dịch</strong> hoặc <strong>Số điện thoại</strong> để được hỗ trợ nhanh nhất.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="support-card">
                <h4>Xem thêm</h4>
                {[
                  { to: '/support/shipping', label: 'Chính sách vận chuyển' },
                  { to: '/support/return-policy', label: 'Chính sách đổi trả' },
                  { to: '/support/security', label: 'Chính sách bảo mật' },
                ].map((l) => (
                  <Link key={l.to} to={l.to} className="d-flex align-items-center justify-content-between py-2 text-decoration-none border-bottom" style={{ color: '#444', fontSize: '0.9rem' }}>
                    <span>{l.label}</span><ChevronRight size={15} className="text-muted" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Payment;

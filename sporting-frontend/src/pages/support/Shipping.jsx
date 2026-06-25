import { Link } from 'react-router-dom';
import { 
  Truck, MapPin, Clock, Package, CheckCircle,
  ChevronRight, Phone, Mail, Zap, Shield
} from 'lucide-react';
import './SupportPage.css';

const Shipping = () => {
  const shippingOptions = [
    {
      icon: <Zap size={24}/>,
      color: 'orange',
      name: 'Giao hàng hỏa tốc',
      time: '2–4 giờ',
      fee: '40.000đ',
      note: 'Chỉ áp dụng nội thành TP.HCM & Hà Nội',
    },
    {
      icon: <Truck size={24}/>,
      color: 'blue',
      name: 'Giao hàng nhanh',
      time: '1–2 ngày',
      fee: '25.000đ',
      note: 'Miễn phí khi đơn hàng từ 500.000đ',
    },
    {
      icon: <Package size={24}/>,
      color: 'green',
      name: 'Giao hàng tiêu chuẩn',
      time: '3–5 ngày',
      fee: '15.000đ',
      note: 'Miễn phí khi đơn hàng từ 300.000đ',
    },
    {
      icon: <MapPin size={24}/>,
      color: 'purple',
      name: 'Nhận tại cửa hàng',
      time: 'Trong ngày',
      fee: 'Miễn phí',
      note: 'Xuất trình mã đơn hàng khi đến nhận',
    },
  ];

  const provinces = [
    { area: 'TP. Hồ Chí Minh', express: '2–4 giờ', standard: '1–2 ngày' },
    { area: 'Hà Nội', express: '2–4 giờ', standard: '1–2 ngày' },
    { area: 'Đà Nẵng', express: 'Không áp dụng', standard: '2–3 ngày' },
    { area: 'Các tỉnh miền Nam', express: 'Không áp dụng', standard: '2–4 ngày' },
    { area: 'Các tỉnh miền Bắc', express: 'Không áp dụng', standard: '3–5 ngày' },
    { area: 'Tây Nguyên & miền núi', express: 'Không áp dụng', standard: '4–7 ngày' },
  ];

  return (
    <div style={{ fontFamily: '"Inter", sans-serif' }}>
      {/* Hero */}
      <section className="support-hero">
        <div className="container position-relative" style={{ zIndex: 1 }}>
          <div className="support-breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span>/</span>
            <span style={{ color: 'rgba(255,255,255,0.8)' }}>Chính sách vận chuyển</span>
          </div>
          <div className="support-hero-badge">
            <Truck size={14} /> Vận chuyển & Giao hàng
          </div>
          <h1>Giao hàng nhanh chóng,<br /><span style={{ color: '#60a5fa' }}>an toàn & tin cậy</span></h1>
          <p>Chúng tôi hợp tác với các đơn vị vận chuyển uy tín để đảm bảo đơn hàng của bạn được giao đến tay một cách nhanh nhất và an toàn nhất.</p>
        </div>
      </section>

      <section className="support-content">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-8">

              {/* Shipping options */}
              <div className="support-card">
                <div className="section-label">Tùy chọn giao hàng</div>
                <h3 className="section-title-lg">Hình thức vận chuyển</h3>
                <p className="section-subtitle">Chọn hình thức phù hợp với nhu cầu của bạn ngay khi thanh toán.</p>
                <div className="row g-3">
                  {shippingOptions.map((opt, i) => (
                    <div className="col-md-6" key={i}>
                      <div className="p-4 rounded-4 border h-100" style={{ borderColor: '#f0f0f0' }}>
                        <div className={`support-card-icon ${opt.color} mb-3`}>{opt.icon}</div>
                        <h5 className="fw-bold" style={{ fontSize: '0.95rem' }}>{opt.name}</h5>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <Clock size={14} className="text-muted" />
                          <span style={{ fontSize: '0.85rem', color: '#555' }}>{opt.time}</span>
                        </div>
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <span className="badge bg-dark rounded-pill" style={{ fontSize: '0.75rem' }}>{opt.fee}</span>
                        </div>
                        <p className="text-muted mb-0" style={{ fontSize: '0.82rem' }}>{opt.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery time by province */}
              <div className="support-card">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="support-card-icon blue"><MapPin size={22}/></div>
                  <div>
                    <div className="section-label">Thời gian giao hàng</div>
                    <h4 className="mb-0">Theo khu vực địa lý</h4>
                  </div>
                </div>
                <table className="table support-table">
                  <thead>
                    <tr>
                      <th>Khu vực</th>
                      <th>Giao hỏa tốc</th>
                      <th>Giao nhanh / tiêu chuẩn</th>
                    </tr>
                  </thead>
                  <tbody>
                    {provinces.map((p, i) => (
                      <tr key={i}>
                        <td className="fw-semibold">{p.area}</td>
                        <td style={{ color: p.express === 'Không áp dụng' ? '#aaa' : '#16a34a' }}>{p.express}</td>
                        <td>{p.standard}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="highlight-box">
                  <h6>📦 Miễn phí vận chuyển</h6>
                  <p>Đơn hàng từ <strong>300.000đ</strong> miễn phí giao tiêu chuẩn. Đơn hàng từ <strong>500.000đ</strong> miễn phí giao nhanh trên toàn quốc.</p>
                </div>
              </div>

              {/* Tracking */}
              <div className="support-card">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="support-card-icon teal"><Shield size={22}/></div>
                  <div>
                    <div className="section-label">Theo dõi đơn hàng</div>
                    <h4 className="mb-0">Cách theo dõi đơn hàng của bạn</h4>
                  </div>
                </div>
                <div className="step-timeline">
                  <div className="step-item"><h6>Xác nhận đơn hàng</h6><p>Email & SMS xác nhận được gửi ngay sau khi đặt hàng thành công.</p></div>
                  <div className="step-item"><h6>Đang chuẩn bị hàng</h6><p>Kho hàng đóng gói và bàn giao cho đơn vị vận chuyển trong 24 giờ.</p></div>
                  <div className="step-item"><h6>Đang vận chuyển</h6><p>Nhận mã vận đơn qua email/SMS để tra cứu trạng thái trực tiếp trên website của đơn vị vận chuyển.</p></div>
                  <div className="step-item"><h6>Giao hàng thành công</h6><p>Xác nhận nhận hàng và để lại đánh giá sản phẩm trên SportingShop.</p></div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              <div className="support-info-banner mb-4">
                <div className="position-relative" style={{ zIndex: 1 }}>
                  <h3 className="fw-black mb-3">Đối tác vận chuyển</h3>
                  <p className="mb-3">SportingShop hợp tác với các đơn vị vận chuyển uy tín hàng đầu Việt Nam.</p>
                  <div className="d-flex flex-column gap-2">
                    {['GHN Express', 'GHTK', 'J&T Express', 'ViettelPost'].map(p => (
                      <div key={p} className="contact-chip">
                        <div className="contact-chip-icon"><CheckCircle size={16}/></div>
                        <div className="contact-chip-value">{p}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="support-card mb-4">
                <h4>Liên hệ hỗ trợ</h4>
                <p className="text-muted" style={{ fontSize: '0.88rem' }}>Có vấn đề với đơn hàng? Chúng tôi giải quyết ngay!</p>
                <div className="d-flex flex-column gap-2 mt-3">
                  <a href="tel:19001234" className="btn btn-dark rounded-pill d-flex align-items-center gap-2 justify-content-center"><Phone size={16}/> 1900 1234</a>
                  <a href="mailto:hotro@sportingshop.com" className="btn btn-outline-dark rounded-pill d-flex align-items-center gap-2 justify-content-center"><Mail size={16}/> Gửi email</a>
                </div>
              </div>
              <div className="support-card">
                <h4>Xem thêm</h4>
                {[
                  { to: '/support/return-policy', label: 'Chính sách đổi trả' },
                  { to: '/support/payment', label: 'Chính sách thanh toán' },
                  { to: '/support/faq', label: 'Câu hỏi thường gặp' },
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

export default Shipping;

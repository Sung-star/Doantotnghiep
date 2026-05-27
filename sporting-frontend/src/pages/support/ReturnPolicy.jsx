import { Link } from 'react-router-dom';
import { 
  RotateCcw, CheckCircle, XCircle, Clock, Package, 
  ChevronRight, Phone, Mail, AlertTriangle, RefreshCw
} from 'lucide-react';
import './SupportPage.css';

const ReturnPolicy = () => {
  const conditions = [
    { icon: <CheckCircle size={18}/>, text: 'Sản phẩm còn nguyên tem, nhãn mác, chưa qua sử dụng' },
    { icon: <CheckCircle size={18}/>, text: 'Còn đầy đủ bao bì, hộp đựng gốc của sản phẩm' },
    { icon: <CheckCircle size={18}/>, text: 'Có hóa đơn mua hàng hoặc mã đơn hàng' },
    { icon: <CheckCircle size={18}/>, text: 'Trong vòng 30 ngày kể từ ngày nhận hàng' },
    { icon: <XCircle size={18}/>, text: 'Không áp dụng với sản phẩm giảm giá trên 50%' },
    { icon: <XCircle size={18}/>, text: 'Không áp dụng với đồ lót, tất và phụ kiện cá nhân' },
  ];

  const steps = [
    { title: 'Liên hệ hỗ trợ', desc: 'Gọi 1900 1234 hoặc email hotro@sportingshop.com để yêu cầu đổi/trả hàng.' },
    { title: 'Cung cấp thông tin', desc: 'Cung cấp mã đơn hàng, lý do đổi/trả và ảnh chụp sản phẩm (nếu có lỗi).' },
    { title: 'Nhận xác nhận', desc: 'Bộ phận CSKH xác nhận yêu cầu trong vòng 24 giờ làm việc.' },
    { title: 'Gửi hàng hoàn trả', desc: 'Đóng gói sản phẩm và gửi về địa chỉ kho hàng của chúng tôi.' },
    { title: 'Kiểm tra hàng', desc: 'Chúng tôi kiểm tra sản phẩm trong 2–3 ngày làm việc.' },
    { title: 'Hoàn tiền / Đổi hàng', desc: 'Hoàn tiền qua tài khoản ngân hàng hoặc gửi hàng đổi trong 5–7 ngày.' },
  ];

  return (
    <div style={{ fontFamily: '"Inter", sans-serif' }}>
      {/* Hero */}
      <section className="support-hero">
        <div className="container position-relative" style={{ zIndex: 1 }}>
          <div className="support-breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span>/</span>
            <span style={{ color: 'rgba(255,255,255,0.8)' }}>Chính sách đổi trả</span>
          </div>
          <div className="support-hero-badge">
            <RotateCcw size={14} /> Chính sách đổi trả
          </div>
          <h1>Đổi trả dễ dàng,<br /><span style={{ color: '#60a5fa' }}>không rắc rối</span></h1>
          <p>Chúng tôi cam kết mang đến trải nghiệm mua sắm tốt nhất. Nếu sản phẩm không như kỳ vọng, chúng tôi sẵn sàng hỗ trợ đổi/trả trong vòng 30 ngày.</p>
        </div>
      </section>

      {/* Content */}
      <section className="support-content">
        <div className="container">
          <div className="row g-4">

            {/* Left: Main */}
            <div className="col-lg-8">
              {/* Điều kiện */}
              <div className="support-card">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="support-card-icon blue"><CheckCircle size={22}/></div>
                  <div>
                    <div className="section-label">Điều kiện áp dụng</div>
                    <h4 className="mb-0">Sản phẩm đủ điều kiện đổi/trả</h4>
                  </div>
                </div>
                <div className="row g-3">
                  {conditions.map((c, i) => (
                    <div className="col-12" key={i}>
                      <div className={`d-flex align-items-start gap-3 p-3 rounded-3 ${i < 4 ? 'bg-light' : 'bg-danger bg-opacity-10'}`}>
                        <span className={i < 4 ? 'text-success mt-1' : 'text-danger mt-1'}>{c.icon}</span>
                        <span style={{ fontSize: '0.9rem', color: '#444' }}>{c.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quy trình */}
              <div className="support-card">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="support-card-icon purple"><RefreshCw size={22}/></div>
                  <div>
                    <div className="section-label">Quy trình</div>
                    <h4 className="mb-0">Các bước đổi/trả hàng</h4>
                  </div>
                </div>
                <div className="step-timeline">
                  {steps.map((s, i) => (
                    <div className="step-item" key={i}>
                      <h6>Bước {i + 1}: {s.title}</h6>
                      <p>{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Thời gian hoàn tiền */}
              <div className="support-card">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="support-card-icon orange"><Clock size={22}/></div>
                  <div>
                    <div className="section-label">Thời gian</div>
                    <h4 className="mb-0">Thời gian xử lý hoàn tiền</h4>
                  </div>
                </div>
                <table className="table support-table">
                  <thead>
                    <tr>
                      <th>Phương thức hoàn tiền</th>
                      <th>Thời gian</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>Ví SportingShop Credit</td><td>⚡ 1–2 giờ</td></tr>
                    <tr><td>Ví MoMo / ZaloPay</td><td>🕐 1–3 ngày làm việc</td></tr>
                    <tr><td>Chuyển khoản ngân hàng</td><td>📅 3–5 ngày làm việc</td></tr>
                    <tr><td>Thẻ tín dụng Visa / Mastercard</td><td>📅 5–10 ngày làm việc</td></tr>
                    <tr><td>VNPay</td><td>📅 3–7 ngày làm việc</td></tr>
                  </tbody>
                </table>
                <div className="warning-box">
                  <AlertTriangle size={16} className="me-2 text-warning" />
                  <strong>Lưu ý:</strong> Phí vận chuyển hoàn trả sẽ do khách hàng chịu trừ trường hợp sản phẩm bị lỗi do nhà sản xuất.
                </div>
              </div>
            </div>

            {/* Right: Sidebar */}
            <div className="col-lg-4">
              <div className="support-info-banner mb-4">
                <div className="position-relative" style={{ zIndex: 1 }}>
                  <h3 className="fw-black mb-3">Cần hỗ trợ?</h3>
                  <p className="mb-4">Đội ngũ CSKH sẵn sàng hỗ trợ bạn 24/7. Liên hệ ngay để được giải đáp nhanh nhất.</p>
                  <div className="d-flex flex-column gap-3">
                    <div className="contact-chip">
                      <div className="contact-chip-icon"><Phone size={18}/></div>
                      <div>
                        <div className="contact-chip-label">Hotline miễn phí</div>
                        <div className="contact-chip-value">1900 1234</div>
                      </div>
                    </div>
                    <div className="contact-chip">
                      <div className="contact-chip-icon"><Mail size={18}/></div>
                      <div>
                        <div className="contact-chip-label">Email hỗ trợ</div>
                        <div className="contact-chip-value">hotro@sportingshop.com</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="support-card">
                <div className="support-card-icon green mb-3"><Package size={22}/></div>
                <h4>Địa chỉ gửi hàng hoàn trả</h4>
                <p className="mb-0">Kho hàng SportingShop<br/>123 Lê Văn Việt, P. Tăng Nhơn Phú B,<br/>Quận 9, TP. Hồ Chí Minh</p>
                <div className="highlight-box mt-3">
                  <h6>📦 Ghi chú khi gửi hàng</h6>
                  <p>Ghi rõ mã đơn hàng và số điện thoại lên bên ngoài hộp để chúng tôi xử lý nhanh hơn.</p>
                </div>
              </div>

              <div className="support-card">
                <h4>Liên kết nhanh</h4>
                {[
                  { to: '/support/shipping', label: 'Chính sách vận chuyển' },
                  { to: '/support/payment', label: 'Chính sách thanh toán' },
                  { to: '/support/faq', label: 'Câu hỏi thường gặp' },
                  { to: '/support/security', label: 'Chính sách bảo mật' },
                ].map((l) => (
                  <Link key={l.to} to={l.to} className="d-flex align-items-center justify-content-between py-2 text-decoration-none border-bottom"
                    style={{ color: '#444', fontSize: '0.9rem' }}>
                    <span>{l.label}</span>
                    <ChevronRight size={15} className="text-muted" />
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

export default ReturnPolicy;

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Instagram, Facebook, Youtube } from 'lucide-react';
import '../../styles/Contactpage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsLoading(false);
    setIsSubmitted(true);
  };

  const contactInfo = [
    {
      icon: <MapPin size={22} />,
      label: 'ĐỊA CHỈ',
      value: '123 Nguyễn Huệ, Quận 1',
      sub: 'TP. Hồ Chí Minh, Việt Nam',
    },
    {
      icon: <Phone size={22} />,
      label: 'ĐIỆN THOẠI',
      value: '1800 6868',
      sub: 'Miễn phí 8:00 – 22:00 hàng ngày',
    },
    {
      icon: <Mail size={22} />,
      label: 'EMAIL',
      value: 'contact@sportingshop.vn',
      sub: 'Phản hồi trong vòng 2 giờ',
    },
    {
      icon: <Clock size={22} />,
      label: 'GIỜ MỞ CỬA',
      value: 'T2 – CN: 8:00 – 22:00',
      sub: 'Kể cả ngày lễ',
    },
  ];

  return (
    <div className="contact-page">
      {/* HERO */}
      <section className="contact-hero">
        <div className="contact-hero-overlay" />
        <div className="contact-hero-content">
          <p className="contact-hero-eyebrow">SPORTING SHOP</p>
          <h1 className="contact-hero-title">LIÊN HỆ<br /><em>VỚI CHÚNG TÔI</em></h1>
          <p className="contact-hero-sub">Đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7</p>
        </div>
        <div className="contact-hero-stripe" />
      </section>

      {/* CONTACT INFO STRIP */}
      <section className="contact-info-strip">
        <div className="contact-container">
          <div className="contact-info-grid">
            {contactInfo.map((item, i) => (
              <div className="contact-info-card" key={i}>
                <div className="contact-info-icon">{item.icon}</div>
                <div>
                  <p className="contact-info-label">{item.label}</p>
                  <p className="contact-info-value">{item.value}</p>
                  <p className="contact-info-sub">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORM + MAP */}
      <section className="contact-main">
        <div className="contact-container">
          <div className="contact-grid">
            {/* FORM */}
            <div className="contact-form-wrapper">
              <div className="contact-form-header">
                <span className="contact-form-tag">GỬI TIN NHẮN</span>
                <h2 className="contact-form-title">Chúng tôi lắng nghe<br />mọi ý kiến của bạn</h2>
              </div>

              {isSubmitted ? (
                <div className="contact-success">
                  <div className="contact-success-icon">
                    <CheckCircle size={40} />
                  </div>
                  <h3>Gửi thành công!</h3>
                  <p>Chúng tôi đã nhận được tin nhắn của bạn và sẽ phản hồi trong vòng 2 giờ.</p>
                  <button className="contact-btn-reset" onClick={() => { setIsSubmitted(false); setFormData({ name: '', email: '', subject: '', message: '' }); }}>
                    Gửi tin nhắn khác
                  </button>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="contact-form-row">
                    <div className="contact-field">
                      <label>Họ và tên *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Nguyễn Văn A"
                        required
                      />
                    </div>
                    <div className="contact-field">
                      <label>Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="email@example.com"
                        required
                      />
                    </div>
                  </div>
                  <div className="contact-field">
                    <label>Chủ đề</label>
                    <select name="subject" value={formData.subject} onChange={handleChange}>
                      <option value="">Chọn chủ đề...</option>
                      <option value="order">Đơn hàng & Vận chuyển</option>
                      <option value="product">Tư vấn sản phẩm</option>
                      <option value="return">Đổi trả & Hoàn tiền</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                  <div className="contact-field">
                    <label>Nội dung *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Nhập nội dung tin nhắn của bạn..."
                      rows={5}
                      required
                    />
                  </div>
                  <button type="submit" className="contact-submit-btn" disabled={isLoading}>
                    {isLoading ? (
                      <span className="contact-loading-dots">
                        <span /><span /><span />
                      </span>
                    ) : (
                      <>
                        <Send size={18} />
                        GỬI TIN NHẮN
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* MAP + SOCIAL */}
            <div className="contact-side">
              <div className="contact-map-wrapper">
                <iframe
                  title="Sporting Shop Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.447292024609!2d106.70191787465936!3d10.775851089368428!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4670702e31%3A0xa5777fb397ee74a!2zMTIzIE5ndXnhu4VuIEh14buHLCBC4bq_biBOZ2jDqSwgUXXhuq1uIDEsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1703123456789!5m2!1svi!2s"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="contact-social-card">
                <p className="contact-social-title">THEO DÕI CHÚNG TÔI</p>
                <div className="contact-social-links">
                  <a href="https://facebook.com" target="_blank" rel="noreferrer" className="contact-social-item contact-social-fb">
                    <Facebook size={20} />
                    <div>
                      <span>Facebook</span>
                      <small>@sportingshop.vn</small>
                    </div>
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noreferrer" className="contact-social-item contact-social-ig">
                    <Instagram size={20} />
                    <div>
                      <span>Instagram</span>
                      <small>@sportingshop</small>
                    </div>
                  </a>
                  <a href="https://youtube.com" target="_blank" rel="noreferrer" className="contact-social-item contact-social-yt">
                    <Youtube size={20} />
                    <div>
                      <span>YouTube</span>
                      <small>Sporting Shop Official</small>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ STRIP */}
      <section className="contact-faq">
        <div className="contact-container">
          <div className="contact-faq-header">
            <span className="contact-form-tag">CÂU HỎI THƯỜNG GẶP</span>
            <h2>Tìm câu trả lời nhanh</h2>
          </div>
          <div className="contact-faq-grid">
            {[
              { q: 'Chính sách đổi trả như thế nào?', a: 'Đổi trả miễn phí trong 30 ngày kể từ ngày nhận hàng, sản phẩm còn nguyên tem nhãn.' },
              { q: 'Thời gian giao hàng là bao lâu?', a: 'Nội thành TP.HCM & Hà Nội: 1-2 ngày. Các tỉnh thành khác: 3-5 ngày làm việc.' },
              { q: 'Có thể thanh toán bằng những hình thức nào?', a: 'Chúng tôi chấp nhận thẻ ATM, Visa/Mastercard, ví MoMo, ZaloPay và thanh toán khi nhận hàng.' },
              { q: 'Sản phẩm có bảo hành không?', a: 'Tất cả sản phẩm đều được bảo hành chính hãng từ 6 tháng đến 2 năm tùy thương hiệu.' },
            ].map((item, i) => (
              <div className="contact-faq-item" key={i}>
                <p className="contact-faq-q">{item.q}</p>
                <p className="contact-faq-a">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
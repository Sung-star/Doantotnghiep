import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, Instagram, Twitter, Mail, Phone, MapPin, 
  Send, ChevronRight, Github, CheckCircle 
} from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState('idle'); // idle, loading, success, error

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setSubscribeStatus('error');
      return;
    }
    setSubscribeStatus('loading');
    // Giả lập API call
    setTimeout(() => {
      setSubscribeStatus('success');
      setEmail('');
      setTimeout(() => setSubscribeStatus('idle'), 3000);
    }, 1000);
  };

  return (
    <footer className="bg-dark text-white mt-auto border-top border-secondary">
      {/* Phần 1: Newsletter - Đăng ký nhận tin */}
      <div className="bg-black py-4 border-bottom border-secondary">
        <div className="container-fluid px-md-5">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-3 mb-lg-0">
              <h5 className="mb-1 fw-bold">Đăng ký nhận bản tin thời trang</h5>
              <p className="text-secondary mb-0 small">Nhận ngay ưu đãi 10% cho đơn hàng đầu tiên của bạn.</p>
            </div>
            <div className="col-lg-6">
              <form onSubmit={handleSubscribe} className="input-group">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if(subscribeStatus === 'error') setSubscribeStatus('idle'); }}
                  className={`form-control bg-transparent text-white ${subscribeStatus === 'error' ? 'border-danger' : 'border-secondary'}`} 
                  placeholder="Nhập email của bạn..."
                  disabled={subscribeStatus === 'loading' || subscribeStatus === 'success'}
                />
                <button 
                  type="submit"
                  className={`btn px-4 d-flex align-items-center gap-2 ${subscribeStatus === 'success' ? 'btn-success' : 'btn-outline-light'}`}
                  disabled={subscribeStatus === 'loading' || subscribeStatus === 'success'}
                >
                  {subscribeStatus === 'loading' ? 'Đang gửi...' : subscribeStatus === 'success' ? <><CheckCircle size={16} /> Đã đăng ký</> : <>Gửi ngay <Send size={16} /></>}
                </button>
              </form>
              {subscribeStatus === 'error' && <small className="text-danger mt-1 d-block">Vui lòng nhập email hợp lệ.</small>}
              {subscribeStatus === 'success' && <small className="text-success mt-1 d-block">Cảm ơn bạn đã đăng ký!</small>}
            </div>
          </div>
        </div>
      </div>

      {/* Phần 2: Nội dung chính */}
      <div className="container-fluid px-md-5 py-5">
        <div className="row g-4">
          {/* Cột 1: Thương hiệu */}
          <div className="col-lg-4">
            <h4 className="fw-bold mb-4 tracking-wider text-uppercase">Sporting<span className="text-primary">Shop</span></h4>
            <p className="text-secondary lh-lg mb-4" style={{ fontSize: '0.9rem' }}>
              Chúng tôi không chỉ bán quần áo, chúng tôi định hình phong cách cho bạn. 
              Từng sản phẩm đều được tuyển chọn kỹ lưỡng về chất liệu và xu hướng.
            </p>
            <div className="d-flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon rounded-circle border border-secondary p-2 text-white transition">
                <Facebook size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon rounded-circle border border-secondary p-2 text-white transition">
                <Instagram size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon rounded-circle border border-secondary p-2 text-white transition">
                <Twitter size={18} />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="social-icon rounded-circle border border-secondary p-2 text-white transition">
                <Github size={18} />
              </a>
            </div>
          </div>
          
          {/* Cột 2: Liên kết nhanh */}
          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold mb-4 text-uppercase small">Mua sắm</h6>
            <ul className="list-unstyled footer-links">
              {[ 
                { label: 'Trang chủ', to: '/' },
                { label: 'Sản phẩm', to: '/products' },
                { label: 'Nam', to: '/men' },
                { label: 'Nữ', to: '/women' },
                { label: 'Bộ sưu tập', to: '/collections' },
                { label: 'Về chúng tôi', to: '/about' }
              ].map((link) => (
                <li key={link.to} className="mb-2">
                  <Link to={link.to} className="text-secondary text-decoration-none d-flex align-items-center gap-1 hover-white shadow-none">
                    <ChevronRight size={12} /> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Cột 3: Dịch vụ */}
          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold mb-4 text-uppercase small">Hỗ trợ khách hàng</h6>
            <ul className="list-unstyled footer-links">
              {[
                { label: 'Chính sách đổi trả', to: '/support/return-policy' },
                { label: 'Vận chuyển', to: '/support/shipping' },
                { label: 'Thanh toán', to: '/support/payment' },
                { label: 'Bảo mật', to: '/support/security' },
                { label: 'Câu hỏi thường gặp', to: '/support/faq' }
              ].map((item) => (
                <li key={item.to} className="mb-2">
                  <Link to={item.to} className="text-secondary text-decoration-none d-flex align-items-center gap-1 hover-white shadow-none">
                    <ChevronRight size={12} /> {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Cột 4: Liên hệ */}
          <div className="col-lg-4 col-md-6">
            <h6 className="fw-bold mb-4 text-uppercase small">Thông tin liên hệ</h6>
            <div className="d-flex flex-column gap-3">
              <div className="d-flex align-items-start gap-3">
                <div className="bg-secondary bg-opacity-25 rounded p-2 text-primary">
                  <MapPin size={20} />
                </div>
                <span className="text-secondary small">123 Lê Văn Việt, Phường Tăng Nhơn Phú B, Quận 9, TP. Hồ Chí Minh</span>
              </div>
              <div className="d-flex align-items-center gap-3">
                <div className="bg-secondary bg-opacity-25 rounded p-2 text-primary">
                  <Phone size={20} />
                </div>
                <span className="text-secondary small">1900 1234 - (028) 3344 5566</span>
              </div>
              <div className="d-flex align-items-center gap-3">
                <div className="bg-secondary bg-opacity-25 rounded p-2 text-primary">
                  <Mail size={20} />
                </div>
                <span className="text-secondary small">hotro@sportingshop.com</span>
              </div>
            </div>
          </div>
        </div>
        
        <hr className="my-5 border-secondary" />
        
        {/* Phần 3: Bản quyền & Thanh toán */}
        <div className="row align-items-center pb-4">
          <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
            <p className="mb-0 text-secondary small">
              © {new Date().getFullYear()} <strong>Sporting </strong>. Toàn bộ nội dung được bảo lưu.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
  <div className="d-flex justify-content-center justify-content-md-end gap-3 align-items-center grayscale payment-methods">
    <img 
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" 
      alt="Visa" 
      style={{ height: '20px', width: 'auto', objectFit: 'contain' }} 
    />
    <img 
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" 
      alt="Mastercard" 
      style={{ height: '25px', width: 'auto', objectFit: 'contain' }} 
    />
    <img 
      src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" 
      alt="MoMo" 
      style={{ height: '25px', width: 'auto', objectFit: 'contain' }} 
    />
    <img 
      src="https://vnpay.vn/wp-content/uploads/2020/07/vnpay-logo.png" 
      alt="VNPay" 
      style={{ height: '20px', width: 'auto', objectFit: 'contain' }} 
    />
  </div>
</div>
        </div>
      </div>

      {/* Một chút CSS bổ trợ trực tiếp */}
      <style>{`
        .social-icon:hover {
          background-color: #0d6efd;
          border-color: #0d6efd !important;
          transform: translateY(-3px);
        }
        .hover-white:hover {
          color: white !important;
          padding-left: 5px;
          transition: all 0.3s ease;
        }
        .grayscale img {
          filter: grayscale(100%);
          transition: filter 0.3s;
        }
        .grayscale img:hover {
          filter: grayscale(0%);
        }
        .transition {
          transition: all 0.3s ease;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
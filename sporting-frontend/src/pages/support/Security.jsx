import { Link } from 'react-router-dom';
import { 
  ShieldCheck, Lock, Eye, Server, UserCheck,
  ChevronRight, Mail
} from 'lucide-react';
import './SupportPage.css';

const Security = () => {
  return (
    <div style={{ fontFamily: '"Inter", sans-serif' }}>
      <section className="support-hero">
        <div className="container position-relative" style={{ zIndex: 1 }}>
          <div className="support-breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span>/</span>
            <span style={{ color: 'rgba(255,255,255,0.8)' }}>Chính sách bảo mật</span>
          </div>
          <div className="support-hero-badge">
            <ShieldCheck size={14} /> Bảo mật thông tin
          </div>
          <h1>Bảo vệ dữ liệu,<br /><span style={{ color: '#60a5fa' }}>tôn trọng quyền riêng tư</span></h1>
          <p>Cam kết bảo vệ thông tin cá nhân của bạn. Tìm hiểu cách chúng tôi thu thập, sử dụng và bảo vệ dữ liệu của bạn khi mua sắm tại SportingShop.</p>
        </div>
      </section>

      <section className="support-content">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="support-card">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="support-card-icon blue"><Eye size={22}/></div>
                  <div>
                    <div className="section-label">Thu thập dữ liệu</div>
                    <h4 className="mb-0">Thông tin chúng tôi thu thập</h4>
                  </div>
                </div>
                <p>Chúng tôi chỉ thu thập thông tin cần thiết để xử lý đơn hàng và cải thiện trải nghiệm của bạn:</p>
                <ul>
                  <li><strong>Thông tin cá nhân:</strong> Tên, email, số điện thoại, địa chỉ giao hàng khi bạn đăng ký tài khoản hoặc đặt hàng.</li>
                  <li><strong>Dữ liệu giao dịch:</strong> Lịch sử mua hàng, phương thức thanh toán (chúng tôi không lưu chi tiết thẻ tín dụng).</li>
                  <li><strong>Dữ liệu thiết bị:</strong> Địa chỉ IP, loại trình duyệt, thời gian truy cập để phân tích và tối ưu hóa website.</li>
                </ul>
              </div>

              <div className="support-card">
                 <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="support-card-icon green"><Server size={22}/></div>
                  <div>
                    <div className="section-label">Sử dụng dữ liệu</div>
                    <h4 className="mb-0">Mục đích sử dụng thông tin</h4>
                  </div>
                </div>
                <p>Thông tin thu thập được sử dụng cho các mục đích sau:</p>
                <ul>
                  <li>Xác nhận và xử lý đơn hàng, vận chuyển sản phẩm.</li>
                  <li>Hỗ trợ khách hàng, giải quyết khiếu nại, đổi trả.</li>
                  <li>Gửi email thông báo về trạng thái đơn hàng, ưu đãi, sản phẩm mới (chỉ khi bạn đăng ký nhận bản tin).</li>
                  <li>Ngăn chặn các hoạt động gian lận, bảo vệ tài khoản của bạn.</li>
                </ul>
              </div>

              <div className="support-card">
                 <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="support-card-icon purple"><Lock size={22}/></div>
                  <div>
                    <div className="section-label">Bảo mật</div>
                    <h4 className="mb-0">Cách chúng tôi bảo vệ bạn</h4>
                  </div>
                </div>
                <p>SportingShop áp dụng các biện pháp an ninh kỹ thuật và tổ chức nghiêm ngặt:</p>
                <div className="row g-3 mt-2">
                  <div className="col-md-6">
                     <div className="p-3 border rounded-3 h-100 bg-light">
                       <h6 className="fw-bold"><ShieldCheck size={16} className="text-primary me-2"/> Mã hóa SSL</h6>
                       <p className="mb-0" style={{ fontSize: '0.85rem' }}>Mọi dữ liệu truyền tải giữa trình duyệt của bạn và máy chủ được mã hóa an toàn.</p>
                     </div>
                  </div>
                  <div className="col-md-6">
                     <div className="p-3 border rounded-3 h-100 bg-light">
                       <h6 className="fw-bold"><UserCheck size={16} className="text-primary me-2"/> Quản lý truy cập</h6>
                       <p className="mb-0" style={{ fontSize: '0.85rem' }}>Chỉ nhân viên được ủy quyền mới có thể truy cập thông tin khách hàng khi cần thiết.</p>
                     </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
               <div className="support-info-banner mb-4">
                <div className="position-relative" style={{ zIndex: 1 }}>
                  <h3 className="fw-black mb-3">Quyền của bạn</h3>
                  <p className="mb-3">Bạn có toàn quyền kiểm soát dữ liệu cá nhân của mình:</p>
                  <ul className="mb-0 text-white-50" style={{ fontSize: '0.9rem', paddingLeft: '1.2rem' }}>
                    <li className="mb-2">Yêu cầu xem lại thông tin.</li>
                    <li className="mb-2">Yêu cầu chỉnh sửa thông tin sai lệch.</li>
                    <li>Yêu cầu xóa tài khoản và dữ liệu.</li>
                  </ul>
                  <div className="mt-4">
                    <a href="mailto:privacy@sportingshop.com" className="btn btn-light rounded-pill btn-sm d-inline-flex align-items-center gap-2 fw-bold">
                      <Mail size={16}/> Liên hệ Privacy Team
                    </a>
                  </div>
                </div>
              </div>
              <div className="support-card">
                <h4>Chính sách khác</h4>
                {[
                  { to: '/support/return-policy', label: 'Chính sách đổi trả' },
                  { to: '/support/shipping', label: 'Chính sách vận chuyển' },
                  { to: '/support/payment', label: 'Chính sách thanh toán' },
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

export default Security;

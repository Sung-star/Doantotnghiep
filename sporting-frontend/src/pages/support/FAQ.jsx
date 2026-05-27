import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HelpCircle, MessageCircle, ChevronRight, Phone, Mail, 
  Search, ChevronDown, ChevronUp
} from 'lucide-react';
import './SupportPage.css';

const FAQ = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [openItem, setOpenItem] = useState('o1');

  const faqs = {
    orders: [
      { id: 'o1', q: 'Làm thế nào để đặt hàng?', a: 'Bạn có thể thêm sản phẩm vào giỏ hàng, sau đó tiến hành thanh toán. Tại trang thanh toán, điền thông tin giao hàng và chọn phương thức thanh toán.' },
      { id: 'o2', q: 'Tôi có thể hủy đơn hàng không?', a: 'Bạn có thể hủy đơn hàng trong vòng 30 phút sau khi đặt bằng cách vào mục "Đơn hàng của tôi". Nếu quá thời gian, vui lòng liên hệ Hotline 1900 1234.' },
      { id: 'o3', q: 'Làm sao để biết đơn hàng đã được xác nhận?', a: 'Chúng tôi sẽ gửi email và tin nhắn SMS xác nhận ngay sau khi bạn đặt hàng thành công.' },
    ],
    shipping: [
      { id: 's1', q: 'Thời gian giao hàng là bao lâu?', a: 'Nội thành TP.HCM/Hà Nội: 1-2 ngày. Các tỉnh khác: 3-5 ngày. Có hỗ trợ giao hỏa tốc 2-4h tại TP.HCM.' },
      { id: 's2', q: 'Phí vận chuyển tính như thế nào?', a: 'Miễn phí giao hàng cho đơn từ 300.000đ. Đơn dưới 300.000đ phí giao hàng là 15.000đ - 25.000đ tùy khu vực.' },
      { id: 's3', q: 'Tôi có được kiểm tra hàng trước khi nhận không?', a: 'Có. SportingShop hỗ trợ đồng kiểm. Bạn được quyền kiểm tra tình trạng bên ngoài và thử sản phẩm trước khi thanh toán.' },
    ],
    returns: [
      { id: 'r1', q: 'Điều kiện đổi trả hàng là gì?', a: 'Sản phẩm phải còn nguyên tem mác, chưa qua sử dụng, và trong vòng 30 ngày kể từ ngày nhận hàng.' },
      { id: 'r2', q: 'Thời gian hoàn tiền mất bao lâu?', a: 'Nếu thanh toán qua ví điện tử: 1-3 ngày. Nếu thanh toán qua thẻ ngân hàng: 3-7 ngày làm việc.' },
    ]
  };

  const toggleItem = (id) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <div style={{ fontFamily: '"Inter", sans-serif' }}>
      <section className="support-hero">
        <div className="container position-relative" style={{ zIndex: 1 }}>
          <div className="support-breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span>/</span>
            <span style={{ color: 'rgba(255,255,255,0.8)' }}>Câu hỏi thường gặp</span>
          </div>
          <div className="support-hero-badge">
            <HelpCircle size={14} /> FAQ
          </div>
          <h1>Chúng tôi có thể<br /><span style={{ color: '#60a5fa' }}>giúp gì cho bạn?</span></h1>
          <div className="mt-4 position-relative" style={{ maxWidth: '500px' }}>
             <input type="text" className="form-control form-control-lg rounded-pill ps-5 border-0" placeholder="Nhập câu hỏi của bạn..." />
             <Search className="position-absolute text-muted" size={20} style={{ top: '50%', left: '20px', transform: 'translateY(-50%)' }} />
          </div>
        </div>
      </section>

      <section className="support-content">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-3">
               <div className="support-card p-3">
                 <ul className="list-unstyled mb-0">
                   <li>
                     <button className={`btn w-100 text-start border-0 fw-bold py-2 px-3 rounded-3 mb-2 ${activeTab === 'orders' ? 'bg-primary text-white' : 'text-dark hover-bg-light'}`} onClick={() => setActiveTab('orders')}>
                       📦 Đơn hàng & Thanh toán
                     </button>
                   </li>
                   <li>
                     <button className={`btn w-100 text-start border-0 fw-bold py-2 px-3 rounded-3 mb-2 ${activeTab === 'shipping' ? 'bg-primary text-white' : 'text-dark hover-bg-light'}`} onClick={() => setActiveTab('shipping')}>
                       🚚 Vận chuyển & Giao nhận
                     </button>
                   </li>
                   <li>
                     <button className={`btn w-100 text-start border-0 fw-bold py-2 px-3 rounded-3 ${activeTab === 'returns' ? 'bg-primary text-white' : 'text-dark hover-bg-light'}`} onClick={() => setActiveTab('returns')}>
                       🔄 Đổi trả & Hoàn tiền
                     </button>
                   </li>
                 </ul>
               </div>

               <div className="support-info-banner mt-4" style={{ padding: '30px 20px' }}>
                <div className="position-relative text-center" style={{ zIndex: 1 }}>
                  <MessageCircle size={32} className="mb-3 mx-auto text-primary" />
                  <h4 className="fw-black mb-2 fs-5">Vẫn cần hỗ trợ?</h4>
                  <p className="mb-3" style={{ fontSize: '0.85rem' }}>Liên hệ trực tiếp với chúng tôi để được giải đáp.</p>
                  <a href="tel:19001234" className="btn btn-light rounded-pill btn-sm w-100 mb-2 fw-bold"><Phone size={14} className="me-2"/> 1900 1234</a>
                  <a href="mailto:hotro@sportingshop.com" className="btn btn-outline-light rounded-pill btn-sm w-100 fw-bold"><Mail size={14} className="me-2"/> Gửi email</a>
                </div>
              </div>
            </div>

            <div className="col-lg-9">
              <div className="support-card p-4 p-md-5">
                <h3 className="section-title-lg mb-4">
                  {activeTab === 'orders' && 'Đơn hàng & Thanh toán'}
                  {activeTab === 'shipping' && 'Vận chuyển & Giao nhận'}
                  {activeTab === 'returns' && 'Đổi trả & Hoàn tiền'}
                </h3>
                
                <div className="faq-accordion">
                  {faqs[activeTab].map((faq) => (
                    <div className="accordion-item mb-3 border rounded-3 overflow-hidden" key={faq.id}>
                      <button 
                        className="accordion-button d-flex justify-content-between align-items-center w-100 border-0 bg-white p-4 text-start fw-bold"
                        onClick={() => toggleItem(faq.id)}
                        style={{ color: openItem === faq.id ? '#2563eb' : '#0a0a0a' }}
                      >
                        {faq.q}
                        {openItem === faq.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                      {openItem === faq.id && (
                        <div className="accordion-body px-4 pb-4 pt-0" style={{ color: '#555', lineHeight: '1.6' }}>
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;

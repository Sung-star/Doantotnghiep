import React from 'react';
import { ShoppingBag, Target, Users, ThumbsUp, ArrowRight, Award, Truck, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import './AboutPage.css'; // Đừng quên import file CSS ở dưới nhé

const AboutPage = () => {
  return (
    <div className="about-page-wrapper pb-5">
      {/* --- HERO SECTION --- */}
      <div className="bg-light py-5 mb-5 border-bottom">
        <div className="container text-center py-4">
          <span className="badge bg-danger text-uppercase px-3 py-2 rounded-pill mb-3 shadow-sm">
            Khám Phá Sporting Shop
          </span>
          <h1 className="display-4 fw-bold mb-3">
            Vượt Qua Giới Hạn <br /> Cùng <span className="text-danger">Sporting Shop</span>
          </h1>
          <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
            Điểm đến lý tưởng cho mọi nhu cầu về trang phục và dụng cụ thể thao. Chúng tôi không chỉ bán sản phẩm, chúng tôi trao cho bạn động lực.
          </p>
        </div>
      </div>

      <div className="container">
        {/* --- CÂU CHUYỆN CỦA CHÚNG TÔI --- */}
        <div className="row g-5 align-items-center mb-5 pb-4">
          <div className="col-lg-6 position-relative">
            <div className="img-wrapper rounded-4 shadow-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&auto=format&fit=crop" 
                alt="Về chúng tôi" 
                className="img-fluid w-100 object-fit-cover hover-zoom"
                style={{ height: '450px' }}
              />
            </div>
            {/* Box nổi trang trí */}
            <div className="position-absolute bottom-0 end-0 bg-white p-4 rounded-4 shadow-lg m-4 d-none d-md-block bounce-anim">
              <div className="d-flex align-items-center gap-3">
                <Award size={40} className="text-warning" />
                <div>
                  <h4 className="fw-bold mb-0">100%</h4>
                  <small className="text-muted fw-semibold">Chính hãng</small>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-lg-6 ps-lg-5">
            <h6 className="text-danger fw-bold text-uppercase tracking-wider mb-2">Câu Chuyện Thương Hiệu</h6>
            <h2 className="fw-bold mb-4">Sinh Ra Từ Đam Mê <br/> Phát Triển Vì Cộng Đồng</h2>
            <p className="text-secondary lh-lg mb-4">
              <strong>Sporting Shop</strong> được thành lập với một niềm đam mê cháy bỏng: mang đến cho cộng đồng những sản phẩm thể thao chất lượng cao. Chúng tôi tin rằng, với trang bị phù hợp, mỗi buổi tập đều là một bước tiến đến phiên bản tốt hơn của chính bạn.
            </p>
            <p className="text-secondary lh-lg mb-4">
              Từ những vận động viên chuyên nghiệp đến những người mới bắt đầu hành trình tập luyện, chúng tôi cam kết cung cấp các sản phẩm đa dạng từ những thương hiệu hàng đầu thế giới với mức giá cạnh tranh nhất.
            </p>
            <div className="row g-3 mt-2">
              <div className="col-sm-6 d-flex align-items-center gap-2">
                <ShieldCheck size={20} className="text-success" /> <span className="fw-medium">Bảo hành trọn đời</span>
              </div>
              <div className="col-sm-6 d-flex align-items-center gap-2">
                <Truck size={20} className="text-primary" /> <span className="fw-medium">Giao hàng siêu tốc</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- DẢI THỐNG KÊ (STATS) --- */}
        <div className="bg-dark text-white rounded-4 shadow py-5 mb-5">
          <div className="row text-center g-4">
            <div className="col-md-4 border-end border-secondary">
              <h2 className="display-5 fw-bold text-danger mb-0">5+</h2>
              <p className="text-light opacity-75 mt-2 mb-0">Năm Kinh Nghiệm</p>
            </div>
            <div className="col-md-4 border-end border-secondary">
              <h2 className="display-5 fw-bold text-danger mb-0">10K+</h2>
              <p className="text-light opacity-75 mt-2 mb-0">Khách Hàng Hài Lòng</p>
            </div>
            <div className="col-md-4">
              <h2 className="display-5 fw-bold text-danger mb-0">50+</h2>
              <p className="text-light opacity-75 mt-2 mb-0">Thương Hiệu Toàn Cầu</p>
            </div>
          </div>
        </div>

        {/* --- GIÁ TRỊ CỐT LÕI --- */}
        <div className="text-center mb-5">
          <h6 className="text-danger fw-bold text-uppercase mb-2">Giá Trị Của Chúng Tôi</h6>
          <h2 className="fw-bold">Tại Sao Nên Chọn Sporting Shop?</h2>
        </div>
        
        <div className="row g-4 mb-5">
          {/* Card 1 */}
          <div className="col-md-6 col-lg-3">
            <div className="value-card card h-100 border-0 shadow-sm p-4 text-center">
              <div className="icon-wrapper bg-danger bg-opacity-10 text-danger mx-auto mb-4 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                <Target size={36} />
              </div>
              <h5 className="fw-bold">Sứ Mệnh</h5>
              <p className="text-muted small mb-0">Tiếp lửa đam mê và đồng hành cùng bạn trên con đường chinh phục các mục tiêu sức khỏe.</p>
            </div>
          </div>
          {/* Card 2 */}
          <div className="col-md-6 col-lg-3">
            <div className="value-card card h-100 border-0 shadow-sm p-4 text-center">
              <div className="icon-wrapper bg-primary bg-opacity-10 text-primary mx-auto mb-4 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                <ShoppingBag size={36} />
              </div>
              <h5 className="fw-bold">Sản Phẩm</h5>
              <p className="text-muted small mb-0">Cung cấp trang phục, giày và phụ kiện chính hãng từ các thương hiệu uy tín toàn cầu.</p>
            </div>
          </div>
          {/* Card 3 */}
          <div className="col-md-6 col-lg-3">
            <div className="value-card card h-100 border-0 shadow-sm p-4 text-center">
              <div className="icon-wrapper bg-success bg-opacity-10 text-success mx-auto mb-4 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                <Users size={36} />
              </div>
              <h5 className="fw-bold">Cộng Đồng</h5>
              <p className="text-muted small mb-0">Xây dựng một cộng đồng năng động, nơi mọi người cùng học hỏi và truyền cảm hứng.</p>
            </div>
          </div>
          {/* Card 4 */}
          <div className="col-md-6 col-lg-3">
            <div className="value-card card h-100 border-0 shadow-sm p-4 text-center">
              <div className="icon-wrapper bg-warning bg-opacity-10 text-warning mx-auto mb-4 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                <ThumbsUp size={36} />
              </div>
              <h5 className="fw-bold">Cam Kết</h5>
              <p className="text-muted small mb-0">Đảm bảo 100% chất lượng, dịch vụ chu đáo và chính sách đổi trả vô cùng linh hoạt.</p>
            </div>
          </div>
        </div>

        {/* --- KÊU GỌI HÀNH ĐỘNG (CTA) --- */}
        <div className="bg-danger text-white rounded-4 p-5 text-center position-relative overflow-hidden shadow">
          {/* Vòng tròn trang trí background */}
          <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'radial-gradient(circle at top right, rgba(255,255,255,0.2), transparent 50%)' }}></div>
          
          <div className="position-relative z-index-1">
            <h2 className="fw-bold mb-3">Sẵn Sàng Để Bắt Đầu?</h2>
            <p className="lead mb-4 opacity-75 max-w-md mx-auto">Trang bị cho mình những vật dụng tốt nhất ngay hôm nay để sẵn sàng bứt phá mọi giới hạn.</p>
            <Link to="/products" className="btn btn-light btn-lg text-danger fw-bold rounded-pill px-5 shadow-sm d-inline-flex align-items-center gap-2">
              Mua Sắm Ngay <ArrowRight size={20} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
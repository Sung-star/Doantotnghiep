import React from 'react';
import { 
    ShoppingBag, Target, Users, ThumbsUp, ArrowRight, 
    Award, Truck, ShieldCheck, Heart, Sparkles, Globe 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AboutPage = () => {
  return (
    <div className="about-page-wrapper bg-white min-vh-100" style={{ fontFamily: '"Inter", sans-serif' }}>
      
      {/* --- PREMIUM HERO SECTION --- */}
      <div className="position-relative overflow-hidden py-5 mb-5" style={{ background: 'var(--bg-main)' }}>
        <div className="container position-relative py-5">
            <div className="row justify-content-center text-center">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="col-lg-8"
                >
                    <span className="text-uppercase tracking-widest small fw-black text-muted mb-3 d-block">CHƯƠNG TIẾP THEO CỦA PHONG CÁCH</span>
                    <h1 className="display-3 fw-black text-dark mb-4 text-uppercase tracking-tighter" style={{ lineHeight: 0.9 }}>
                        KẾT NỐI <span className="text-gradient">ĐAM MÊ</span> <br/> KIẾN TẠO <span className="text-dark">ĐẲNG CẤP</span>
                    </h1>
                    <p className="lead text-muted mx-auto mb-5" style={{ maxWidth: '650px', fontSize: '1.1rem' }}>
                        Tại Sporting Shop, chúng tôi không chỉ cung cấp trang phục. Chúng tôi mang đến một phong cách sống đỉnh cao, nơi hiệu năng gặp gỡ sự sang trọng.
                    </p>
                    <div className="d-flex justify-content-center gap-3">
                        <Link to="/products" className="luxury-button px-5 py-3 d-flex align-items-center gap-2">
                            KHÁM PHÁ BỘ SƯU TẬP <ArrowRight size={18} />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
      </div>

      <div className="container">
        {/* --- BRAND STORY SECTION --- */}
        <div className="row g-5 align-items-center mb-5 pb-5">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="col-lg-6"
          >
            <div className="position-relative">
                <div className="luxury-card p-0 overflow-hidden border-0" style={{ borderRadius: '40px' }}>
                    <img 
                        src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80" 
                        alt="Brand Story" 
                        className="img-fluid w-100 object-fit-cover"
                        style={{ height: '600px' }}
                    />
                </div>
                <div className="position-absolute -bottom-10 -right-10 bg-dark text-white p-5 rounded-4 shadow-lg d-none d-lg-block" style={{ width: '280px', bottom: '-40px', right: '-40px' }}>
                    <h2 className="fw-black mb-1">05+</h2>
                    <p className="small text-white-50 mb-0 fw-bold">NĂM DẪN ĐẦU XU HƯỚNG THỂ THAO CAO CẤP</p>
                </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="col-lg-6 ps-lg-5"
          >
            <div className="ps-lg-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                    <div className="bg-dark" style={{ width: '40px', height: '2px' }}></div>
                    <span className="fw-black small text-uppercase tracking-widest text-muted">DI SẢN THƯƠNG HIỆU</span>
                </div>
                <h2 className="display-5 fw-black mb-4 text-dark text-uppercase tracking-tighter">SINH RA ĐỂ <br/> TRỞ THÀNH BIỂU TƯỢNG</h2>
                <p className="text-muted lh-lg mb-4" style={{ fontSize: '1.05rem' }}>
                    Mỗi sản phẩm tại <strong>Sporting Shop</strong> là một tuyên ngôn về sự hoàn hảo. Chúng tôi khắt khe trong việc lựa chọn từng thương hiệu, từng chất liệu để đảm bảo rằng khi bạn khoác lên mình, bạn đang mang theo tinh hoa của ngành công nghiệp thể thao toàn cầu.
                </p>
                <p className="text-muted lh-lg mb-5">
                    Hành trình của chúng tôi bắt đầu từ khát khao định nghĩa lại thị trường đồ thể thao Việt Nam - không chỉ là sự tiện dụng, mà còn là sự xa xỉ trong từng trải nghiệm.
                </p>
                
                <div className="row g-4">
                    <div className="col-sm-6">
                        <div className="d-flex align-items-start gap-3">
                            <div className="text-dark p-2 bg-light rounded-3"><ShieldCheck size={20} /></div>
                            <div>
                                <h6 className="fw-black mb-1">CHÍNH HÃNG 100%</h6>
                                <p className="small text-muted mb-0">Cam kết bảo hành và xác thực mọi sản phẩm.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="d-flex align-items-start gap-3">
                            <div className="text-dark p-2 bg-light rounded-3"><Globe size={20} /></div>
                            <div>
                                <h6 className="fw-black mb-1">PHỦ SÓNG TOÀN CẦU</h6>
                                <p className="small text-muted mb-0">Hợp tác cùng 50+ thương hiệu quốc tế.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </motion.div>
        </div>

        {/* --- VALUES GRID --- */}
        <div className="text-center mb-5 pt-5">
          <span className="badge border border-dark text-dark rounded-pill px-3 py-2 mb-3 text-uppercase fw-bold">GIÁ TRỊ CỐT LÕI</span>
          <h2 className="display-6 fw-black text-dark text-uppercase tracking-tighter">TRIẾT LÝ VẬN HÀNH</h2>
        </div>
        
        <div className="row g-4 mb-5 pb-5">
          {[
            { icon: <Target size={32} />, title: "SỨ MỆNH", desc: "Tiếp lửa đam mê và đồng hành cùng bạn trên con đường chinh phục các mục tiêu sức khỏe.", bg: "#fef3c7" },
            { icon: <Sparkles size={32} />, title: "SẢN PHẨM", desc: "Cung cấp trang phục, giày và phụ kiện chính hãng từ các thương hiệu uy tín nhất.", bg: "#ecfdf5" },
            { icon: <Users size={32} />, title: "CỘNG ĐỒNG", desc: "Xây dựng một cộng đồng năng động, nơi mọi người cùng truyền cảm hứng cho nhau.", bg: "#eff6ff" },
            { icon: <Heart size={32} />, title: "TẬN TÂM", desc: "Đảm bảo chất lượng dịch vụ chu đáo và chính sách đổi trả vô cùng linh hoạt.", bg: "#fff1f2" }
          ].map((v, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="col-md-3"
            >
                <div className="luxury-card border-0 text-center p-5 h-100" style={{ borderRadius: '30px' }}>
                    <div className="mb-4 d-flex justify-content-center">
                        <div className="p-4 rounded-circle" style={{ background: v.bg, color: 'var(--primary)' }}>
                            {v.icon}
                        </div>
                    </div>
                    <h5 className="fw-black mb-3 text-uppercase">{v.title}</h5>
                    <p className="text-muted small mb-0">{v.desc}</p>
                </div>
            </motion.div>
          ))}
        </div>

        {/* --- PREMIUM CTA --- */}
        <div className="mb-5 pb-5">
            <div className="bg-dark text-white rounded-5 p-5 text-center position-relative overflow-hidden shadow-lg" style={{ borderRadius: '50px' }}>
                <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'radial-gradient(circle at 10% 20%, rgba(217,119,6,0.3) 0%, transparent 40%)' }}></div>
                <div className="position-absolute bottom-0 end-0 w-100 h-100" style={{ background: 'radial-gradient(circle at 90% 80%, rgba(255,255,255,0.05) 0%, transparent 40%)' }}></div>
                
                <div className="position-relative z-index-1 py-4">
                    <h2 className="display-4 fw-black mb-3 text-uppercase tracking-tighter">BẮT ĐẦU HÀNH TRÌNH <br/> CỦA BẠN NGAY HÔM NAY</h2>
                    <p className="lead mb-5 text-white-50 mx-auto" style={{ maxWidth: '600px' }}>Đừng chần chừ trước sự hoàn hảo. Trang bị cho mình những vật dụng tốt nhất để bứt phá mọi giới hạn.</p>
                    <Link to="/products" className="btn btn-light rounded-pill px-5 py-3 fw-black text-uppercase shadow-lg d-inline-flex align-items-center gap-2">
                        MUA SẮM NGAY <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import productApi from '../../api/productApi';
import ProductCard from '../../components/product/ProductCard';
import { ArrowRight, Sparkles, TrendingUp, Zap } from 'lucide-react';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await productApi.getAll(0, 12); 
                const data = res.data.content || res.data;
                setProducts(Array.isArray(data) ? data : []); 
            } catch (err) {
                console.error("Lỗi lấy sản phẩm tại Home:", err);
                setProducts([]); 
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-white">
            <div className="spinner-border text-dark"></div>
        </div>
    );

    const bestSellers = products.slice(0, 4); 
    const newArrivals = products.slice(4, 12);

    return (
        <div className="home-wrapper overflow-hidden bg-white" style={{ fontFamily: '"Inter", sans-serif' }}>
            
            {/* 1. PREMIUM HERO BANNER */}
            <section className="hero-section position-relative py-5 mb-5" style={{ background: 'var(--bg-main)', minHeight: '600px' }}>
                <div className="container-fluid px-md-5 position-relative py-5">
                    <div className="row align-items-center">
                        <div className="col-lg-6 mb-5 mb-lg-0">
                            <span className="badge border border-dark text-dark px-3 py-2 rounded-pill mb-3 text-uppercase fw-bold tracking-widest animate-fade-in">BỘ SƯU TẬP 2026</span>
                            <h1 className="display-2 fw-black text-dark mb-4 text-uppercase tracking-tighter" style={{ lineHeight: 0.85 }}>
                                KIẾN TẠO <br/> <span className="text-gradient">PHONG CÁCH</span> <br/> RIÊNG BẠN
                            </h1>
                            <p className="lead text-muted mb-5 pe-lg-5" style={{ fontSize: '1.2rem' }}>
                                Khám phá tinh hoa của ngành thời trang thể thao thế giới. Nâng tầm trải nghiệm tập luyện cùng Sporting Shop.
                            </p>
                            <div className="d-flex gap-3 animate-fade-in-up">
                                <button onClick={() => navigate('/products')} className="luxury-button px-5 py-3 d-flex align-items-center gap-2 shadow-lg">
                                    MUA SẮM NGAY <ArrowRight size={20} />
                                </button>
                                <button onClick={() => navigate('/about')} className="btn btn-outline-dark rounded-pill px-4 fw-bold">TÌM HIỂU THÊM</button>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="position-relative">
                                <img 
                                    src="https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1200&q=80" 
                                    alt="Hero" 
                                    className="img-fluid rounded-4 shadow-2xl w-100 object-fit-cover shadow-lg"
                                    style={{ height: '600px', borderRadius: '40px', objectPosition: 'center' }}
                                />
                                <div className="position-absolute -bottom-5 -left-5 bg-white p-4 rounded-4 shadow-lg d-none d-lg-block" style={{ bottom: '-30px', left: '-30px' }}>
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="bg-dark text-white p-3 rounded-circle"><Zap size={24} /></div>
                                        <div>
                                            <h5 className="fw-black mb-0">CHÍNH HÃNG</h5>
                                            <small className="text-muted fw-bold">Authentic Only</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container-fluid px-md-5">
                {/* 2. BEST SELLERS */}
                <div className="mb-5 pb-5">
                    <div className="d-flex justify-content-between align-items-end mb-4">
                        <div>
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <TrendingUp className="text-dark" size={20} />
                                <span className="fw-black small text-uppercase tracking-widest text-muted">BÁN CHẠY NHẤT</span>
                            </div>
                            <h2 className="fw-black text-dark text-uppercase tracking-tighter m-0 display-6">DANH MỤC THỊNH HÀNH</h2>
                        </div>
                        <button onClick={() => navigate('/products')} className="btn btn-link text-dark fw-bold text-decoration-none d-flex align-items-center gap-2 p-0">
                            XEM TẤT CẢ <ArrowRight size={18} />
                        </button>
                    </div>

                    <div className="row g-4">
                        {bestSellers.map(product => (
                            <div className="col-6 col-md-3" key={product.id}>
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. PROMO SECTION */}
                <section className="promo-banner bg-dark text-white rounded-5 p-5 mb-5 overflow-hidden position-relative" style={{ borderRadius: '40px' }}>
                    <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'radial-gradient(circle at top right, var(--accent), transparent 60%)', opacity: 0.3 }}></div>
                    <div className="row align-items-center position-relative z-index-1 py-4">
                        <div className="col-md-7">
                            <h2 className="display-4 fw-black mb-3 text-uppercase tracking-tighter">ƯU ĐÃI ĐỘC QUYỀN <br/> DÀNH CHO THÀNH VIÊN</h2>
                            <p className="lead text-white-50 mb-4">Tham gia cộng đồng Sporting Shop để nhận voucher 15% và trải nghiệm đặc quyền VIP ngay hôm nay.</p>
                            <button onClick={() => navigate('/register')} className="btn btn-light rounded-pill px-5 py-3 fw-black text-uppercase">ĐĂNG KÝ NGAY</button>
                        </div>
                        <div className="col-md-5 d-none d-md-block text-center">
                            <div className="display-1 fw-black text-white-50" style={{ fontSize: '10rem', opacity: 0.1 }}>SALE</div>
                        </div>
                    </div>
                </section>

                {/* 4. NEW ARRIVALS */}
                <div className="pb-5">
                    <div className="text-center mb-5">
                        <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
                            <Sparkles className="text-dark" size={20} />
                            <span className="fw-black small text-uppercase tracking-widest text-muted">HÀNG MỚI VỀ</span>
                        </div>
                        <h2 className="fw-black text-dark text-uppercase tracking-tighter display-6">SẢN PHẨM MỚI NHẤT</h2>
                    </div>

                    <div className="row g-4">
                        {newArrivals.map(product => (
                            <div className="col-6 col-md-3" key={product.id}>
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-5">
                        <button 
                            className="btn btn-outline-dark rounded-pill px-5 py-3 fw-black text-uppercase"
                            onClick={() => navigate('/products')} 
                        >
                            KHÁM PHÁ TOÀN BỘ SẢN PHẨM
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
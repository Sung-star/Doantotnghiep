import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { 
    FaHeart, FaRegHeart, FaShoppingCart, FaRulerHorizontal, 
    FaTruckMoving, FaUndoAlt, FaChevronRight, FaStar 
} from 'react-icons/fa';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import ImageMagnifier from '../../components/product/ImageMagnifier';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, openMiniCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${id}`);
        const productData = res.data;
        setProduct(productData);
        if (productData.variants && productData.variants.length > 0) {
          setSelectedVariant(productData.variants[0]);
        }
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-white">
      <div className="spinner-border text-primary"></div>
    </div>
  );
  
  if (!product) return (
    <div className="container py-5 text-center">
        <h2 className="fw-black text-uppercase">Không tìm thấy sản phẩm!</h2>
        <Link to="/products" className="btn btn-dark mt-3 rounded-pill px-4">Quay lại cửa hàng</Link>
    </div>
  );

  const getImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/800x1000?text=No+Image';
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    return `http://localhost:8081${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const imageSourceList = (selectedVariant?.imgUrl || product.imgUrl || '').trim();
  const imageUrls = imageSourceList
    ? imageSourceList.split('|').map(url => url.trim()).filter(url => url.length > 0).map(u => getImageUrl(u))
    : ['https://via.placeholder.com/800x1000?text=No+Image'];

  const productSizes = selectedVariant?.productSizes || [];

  const handleAddToCart = () => {
    if (!selectedSize) {
      setError("Vui lòng chọn kích cỡ của bạn");
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      brand: product.brand,
      image: imageUrls[0],
      selectedColor: selectedVariant?.color || 'Gốc',
      selectedSize: { size: selectedSize.size },
      quantity: quantity
    });
    openMiniCart();
  };

  return (
    <div className="product-detail-wrapper bg-white py-4" style={{ fontFamily: '"Inter", sans-serif' }}>
      <div className="container-fluid px-md-5" style={{ maxWidth: '1600px', margin: '0 auto' }}>
        {/* Breadcrumb */}
        <nav className="mb-4 small fw-bold text-uppercase tracking-widest text-muted">
          <Link to="/" className="text-decoration-none text-muted">Trang chủ</Link>
          <FaChevronRight className="mx-2" size={10} />
          <Link to="/products" className="text-decoration-none text-muted">
            {product.categories?.[0]?.name || 'Sản phẩm'}
          </Link>
          <FaChevronRight className="mx-2" size={10} />
          <span className="text-dark">{product.name}</span>
        </nav>

        <div className="row g-5">
          <div className="col-lg-6">
             <div className="pe-lg-5">
                <ImageMagnifier images={imageUrls} zoomLevel={2.5} />
             </div>
             <div className="mt-5 d-none d-lg-block border-top pt-4">
                 <h5 className="fw-black text-uppercase mb-3 italic">Mô tả sản phẩm</h5>
                 <p className="text-muted lh-lg">{product.description || 'Chưa có mô tả chi tiết cho sản phẩm này.'}</p>
             </div>
          </div>

          {/* RIGHT: Info Section */}
          <div className="col-lg-6">
            <div className="sticky-top" style={{ top: '100px', zIndex: 10 }}>
            <div className="ps-lg-4">
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="badge bg-light text-dark border px-3 py-2 rounded-pill fw-black small tracking-widest text-uppercase">{product.brand}</span>
                    <div className="text-warning small">
                        <FaStar/><FaStar/><FaStar/><FaStar/><FaStar/> <span className="text-muted ms-1">(120)</span>
                    </div>
                </div>
                <h1 className="display-5 fw-black text-uppercase italic tracking-tighter mb-2">{product.name}</h1>
                <h3 className="fw-black text-danger mb-0">{product.price?.toLocaleString()} VNĐ</h3>
              </div>

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-4">
                  <p className="small fw-black text-uppercase tracking-widest mb-3">Màu sắc: <span className="text-muted">{selectedVariant?.color}</span></p>
                  <div className="d-flex gap-2 flex-wrap">
                    {product.variants.map((v) => (
                      <div
                        key={v.id}
                        onClick={() => { setSelectedVariant(v); setSelectedSize(null); }}
                        className={`cursor-pointer border rounded overflow-hidden shadow-sm transition-all ${selectedVariant?.id === v.id ? 'border-dark border-2 scale-105' : 'opacity-75 hover:opacity-100'}`}
                        style={{ width: '60px', height: '75px' }}
                      >
                        <img src={getImageUrl(v.imgUrl?.split('|')[0])} className="w-100 h-100 object-fit-cover" alt={v.color} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <p className="small fw-black text-uppercase tracking-widest m-0">Kích cỡ</p>
                  <button className="btn btn-link btn-sm text-dark fw-bold text-decoration-none p-0 small"><FaRulerHorizontal className="me-1"/> Bảng size</button>
                </div>
                
                {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}
                
                <div className="row g-2">
                  {productSizes.length > 0 ? productSizes.map((s) => (
                    <div className="col-3" key={s.id}>
                        <button
                          disabled={s.quantity === 0}
                          onClick={() => { setSelectedSize(s); setError(""); }}
                          className={`btn w-100 py-3 fw-black border-2 transition-all ${selectedSize?.id === s.id ? 'btn-dark' : 'btn-outline-dark'}`}
                          style={{ fontSize: '0.8rem' }}
                        >
                          {s.size}
                        </button>
                    </div>
                  )) : (
                    <div className="col-12"><p className="text-muted italic small">Phiên bản này hiện đang hết hàng</p></div>
                  )}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-4">
                <p className="small fw-black text-uppercase tracking-widest mb-3">Số lượng</p>
                <div className="input-group" style={{ width: '140px' }}>
                    <button className="btn btn-outline-dark" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                    <input type="text" className="form-control text-center fw-bold" value={quantity} readOnly />
                    <button className="btn btn-outline-dark" onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
              </div>

              {/* Actions */}
              <div className="d-grid gap-3 pt-3">
                <button
                  onClick={handleAddToCart}
                  className="btn btn-dark w-100 py-3 rounded-0 fw-black text-uppercase d-flex justify-content-between align-items-center px-4"
                  style={{ height: '60px', letterSpacing: '1px' }}
                >
                  <span>THÊM VÀO GIỎ HÀNG</span>
                  <FaShoppingCart size={20} />
                </button>
                
                <button className="btn btn-outline-dark w-100 py-3 rounded-0 fw-black text-uppercase" style={{ height: '60px', letterSpacing: '1px' }}>
                    MUA NGAY
                </button>

                <button 
                    onClick={() => toggleWishlist(product)}
                    className={`btn btn-sm text-uppercase fw-bold d-flex align-items-center justify-content-center gap-2 mt-2 ${isInWishlist(product.id) ? 'text-danger' : 'text-muted'}`}
                >
                    {isInWishlist(product.id) ? <FaHeart/> : <FaRegHeart/>} 
                    {isInWishlist(product.id) ? 'Đã yêu thích' : 'Thêm vào yêu thích'}
                </button>
              </div>

              {/* Policies */}
              <div className="mt-5 pt-4 border-top">
                <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="bg-light p-3 rounded-circle text-primary"><FaTruckMoving size={20}/></div>
                    <div>
                        <h6 className="fw-black mb-0 small">GIAO HÀNG MIỄN PHÍ</h6>
                        <small className="text-muted">Áp dụng cho đơn hàng trên 2.000.000đ</small>
                    </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                    <div className="bg-light p-3 rounded-circle text-primary"><FaUndoAlt size={20}/></div>
                    <div>
                        <h6 className="fw-black mb-0 small">ĐỔI TRẢ 30 NGÀY</h6>
                        <small className="text-muted">Đảm bảo hài lòng tuyệt đối hoặc hoàn tiền</small>
                    </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { 
    FaHeart, FaRegHeart, FaShoppingCart, FaRulerHorizontal, 
    FaTruckMoving, FaUndoAlt, FaChevronRight, FaStar 
} from 'react-icons/fa';
import RecentlyViewed from '../../components/product/RecentlyViewed';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useAuth } from '../../contexts/AuthContext';
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
  const [reviews, setReviews] = useState([]);
  const [canReview, setCanReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const { user } = useAuth();

  const getAvatar = (imgUrl, name) => {
    if (!imgUrl) return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0f172a&color=fff&bold=true`;
    if (imgUrl.startsWith('http') || imgUrl.startsWith('data:')) return imgUrl;
    return `http://localhost:8081${imgUrl.startsWith('/') ? '' : '/'}${imgUrl}`;
  };

  const addToRecentlyViewed = (p) => {
    if (!p) return;
    const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    const updated = [p, ...viewed.filter(item => item.id !== p.id)].slice(0, 10);
    localStorage.setItem('recentlyViewed', JSON.stringify(updated));
  };

  useEffect(() => {
    if (product) {
      addToRecentlyViewed({
        id: product.id,
        name: product.name,
        price: product.price,
        imgUrl: product.imgUrl,
        brand: product.brand
      });
    }
  }, [product]);

  useEffect(() => {
    fetchProductData();
    fetchReviews();
    if (user?.id) {
        checkCanReview();
    }
    window.scrollTo(0, 0);
  }, [id, user]);

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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
        const res = await api.get(`/reviews/product/${id}`);
        setReviews(res.data);
    } catch (err) {
        console.error(err);
    }
  };

  const checkCanReview = async () => {
    try {
        const res = await api.get(`/reviews/can-review/${id}/user/${user.id}`);
        setCanReview(res.data);
    } catch (err) {
        console.error(err);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
        await api.post('/reviews', {
            product: { id: id },
            user: { id: user.id },
            rating: reviewForm.rating,
            comment: reviewForm.comment
        });
        alert("Cảm ơn bạn đã đánh giá!");
        setReviewForm({ rating: 5, comment: '' });
        fetchReviews();
        setCanReview(false);
    } catch (err) {
        alert("Lỗi khi gửi đánh giá: " + (err.response?.data?.message || err.message));
    }
  };

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
                
                <button 
                  onClick={() => {
                    if (!selectedSize) {
                      setError("Vui lòng chọn kích cỡ để mua ngay");
                      return;
                    }
                    handleAddToCart(); // Thêm vào giỏ
                    navigate('/checkout'); // Đi tới thanh toán
                  }}
                  className="btn btn-outline-dark w-100 py-3 rounded-0 fw-black text-uppercase" 
                  style={{ height: '60px', letterSpacing: '1px' }}
                >
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

        <div className="mt-5 pt-5 border-top">
            <div className="row g-5">
                <div className="col-lg-4">
                    <h3 className="fw-black text-uppercase tracking-tighter mb-4 italic">ĐÁNH GIÁ TỪ KHÁCH HÀNG</h3>
                    <div className="luxury-card p-4 bg-light text-center border-0">
                        <h1 className="display-4 fw-black mb-0">
                            {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : '5.0'}
                        </h1>
                        <div className="text-warning mb-2 fs-4">
                            {[1, 2, 3, 4, 5].map(star => (
                                <FaStar key={star} className={star <= Math.round(reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / (reviews.length || 1)) ? 'text-warning' : 'text-muted opacity-25'} />
                            ))}
                        </div>
                        <p className="text-muted small fw-bold text-uppercase mb-0">Dựa trên {reviews.length} nhận xét</p>
                    </div>

                    {canReview && (
                        <div className="mt-4 p-4 border rounded-4 animate__animated animate__fadeInUp">
                            <h5 className="fw-black text-uppercase small mb-3">Viết đánh giá của bạn</h5>
                            <form onSubmit={handleReviewSubmit}>
                                <div className="mb-3">
                                    <div className="d-flex gap-2 mb-2">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <FaStar 
                                                key={star} 
                                                className={`cursor-pointer fs-4 ${star <= reviewForm.rating ? 'text-warning' : 'text-muted opacity-25'}`}
                                                onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                            />
                                        ))}
                                    </div>
                                    <textarea 
                                        className="luxury-input w-100" 
                                        placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                                        style={{ height: '100px' }}
                                        required
                                        value={reviewForm.comment}
                                        onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                    ></textarea>
                                </div>
                                <button type="submit" className="luxury-button w-100 py-2">GỬI ĐÁNH GIÁ</button>
                            </form>
                        </div>
                    )}
                </div>

                <div className="col-lg-8">
                    {reviews.length > 0 ? (
                        <div className="space-y-4">
                            {reviews.map(review => (
                                <div key={review.id} className="p-4 border-bottom border-light">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="flex-shrink-0">
                                                <img 
                                                    src={getAvatar(review.user?.imgUrl, review.user?.name || 'User')} 
                                                    className="rounded-circle border border-2 border-white shadow-sm"
                                                    style={{ width: '45px', height: '45px', objectFit: 'cover' }}
                                                    alt="avatar"
                                                />
                                            </div>
                                            <div>
                                                <div className="fw-black text-uppercase small">{review.client?.name}</div>
                                                <div className="text-warning small" style={{ fontSize: '0.7rem' }}>
                                                    {[1, 2, 3, 4, 5].map(star => (
                                                        <FaStar key={star} className={star <= review.rating ? '' : 'text-muted opacity-25'} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <small className="text-muted">{new Date(review.moment).toLocaleDateString()}</small>
                                    </div>
                                    <p className="text-muted mb-0">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-5 bg-light rounded-5">
                            <p className="text-muted italic mb-0">Sản phẩm này chưa có đánh giá nào. Hãy là người đầu tiên trải nghiệm!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Recently Viewed Products */}
        <RecentlyViewed currentId={product.id} />
      </div>
    </div>
  );
};

export default ProductDetail;
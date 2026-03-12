import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { FaHeart, FaRegHeart, FaShoppingCart, FaCreditCard, FaPlus, FaMinus } from 'react-icons/fa';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  // State mới cho các phiên bản màu
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const MAX_LIMIT = 10; 

  const isFavorite = isInWishlist(Number(id));

  // Cập nhật useEffect để tải cả sản phẩm và các phiên bản màu
  useEffect(() => {
    setLoading(true);
    // Reset lựa chọn size và số lượng khi đổi sản phẩm
    setSelectedSize(null);
    setQuantity(1);

    const fetchProductData = async () => {
      try {
        const [productRes, variantsRes] = await Promise.all([
          api.get(`/products/${id}`),
          api.get(`/products/${id}/variants`)
        ]);
        setProduct(productRes.data);
        setVariants(variantsRes.data);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu sản phẩm:", err);
        setProduct(null); // Đặt lại product nếu có lỗi
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductData();
  }, [id]); // Chạy lại mỗi khi 'id' trên URL thay đổi

  const handleSelectSize = (sizeObj) => {
    setSelectedSize(sizeObj);
    setQuantity(1); 
  };

  const increaseQty = () => {
    if (!selectedSize) { alert("Vui lòng chọn kích cỡ trước!"); return; }
    if (quantity >= MAX_LIMIT) { alert(`Bạn chỉ được chọn tối đa ${MAX_LIMIT} sản phẩm!`); return; }
    if (quantity >= selectedSize.quantity) { alert(`Rất tiếc, kích cỡ này chỉ còn ${selectedSize.quantity} sản phẩm trong kho!`); return; }
    setQuantity(prev => prev + 1);
  };

  const decreaseQty = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  const handleAddToCartOnly = () => {
    if (!selectedSize) { alert("Vui lòng chọn kích cỡ sản phẩm!"); return; }
    if (product) {
      addToCart({ ...product, selectedSize, quantity });
      alert(`Đã thêm ${quantity} sản phẩm ${product.name} (Size: ${selectedSize.size}) vào giỏ hàng!`);
    }
  };

  const handleBuyNow = () => {
    if (!selectedSize) { alert("Vui lòng chọn kích cỡ sản phẩm!"); return; }
    if (product) {
      addToCart({ ...product, selectedSize, quantity });
      navigate('/checkout');
    }
  };

  const handleWishlistClick = () => {
    if (product) toggleWishlist(product);
  };

  // ----- RENDER -----
  if (loading) return <div className="text-center my-5"><div className="spinner-border" /></div>;
  if (!product) return <div className="text-center my-5">Không tìm thấy sản phẩm!</div>;

  // Gộp sản phẩm hiện tại và các phiên bản khác để hiển thị các lựa chọn màu
  const allColorVariants = [product, ...variants];

  return (
    <div className="container mt-5 mb-5">
      <div className="row bg-white p-4 shadow-sm rounded">
        <div className="col-md-6 text-center border-end">
          <img 
            src={product.imgUrl || 'https://placehold.co/500x600'} 
            className="img-fluid rounded" 
            style={{ maxHeight: '500px', objectFit: 'contain' }} 
            alt={product.name} 
          />
        </div>

        <div className="col-md-6 ps-md-5">
          <div className="d-flex justify-content-between align-items-start">
            <h2 className="fw-bold mb-1">{product.name}</h2>
            <button onClick={handleWishlistClick} className="btn btn-link fs-3 p-0">
               {isFavorite ? <FaHeart className="text-danger" /> : <FaRegHeart className="text-dark" />}
            </button>
          </div>
          
          <div className="mb-2">
            <span className="text-muted">Thương hiệu: </span>
            <strong className="text-dark">{product.brand || 'Chưa có'}</strong>
          </div>

          <div className="mb-3">
             <span className="badge bg-secondary me-2">{product.categories?.[0]?.name || 'Thời trang'}</span>
             <span className="text-muted">Mã SP: {product.id}</span>
          </div>

          <h3 className="text-danger fw-bold mb-4">{product.price?.toLocaleString()} VNĐ</h3>

          {/* === KHU VỰC CHỌN MÀU MỚI === */}
          <div className="mb-4">
            <h6 className="fw-bold">Màu sắc: <span className="fw-normal">{product.color}</span></h6>
            <div className="d-flex gap-2 flex-wrap">
              {allColorVariants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => navigate(`/product/${variant.id}`)}
                  className={`btn ${variant.id === product.id ? 'btn-dark' : 'btn-outline-dark'}`}
                  title={variant.color}
                >
                  {variant.color}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h6 className="fw-bold">Kích cỡ:</h6>
            <div className="d-flex gap-2 flex-wrap">
              {product.productSizes?.length > 0 ? product.productSizes.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSelectSize(s)}
                  className={`btn ${selectedSize?.id === s.id ? 'btn-dark' : 'btn-outline-dark'} ${s.quantity <= 0 ? 'disabled opacity-50' : ''}`}
                  disabled={s.quantity <= 0}
                >
                  {s.size}
                </button>
              )) : <span className="text-muted small">Sản phẩm hiện chưa có size.</span>}
            </div>
          </div>

          <div className="mb-4">
            <h6 className="fw-bold">Số lượng:</h6>
            <div className="d-flex align-items-center gap-3">
              <div className="input-group" style={{ width: '130px' }}>
                <button className="btn btn-outline-secondary" onClick={decreaseQty}><FaMinus /></button>
                <input type="text" className="form-control text-center" value={quantity} readOnly />
                <button className="btn btn-outline-secondary" onClick={increaseQty}><FaPlus /></button>
              </div>
              <span className="text-muted small">
                {selectedSize ? `(Còn lại: ${selectedSize.quantity} sản phẩm)` : "(Vui lòng chọn size)"}
              </span>
            </div>
          </div>
          
          <div className="border-top pt-3 mb-4">
            <h6 className="fw-bold">Mô tả sản phẩm:</h6>
            <p className="text-muted small">{product.description || 'Chưa có mô tả cho sản phẩm này.'}</p>
          </div>
          
          <div className="d-grid gap-3">
            <button onClick={handleBuyNow} className="btn btn-danger btn-lg fw-bold" disabled={!selectedSize || (selectedSize && selectedSize.quantity <= 0)}>
              <FaCreditCard className="me-2" /> MUA NGAY
            </button>
            <button onClick={handleAddToCartOnly} className="btn btn-outline-dark btn-lg" disabled={!selectedSize || (selectedSize && selectedSize.quantity <= 0)}>
              <FaShoppingCart className="me-2" /> THÊM VÀO GIỎ HÀNG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
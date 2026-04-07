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
  const [mainImage, setMainImage] = useState('');

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

        // Setup main image
        // Dùng regex để chỉ cắt dấu phẩy khi theo sau nó là http, https hoặc / (tránh cắt nhầm dấu phẩy trong link ảnh)
        const images = productRes.data.imgUrl
          ? productRes.data.imgUrl.split(/,\s*(?=https?:\/\/|\/)/).map(i => i.trim()).filter(i => i)
          : [];
        setMainImage(images.length > 0 ? images[0] : 'https://placehold.co/500x600');

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
      addToCart({ ...product, selectedSize, quantity, cartImage: mainImage });
      alert(`Đã thêm ${quantity} sản phẩm ${product.name} (Size: ${selectedSize.size}) vào giỏ hàng!`);
    }
  };

  const handleBuyNow = () => {
    if (!selectedSize) { alert("Vui lòng chọn kích cỡ sản phẩm!"); return; }
    if (product) {
      addToCart({ ...product, selectedSize, quantity, cartImage: mainImage });
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

  // Danh sách tất cả hình ảnh của sản phẩm
  // Tương tự, dùng regex an toàn
  const imageUrls = product.imgUrl
    ? product.imgUrl.split(/,\s*(?=https?:\/\/|\/)/).map(url => url.trim()).filter(url => url)
    : [];
  const displayImages = imageUrls.length > 0 ? imageUrls : ['https://placehold.co/500x600'];

  return (
    <div className="container-fluid px-4 mt-4 mb-5">
      <div className="row g-4">

        {/* === CỘT TRÁI: CHỈ ẢNH CHÍNH === */}
        <div className="col-md-7">
          <img
            src={mainImage || displayImages[0]}
            alt={product.name}
            style={{
              width: '100%',
              height: '550px',
              objectFit: 'contain',
              background: '#f5f5f5',
              borderRadius: '8px',
            }}
          />
        </div>

        {/* === CỘT PHẢI: THÔNG TIN === */}
        <div className="col-md-5 ps-md-4">

          {/* Tên + Wishlist */}
          <div className="d-flex justify-content-between align-items-start mb-1">
            <h2 className="fw-bold mb-0" style={{ fontSize: '1.6rem' }}>{product.name}</h2>
            <button onClick={handleWishlistClick} className="btn btn-link fs-3 p-0 ms-2">
              {isFavorite ? <FaHeart className="text-danger" /> : <FaRegHeart className="text-dark" />}
            </button>
          </div>

          {/* Thương hiệu + Mã SP */}
          <div className="mb-2 text-muted" style={{ fontSize: '0.9rem' }}>
            Thương hiệu: <strong className="text-dark">{product.brand || 'Chưa có'}</strong>
            <span className="mx-2">·</span>
            <span className="badge bg-secondary me-1">{product.categories?.[0]?.name || 'Thời trang'}</span>
            <span>Mã SP: {product.id}</span>
          </div>

          {/* Giá */}
          <h3 className="text-danger fw-bold mb-4">{product.price?.toLocaleString()} VNĐ</h3>

          {/* === MÀU SẮC === */}


          {/* === THUMBNAIL ẢNH PHỤ (dưới màu sắc) === */}
          {displayImages.length > 1 && (
            <div className="mb-4">
              <p className="fw-bold mb-2">Màu sắc</p>
              <div className="d-flex gap-2 flex-wrap">
                {displayImages.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setMainImage(img)}
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '8px',
                      border: mainImage === img ? '2px solid #000' : '1px solid #e0e0e0',
                      padding: '3px',
                      background: mainImage === img ? '#f0f0f0' : '#fafafa',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: mainImage === img ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
                    }}
                  >
                    <img
                      src={img}
                      alt={`${product.name} - ${idx + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        borderRadius: '6px',
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* === KÍCH CỠ === */}
          <div className="mb-4">
            <p className="fw-bold mb-2">Kích cỡ</p>
            <div className="d-flex gap-2 flex-wrap">
              {product.productSizes?.length > 0
                ? product.productSizes.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSelectSize(s)}
                    disabled={s.quantity <= 0}
                    style={{
                      width: '64px', height: '40px',
                      border: selectedSize?.id === s.id ? '2px solid #000' : '1px solid #ccc',
                      borderRadius: '6px',
                      background: selectedSize?.id === s.id ? '#000' : '#fff',
                      color: selectedSize?.id === s.id ? '#fff' : '#000',
                      fontWeight: '500',
                      fontSize: '0.85rem',
                      cursor: s.quantity <= 0 ? 'not-allowed' : 'pointer',
                      opacity: s.quantity <= 0 ? 0.4 : 1,
                      transition: 'all 0.15s',
                    }}
                  >
                    {s.size}
                  </button>
                ))
                : <span className="text-muted small">Chưa có size.</span>
              }
            </div>
          </div>

          {/* === SỐ LƯỢNG === */}
          <div className="mb-4">
            <p className="fw-bold mb-2">Số lượng</p>
            <div className="d-flex align-items-center gap-3">
              <div className="d-flex align-items-center border rounded" style={{ overflow: 'hidden' }}>
                <button
                  onClick={decreaseQty}
                  className="btn btn-light"
                  style={{ width: '40px', height: '40px', border: 'none', borderRadius: 0 }}
                >
                  <FaMinus />
                </button>
                <span style={{ width: '40px', textAlign: 'center', fontWeight: '600' }}>{quantity}</span>
                <button
                  onClick={increaseQty}
                  className="btn btn-light"
                  style={{ width: '40px', height: '40px', border: 'none', borderRadius: 0 }}
                >
                  <FaPlus />
                </button>
              </div>
              <span className="text-muted small">
                {selectedSize ? `(Còn lại: ${selectedSize.quantity} sản phẩm)` : '(Vui lòng chọn size)'}
              </span>
            </div>
          </div>

          {/* === MÔ TẢ === */}
          <div className="border-top pt-3 mb-4">
            <p className="fw-bold mb-1">Mô tả sản phẩm:</p>
            <p className="text-muted small">{product.description || 'Chưa có mô tả.'}</p>
          </div>

          {/* === BUTTONS === */}
          <div className="d-grid gap-2">
            <button
              onClick={handleBuyNow}
              disabled={!selectedSize || selectedSize?.quantity <= 0}
              className="btn btn-danger btn-lg fw-bold"
            >
              <FaCreditCard className="me-2" /> MUA NGAY
            </button>
            <button
              onClick={handleAddToCartOnly}
              disabled={!selectedSize || selectedSize?.quantity <= 0}
              className="btn btn-outline-dark btn-lg"
            >
              <FaShoppingCart className="me-2" /> THÊM VÀO GIỎ HÀNG
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
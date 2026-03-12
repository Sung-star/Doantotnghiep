import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaEye } from 'react-icons/fa'; 
// Tạm tắt Wishlist để tránh lỗi trắng trang
// import { FaHeart, FaRegHeart } from 'react-icons/fa';
// import { useWishlist } from '../../contexts/WishlistContext';

const ProductCard = ({ product, viewMode = 'grid' }) => {
  const navigate = useNavigate();
  // const { toggleWishlist, isInWishlist } = useWishlist(); // Tạm tắt

  // 1. Kiểm tra an toàn
  if (!product) return null;

  // const isFavorite = isInWishlist(product.id); // Tạm tắt

  // 2. Logic chuyển hướng sang trang chi tiết để chọn size
  const handleSelectSize = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };

  /* Tạm tắt hàm Wishlist
  const handleAddToWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };
  */

  // --- STYLE NỘI BỘ ---
  const styles = {
    hoverShadow: {
      transition: 'all 0.3s',
      cursor: 'pointer'
    },
    imgCover: {
      height: '250px',
      objectFit: 'cover',
      width: '100%'
    }
  };

  // --- CHẾ ĐỘ XEM DANH SÁCH (LIST VIEW) ---
  if (viewMode === 'list') {
    return (
      <div className="card mb-3 border-0 shadow-sm product-card">
        <div className="row g-0">
          <div className="col-md-4">
            <Link to={`/product/${product.id}`}>
              <img
                src={product.imgUrl || 'https://placehold.co/400x500'}
                className="img-fluid rounded-start"
                alt={product.name}
                style={styles.imgCover}
              />
            </Link>
          </div>
          <div className="col-md-8">
            <div className="card-body h-100 d-flex flex-column">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <Link to={`/product/${product.id}`} className="text-decoration-none">
                    <h5 className="card-title fw-bold text-dark mb-1">{product.name}</h5>
                  </Link>
                  {/* Dòng mới thêm vào */}
                  <p className="text-muted small mb-2">{product.brand}</p>
                </div>
                {/* Đã ẩn nút tim để tránh lỗi */}
              </div>
              
              <p className="card-text text-muted flex-grow-1">
                {product.description ? product.description.substring(0, 150) + "..." : ""}
              </p>
              
              <div className="d-flex justify-content-between align-items-center mt-auto">
                <h4 className="text-danger fw-bold mb-0">
                  {product.price ? product.price.toLocaleString() : 0}đ
                </h4>
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-outline-dark"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <FaEye /> Chi tiết
                  </button>
                  {/* NÚT CHỌN SIZE */}
                  <button className="btn btn-dark" onClick={handleSelectSize}>
                    <FaShoppingCart /> Chọn size
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- CHẾ ĐỘ XEM LƯỚI (GRID VIEW - MẶC ĐỊNH) ---
  return (
    <div className="card h-100 border-0 shadow-sm product-card overflow-hidden">
      <div className="position-relative">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.imgUrl || 'https://placehold.co/400x500'}
            className="card-img-top"
            alt={product.name}
            style={styles.imgCover}
          />
        </Link>
        
        {/* Đã ẩn nút Wishlist ở đây để tránh lỗi */}
        
        {/* ĐÃ XÓA NHÃN -20% TẠI ĐÂY */}
      </div>

      <div className="card-body d-flex flex-column">
        <Link to={`/product/${product.id}`} className="text-decoration-none mb-2">
          <h6 className="card-title fw-bold text-dark mb-1 text-truncate">
            {product.name}
          </h6>
        </Link>

        {/* Dòng mới thêm vào */}
        <p className="card-text text-muted small flex-grow-1">
            {product.brand}
        </p>
        
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <h5 className="text-danger fw-bold mb-0">
            {product.price ? product.price.toLocaleString() : 0}đ
          </h5>
          
          {/* NÚT CHỌN SIZE */}
          <button 
            className="btn btn-dark btn-sm rounded-circle p-2" 
            onClick={handleSelectSize} 
            title="Chọn size"
          >
            <FaShoppingCart />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
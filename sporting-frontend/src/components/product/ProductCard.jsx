import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Eye, Plus } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

const ProductCard = ({ product, viewMode = 'grid' }) => {
  const navigate = useNavigate();
  const { addToCart, openMiniCart } = useCart();
  const [hovered, setHovered] = useState(false);

  if (!product) return null;

  const handleSelectSize = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };

  const getImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/600x600?text=Sporting+Shop';
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    // Backend phục vụ ảnh tại /uploads/...
    return `http://localhost:8081${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const imageSources = (() => {
    const variants = product?.variants;
    let variant = null;
    
    if (Array.isArray(variants) && variants.length > 0) {
      variant = variants[0];
    } else if (variants && typeof variants === 'object' && Object.values(variants).length > 0) {
      variant = Object.values(variants)[0];
    }
    
    const sourceString = variant?.imgUrl || product?.imgUrl || '';
    const urls = sourceString.split('|')
      .map(u => u.trim())
      .filter(u => u !== '')
      .map(u => getImageUrl(u));
    
    return urls.length ? urls : ['https://via.placeholder.com/600x600?text=Sporting+Shop'];
  })();

  const primaryImage = hovered ? imageSources[1] || imageSources[0] : imageSources[0];

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const defaultVariant = product?.variants?.[0];
    const defaultSize = defaultVariant?.productSizes?.[0];

    if (!defaultVariant || !defaultSize) {
      navigate(`/product/${product.id}`);
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      quantity: 1,
      selectedSize: { size: defaultSize.size },
      selectedColor: defaultVariant.color,
      image: primaryImage
    });
    openMiniCart();
  };

  // --- LIST VIEW ---
  if (viewMode === 'list') {
    return (
      <div className="luxury-card mb-4 overflow-hidden">
        <div className="row g-0">
          <div className="col-md-4">
            <Link to={`/product/${product.id}`} className="d-block overflow-hidden rounded-4">
              <img
                src={primaryImage}
                className="img-fluid w-100 object-fit-cover"
                alt={product.name}
                style={{ height: '280px' }}
              />
            </Link>
          </div>
          <div className="col-md-8">
            <div className="card-body h-100 d-flex flex-column p-4">
                <div className="mb-2">
                    <span className="fw-black text-muted small text-uppercase tracking-widest">{product.brand}</span>
                    <Link to={`/product/${product.id}`} className="text-decoration-none">
                        <h4 className="fw-black text-dark mb-2 mt-1">{product.name}</h4>
                    </Link>
                </div>
              
              <p className="text-muted small flex-grow-1 lh-base">
                {product.description ? product.description.substring(0, 180) + "..." : "Sản phẩm thể thao cao cấp dành cho những ai tìm kiếm sự hoàn mỹ và hiệu suất tối đa."}
              </p>
              
              <div className="d-flex justify-content-between align-items-center mt-4">
                <div>
                  <h3 className="fw-black text-dark mb-0">
                    {product.price ? product.price.toLocaleString() : 0}đ
                  </h3>
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-outline-dark rounded-pill px-4 fw-bold d-flex align-items-center gap-2" onClick={() => navigate(`/product/${product.id}`)}>
                    <Eye size={18} /> CHI TIẾT
                  </button>
                  <button className="luxury-button d-flex align-items-center gap-2" onClick={handleQuickAdd}>
                    <Plus size={18} /> THÊM NHANH
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- GRID VIEW ---
  return (
    <div className="luxury-card border-0 h-100 p-0 overflow-hidden group" 
         onMouseEnter={() => setHovered(true)} 
         onMouseLeave={() => setHovered(false)}>
      <div className="position-relative overflow-hidden" style={{ height: '320px' }}>
        <Link to={`/product/${product.id}`}>
            <img
            src={primaryImage}
            className="w-100 h-100 object-fit-cover"
            alt={product.name}
            onError={(e) => { e.target.src = 'https://via.placeholder.com/600x600?text=Sporting+Shop'; }}
            style={{ 
                transition: 'transform 0.8s cubic-bezier(0.2, 1, 0.3, 1)',
                transform: hovered ? 'scale(1.1)' : 'scale(1)' 
            }}
          />
        </Link>
        
        {/* Quick Action Overlay */}
        <div className="position-absolute bottom-0 start-0 w-100 p-3 translate-middle-y opacity-0 transition-all"
             style={{ 
                 bottom: hovered ? '0' : '-20px', 
                 opacity: hovered ? 1 : 0,
                 transition: 'all 0.4s ease'
             }}>
            <button className="luxury-button w-100 py-3 d-flex align-items-center justify-content-center gap-2 shadow-lg"
                    onClick={handleQuickAdd}>
                <Plus size={18} /> THÊM NHANH
            </button>
        </div>

        {/* Brand Badge */}
        <div className="position-absolute top-0 start-0 m-3">
            <span className="badge bg-white text-dark rounded-pill px-3 py-2 fw-black small shadow-sm">{product.brand}</span>
        </div>
      </div>

      <div className="p-4 bg-white">
        <Link to={`/product/${product.id}`} className="text-decoration-none">
          <h6 className="fw-black text-dark text-uppercase tracking-tighter mb-1 text-truncate" style={{ fontSize: '1.1rem' }}>
            {product.name}
          </h6>
        </Link>
        
        <div className="d-flex justify-content-between align-items-center mt-3">
            <div className="fw-black fs-5 text-dark">
                {product.price ? product.price.toLocaleString() : 0}đ
            </div>
            <button className="btn btn-outline-dark rounded-circle p-2 d-flex align-items-center justify-content-center" 
                    onClick={handleSelectSize} style={{ width: '40px', height: '40px' }}>
                <ShoppingCart size={18} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
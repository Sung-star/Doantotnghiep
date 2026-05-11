import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice } = useCart();
  const navigate = useNavigate();

  // 1. TRƯỜNG HỢP GIỎ HÀNG TRỐNG
  if (cartItems.length === 0) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: '60vh' }}>
        <div className="mb-4">
          <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '100px', height: '100px' }}>
            <ShoppingBag size={48} className="text-secondary opacity-50" />
          </div>
        </div>
        <h3 className="fw-bold mb-3">Giỏ hàng của bạn đang trống</h3>
        <p className="text-muted mb-4">Hãy dạo một vòng và chọn những món đồ ưng ý nhé!</p>
        <Link to="/products" className="btn btn-dark px-4 py-2 rounded-pill">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  // 2. GIAO DIỆN GIỎ HÀNG CÓ SẢN PHẨM
  return (
    <div className="container py-5 mb-5">
      <div className="d-flex align-items-center gap-2 mb-4">
        <button onClick={() => navigate(-1)} className="btn btn-link text-dark p-0 text-decoration-none">
          <ArrowLeft size={20} />
        </button>
        <h2 className="fw-bold mb-0">Giỏ hàng ({cartItems.length})</h2>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="card-body p-0">
              <div className="d-none d-md-flex bg-light p-3 fw-bold text-secondary font-monospace small">
                <div style={{ width: '45%' }}>SẢN PHẨM</div>
                <div style={{ width: '15%' }} className="text-center">ĐƠN GIÁ</div>
                <div style={{ width: '20%' }} className="text-center">SỐ LƯỢNG</div>
                <div style={{ width: '15%' }} className="text-end">TỔNG</div>
                <div style={{ width: '5%' }}></div>
              </div>

              <div className="d-flex flex-column">
                {cartItems.map((item) => (
                  // SỬA: Key dùng item.selectedSize?.size (String)
                  <div key={`${item.id}-${item.selectedSize?.size}`} className="p-3 border-bottom position-relative hover-bg-light">
                    <div className="row align-items-center g-3">
                      
                      <div className="col-12 col-md-5 d-flex gap-3 align-items-center">
                        <Link to={`/product/${item.id}`} className="flex-shrink-0">
                          <img 
                            src={item.image || (item.imgUrl ? item.imgUrl.split('|')[0].trim() : 'https://placehold.co/100')} 
                            alt={item.name}
                            className="rounded-3 border"
                            style={{ width: '80px', height: '100px', objectFit: 'cover' }}
                          />
                        </Link>
                        <div>
                          <Link to={`/product/${item.id}`} className="text-decoration-none text-dark fw-bold d-block mb-1 text-truncate-2">
                            {item.name}
                          </Link>
                          {/* SỬA: Hiển thị item.selectedSize.size thay vì .name */}
                          {item.selectedSize && (
                            <span className="badge bg-light text-dark border fw-normal">
                              Size: {item.selectedSize.size}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="col-md-2 d-none d-md-block text-center text-muted">
                        {item.price ? item.price.toLocaleString() : 0}đ
                      </div>

                      <div className="col-6 col-md-2 d-flex justify-content-center">
                        <div className="input-group input-group-sm border rounded-3 overflow-hidden" style={{ width: '100px' }}>
                          <button 
                            className="btn btn-light border-0 px-2 hover-dark"
                            // SỬA: Truyền item.selectedSize.size (String)
                            onClick={() => updateQuantity(item.id, item.selectedSize?.size, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={14} />
                          </button>
                          
                          <span className="form-control border-0 text-center bg-white px-0 fw-bold d-flex align-items-center justify-content-center">
                            {item.quantity}
                          </span>
                          
                          <button 
                            className="btn btn-light border-0 px-2 hover-dark"
                            // SỬA: Truyền item.selectedSize.size (String)
                            onClick={() => updateQuantity(item.id, item.selectedSize?.size, item.quantity + 1)}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="col-6 col-md-2 text-end fw-bold text-dark">
                         {(item.price * item.quantity).toLocaleString()}đ
                      </div>

                      <div className="col-12 col-md-1 text-end">
                        <button 
                          className="btn btn-link text-danger p-2 rounded-circle hover-bg-danger-light"
                          // SỬA: Truyền item.selectedSize.size (String)
                          onClick={() => removeFromCart(item.id, item.selectedSize?.size)}
                          title="Xóa sản phẩm"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: '100px' }}>
            <h5 className="fw-bold mb-4">Cộng giỏ hàng</h5>
            
            <div className="d-flex justify-content-between mb-3">
              <span className="text-muted">Tạm tính:</span>
              <span className="fw-bold">{getTotalPrice().toLocaleString()}đ</span>
            </div>
            
            <div className="d-flex justify-content-between mb-4 pb-3 border-bottom">
              <span className="text-muted">Phí vận chuyển:</span>
              <span className="text-success fw-bold">Miễn phí</span>
            </div>

            <div className="d-flex justify-content-between mb-4">
              <span className="fw-bold fs-5">Tổng cộng:</span>
              <span className="fw-bold fs-4 text-danger">{getTotalPrice().toLocaleString()}đ</span>
            </div>

            <Link to="/checkout" className="btn btn-dark w-100 py-3 rounded-pill fw-bold shadow-sm mb-3">
              TIẾN HÀNH THANH TOÁN
            </Link>

            <Link to="/products" className="btn btn-outline-secondary w-100 py-2 rounded-pill small">
              Tiếp tục xem sản phẩm
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .text-truncate-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .hover-bg-light:hover { background-color: #f8f9fa; }
        .hover-bg-danger-light:hover { background-color: #ffeaea; }
        .hover-dark:hover { background-color: #e9ecef; color: black; }
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
      `}</style>
    </div>
  );
};

export default Cart;
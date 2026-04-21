import { Link } from 'react-router-dom';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

const MiniCartSidebar = () => {
  const { cartItems, isMiniCartOpen, closeMiniCart, removeFromCart, updateQuantity, getTotalPrice } = useCart();

  return (
    <div className={`mini-cart-overlay ${isMiniCartOpen ? 'open' : ''}`} onClick={closeMiniCart}>
      <div className="mini-cart-sidebar bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="d-flex align-items-center justify-content-between px-4 py-3 border-bottom">
          <div>
            <h5 className="mb-0 fw-bold">Giỏ hàng nhanh</h5>
            <p className="text-muted small mb-0">Xem và chỉnh sửa trước khi thanh toán</p>
          </div>
          <button className="btn btn-sm btn-outline-secondary" onClick={closeMiniCart}>
            <X size={18} />
          </button>
        </div>

        <div className="mini-cart-body p-4">
          {cartItems.length === 0 ? (
            <div className="text-center text-muted py-5">
              <p className="mb-2 fw-bold">Giỏ hàng trống</p>
              <p className="small">Thêm sản phẩm để tiếp tục.</p>
              <Link to="/products" className="btn btn-dark btn-sm mt-3" onClick={closeMiniCart}>
                Tiếp tục mua sắm
              </Link>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={`${item.id}-${item.selectedSize?.size || 'default'}`} className="mini-cart-item d-flex gap-3 mb-4">
                <img
                  src={item.image || item.imgUrl || 'https://placehold.co/120x120'}
                  alt={item.name}
                  className="mini-cart-img rounded-3"
                />
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h6 className="mb-1 fw-bold">{item.name}</h6>
                      <p className="small text-muted mb-1">{item.brand || ''}</p>
                      <p className="small text-muted mb-0">Size: {item.selectedSize?.size || 'N/A'}</p>
                    </div>
                    <button className="btn btn-sm btn-outline-danger p-1" onClick={() => removeFromCart(item.id, item.selectedSize?.size)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="d-flex align-items-center justify-content-between gap-2">
                    <div className="input-group input-group-sm mini-cart-qty">
                      <button className="btn btn-outline-secondary" type="button" onClick={() => updateQuantity(item.id, item.selectedSize?.size, item.quantity - 1)}>
                        <Minus size={14} />
                      </button>
                      <input type="text" className="form-control text-center" value={item.quantity} readOnly />
                      <button className="btn btn-outline-secondary" type="button" onClick={() => updateQuantity(item.id, item.selectedSize?.size, item.quantity + 1)}>
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="text-end">
                      <p className="mb-0 fw-bold">{(item.price * item.quantity).toLocaleString()}đ</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="mini-cart-footer px-4 py-3 border-top">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="small text-muted">Tổng</span>
              <strong>{getTotalPrice().toLocaleString()}đ</strong>
            </div>
            <Link to="/checkout" className="btn btn-dark w-100" onClick={closeMiniCart}>
              Thanh toán ngay
            </Link>
            <Link to="/cart" className="btn btn-outline-secondary w-100 mt-2" onClick={closeMiniCart}>
              Xem giỏ hàng đầy đủ
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MiniCartSidebar;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import api from '../../api/axiosConfig';
import ProductCard from "../../components/product/ProductCard";

const OrderSuccess = ({ order }) => {
  const navigate = useNavigate();
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    api.get('/products?size=1000')
      .then(res => {
        const data = res.data.content || res.data;
        const all = Array.isArray(data) ? data : [];
        const shuffled = all.sort(() => 0.5 - Math.random()).slice(0, 4);
        setSuggestedProducts(shuffled);
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingProducts(false));
  }, []);

  return (
    <div style={{ fontFamily: '"Segoe UI", sans-serif', background: '#f8f8f6', minHeight: '100vh', paddingBottom: 60 }}>
      <style>{`
        .success-card {
          max-width: 560px; margin: 0 auto; background: #fff;
          border-radius: 24px; padding: 48px 40px; text-align: center;
          box-shadow: 0 4px 40px rgba(0,0,0,0.08);
        }
        .success-icon-wrap {
          width: 80px; height: 80px; background: #e6f9ef; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 24px;
          animation: popIn 0.5s cubic-bezier(.36,2,.5,.8) both;
        }
        @keyframes popIn {
          from { transform: scale(0); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
        .success-meta {
          background: #f8f8f6; border-radius: 16px;
          padding: 20px 24px; text-align: left; margin-bottom: 28px;
        }
        .success-meta-row {
          display: flex; justify-content: space-between; align-items: center; padding: 6px 0;
        }
        .success-meta-row:not(:last-child) { border-bottom: 1px solid #ececec; margin-bottom: 6px; }
        .badge-status {
          background: #fef3c7; color: #92400e; border-radius: 20px;
          padding: 4px 14px; font-size: 0.78rem; font-weight: 700;
        }
        .btn-continue {
          display: block; width: 100%; background: #111; color: #fff;
          border: none; border-radius: 14px; padding: 16px;
          font-weight: 800; font-size: 0.95rem; letter-spacing: 1px;
          cursor: pointer; transition: background 0.2s;
        }
        .btn-continue:hover { background: #333; }
        .suggested-section { max-width: 1100px; margin: 48px auto 0; padding: 0 16px; }
        .suggested-header { display: flex; align-items: baseline; gap: 12px; margin-bottom: 24px; }
        .suggested-title { font-size: 1.35rem; font-weight: 900; color: #111; }
        .suggested-sub { color: #aaa; font-size: 0.85rem; }
        .suggested-grid {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;
        }
        @media (max-width: 900px) { .suggested-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .success-card { padding: 32px 16px; margin: 0 12px; } }
        .skeleton-card {
          background: #ececec; border-radius: 18px; height: 340px;
          animation: pulse 1.4s ease-in-out infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .suggest-card-wrap {
          animation: fadeUp 0.4s ease both;
        }
        .suggest-card-wrap:nth-child(1){animation-delay:0.05s}
        .suggest-card-wrap:nth-child(2){animation-delay:0.12s}
        .suggest-card-wrap:nth-child(3){animation-delay:0.19s}
        .suggest-card-wrap:nth-child(4){animation-delay:0.26s}
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{ paddingTop: 48 }}>
        {/* SUCCESS CARD */}
        <div className="success-card">
          <div className="success-icon-wrap">
            <FaCheckCircle color="#22c55e" size={36} />
          </div>
          <h2 style={{ fontWeight: 900, fontSize: '1.75rem', letterSpacing: '-0.5px', marginBottom: 8 }}>
            ĐẶT HÀNG THÀNH CÔNG!
          </h2>
          <p style={{ color: '#888', fontSize: '0.95rem', marginBottom: 28 }}>
            Cảm ơn bạn đã tin dùng Sporting Shop. Mã đơn hàng của bạn là{' '}
            <strong style={{ color: '#111' }}>#ORD-{order.id}</strong>
          </p>

          <div className="success-meta">
            <div className="success-meta-row">
              <span style={{ color: '#999', fontSize: '0.875rem' }}>Tổng thanh toán:</span>
              <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#e53e3e' }}>
                {order.total?.toLocaleString('vi-VN')}đ
              </span>
            </div>
            <div className="success-meta-row">
              <span style={{ color: '#999', fontSize: '0.875rem' }}>Trạng thái:</span>
              <span className="badge-status">CHỜ XÁC NHẬN</span>
            </div>
          </div>

          <button className="btn-continue" onClick={() => navigate('/')}>
            TIẾP TỤC KHÁM PHÁ
          </button>
        </div>

        {/* SUGGESTED PRODUCTS */}
        <div className="suggested-section">
          <div className="suggested-header">
            <div className="suggested-title">Có thể bạn cũng thích</div>
            <div className="suggested-sub">Gợi ý dành riêng cho bạn</div>
          </div>

          {loadingProducts ? (
            <div className="suggested-grid">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton-card" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          ) : (
            <div className="suggested-grid">
              {suggestedProducts.map(product => (
                <div key={product.id} className="suggest-card-wrap">
                  {/* Tái sử dụng ProductCard — đúng field ảnh, đúng link, đúng style */}
                  <ProductCard product={product} viewMode="grid" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { FaChevronRight } from 'react-icons/fa';
import ProductCard from './ProductCard';

const RelatedProducts = ({ currentProductId, categoryName }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (!categoryName) return;
    const fetchRelated = async () => {
      try {
        const res = await api.get(`/products?category=${encodeURIComponent(categoryName)}&size=5`);
        const data = res.data.content || res.data;
        const filtered = data.filter(p => p.id !== currentProductId).slice(0, 4);
        setRelatedProducts(filtered);
      } catch (err) {
        console.error("Lỗi fetch sản phẩm liên quan:", err);
      }
    };
    fetchRelated();
  }, [currentProductId, categoryName]);

  if (relatedProducts.length === 0) return null;

  return (
    <div className="mt-5 pt-5 border-top">
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <span className="badge border border-dark text-dark rounded-pill px-3 py-2 mb-3 text-uppercase fw-bold">CÓ THỂ BẠN CŨNG THÍCH</span>
          <h3 className="fw-black text-uppercase tracking-tighter mb-0">SẢN PHẨM LIÊN QUAN</h3>
        </div>
        <Link to={`/products?category=${encodeURIComponent(categoryName)}`} className="btn btn-link text-dark text-decoration-none fw-bold small p-0 pb-1 border-bottom border-dark rounded-0">
          XEM THÊM <FaChevronRight size={12} className="ms-1" />
        </Link>
      </div>
      
      <div className="row g-4">
        {relatedProducts.map(product => (
          <div className="col-md-3" key={product.id}>
            <ProductCard product={product} viewMode="grid" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const RecentlyViewed = ({ currentId }) => {
    const [viewedProducts, setViewedProducts] = useState([]);

    useEffect(() => {
        const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        // Loại bỏ sản phẩm đang xem khỏi danh sách hiển thị
        setViewedProducts(viewed.filter(p => p.id !== currentId));
    }, [currentId]);

    if (viewedProducts.length === 0) return null;

    const getImageUrl = (url) => {
        if (!url) return 'https://placehold.co/200';
        if (url.startsWith('http') || url.startsWith('data:')) return url;
        return `http://localhost:8081${url.startsWith('/') ? '' : '/'}${url.split('|')[0]}`;
    };

    return (
        <div className="recently-viewed-section mt-5 pt-5 border-top">
            <h4 className="fw-black text-uppercase mb-4">Sản phẩm bạn đã xem</h4>
            <div className="row g-4 overflow-auto flex-nowrap pb-3" style={{ scrollbarWidth: 'thin' }}>
                {viewedProducts.map(p => (
                    <div key={p.id} className="col-6 col-md-3 col-lg-2" style={{ minWidth: '180px' }}>
                        <Link to={`/product/${p.id}`} className="text-decoration-none group">
                            <div className="card border-0 bg-light h-100 overflow-hidden" style={{ borderRadius: '15px' }}>
                                <img 
                                    src={getImageUrl(p.imgUrl)} 
                                    alt={p.name} 
                                    className="card-img-top object-fit-cover"
                                    style={{ height: '180px' }}
                                />
                                <div className="card-body p-2">
                                    <div className="small text-muted mb-1">{p.brand}</div>
                                    <div className="fw-bold text-dark text-truncate small mb-1">{p.name}</div>
                                    <div className="fw-black text-danger small">{p.price?.toLocaleString()}đ</div>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentlyViewed;

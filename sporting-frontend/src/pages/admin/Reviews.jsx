import React, { useEffect, useState } from 'react';
import instance from '../../api/axiosConfig';
import { FaTrash, FaStar, FaSync, FaUser, FaBoxOpen } from 'react-icons/fa';

const AdminReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const res = await instance.get('/reviews');
            setReviews(res.data);
        } catch (err) {
            console.error('Lỗi tải đánh giá:', err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa đánh giá này?")) return;
        try {
            await instance.delete(`/reviews/${id}`);
            setReviews(reviews.filter(r => r.id !== id));
        } catch (err) {
            alert("Lỗi khi xóa: " + err.message);
        }
    };

    const getAvatar = (url, name) => {
        if (!url) return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'U')}&background=0d6efd&color=fff&bold=true`;
        if (url.startsWith('http') || url.startsWith('data:')) return url;
        return `http://localhost:8081${url.startsWith('/') ? '' : '/'}${url}`;
    };

    return (
        <div className="container-fluid py-4 bg-light min-vh-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold border-start border-4 border-primary ps-3 m-0" style={{ fontSize: '1.4rem' }}>
                    QUẢN LÝ ĐÁNH GIÁ SẢN PHẨM
                </h2>
                <button className="btn btn-dark shadow-sm rounded-3 px-4" onClick={fetchReviews} disabled={loading}>
                    <FaSync className={loading ? 'fa-spin me-2' : 'me-2'} />
                    Làm mới
                </button>
            </div>

            <div className="row g-4">
                {loading ? (
                    <div className="col-12 text-center py-5">
                        <div className="spinner-border text-primary"></div>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="col-12 text-center py-5 text-muted">
                        <h3>Chưa có đánh giá nào</h3>
                    </div>
                ) : reviews.map(review => (
                    <div key={review.id} className="col-md-6 col-lg-4">
                        <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="flex-shrink-0">
                                            <img 
                                                src={getAvatar(review.user?.imgUrl || review.client?.imgUrl, review.user?.name || review.client?.name)} 
                                                className="rounded-circle border"
                                                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                                alt="avatar"
                                            />
                                        </div>
                                        <div>
                                            <div className="fw-bold small">{review.user?.name || review.client?.name}</div>
                                            <div className="text-warning small">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <FaStar key={star} className={star <= review.rating ? '' : 'text-muted opacity-25'} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        className="btn btn-outline-danger btn-sm border-0" 
                                        onClick={() => handleDelete(review.id)}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>

                                <div className="mb-3 p-3 bg-light rounded-3 small border">
                                    <div className="d-flex align-items-center gap-2 mb-1">
                                        <FaBoxOpen className="text-muted" />
                                        <span className="fw-bold">Sản phẩm:</span>
                                    </div>
                                    <div className="text-truncate text-primary fw-bold">{review.product?.name}</div>
                                </div>

                                <p className="text-muted mb-0 fst-italic" style={{ fontSize: '14px' }}>
                                    "{review.comment}"
                                </p>
                                
                                <div className="mt-3 pt-3 border-top text-end">
                                    <small className="text-muted">{new Date(review.moment).toLocaleString()}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminReviews;

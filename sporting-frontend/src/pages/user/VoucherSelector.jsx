import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { useAuth } from '../../contexts/AuthContext';
import { Ticket, Info, CheckCircle2 } from 'lucide-react';
import './VoucherSelector.css';

const VoucherSelector = ({ subtotal, onSelect, selectedVoucher }) => {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);

    const { user } = useAuth();

    useEffect(() => {
        const userId = user?.id || null;
        const url = userId ? `/vouchers/available/user/${userId}` : '/vouchers/available';

        api.get(url)
            .then(res => setVouchers(res.data))
            .catch(err => console.error("Không lấy được danh sách voucher", err))
            .finally(() => setLoading(false));
    }, [user]);

    const calculateSavings = (v) => {
        let amount = subtotal * (v.discountPercent / 100);
        if (v.maxDiscountAmount && amount > v.maxDiscountAmount) amount = v.maxDiscountAmount;
        return amount;
    };

    if (loading) return <div className="text-muted small p-3">Đang tải mã giảm giá...</div>;

    return (
        <div className="voucher-selector-container">
            <h6 className="fw-bold d-flex align-items-center gap-2 mb-3 text-uppercase">
                <Ticket size={20} /> Chọn Voucher của shop
            </h6>
            <div className="voucher-scroll-area">
                {vouchers.length === 0 && <p className="text-muted small">Hiện không có mã giảm giá nào.</p>}
                {vouchers.map(v => {
                    const isLocked = subtotal < v.minOrderAmount;
                    const isSelected = selectedVoucher?.code === v.code;
                    const savings = calculateSavings(v);

                    return (
                        <div 
                            key={v.id} 
                            className={`voucher-card ${isLocked ? 'disabled' : ''} ${isSelected ? 'selected' : ''}`}
                            onClick={() => !isLocked && onSelect(v)}
                        >
                            <div className="voucher-left">
                                <div style={{fontSize: '18px'}}>{v.discountPercent}%</div>
                                <div style={{fontSize: '10px'}}>OFF</div>
                            </div>
                            <div className="voucher-right">
                                <div className="d-flex justify-content-between">
                                    <span className="fw-bold text-dark">{v.description || 'Giảm giá đơn hàng'}</span>
                                    {isSelected ? <CheckCircle2 size={18} className="text-success" /> : <span className="voucher-badge">{v.code}</span>}
                                </div>
                                <div className="text-muted" style={{fontSize: '11px'}}>
                                    Đơn tối thiểu: {v.minOrderAmount.toLocaleString()}đ
                                </div>
                                <div className="text-muted" style={{fontSize: '10px', marginTop: '0.35rem'}}>
                                    {v.assignedToAll ? 'Voucher phát cho tất cả khách hàng' : 'Voucher gán riêng cho bạn'}
                                </div>
                                {!isLocked ? (
                                    <div className="text-success small fw-bold mt-1">
                                        Giảm được: {savings.toLocaleString()}đ
                                    </div>
                                ) : (
                                    <div className="text-danger mt-1 d-flex align-items-center gap-1" style={{fontSize: '10px'}}>
                                        <Info size={12} /> Cần thêm {(v.minOrderAmount - subtotal).toLocaleString()}đ để sử dụng
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
export default VoucherSelector;
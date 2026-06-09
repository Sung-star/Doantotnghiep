import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axiosConfig from '../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import {
  Gift, TrendingUp, Award, Zap, ArrowLeft, Star,
  Clock, CheckCircle, XCircle, RotateCcw, ShoppingBag,
  ChevronRight, Sparkles, Crown, Shield, Flame
} from 'lucide-react';
import './Loyalty.css';

// ===========================================================
// TIER CONFIG
// ===========================================================
const TIER_CONFIG = {
  BRONZE: {
    label: 'Đồng', icon: '🥉', color: '#cd7f32',
    gradient: 'linear-gradient(135deg, #b8860b, #cd7f32)',
    bg: '#fff8ef', border: '#e4a35a',
    discount: '0%', multiplier: '1x',
    nextTier: 'SILVER', nextPts: 1000,
  },
  SILVER: {
    label: 'Bạc', icon: '🥈', color: '#94a3b8',
    gradient: 'linear-gradient(135deg, #64748b, #94a3b8)',
    bg: '#f8fafc', border: '#94a3b8',
    discount: '2%', multiplier: '1.2x',
    nextTier: 'GOLD', nextPts: 5000,
  },
  GOLD: {
    label: 'Vàng', icon: '🥇', color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #d97706, #f59e0b)',
    bg: '#fffbeb', border: '#fbbf24',
    discount: '5%', multiplier: '1.5x',
    nextTier: 'PLATINUM', nextPts: 10000,
  },
  PLATINUM: {
    label: 'Bạch Kim', icon: '👑', color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #6d28d9, #8b5cf6)',
    bg: '#f5f3ff', border: '#a78bfa',
    discount: '10%', multiplier: '2x',
    nextTier: null, nextPts: null,
  },
};

const TX_TYPES = {
  EARN:   { label: 'Tích điểm',  color: '#10b981', bg: '#d1fae5', icon: <TrendingUp size={14}/> },
  REDEEM: { label: 'Đổi voucher',color: '#8b5cf6', bg: '#ede9fe', icon: <Gift size={14}/> },
  REFUND: { label: 'Hoàn điểm', color: '#f59e0b', bg: '#fef3c7', icon: <RotateCcw size={14}/> },
  DEDUCT: { label: 'Trừ điểm',  color: '#ef4444', bg: '#fee2e2', icon: <XCircle size={14}/> },
  BONUS:  { label: 'Bonus',     color: '#06b6d4', bg: '#cffafe', icon: <Sparkles size={14}/> },
};

// ===========================================================
// MAIN COMPONENT
// ===========================================================
const LoyaltyDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loyaltyData, setLoyaltyData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [redeemPackages, setRedeemPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [redeemLoading, setRedeemLoading] = useState(null);
  const [redeemResult, setRedeemResult] = useState(null);
  const [animated, setAnimated] = useState(false);

  const fetchAll = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const [loyaltyRes, txRes, pkgRes] = await Promise.all([
        axiosConfig.get(`/loyalty/user/${user.id}`),
        axiosConfig.get(`/loyalty/user/${user.id}/transactions?limit=30`),
        axiosConfig.get('/loyalty/redeem-packages'),
      ]);
      setLoyaltyData(loyaltyRes.data);
      setTransactions(txRes.data || []);
      setRedeemPackages(pkgRes.data || []);
    } catch (err) {
      console.error('Lỗi tải loyalty:', err);
    } finally {
      setLoading(false);
      setTimeout(() => setAnimated(true), 100);
    }
  }, [user]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleRedeem = async (pkgIndex) => {
    setRedeemLoading(pkgIndex);
    setRedeemResult(null);
    try {
      const res = await axiosConfig.post(`/loyalty/user/${user.id}/redeem?packageIndex=${pkgIndex}`);
      setRedeemResult({ success: true, ...res.data });
      await fetchAll();
    } catch (err) {
      setRedeemResult({
        success: false,
        message: err.response?.data?.message || 'Đổi điểm thất bại!'
      });
    } finally {
      setRedeemLoading(null);
    }
  };

  // ===========================================================
  // LOADING STATE
  // ===========================================================
  if (!user) {
    return (
      <div className="loyalty-container">
        <div className="loyalty-empty-state">
          <Gift size={64} strokeWidth={1} />
          <h3>Vui lòng đăng nhập</h3>
          <p>Để xem thông tin điểm thưởng của bạn</p>
          <button className="loyalty-btn-primary" onClick={() => navigate('/login')}>Đăng nhập ngay</button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loyalty-container">
        <div className="loyalty-loading">
          <div className="loyalty-spinner" />
          <p>Đang tải thông tin thành viên...</p>
        </div>
      </div>
    );
  }

  const tier = loyaltyData?.loyaltyTier || 'BRONZE';
  const tierConf = TIER_CONFIG[tier] || TIER_CONFIG.BRONZE;
  const progress = Math.min(100, loyaltyData?.tierProgress || 0);
  const pointsUntilNext = loyaltyData?.pointsUntilNextTier || 0;

  return (
    <div className={`loyalty-container ${animated ? 'loyalty-in' : ''}`}>
      {/* BACK BUTTON */}
      <div className="loyalty-header-row">
        <button className="loyalty-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Quay lại
        </button>
        <h1 className="loyalty-page-title">
          <Crown size={24} /> Chương Trình Thành Viên
        </h1>
      </div>

      {/* HERO TIER CARD */}
      <div className="loyalty-hero" style={{ background: tierConf.gradient }}>
        <div className="loyalty-hero-bg-dots" />
        <div className="loyalty-hero-content">
          <div className="loyalty-hero-left">
            <span className="loyalty-tier-badge">HẠNG THÀNH VIÊN</span>
            <div className="loyalty-tier-display">
              <span className="loyalty-tier-emoji">{tierConf.icon}</span>
              <div>
                <h2 className="loyalty-tier-name">{tier}</h2>
                <p className="loyalty-tier-label">{tierConf.label}</p>
              </div>
            </div>
            <div className="loyalty-hero-stats">
              <div className="loyalty-hero-stat">
                <span className="loyalty-hero-stat-val">
                  {(loyaltyData?.availablePoints || 0).toLocaleString('vi-VN')}
                </span>
                <span className="loyalty-hero-stat-lbl">Điểm khả dụng</span>
              </div>
              <div className="loyalty-hero-divider" />
              <div className="loyalty-hero-stat">
                <span className="loyalty-hero-stat-val">
                  {(loyaltyData?.totalPoints || 0).toLocaleString('vi-VN')}
                </span>
                <span className="loyalty-hero-stat-lbl">Tổng điểm</span>
              </div>
            </div>
          </div>

          {/* TIER PROGRESS */}
          <div className="loyalty-hero-right">
            {tierConf.nextTier ? (
              <>
                <p className="loyalty-progress-label">
                  Còn <strong>{pointsUntilNext.toLocaleString('vi-VN')} điểm</strong> để lên {TIER_CONFIG[tierConf.nextTier]?.icon} {TIER_CONFIG[tierConf.nextTier]?.label}
                </p>
                <div className="loyalty-progress-bar">
                  <div className="loyalty-progress-fill" style={{ width: `${progress}%` }} />
                </div>
                <p className="loyalty-progress-pct">{Math.round(progress)}% hoàn thành</p>
              </>
            ) : (
              <div className="loyalty-max-tier">
                <Crown size={32} />
                <p>Bạn đã đạt cấp độ cao nhất!</p>
              </div>
            )}

            <div className="loyalty-hero-perks">
              <div className="loyalty-perk">
                <Shield size={14} /> Giảm giá: <strong>{tierConf.discount}</strong>
              </div>
              <div className="loyalty-perk">
                <Flame size={14} /> Nhân điểm: <strong>{tierConf.multiplier}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK STATS */}
      <div className="loyalty-stats-grid">
        {[
          { label: 'Tổng kiếm được', value: (loyaltyData?.totalPoints || 0).toLocaleString('vi-VN'), icon: <TrendingUp size={20}/>, color: '#3b82f6' },
          { label: 'Điểm khả dụng',  value: (loyaltyData?.availablePoints || 0).toLocaleString('vi-VN'), icon: <Star size={20}/>, color: '#10b981' },
          { label: 'Đã sử dụng',     value: (loyaltyData?.usedPoints || 0).toLocaleString('vi-VN'),      icon: <CheckCircle size={20}/>, color: '#f59e0b' },
          { label: 'Lịch sử GD',     value: transactions.length.toString(),                               icon: <Clock size={20}/>, color: '#8b5cf6' },
        ].map((s, i) => (
          <div key={i} className="loyalty-stat-card" style={{ '--accent': s.color }}>
            <div className="loyalty-stat-icon" style={{ color: s.color }}>{s.icon}</div>
            <div className="loyalty-stat-val">{s.value}</div>
            <div className="loyalty-stat-lbl">{s.label}</div>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div className="loyalty-tabs">
        {[
          { id: 'overview', label: 'Tổng quan', icon: <Award size={16}/> },
          { id: 'redeem',   label: 'Đổi điểm',  icon: <Gift size={16}/> },
          { id: 'history',  label: 'Lịch sử',   icon: <Clock size={16}/> },
        ].map(tab => (
          <button
            key={tab.id}
            className={`loyalty-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => { setActiveTab(tab.id); setRedeemResult(null); }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ==================== OVERVIEW TAB ==================== */}
      {activeTab === 'overview' && (
        <div className="loyalty-section">
          {/* All Tiers */}
          <h3 className="loyalty-section-title"><TrendingUp size={18}/> Lộ Trình Hạng Thành Viên</h3>
          <div className="loyalty-tiers-list">
            {Object.entries(TIER_CONFIG).map(([name, conf]) => {
              const isCurrentTier = name === tier;
              const isAchieved = loyaltyData?.totalPoints >= (name === 'BRONZE' ? 0 : name === 'SILVER' ? 1000 : name === 'GOLD' ? 5000 : 10000);
              return (
                <div
                  key={name}
                  className={`loyalty-tier-row ${isCurrentTier ? 'current' : ''} ${isAchieved ? 'achieved' : ''}`}
                >
                  <div className="loyalty-tier-row-icon">{conf.icon}</div>
                  <div className="loyalty-tier-row-info">
                    <span className="loyalty-tier-row-name">{name} <em>{conf.label}</em></span>
                    <span className="loyalty-tier-row-perks">
                      Giảm {conf.discount} · Nhân {conf.multiplier} điểm
                    </span>
                  </div>
                  {isCurrentTier && <span className="loyalty-tier-current-badge">Hiện tại</span>}
                  {isAchieved && !isCurrentTier && <CheckCircle size={18} color="#10b981"/>}
                  {!isAchieved && (
                    <span className="loyalty-tier-pts-needed">
                      {(name === 'SILVER' ? 1000 : name === 'GOLD' ? 5000 : 10000).toLocaleString('vi-VN')} điểm
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* How to Earn */}
          <h3 className="loyalty-section-title"><Zap size={18}/> Cách Kiếm Điểm</h3>
          <div className="loyalty-earn-grid">
            {[
              { icon: <ShoppingBag size={24}/>, title: 'Mua sắm', desc: '1.000đ = 1 điểm (nhân theo hạng)' },
              { icon: <TrendingUp size={24}/>, title: 'Lên hạng', desc: 'Điểm nhân tăng khi lên tier cao hơn' },
              { icon: <Gift size={24}/>, title: 'Đổi voucher', desc: 'Dùng điểm đổi voucher giảm giá hấp dẫn' },
              { icon: <Sparkles size={24}/>, title: 'Không giới hạn', desc: 'Tích lũy điểm không giới hạn số lượng' },
            ].map((item, i) => (
              <div key={i} className="loyalty-earn-card">
                <div className="loyalty-earn-icon">{item.icon}</div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== REDEEM TAB ==================== */}
      {activeTab === 'redeem' && (
        <div className="loyalty-section">
          <div className="loyalty-redeem-header">
            <h3 className="loyalty-section-title"><Gift size={18}/> Đổi Điểm Lấy Voucher</h3>
            <div className="loyalty-available-pts">
              Điểm khả dụng: <strong>{(loyaltyData?.availablePoints || 0).toLocaleString('vi-VN')}</strong>
            </div>
          </div>

          {/* Result Banner */}
          {redeemResult && (
            <div className={`loyalty-result-banner ${redeemResult.success ? 'success' : 'error'}`}>
              {redeemResult.success ? <CheckCircle size={20}/> : <XCircle size={20}/>}
              <div>
                <p className="loyalty-result-msg">{redeemResult.message}</p>
                {redeemResult.success && (
                  <p className="loyalty-result-code">
                    Mã voucher: <strong>{redeemResult.voucherCode}</strong>
                    &nbsp;·&nbsp;Giảm <strong>{redeemResult.discountPercent}%</strong>
                    &nbsp;·&nbsp;Điểm còn: <strong>{(redeemResult.remainingPoints || 0).toLocaleString('vi-VN')}</strong>
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="loyalty-redeem-grid">
            {redeemPackages.map((pkg) => {
              const canAfford = (loyaltyData?.availablePoints || 0) >= pkg.pointsRequired;
              return (
                <div key={pkg.index} className={`loyalty-redeem-card ${!canAfford ? 'disabled' : ''}`}>
                  <div className="loyalty-redeem-badge">{pkg.discountPercent}% OFF</div>
                  <div className="loyalty-redeem-pts">
                    <Star size={16}/> {pkg.pointsRequired.toLocaleString('vi-VN')} điểm
                  </div>
                  <div className="loyalty-redeem-info">
                    <p>Voucher giảm <strong>{pkg.discountPercent}%</strong></p>
                    <p>Tối đa <strong>{pkg.maxDiscountAmount.toLocaleString('vi-VN')}đ</strong></p>
                    <p className="loyalty-redeem-min">Đơn tối thiểu 100.000đ · HSD 30 ngày</p>
                  </div>
                  <button
                    className="loyalty-redeem-btn"
                    disabled={!canAfford || redeemLoading === pkg.index}
                    onClick={() => handleRedeem(pkg.index)}
                  >
                    {redeemLoading === pkg.index ? (
                      <span className="loyalty-btn-spinner" />
                    ) : canAfford ? (
                      <>Đổi ngay <ChevronRight size={16}/></>
                    ) : (
                      `Thiếu ${(pkg.pointsRequired - loyaltyData.availablePoints).toLocaleString('vi-VN')} điểm`
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          <p className="loyalty-redeem-note">
            💡 Voucher được tạo ngay và áp dụng trong <strong>30 ngày</strong>. Xem tại <strong>Ví Voucher</strong> trong hồ sơ của bạn.
          </p>
        </div>
      )}

      {/* ==================== HISTORY TAB ==================== */}
      {activeTab === 'history' && (
        <div className="loyalty-section">
          <h3 className="loyalty-section-title"><Clock size={18}/> Lịch Sử Giao Dịch Điểm</h3>
          {transactions.length === 0 ? (
            <div className="loyalty-empty-state small">
              <Clock size={48} strokeWidth={1}/>
              <p>Chưa có giao dịch nào</p>
              <span>Hãy mua sắm để tích điểm thưởng!</span>
            </div>
          ) : (
            <div className="loyalty-tx-list">
              {transactions.map((tx) => {
                const txConf = TX_TYPES[tx.type] || TX_TYPES.EARN;
                const isPositive = tx.points > 0;
                return (
                  <div key={tx.id} className="loyalty-tx-row">
                    <div className="loyalty-tx-icon" style={{ background: txConf.bg, color: txConf.color }}>
                      {txConf.icon}
                    </div>
                    <div className="loyalty-tx-info">
                      <p className="loyalty-tx-desc">{tx.description}</p>
                      <span className="loyalty-tx-type" style={{ color: txConf.color }}>
                        {txConf.label}
                      </span>
                      {tx.referenceId && (
                        <span className="loyalty-tx-ref">· {tx.referenceId}</span>
                      )}
                    </div>
                    <div className="loyalty-tx-right">
                      <span className={`loyalty-tx-pts ${isPositive ? 'positive' : 'negative'}`}>
                        {isPositive ? '+' : ''}{tx.points.toLocaleString('vi-VN')}
                      </span>
                      <span className="loyalty-tx-balance">Còn: {tx.balanceAfter.toLocaleString('vi-VN')}</span>
                      <span className="loyalty-tx-date">
                        {new Date(tx.createdAt).toLocaleDateString('vi-VN', {
                          day: '2-digit', month: '2-digit', year: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* FOOTER */}
      <div className="loyalty-footer">
        Tham gia từ {new Date(loyaltyData?.joinDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
        &nbsp;·&nbsp;Cập nhật lần cuối: {new Date(loyaltyData?.lastUpdated).toLocaleDateString('vi-VN')}
      </div>
    </div>
  );
};

export default LoyaltyDashboard;

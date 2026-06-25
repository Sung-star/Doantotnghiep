import React, { useState, useEffect } from 'react';
import { Tag, Copy, Check, Clock, ChevronRight, Lock, Gift, AlertCircle, Loader } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import api from '../../api/axiosConfig';
import '../../styles/Voucherpage.css';

// Map màu theo index để mỗi voucher có màu khác nhau
const COLORS = ['orange', 'blue', 'gold', 'pink', 'red', 'purple', 'teal', 'green'];

// Chuyển data từ API sang format hiển thị
const mapVoucher = (v, index) => {
  const discountText = v.discountPercent
    ? `${v.discountPercent}%`
    : v.maxDiscountAmount
    ? `${Number(v.maxDiscountAmount).toLocaleString('vi-VN')}đ`
    : 'Ưu đãi';

  const minOrderText = v.minOrderAmount
    ? `${Number(v.minOrderAmount).toLocaleString('vi-VN')}đ`
    : 'Không giới hạn';

  const daysLeft = v.expiryDate
    ? Math.max(0, Math.ceil((new Date(v.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)))
    : null;

  // Xác định tag hiển thị
  let tag = 'VOUCHER';
  if (v.assignedToAll === false) tag = 'RIÊNG TƯ';
  else if (daysLeft !== null && daysLeft <= 3) tag = 'SẮP HẾT HẠN';
  else if (v.usageLimit && v.usageCount >= v.usageLimit * 0.8) tag = 'GẦN HẾT';
  else if (index === 0) tag = 'PHỔ BIẾN';
  else if (v.discountPercent >= 30) tag = 'HOT';

  const remaining = v.usageLimit ? v.usageLimit - (v.usageCount || 0) : null;

  return {
    ...v,
    discountText,
    minOrderText,
    daysLeft,
    tag,
    color: COLORS[index % COLORS.length],
    remaining,
    isLimited: remaining !== null && remaining <= 20,
    isExpiringSoon: daysLeft !== null && daysLeft <= 3,
  };
};

// ===================== VOUCHER CARD =====================
const VoucherCard = ({ v, isPersonal }) => {
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();

  // Voucher assigned_to_all = false mà chưa login thì khóa
  const isLocked = !v.assignedToAll && !user;

  const handleCopy = () => {
    if (isLocked) return;
    navigator.clipboard.writeText(v.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className={`voucher-card voucher-${v.color} ${isLocked ? 'voucher-locked' : ''} ${v.isLimited ? 'voucher-limited' : ''}`}>
      {/* LEFT */}
      <div className="voucher-left">
        <div className="voucher-icon-wrap">
          {isLocked ? <Lock size={26} /> : <Tag size={26} />}
        </div>
        <div className="voucher-discount-big">{v.discountText}</div>
        {v.usageCount > 0 && (
          <div className="voucher-uses">{v.usageCount} lượt dùng</div>
        )}
      </div>

      {/* NOTCH */}
      <div className="voucher-notch-top" />
      <div className="voucher-notch-bottom" />
      <div className="voucher-divider" />

      {/* RIGHT */}
      <div className="voucher-right">
        <div className="voucher-top-row">
          <span className={`voucher-tag ${v.isExpiringSoon ? 'voucher-tag--urgent' : ''}`}>
            {v.tag}
          </span>
          {v.isLimited && v.remaining !== null && (
            <span className="voucher-remaining">
              <Clock size={11} /> Còn {v.remaining} lượt
            </span>
          )}
        </div>

        <h3 className="voucher-title">{v.description || `Giảm ${v.discountText}`}</h3>

        <div className="voucher-meta">
          <span>Đơn tối thiểu: <strong>{v.minOrderText}</strong></span>
          {v.daysLeft !== null && (
            <span className={v.daysLeft <= 3 ? 'voucher-meta--urgent' : ''}>
              HSD: <strong>{v.daysLeft === 0 ? 'Hôm nay!' : `${v.daysLeft} ngày`}</strong>
            </span>
          )}
          {v.maxDiscountAmount && v.discountPercent && (
            <span>Giảm tối đa: <strong>{Number(v.maxDiscountAmount).toLocaleString('vi-VN')}đ</strong></span>
          )}
        </div>

        {isLocked ? (
          <div className="voucher-code-locked">
            <Lock size={14} />
            <span>Đăng nhập để dùng voucher này</span>
          </div>
        ) : (
          <div className="voucher-code-row" onClick={handleCopy} title="Click để sao chép">
            <span className="voucher-code-text">{v.code}</span>
            <button className={`voucher-copy-btn ${copied ? 'copied' : ''}`}>
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? 'Đã chép!' : 'SAO CHÉP'}
            </button>
          </div>
        )}

        {isPersonal && (
          <div className="voucher-personal-badge">
            <Gift size={12} /> Voucher dành riêng cho bạn
          </div>
        )}
      </div>
    </div>
  );
};

// ===================== MAIN PAGE =====================
const VoucherPage = () => {
  const { user } = useAuth();
  const [vouchers, setVouchers] = useState([]);
  const [personalVouchers, setPersonalVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'personal'
  const [animated, setAnimated] = useState(false);

  // Fetch vouchers
  useEffect(() => {
    const fetchVouchers = async () => {
      setLoading(true);
      setError(null);
      try {
        // Luôn fetch voucher public
        const publicRes = await api.get('/vouchers/available');
        setVouchers((publicRes.data || []).map((v, i) => mapVoucher(v, i)));

        // Nếu đã login thì fetch thêm voucher riêng
        if (user?.id) {
          try {
            const personalRes = await api.get(`/vouchers/available/user/${user.id}`);
            // Lọc ra các voucher riêng (không phải assigned_to_all)
            const personal = (personalRes.data || []).filter(v => !v.assignedToAll);
            setPersonalVouchers(personal.map((v, i) => mapVoucher(v, i)));
          } catch {
            // Không có voucher cá nhân thì bỏ qua
          }
        }
      } catch (err) {
        setError('Không thể tải danh sách voucher. Vui lòng thử lại.');
      } finally {
        setLoading(false);
        setTimeout(() => setAnimated(true), 100);
      }
    };

    fetchVouchers();
  }, [user]);

  // Danh sách đang hiển thị theo tab
  const displayList = activeTab === 'personal' ? personalVouchers : vouchers;

  // Filter theo search
  const filtered = displayList.filter(v =>
    v.code?.toLowerCase().includes(search.toLowerCase()) ||
    v.description?.toLowerCase().includes(search.toLowerCase())
  );

  // Giảm tối đa trong tất cả voucher
  const maxDiscount = vouchers.reduce((max, v) => Math.max(max, v.discountPercent || 0), 0);

  return (
    <div className={`voucher-page ${animated ? 'voucher-page--in' : ''}`}>

      {/* HERO */}
      <section className="voucher-hero">
        <div className="voucher-hero-bg">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`voucher-hero-circle voucher-hero-circle--${i + 1}`} />
          ))}
        </div>

        <div className="voucher-hero-content">
          <span className="voucher-hero-eyebrow">
            <Tag size={14} /> KHO VOUCHER
          </span>
          <h1 className="voucher-hero-title">
            ƯU ĐÃI<br />
            <span>XỊN XÒ</span>
          </h1>
          <p className="voucher-hero-sub">
            {loading
              ? 'Đang tải voucher...'
              : `Săn ngay ${vouchers.length} voucher cực hot — Tiết kiệm thêm hàng trăm nghìn đồng!`}
          </p>

          {/* SEARCH */}
          <div className="voucher-search-wrap">
            <input
              type="text"
              placeholder="Nhập mã voucher để tìm kiếm..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="voucher-search-input"
            />
            <button className="voucher-search-btn" onClick={() => {}}>
              TÌM KIẾM
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="voucher-stats-band">
          {[
            { num: loading ? '...' : `${vouchers.length}+`, label: 'Voucher hiện có' },
            { num: loading ? '...' : `${maxDiscount}%`, label: 'Giảm tối đa' },
            { num: '24/7', label: 'Cập nhật liên tục' },
            { num: '0đ', label: 'Miễn phí sử dụng' },
          ].map((s, i) => (
            <div className="voucher-stat" key={i}>
              <strong>{s.num}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CONTENT */}
      <section className="voucher-content">
        <div className="voucher-container">

          {/* TABS */}
          <div className="voucher-filter-row">
            <div className="voucher-filters">
              <button
                className={`voucher-filter-btn ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                Tất cả ({vouchers.length})
              </button>
              {user && (
                <button
                  className={`voucher-filter-btn ${activeTab === 'personal' ? 'active' : ''}`}
                  onClick={() => setActiveTab('personal')}
                >
                  Của tôi ({personalVouchers.length})
                </button>
              )}
            </div>
            <span className="voucher-result-count">
              {loading ? 'Đang tải...' : `${filtered.length} voucher`}
            </span>
          </div>

          {/* NOT LOGGED IN BANNER */}
          {!user && (
            <div className="voucher-login-banner">
              <Lock size={20} />
              <span>Đăng nhập để xem voucher dành riêng cho bạn</span>
              <Link to="/login" className="voucher-login-link">
                Đăng nhập ngay <ChevronRight size={16} />
              </Link>
            </div>
          )}

          {/* LOADING */}
          {loading && (
            <div className="voucher-loading">
              <Loader size={36} className="voucher-spinner" />
              <p>Đang tải voucher...</p>
            </div>
          )}

          {/* ERROR */}
          {error && !loading && (
            <div className="voucher-error">
              <AlertCircle size={36} />
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>Thử lại</button>
            </div>
          )}

          {/* EMPTY */}
          {!loading && !error && filtered.length === 0 && (
            <div className="voucher-empty">
              <Tag size={48} />
              <p>
                {search
                  ? `Không tìm thấy voucher "${search}"`
                  : activeTab === 'personal'
                  ? 'Bạn chưa có voucher cá nhân nào'
                  : 'Hiện chưa có voucher nào'}
              </p>
            </div>
          )}

          {/* GRID */}
          {!loading && !error && filtered.length > 0 && (
            <div className="voucher-grid">
              {filtered.map((v, i) => (
                <div
                  key={v.id}
                  style={{ animationDelay: `${i * 0.07}s` }}
                  className="voucher-card-wrapper"
                >
                  <VoucherCard
                    v={v}
                    isPersonal={activeTab === 'personal'}
                  />
                </div>
              ))}
            </div>
          )}

          {/* REFERRAL */}
          <div className="voucher-referral">
            <div className="voucher-referral-left">
              <div className="voucher-referral-icon">
                <Gift size={32} />
              </div>
              <div>
                <h3>Chia sẻ & Nhận thêm ưu đãi</h3>
                <p>Giới thiệu bạn bè đăng ký thành viên — bạn và bạn bè đều được nhận voucher đặc biệt!</p>
              </div>
            </div>
            <Link to={user ? '/profile' : '/register'} className="voucher-referral-btn">
              {user ? 'XEM HỒ SƠ' : 'ĐĂNG KÝ NGAY'} <ChevronRight size={18} />
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
};

export default VoucherPage;
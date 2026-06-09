import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, Gift, Package, Tag, CheckCheck, Trash2, AlertCircle, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { useAuth } from '../../contexts/AuthContext';
import './NotificationBell.css';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatTime = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMs / 3600000);
    const diffDay = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return 'Vừa xong';
    if (diffMin < 60) return `${diffMin} phút trước`;
    if (diffHr < 24) return `${diffHr} giờ trước`;
    if (diffDay === 1) return 'Hôm qua';
    if (diffDay < 7) return `${diffDay} ngày trước`;
    return date.toLocaleDateString('vi-VN');
};

const getNotificationMeta = (type) => {
    switch (type) {
        case 'ORDER':
            return { icon: <Package size={18} />, color: 'notif-order', label: 'Đơn hàng' };
        case 'CHAT':
            return { icon: <MessageCircle size={18} />, color: 'notif-chat', label: 'Tin nhắn' };
        case 'VOUCHER_PERSONAL':
            return { icon: <Tag size={18} />, color: 'notif-voucher-personal', label: 'Voucher' };
        case 'voucher':
        default:
            return { icon: <Gift size={18} />, color: 'notif-voucher', label: 'Ưu đãi' };
    }
};

const getNavigationPath = (notification) => {
    if (notification.type === 'ORDER') return '/orders';
    if (notification.type === 'CHAT') return '/'; // Chuyển về trang chủ để người dùng mở chat
    if (notification.type === 'VOUCHER_PERSONAL') return '/vouchers';
    return '/vouchers';
};

// ─── Component ────────────────────────────────────────────────────────────────

const NotificationBell = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isNew, setIsNew] = useState(false); // trigger pulse animation
    const dropdownRef = useRef(null);
    const stompClient = useRef(null);
    const reconnectTimeout = useRef(null);
    const isDestroyed = useRef(false);

    // ── Add notification helper ──────────────────────────────────────────────
    const addNotification = useCallback((notification) => {
        setNotifications(prev => {
            // Deduplicate by id
            if (prev.some(n => n.id === notification.id)) return prev;
            const updated = [notification, ...prev].slice(0, 50); // max 50
            localStorage.setItem('notifications_v2', JSON.stringify(updated));
            return updated;
        });
        setUnreadCount(prev => prev + 1);
        setIsNew(true);
        setTimeout(() => setIsNew(false), 3000);
    }, []);

    // ── WebSocket connection ─────────────────────────────────────────────────
    const connect = useCallback(() => {
        if (isDestroyed.current) return;
        if (stompClient.current?.connected) return;

        const socket = new SockJS('http://localhost:8081/ws-chat');
        const client = Stomp.over(socket);
        client.debug = null;
        stompClient.current = client;

        client.connect({}, () => {
            if (isDestroyed.current) return;

            // 1. Subscribe voucher public — mọi user đều nhận
            client.subscribe('/topic/public-notifications', (msg) => {
                try {
                    const data = JSON.parse(msg.body);
                    // data có thể là Voucher object (từ public) hoặc notification object
                    const notification = data.type ? data : {
                        id: `voucher-${data.id}-${Date.now()}`,
                        type: 'voucher',
                        title: 'Voucher mới! 🎉',
                        message: `Mã "${data.code}" giảm ${data.discountPercent}% vừa ra mắt!`,
                        timestamp: new Date().toISOString(),
                        read: false,
                    };
                    if (!notification.read) notification.read = false;
                    addNotification(notification);
                } catch (e) {
                    console.error('[WS] Lỗi parse public notification:', e);
                }
            });

            // 2. Subscribe kênh user-riêng nếu đã đăng nhập
            if (user?.id) {
                client.subscribe(`/topic/user-${user.id}`, (msg) => {
                    try {
                        const notification = JSON.parse(msg.body);
                        notification.read = false;
                        addNotification(notification);
                    } catch (e) {
                        console.error('[WS] Lỗi parse user notification:', e);
                    }
                });
            }
        }, (error) => {
            console.warn('[WS] Mất kết nối, thử lại sau 4 giây...', error);
            stompClient.current = null;
            if (!isDestroyed.current) {
                reconnectTimeout.current = setTimeout(connect, 4000);
            }
        });
    }, [user?.id, addNotification]);

    // ── Load from localStorage + connect ─────────────────────────────────────
    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('notifications_v2') || '[]');
        setNotifications(stored);
        setUnreadCount(stored.filter(n => !n.read).length);

        isDestroyed.current = false;
        connect();

        return () => {
            isDestroyed.current = true;
            clearTimeout(reconnectTimeout.current);
            if (stompClient.current?.connected) {
                stompClient.current.disconnect();
            }
            stompClient.current = null;
        };
    }, [connect]);

    // ── Persist & sync unread count ──────────────────────────────────────────
    useEffect(() => {
        localStorage.setItem('notifications_v2', JSON.stringify(notifications));
        setUnreadCount(notifications.filter(n => !n.read).length);
    }, [notifications]);

    // ── Click outside to close ───────────────────────────────────────────────
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // ── Actions ──────────────────────────────────────────────────────────────
    const toggleDropdown = () => {
        setShowDropdown(prev => !prev);
        if (!showDropdown) markAllAsRead();
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const clearAll = () => {
        setNotifications([]);
        localStorage.removeItem('notifications_v2');
    };

    const handleItemClick = (notification) => {
        // Mark this item as read
        setNotifications(prev => prev.map(n =>
            n.id === notification.id ? { ...n, read: true } : n
        ));
        setShowDropdown(false);
        navigate(getNavigationPath(notification));
    };

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="nb-container" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                className={`nb-bell-btn ${isNew ? 'nb-bell-shake' : ''}`}
                onClick={toggleDropdown}
                aria-label="Thông báo"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className={`nb-badge ${isNew ? 'nb-badge-pulse' : ''}`}>
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {showDropdown && (
                <div className="nb-dropdown">
                    {/* Header */}
                    <div className="nb-header">
                        <div className="nb-header-left">
                            <Bell size={16} />
                            <span>Thông báo</span>
                            {unreadCount > 0 && (
                                <span className="nb-header-count">{unreadCount} chưa đọc</span>
                            )}
                        </div>
                        <div className="nb-header-actions">
                            {unreadCount > 0 && (
                                <button className="nb-action-btn" onClick={markAllAsRead} title="Đánh dấu tất cả đã đọc">
                                    <CheckCheck size={15} />
                                </button>
                            )}
                            {notifications.length > 0 && (
                                <button className="nb-action-btn nb-action-danger" onClick={clearAll} title="Xóa tất cả">
                                    <Trash2 size={15} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* List */}
                    <div className="nb-list">
                        {notifications.length === 0 ? (
                            <div className="nb-empty">
                                <AlertCircle size={32} />
                                <p>Chưa có thông báo nào</p>
                                <small>Chúng tôi sẽ thông báo khi có cập nhật đơn hàng hoặc ưu đãi mới!</small>
                            </div>
                        ) : (
                            notifications.map(n => {
                                const meta = getNotificationMeta(n.type);
                                return (
                                    <div
                                        key={n.id}
                                        className={`nb-item ${n.read ? 'nb-read' : 'nb-unread'}`}
                                        onClick={() => handleItemClick(n)}
                                    >
                                        <div className={`nb-icon ${meta.color}`}>
                                            {meta.icon}
                                        </div>
                                        <div className="nb-content">
                                            <div className="nb-title">{n.title}</div>
                                            <p className="nb-message">{n.message}</p>
                                            <time className="nb-time">{formatTime(n.timestamp)}</time>
                                        </div>
                                        {!n.read && <span className="nb-dot" />}
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="nb-footer">
                            <button className="nb-footer-link" onClick={() => { navigate('/orders'); setShowDropdown(false); }}>
                                Xem tất cả đơn hàng
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
import React, { useState, useEffect, useRef } from 'react';
import { Bell, Gift, CheckCircle2 } from 'lucide-react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import './NotificationBell.css';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const stompClient = useRef(null);
    const reconnectTimeout = useRef(null);
    const isDestroyed = useRef(false);

    const connect = () => {
        // Nếu component đã unmount thì không connect nữa
        if (isDestroyed.current) return;
        // Nếu đang kết nối rồi thì bỏ qua
        if (stompClient.current?.connected) return;

        console.log('>>> [WS] Đang kết nối...');
        const socket = new SockJS('http://localhost:8081/ws-chat');
        const client = Stomp.over(socket);
        client.debug = null;
        stompClient.current = client;

        client.connect({}, () => {
            if (isDestroyed.current) return;
            console.log('>>> [WS] Đã kết nối, bắt đầu subscribe...');

            client.subscribe('/topic/public-notifications', (message) => {
                console.log('>>> [WS] Nhận được message:', message.body);
                try {
                    const voucher = JSON.parse(message.body);
                    const notification = {
                        id: voucher.id + '-' + Date.now(),
                        type: 'voucher',
                        title: 'Voucher Mới! 🎉',
                        message: `Mã "${voucher.code}" giảm ${voucher.discountPercent}% vừa ra mắt!`,
                        voucherCode: voucher.code,
                        read: false,
                        timestamp: new Date().toISOString()
                    };
                    setNotifications(prev => {
                        const updated = [notification, ...prev];
                        localStorage.setItem('notifications', JSON.stringify(updated));
                        return updated;
                    });
                    setUnreadCount(prev => prev + 1);
                } catch (e) {
                    console.error('Lỗi parse notification:', e);
                }
            });

            console.log('>>> [WS] Subscribe xong!');
        }, (error) => {
            console.error('>>> [WS] Mất kết nối, thử lại sau 3 giây...', error);
            stompClient.current = null;
            // Tự động reconnect sau 3 giây
            if (!isDestroyed.current) {
                reconnectTimeout.current = setTimeout(connect, 3000);
            }
        });
    };

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('notifications')) || [];
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
    }, []);

    useEffect(() => {
        localStorage.setItem('notifications', JSON.stringify(notifications));
        setUnreadCount(notifications.filter(n => !n.read).length);
    }, [notifications]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = () => {
        setShowDropdown(prev => !prev);
        if (!showDropdown) markAllAsRead();
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
    };

    const clearAllNotifications = () => {
        setNotifications([]);
        setUnreadCount(0);
        localStorage.removeItem('notifications');
    };

    return (
        <div className="notification-bell-container" ref={dropdownRef}>
            <button className="notification-bell-button" onClick={toggleDropdown}>
                <Bell size={24} />
                {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
                )}
            </button>

            {showDropdown && (
                <div className="notification-dropdown shadow-lg">
                    <div className="notification-header">
                        <h6 className="fw-bold mb-0">Thông báo</h6>
                        <div className="d-flex gap-2">
                            {unreadCount > 0 && (
                                <button className="btn btn-sm btn-link text-primary p-0" onClick={markAllAsRead}>
                                    Đánh dấu đã đọc
                                </button>
                            )}
                            <button className="btn btn-sm btn-link text-danger p-0" onClick={clearAllNotifications}>
                                Xóa tất cả
                            </button>
                        </div>
                    </div>
                    <div className="notification-list">
                        {notifications.length === 0 ? (
                            <p className="text-muted text-center small p-3 mb-0">Không có thông báo nào.</p>
                        ) : (
                            notifications.map(n => (
                                <div key={n.id} className={`notification-item ${n.read ? 'read' : 'unread'}`}>
                                    <div className="notification-icon">
                                        {n.type === 'voucher' ? <Gift size={20} /> : <CheckCircle2 size={20} />}
                                    </div>
                                    <div className="notification-content">
                                        <div className="fw-bold">{n.title}</div>
                                        <p className="mb-1 small">{n.message}</p>
                                        <small className="text-muted">
                                            {new Date(n.timestamp).toLocaleString('vi-VN')}
                                        </small>
                                    </div>
                                    {!n.read && <div className="notification-unread-dot" />}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
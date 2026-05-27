import React, { useState, useEffect, useRef } from 'react';
import { Bell, XCircle, Gift, CheckCircle2 } from 'lucide-react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import './NotificationBell.css'; // Tạo file CSS này

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const stompClient = useRef(null);

    // Load notifications from localStorage on component mount
    useEffect(() => {
        const storedNotifications = JSON.parse(localStorage.getItem('notifications')) || [];
        setNotifications(storedNotifications);
        setUnreadCount(storedNotifications.filter(n => !n.read).length);

        // Connect to WebSocket
        const socket = new SockJS('http://localhost:8081/ws-chat'); // Dùng chung endpoint với ChatAI
        stompClient.current = Stomp.over(socket);
        stompClient.current.debug = null; // Tắt log debug của Stomp

        stompClient.current.connect({}, (frame) => {
            console.log('Connected to WebSocket for notifications: ' + frame);
            // Subscribe to public notifications topic
            stompClient.current.subscribe('/topic/public-notifications', (message) => {
                const newVoucher = JSON.parse(message.body);
                const newNotification = {
                    id: newVoucher.id + '-' + Date.now(), // Unique ID
                    type: 'voucher',
                    title: 'Voucher Mới!',
                    message: `Mã giảm giá ${newVoucher.code} (${newVoucher.discountPercent}% OFF) đã có!`,
                    voucherCode: newVoucher.code,
                    read: false,
                    timestamp: new Date().toISOString()
                };
                setNotifications(prev => {
                    const updatedNotifications = [newNotification, ...prev];
                    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
                    return updatedNotifications;
                });
                setUnreadCount(prev => prev + 1);
            });
        }, (error) => {
            console.error('STOMP error for notifications: ' + error);
        });

        // Cleanup on unmount
        return () => {
            if (stompClient.current && stompClient.current.connected) {
                stompClient.current.disconnect();
            }
        };
    }, []);

    // Update localStorage whenever notifications state changes
    useEffect(() => {
        localStorage.setItem('notifications', JSON.stringify(notifications));
        setUnreadCount(notifications.filter(n => !n.read).length);
    }, [notifications]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    const toggleDropdown = () => {
        setShowDropdown(prev => !prev);
        if (!showDropdown) { // If opening dropdown, mark all as read
            markAllAsRead();
        }
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
    };

    const clearAllNotifications = () => {
        setNotifications([]);
        setUnreadCount(0);
    };

    return (
        <div className="notification-bell-container" ref={dropdownRef}>
            <button className="notification-bell-button" onClick={toggleDropdown}>
                <Bell size={24} />
                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </button>

            {showDropdown && (
                <div className="notification-dropdown shadow-lg">
                    <div className="notification-header">
                        <h6 className="fw-bold mb-0">Thông báo</h6>
                        <div className="d-flex gap-2">
                            {unreadCount > 0 && (
                                <button className="btn btn-sm btn-link text-primary p-0" onClick={markAllAsRead}>Đánh dấu đã đọc</button>
                            )}
                            <button className="btn btn-sm btn-link text-danger p-0" onClick={clearAllNotifications}>Xóa tất cả</button>
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
                                        <small className="text-muted">{new Date(n.timestamp).toLocaleString('vi-VN')}</small>
                                    </div>
                                    {!n.read && (
                                        <div className="notification-unread-dot"></div>
                                    )}
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
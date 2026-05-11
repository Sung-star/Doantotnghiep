import React from 'react';
import { FaPhoneAlt, FaFacebookMessenger } from 'react-icons/fa';
import { SiZalo } from 'react-icons/si';
import './FloatingActions.css';

const FloatingActions = () => {
    return (
        <div className="floating-container">
            {/* Hotline Button */}
            <a href="tel:0912345678" className="floating-btn hotline" title="Gọi hotline">
                <FaPhoneAlt size={20} />
                <span className="btn-label">0912.345.678</span>
            </a>

            {/* Zalo Button */}
            <a href="https://zalo.me/0912345678" target="_blank" rel="noreferrer" className="floating-btn zalo" title="Chat Zalo">
                <SiZalo size={24} />
            </a>

            {/* Messenger Button */}
            <a href="https://m.me/your-facebook-page" target="_blank" rel="noreferrer" className="floating-btn messenger" title="Chat Facebook">
                <FaFacebookMessenger size={24} />
            </a>
            
            {/* Hiệu ứng sóng lan tỏa cho nút chính */}
            <div className="pulse-wave"></div>
        </div>
    );
};

export default FloatingActions;

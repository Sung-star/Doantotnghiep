import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Để chuyển hướng trang
import api from '../../api/axiosConfig';
import './ChatAI.css';

const ChatAI = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Chào bạn! Tôi là trợ lý ảo của Sporting Shop. Bạn cần tìm mẫu quần áo nào ạ?", isBot: true }
    ]);
    
    const navigate = useNavigate();
    const scrollRef = useRef(null);

    useEffect(() => {
        scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = input;
        setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
        setInput("");
        setLoading(true);

        try {
            const res = await api.post('/chat', { message: userMsg });
            setMessages(prev => [...prev, { text: res.data.reply, isBot: true }]);
        } catch (err) {
            setMessages(prev => [...prev, { text: "Xin lỗi, tôi đang bận một chút. Thử lại sau nhé!", isBot: true }]);
        } finally {
            setLoading(false);
        }
    };

    // Hàm phân tích tin nhắn để hiển thị hình ảnh
    const renderMessageContent = (text) => {
        const productRegex = /\[PRODUCT: (.*?)\|(.*?)\|(.*?)\|(.*?)\]/g;
        const parts = text.split(productRegex);

        if (parts.length > 1) {
            const [baseText, id, name, price, imgUrl, remainingText] = parts;
            return (
                <>
                    <div>{baseText}</div>
                    <div className="product-card-chat mt-2 shadow-sm border rounded overflow-hidden bg-white" 
                         onClick={() => navigate(`/product/${id.trim()}`)}
                         style={{ cursor: 'pointer', maxWidth: '200px' }}>
                        <img src={imgUrl.trim()} alt={name} className="w-100" style={{ height: '120px', objectFit: 'cover' }} />
                        <div className="p-2">
                            <div className="fw-bold small text-truncate">{name.trim()}</div>
                            <div className="text-danger small fw-bold">{price.trim()}</div>
                            <div className="text-primary small mt-1 d-flex align-items-center">
                                Xem chi tiết <ExternalLink size={12} className="ms-1"/>
                            </div>
                        </div>
                    </div>
                    <div>{remainingText}</div>
                </>
            );
        }
        return text;
    };

    return (
        <div className="chat-ai-wrapper">
            {isOpen && (
                <div className="chat-window shadow-lg border">
                    <div className="p-3 bg-primary text-white d-flex justify-content-between align-items-center" style={{borderRadius: '20px 20px 0 0'}}>
                        <div className="d-flex align-items-center gap-2">
                            <div className="bg-white rounded-circle p-1"><MessageCircle size={18} className="text-primary"/></div>
                            <span className="fw-bold">Hỗ trợ AI</span>
                        </div>
                        <X size={20} style={{cursor: 'pointer'}} onClick={() => setIsOpen(false)} />
                    </div>

                    <div className="chat-body d-flex flex-column" ref={scrollRef}>
                        {messages.map((m, i) => (
                            <div key={i} className={`message ${m.isBot ? 'bot-msg' : 'user-msg'}`}>
                                {m.isBot ? renderMessageContent(m.text) : m.text}
                            </div>
                        ))}
                        {loading && (
                            <div className="bot-msg message d-flex align-items-center gap-2">
                                <Loader2 size={16} className="spinner-border spinner-border-sm border-0" />
                                <span>Đang suy nghĩ...</span>
                            </div>
                        )}
                    </div>

                    <form className="p-3 border-top d-flex gap-2" onSubmit={handleSend}>
                        <input type="text" className="form-control form-control-sm border-0 bg-light" 
                            placeholder="Nhập câu hỏi..." value={input} onChange={e => setInput(e.target.value)} />
                        <button type="submit" className="btn btn-primary btn-sm rounded-circle"><Send size={16}/></button>
                    </form>
                </div>
            )}

            <div className="chat-bubble-btn bg-primary text-white shadow-lg" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
            </div>
        </div>
    );
};

export default ChatAI;
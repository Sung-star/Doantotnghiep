import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, ExternalLink, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import api from '../../api/axiosConfig';
import { useAuth } from '../../contexts/AuthContext';
import './ChatAI.css';

const ChatAI = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [isHumanMode, setIsHumanMode] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Chào bạn! Tôi là trợ lý ảo của Sporting Shop. Bạn cần tư vấn gì ạ?", isBot: true }
    ]);
    
    const { user } = useAuth();
    const navigate = useNavigate();
    const scrollRef = useRef(null);
    const stompClient = useRef(null);
    const userId = useRef(user?.id?.toString() || localStorage.getItem('chat_session_id') || Math.random().toString(36).substring(7));

    useEffect(() => {
        if (!localStorage.getItem('chat_session_id')) {
            localStorage.setItem('chat_session_id', userId.current);
        }
        connectWebSocket();
        fetchHistory(); // Lấy lịch sử khi load trang
        return () => disconnectWebSocket();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await api.get(`/chat/history/${userId.current}`);
            const history = res.data.map(m => ({
                text: m.content,
                isBot: m.bot,
                timestamp: m.timestamp
            }));
            if (history.length > 0) {
                setMessages(history);
            }
        } catch (err) {
            console.error("Failed to fetch chat history", err);
        }
    };

    const connectWebSocket = () => {
        const socket = new SockJS('http://localhost:8081/ws-chat');
        stompClient.current = Stomp.over(socket);
        stompClient.current.debug = null;
        
        stompClient.current.connect({}, (frame) => {
            stompClient.current.subscribe(`/user/${userId.current}/queue/messages`, (message) => {
                const chatMsg = JSON.parse(message.body);
                setMessages(prev => [...prev, { text: chatMsg.content, isBot: true, isHuman: true }]);
                setIsHumanMode(true);
                setIsOpen(true);
            });
        }, (error) => {
            console.log('STOMP error: ' + error);
        });
    };

    const disconnectWebSocket = () => {
        if (stompClient.current && stompClient.current.connected) {
            stompClient.current.disconnect();
        }
    };

    useEffect(() => {
        scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = input;
        setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
        setInput("");

        if (isHumanMode) {
            // Gửi tin nhắn real-time cho Admin qua WebSocket
            if (stompClient.current && stompClient.current.connected) {
                stompClient.current.send("/app/chat.send", {}, JSON.stringify({
                    senderId: userId.current,
                    recipientId: "admin", // Gửi cho Admin
                    content: userMsg,
                    type: 'CHAT'
                }));
            }
        } else {
            // Chế độ AI
            setLoading(true);
            try {
                const res = await api.post('/chat', { message: userMsg });
                setMessages(prev => [...prev, { text: res.data.reply, isBot: true }]);
                
                // Sau 2 câu hỏi, gợi ý chat với người thật nếu AI không giải quyết được
                if (messages.length > 3 && !isHumanMode) {
                    setMessages(prev => [...prev, { 
                        text: "Bạn có muốn chat trực tiếp với nhân viên tư vấn không?", 
                        isBot: true,
                        isSuggestion: true 
                    }]);
                }
            } catch (err) {
                setMessages(prev => [...prev, { text: "Xin lỗi, tôi đang bận một chút. Bạn có thể chat trực tiếp với Admin nhé!", isBot: true }]);
                setIsHumanMode(true); // Tự động chuyển sang mode người nếu AI lỗi
            } finally {
                setLoading(false);
            }
        }
    };

    const switchToHuman = () => {
        setIsHumanMode(true);
        setMessages(prev => [...prev, { text: "Hệ thống đang kết nối với nhân viên tư vấn. Vui lòng chờ trong giây lát...", isBot: true }]);
        // Thông báo cho Admin là có khách hàng mới cần chat
        if (stompClient.current && stompClient.current.connected) {
            stompClient.current.send("/app/chat.send", {}, JSON.stringify({
                senderId: userId.current,
                recipientId: null, // Gửi chung cho các Admin
                content: "Khách hàng " + (user?.name || "Ẩn danh") + " muốn chat trực tiếp.",
                type: 'JOIN'
            }));
        }
    };

    const renderMessageContent = (m) => {
        const text = m.text;
        if (m.isSuggestion) {
            return (
                <div className="d-flex flex-column gap-2">
                    <div>{text}</div>
                    <button className="btn btn-sm btn-outline-primary rounded-pill" onClick={switchToHuman}>
                        Chat với nhân viên
                    </button>
                </div>
            );
        }

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
                            <div className="bg-white rounded-circle p-1">
                                {isHumanMode ? <User size={18} className="text-primary"/> : <MessageCircle size={18} className="text-primary"/>}
                            </div>
                            <div className="d-flex flex-column">
                                <span className="fw-bold" style={{fontSize: '14px'}}>{isHumanMode ? "Nhân viên hỗ trợ" : "Hỗ trợ AI"}</span>
                                {isHumanMode && <span className="text-white-50" style={{fontSize: '10px'}}>Đang trực tuyến</span>}
                            </div>
                        </div>
                        <div className="d-flex gap-2 align-items-center">
                            {!isHumanMode && (
                                <button 
                                    className="btn btn-sm btn-light p-1 rounded-circle" 
                                    title="Chat với nhân viên"
                                    onClick={switchToHuman}
                                >
                                    <User size={16} className="text-primary" />
                                </button>
                            )}
                            <X size={20} style={{cursor: 'pointer'}} onClick={() => setIsOpen(false)} />
                        </div>
                    </div>

                    <div className="chat-body d-flex flex-column" ref={scrollRef}>
                        {messages.map((m, i) => (
                            <div key={i} className={`message ${m.isBot ? 'bot-msg' : 'user-msg'}`}>
                                {renderMessageContent(m)}
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
                            placeholder={isHumanMode ? "Nhập tin nhắn..." : "Hỏi AI hoặc yêu cầu gặp nhân viên..."} 
                            value={input} onChange={e => setInput(e.target.value)} />
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
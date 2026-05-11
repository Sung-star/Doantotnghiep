import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, User, Sparkles, Headset, Clock, ChevronLeft, Image as ImageIcon, Loader2 } from 'lucide-react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import api from '../../api/axiosConfig';
import { useAuth } from '../../contexts/AuthContext';
import './SupportCenter.css';

const SupportCenter = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('menu'); // 'menu', 'ai', 'live'
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [previewImage, setPreviewImage] = useState(null); // Để xem trước ảnh định gửi
    const [uploadingImage, setUploadingImage] = useState(false);
    
    const [aiMessages, setAiMessages] = useState([
        { text: "Xin chào! Tôi là trợ lý ảo AI. Bạn cần tìm mẫu giày hay trang phục nào hôm nay?", isBot: true }
    ]);
    const [liveMessages, setLiveMessages] = useState([]);
    
    const { user } = useAuth();
    const scrollRef = useRef(null);
    const stompClient = useRef(null);
    const subscriptionRef = useRef(null);
    const userId = useRef(user?.id?.toString() || localStorage.getItem('chat_session_id') || Math.random().toString(36).substring(7));

    useEffect(() => {
        if (!localStorage.getItem('chat_session_id')) {
            localStorage.setItem('chat_session_id', userId.current);
        }
        connectWebSocket();
        fetchHistory();
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
            if (history.length > 0) setLiveMessages(history);
        } catch (err) {}
    };

    const connectWebSocket = () => {
        if (stompClient.current?.connected) return;
        const socket = new SockJS('http://localhost:8081/ws-chat');
        stompClient.current = Stomp.over(socket);
        stompClient.current.debug = null;
        stompClient.current.connect({}, () => {
            if (subscriptionRef.current) subscriptionRef.current.unsubscribe();
            subscriptionRef.current = stompClient.current.subscribe(`/user/${userId.current}/queue/messages`, (message) => {
                const chatMsg = JSON.parse(message.body);
                if (chatMsg.type === 'TYPING') {
                    setIsTyping(true);
                    setTimeout(() => setIsTyping(false), 3000);
                } else {
                    setLiveMessages(prev => {
                        const isDuplicate = prev.some(m => m.text === chatMsg.content && m.isBot);
                        if (isDuplicate) return prev;
                        return [...prev, { text: chatMsg.content, isBot: true }];
                    });
                    setIsTyping(false);
                }
            });
        });
    };

    const disconnectWebSocket = () => {
        if (subscriptionRef.current) subscriptionRef.current.unsubscribe();
        if (stompClient.current?.connected) stompClient.current.disconnect();
    };

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, [aiMessages, liveMessages, activeTab, isTyping]);

    const handleSend = async (e) => {
        e.preventDefault();
        if ((!input.trim() && !previewImage) || loading) return;

        let finalContent = input;
        setLoading(true);

        try {
            // Nếu có ảnh, upload trước
            if (previewImage) {
                setUploadingImage(true);
                const formData = new FormData();
                formData.append('file', previewImage.file);
                const uploadRes = await api.post('/upload/chat', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                finalContent = `[IMAGE]${uploadRes.data}${input ? '|' + input : ''}`;
                setPreviewImage(null);
                setUploadingImage(false);
            }

            if (activeTab === 'ai') {
                setAiMessages(prev => [...prev, { text: input, isBot: false }]);
                setInput("");
                const res = await api.post('/chat', { message: input });
                setAiMessages(prev => [...prev, { text: res.data.reply, isBot: true }]);
            } else {
                setLiveMessages(prev => [...prev, { text: finalContent, isBot: false }]);
                setInput("");
                if (stompClient.current?.connected) {
                    stompClient.current.send("/app/chat.send", {}, JSON.stringify({
                        senderId: userId.current,
                        recipientId: "admin",
                        content: finalContent,
                        type: 'CHAT'
                    }));
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewImage({
                file: file,
                url: URL.createObjectURL(file)
            });
        }
    };

    const renderMessageContent = (msg, isBot) => {
        const isImage = msg.text?.startsWith('[IMAGE]');
        if (isImage) {
            const parts = msg.text.replace('[IMAGE]', '').split('|');
            const imageUrl = parts[0];
            const caption = parts[1] || "";
            const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `http://localhost:8081${imageUrl}`;

            return (
                <div className="d-flex flex-column gap-2">
                    <img 
                        src={fullImageUrl} 
                        alt="Chat" 
                        className="rounded-3 img-fluid shadow-sm"
                        style={{ maxWidth: '100%', cursor: 'pointer', display: 'block' }}
                        onClick={() => window.open(fullImageUrl, '_blank')}
                    />
                    {caption && <div className="caption-text">{caption}</div>}
                </div>
            );
        }
        return msg.text;
    };

    return (
        <div className="support-center-wrapper">
            {isOpen && (
                <div className="support-window shadow-2xl border border-white/20">
                    <div className="support-header p-4 text-white">
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center gap-2">
                                {activeTab !== 'menu' && (
                                    <button className="btn btn-link text-white p-0 border-0" onClick={() => setActiveTab('menu')}>
                                        <ChevronLeft size={20} />
                                    </button>
                                )}
                                <div>
                                    <h6 className="mb-0 fw-bold">
                                        {activeTab === 'menu' ? 'Trung tâm hỗ trợ' : activeTab === 'ai' ? 'Trợ lý AI Gemini' : 'Chat với tư vấn viên'}
                                    </h6>
                                    <div className="small opacity-75 d-flex align-items-center gap-1">
                                        <div className="bg-success rounded-circle" style={{width: '6px', height: '6px'}}></div> Sẵn sàng hỗ trợ
                                    </div>
                                </div>
                            </div>
                            <button className="btn btn-link text-white p-0 border-0" onClick={() => setIsOpen(false)}><X size={20} /></button>
                        </div>
                    </div>

                    <div className="support-content flex-grow-1 overflow-hidden d-flex flex-column bg-white">
                        {activeTab === 'menu' ? (
                            <div className="p-4 d-flex flex-column gap-3 h-100">
                                <div className="welcome-text mb-2">
                                    <h4 className="fw-black text-dark">Chào bạn 👋</h4>
                                    <p className="text-muted">Chúng tôi có thể giúp gì cho bạn hôm nay?</p>
                                </div>
                                <button className="menu-option" onClick={() => setActiveTab('ai')}>
                                    <div className="option-icon ai"><Sparkles size={24} /></div>
                                    <div className="text-start">
                                        <div className="fw-bold">Hỏi trợ lý AI</div>
                                        <div className="text-muted smaller">Tư vấn sản phẩm 24/7</div>
                                    </div>
                                </button>
                                <button className="menu-option" onClick={() => setActiveTab('live')}>
                                    <div className="option-icon live"><Headset size={24} /></div>
                                    <div className="text-start">
                                        <div className="fw-bold">Chat với nhân viên</div>
                                        <div className="text-muted smaller">Hỗ trợ đơn hàng & Bảo hành</div>
                                    </div>
                                </button>
                                <div className="mt-auto text-center py-3 border-top">
                                    <span className="text-muted smaller"><Clock size={12} className="me-1"/> Phản hồi trong vài phút</span>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="chat-body p-3 flex-grow-1 overflow-auto bg-light d-flex flex-column gap-3" ref={scrollRef}>
                                    {(activeTab === 'ai' ? aiMessages : liveMessages).map((m, i) => (
                                        <div key={i} className={`msg-group ${m.isBot ? 'bot' : 'user'}`}>
                                            <div className="msg-bubble shadow-sm">
                                                {renderMessageContent(m, m.isBot)}
                                            </div>
                                            <span className="msg-time">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                        </div>
                                    ))}
                                    {loading && activeTab === 'ai' && <div className="msg-group bot"><div className="msg-bubble typing-dots"><span></span><span></span><span></span></div></div>}
                                    {isTyping && activeTab === 'live' && <div className="msg-group bot"><div className="msg-bubble text-muted smaller">Đang trả lời...</div></div>}
                                </div>
                                
                                <div className="chat-input-area p-3 border-top">
                                    {previewImage && (
                                        <div className="image-preview-container mb-2 p-2 bg-light rounded-3 position-relative d-inline-block">
                                            <img src={previewImage.url} alt="Preview" className="rounded-2" style={{ height: '60px', width: '60px', objectFit: 'cover' }} />
                                            <button className="btn-close-preview shadow-sm" onClick={() => setPreviewImage(null)}><X size={12}/></button>
                                        </div>
                                    )}
                                    <form className="d-flex align-items-center gap-2" onSubmit={handleSend}>
                                        {activeTab === 'live' && (
                                            <label className="input-btn" title="Gửi ảnh">
                                                <ImageIcon size={20} />
                                                <input type="file" hidden accept="image/*" onChange={handleFileSelect} />
                                            </label>
                                        )}
                                        <input 
                                            type="text" 
                                            className="form-control chat-input" 
                                            placeholder="Nhập nội dung..." 
                                            value={input} 
                                            onChange={e => setInput(e.target.value)} 
                                        />
                                        <button type="submit" className="btn btn-primary send-btn" disabled={loading}>
                                            {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18}/>}
                                        </button>
                                    </form>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
            <div className={`main-bubble shadow-lg ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
            </div>
        </div>
    );
};

export default SupportCenter;

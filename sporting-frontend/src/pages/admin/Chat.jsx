import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { Send, User, MessageSquare, Search, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import api from '../../api/axiosConfig';
import './Chat.css';

const AdminChat = () => {
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [input, setInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [previewImage, setPreviewImage] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const stompClient = useRef(null);
    const scrollRef = useRef(null);
    const subscriptionRef = useRef(null);
    // Sử dụng Ref để tránh stale closure trong WebSocket callback
    const selectedUserRef = useRef(null);

    useEffect(() => {
        selectedUserRef.current = selectedUser;
    }, [selectedUser]);

    const getAvatar = (imgUrl, name) => {
        if (!imgUrl) return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=random&color=fff&bold=true`;
        if (imgUrl.startsWith('http') || imgUrl.startsWith('data:')) return imgUrl;
        return `http://localhost:8081${imgUrl.startsWith('/') ? '' : '/'}${imgUrl}`;
    };

    useEffect(() => {
        connectWebSocket();
        fetchConversations();
        return () => disconnectWebSocket();
    }, []);

    useEffect(() => {
        if (selectedUser) {
            fetchHistory(selectedUser.userId);
        }
    }, [selectedUser]);

    useEffect(() => {
        scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
    }, [messages]);

    const fetchConversations = async () => {
        try {
            const res = await api.get('/chat/conversations');
            setConversations(res.data);
        } catch (err) {}
    };

    const fetchHistory = async (userId) => {
        try {
            const res = await api.get(`/chat/history/${userId}`);
            setMessages(res.data.map(m => ({
                text: m.content,
                isBot: m.bot,
                timestamp: m.timestamp
            })));
        } catch (err) {}
    };

    const connectWebSocket = () => {
        if (stompClient.current?.connected) return;
        const socket = new SockJS('http://localhost:8081/ws-chat');
        stompClient.current = Stomp.over(socket);
        stompClient.current.debug = null;
        
        stompClient.current.connect({}, () => {
            if (subscriptionRef.current) subscriptionRef.current.unsubscribe();
            subscriptionRef.current = stompClient.current.subscribe('/topic/admin', (message) => {
                const chatMsg = JSON.parse(message.body);
                handleIncomingMessage(chatMsg);
            });
        });
    };

    const disconnectWebSocket = () => {
        if (subscriptionRef.current) subscriptionRef.current.unsubscribe();
        if (stompClient.current?.connected) stompClient.current.disconnect();
    };

    const handleIncomingMessage = (msg) => {
        if (msg.type === 'TYPING') return;
        
        // Cập nhật sidebar
        fetchConversations();
        
        // Sử dụng ref để kiểm tra user đang chọn
        const currentSelected = selectedUserRef.current;
        
        if (currentSelected && String(msg.senderId) === String(currentSelected.userId)) {
            setMessages(prev => {
                // Chỉ chống lặp nếu là tin nhắn của Admin gửi đi (vì Admin đã add local rồi)
                if (msg.senderId === 'admin') {
                   const isDuplicate = prev.some(m => m.text === msg.content && m.isBot);
                   if (isDuplicate) return prev;
                }
                return [...prev, { text: msg.content, isBot: msg.senderId === 'admin' || msg.senderId === 'bot' }];
            });
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if ((!input.trim() && !previewImage) || !selectedUser) return;

        let finalContent = input;
        setLoading(true);

        try {
            if (previewImage) {
                const formData = new FormData();
                formData.append('file', previewImage.file);
                const uploadRes = await api.post('/upload/chat', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                finalContent = `[IMAGE]${uploadRes.data}${input ? '|' + input : ''}`;
                setPreviewImage(null);
            }

            if (stompClient.current?.connected) {
                const chatPayload = {
                    senderId: "admin",
                    recipientId: selectedUser.userId,
                    content: finalContent,
                    type: 'CHAT'
                };
                stompClient.current.send("/app/chat.send", {}, JSON.stringify(chatPayload));
                
                // Add ngay vào list để Admin thấy kết quả tức thì
                setMessages(prev => [...prev, { text: finalContent, isBot: true }]);
                setInput("");
            }
        } catch (err) {
            alert("Lỗi khi gửi tin nhắn!");
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

    const renderMessageContent = (text) => {
        if (text?.startsWith('[IMAGE]')) {
            const parts = text.replace('[IMAGE]', '').split('|');
            const imageUrl = parts[0];
            const caption = parts[1] || "";
            const fullUrl = imageUrl.startsWith('http') ? imageUrl : `http://localhost:8081${imageUrl}`;
            return (
                <div className="d-flex flex-column gap-2">
                    <img src={fullUrl} alt="Chat" className="rounded-3 img-fluid shadow-sm" style={{ maxWidth: '300px', cursor: 'pointer', display: 'block' }} onClick={() => window.open(fullUrl, '_blank')} />
                    {caption && <div className="caption-text">{caption}</div>}
                </div>
            );
        }
        return text;
    };

    const filteredConversations = conversations.filter(c => (c.userName || "").toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="admin-chat-container shadow-sm bg-white rounded-4 overflow-hidden border" style={{height: 'calc(100vh - 120px)'}}>
            <div className="row g-0 h-100">
                <div className="col-md-4 border-end chat-sidebar bg-white h-100 d-flex flex-column">
                    <div className="p-4 border-bottom">
                        <h5 className="fw-black text-uppercase mb-3 d-flex align-items-center gap-2">
                            <MessageSquare size={20} className="text-primary"/> Chat Khách Hàng
                        </h5>
                        <div className="input-group input-group-sm bg-light rounded-pill px-2">
                            <span className="input-group-text bg-transparent border-0"><Search size={14} className="text-muted"/></span>
                            <input type="text" className="form-control bg-transparent border-0" placeholder="Tìm khách hàng..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        </div>
                    </div>
                    <div className="flex-grow-1 overflow-auto custom-scroll">
                        {filteredConversations.map(conv => {
                            const lastMsg = conv.lastMessage || "";
                            const isImg = lastMsg.startsWith('[IMAGE]');
                            const displayMsg = isImg ? "📷 Hình ảnh" : lastMsg;
                            
                            return (
                                <button key={conv.userId} className={`list-group-item list-group-item-action p-3 border-0 d-flex align-items-center gap-3 transition-all ${selectedUser?.userId === conv.userId ? 'bg-primary-subtle border-start border-4 border-primary' : ''}`} onClick={() => setSelectedUser(conv)}>
                                    <img src={getAvatar(conv.userImg, conv.userName)} alt="" className="rounded-circle shadow-sm" style={{ width: '48px', height: '48px', objectFit: 'cover' }} />
                                    <div className="flex-grow-1 overflow-hidden">
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                            <span className="fw-bold text-dark small">{conv.userName || `Khách #${conv.userId.substring(0, 5)}`}</span>
                                            <span className="smaller text-muted" style={{fontSize: '10px'}}>Mới</span>
                                        </div>
                                        <div className="text-muted small text-truncate">{displayMsg || "Nhấn để chat"}</div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="col-md-8 d-flex flex-column chat-main h-100 bg-white">
                    {selectedUser ? (
                        <>
                            <div className="p-3 border-bottom d-flex align-items-center justify-content-between px-4">
                                <div className="d-flex align-items-center gap-3">
                                    <img src={getAvatar(selectedUser.userImg, selectedUser.userName)} alt="" className="rounded-circle border" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                                    <div>
                                        <div className="fw-bold text-dark">{selectedUser.userName || `Khách #${selectedUser.userId}`}</div>
                                        <div className="small text-success fw-bold d-flex align-items-center gap-1">
                                            <div className="bg-success rounded-circle" style={{width: '6px', height: '6px'}}></div> Trực tuyến
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-grow-1 p-4 overflow-auto bg-light chat-messages d-flex flex-column gap-3" ref={scrollRef}>
                                {messages.map((m, i) => (
                                    <div key={i} className={`d-flex flex-column ${m.isBot ? 'align-items-end' : 'align-items-start'}`}>
                                        <div className={`p-3 shadow-sm ${m.isBot ? 'bg-primary text-white' : 'bg-white text-dark'}`} 
                                             style={{ maxWidth: '75%', borderRadius: m.isBot ? '18px 18px 4px 18px' : '18px 18px 18px 4px' }}>
                                            {renderMessageContent(m.text)}
                                        </div>
                                        <span className="msg-time-admin">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="p-3 border-top">
                                {previewImage && (
                                    <div className="mb-2 p-2 bg-light rounded-3 position-relative d-inline-block shadow-sm">
                                        <img src={previewImage.url} alt="Preview" className="rounded-2" style={{ height: '80px' }} />
                                        <button className="btn-close-preview-admin" onClick={() => setPreviewImage(null)}><X size={14}/></button>
                                    </div>
                                )}
                                <form className="d-flex align-items-center gap-2" onSubmit={handleSend}>
                                    <label className="mb-0 text-muted p-2" style={{ cursor: 'pointer' }}>
                                        <ImageIcon size={22} />
                                        <input type="file" hidden accept="image/*" onChange={handleFileSelect} />
                                    </label>
                                    <input type="text" className="form-control border-0 bg-light rounded-pill px-4 py-2" placeholder="Nhập tin nhắn..." value={input} onChange={e => setInput(e.target.value)} />
                                    <button type="submit" className="btn btn-primary rounded-circle p-2 shadow-sm" style={{width: '45px', height: '45px'}} disabled={loading}>
                                        {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20}/>}
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted p-5 bg-light">
                            <div className="bg-white shadow-sm rounded-circle p-4 mb-3"><MessageSquare size={64} className="text-primary opacity-25"/></div>
                            <h4 className="fw-black text-dark">Hỗ trợ khách hàng</h4>
                            <p>Chọn một hội thoại để bắt đầu hỗ trợ trực tiếp.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminChat;

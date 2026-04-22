package com.example.ecommerce.dto;

public class ChatMessage {
    private String senderId;
    private String recipientId;
    private String content;
    private MessageType type;

    public enum MessageType {
        CHAT, JOIN, LEAVE, TYPING;

        @com.fasterxml.jackson.annotation.JsonCreator
        public static MessageType fromString(String key) {
            if (key == null) return CHAT;
            try {
                return MessageType.valueOf(key.toUpperCase());
            } catch (Exception e) {
                return CHAT;
            }
        }
    }

    public ChatMessage() {}

    public ChatMessage(String senderId, String recipientId, String content, MessageType type) {
        this.senderId = senderId;
        this.recipientId = recipientId;
        this.content = content;
        this.type = type;
    }

    // Getters and Setters
    public String getSenderId() { return senderId; }
    public void setSenderId(String senderId) { this.senderId = senderId; }
    public String getRecipientId() { return recipientId; }
    public void setRecipientId(String recipientId) { this.recipientId = recipientId; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public MessageType getType() { return type; }
    public void setType(MessageType type) { this.type = type; }
}

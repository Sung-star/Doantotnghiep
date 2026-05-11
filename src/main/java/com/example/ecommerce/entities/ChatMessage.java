package com.example.ecommerce.entities;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "chat_messages")
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String senderId;
    private String recipientId;
    
    @Column(columnDefinition = "TEXT")
    private String content;
    
    private Instant timestamp;
    private boolean isBot;

    public ChatMessage() {
        this.timestamp = Instant.now();
    }

    public ChatMessage(String senderId, String recipientId, String content, boolean isBot) {
        this();
        this.senderId = senderId;
        this.recipientId = recipientId;
        this.content = content;
        this.isBot = isBot;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSenderId() { return senderId; }
    public void setSenderId(String senderId) { this.senderId = senderId; }
    public String getRecipientId() { return recipientId; }
    public void setRecipientId(String recipientId) { this.recipientId = recipientId; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
    public boolean isBot() { return isBot; }
    public void setBot(boolean bot) { isBot = bot; }
}

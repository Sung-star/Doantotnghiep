package com.example.ecommerce.repositories;

import com.example.ecommerce.entities.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    
    // Lấy lịch sử chat giữa một user cụ thể và Admin (hoặc Bot)
    @Query("SELECT m FROM ChatMessage m WHERE " +
           "(m.senderId = :userId OR m.recipientId = :userId) " +
           "ORDER BY m.timestamp ASC")
    List<ChatMessage> findChatHistory(@Param("userId") String userId);

    // Lấy danh sách các User ID đã từng nhắn tin (cho Admin sidebar)
    @Query("SELECT DISTINCT m.senderId FROM ChatMessage m WHERE m.senderId <> 'admin' AND m.isBot = false")
    List<String> findActiveUserIds();

    @Query(value = "SELECT content FROM chat_messages WHERE sender_id = :userId OR recipient_id = :userId ORDER BY timestamp DESC LIMIT 1", nativeQuery = true)
    String findLastMessageForUser(@Param("userId") String userId);
}

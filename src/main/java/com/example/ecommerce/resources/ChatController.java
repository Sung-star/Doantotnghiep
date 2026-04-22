package com.example.ecommerce.resources;

import com.example.ecommerce.entities.ChatMessage;
import com.example.ecommerce.repositories.ChatMessageRepository;
import com.example.ecommerce.repositories.UserRepository;
import com.example.ecommerce.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@RestController
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private UserRepository userRepository;

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload com.example.ecommerce.dto.ChatMessage chatMsgDto) {
        // Lưu vào DB nếu không phải là tín hiệu đang gõ
        if (chatMsgDto.getType() != com.example.ecommerce.dto.ChatMessage.MessageType.TYPING) {
            ChatMessage msg = new ChatMessage();
            msg.setSenderId(chatMsgDto.getSenderId());
            msg.setRecipientId(chatMsgDto.getRecipientId());
            msg.setContent(chatMsgDto.getContent());
            msg.setBot(chatMsgDto.getSenderId().equals("bot") || chatMsgDto.getSenderId().equals("admin"));
            chatMessageRepository.save(msg);
        }

        // Gửi real-time
        if (chatMsgDto.getRecipientId() != null) {
            // Gửi riêng tư cho người nhận
            messagingTemplate.convertAndSendToUser(
                chatMsgDto.getRecipientId(), "/queue/messages", chatMsgDto
            );
            
            // ĐẶC BIỆT: Nếu sender không phải là admin (tức là khách hàng gửi), 
            // hoặc nếu recipient là admin, thì LUÔN gửi vào /topic/admin để Admin Panel cập nhật ngay
            if ("admin".equals(chatMsgDto.getRecipientId()) || !"admin".equals(chatMsgDto.getSenderId())) {
                messagingTemplate.convertAndSend("/topic/admin", chatMsgDto);
            }
        }
    }

    // API lấy lịch sử chat
    @GetMapping("/api/chat/history/{userId}")
    public List<ChatMessage> getChatHistory(@PathVariable String userId) {
        return chatMessageRepository.findChatHistory(userId);
    }

    // API lấy danh sách các cuộc hội thoại cho Admin
    @GetMapping("/api/chat/conversations")
    public List<Map<String, Object>> getActiveConversations() {
        List<String> userIds = chatMessageRepository.findActiveUserIds();
        return userIds.stream().map(id -> {
            Map<String, Object> map = new HashMap<>();
            map.put("userId", id);
            map.put("lastMessage", chatMessageRepository.findLastMessageForUser(id));
            // Tìm thông tin user thật nếu có
            try {
                Long longId = Long.parseLong(id);
                User user = userRepository.findById(longId).orElse(null);
                if (user != null) {
                    map.put("userName", user.getName());
                    map.put("userImg", user.getImgUrl());
                }
            } catch (Exception e) {}
            return map;
        }).collect(Collectors.toList());
    }
}

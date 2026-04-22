package com.example.ecommerce.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Kích hoạt broker đơn giản để gửi tin nhắn đến các topic
        config.enableSimpleBroker("/topic", "/user");
        // Prefix cho các tin nhắn được gửi từ Client lên Server
        config.setApplicationDestinationPrefixes("/app");
        // Prefix cho các tin nhắn gửi riêng cho 1 user
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Endpoint để Client kết nối WebSocket
        registry.addEndpoint("/ws-chat")
                .setAllowedOrigins("http://localhost:3000") // URL của React app
                .withSockJS();
    }
}

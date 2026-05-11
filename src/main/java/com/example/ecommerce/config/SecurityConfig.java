package com.example.ecommerce.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableMethodSecurity // Cho phép dùng @PreAuthorize ở Controller
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

 @Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.csrf(csrf -> csrf.disable())
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/h2-console/**").permitAll()
            .requestMatchers("/products/**").permitAll()
            .requestMatchers("/users/**").permitAll()
            .requestMatchers("/orders/**").permitAll() 
            .requestMatchers("/add-to-cart/**").permitAll()
            .requestMatchers("/api/payment/**").permitAll() // Mở quyền cho VNPAY
            // THÊM DÒNG NÀY: Mở khóa quyền truy cập ảnh
            .requestMatchers("/uploads/**").permitAll() 
            .requestMatchers("/api/upload/**").permitAll() 
            .requestMatchers("/admin/**").hasRole("ADMIN")
            .anyRequest().permitAll()
        )
        .httpBasic(Customizer.withDefaults()); 

    http.headers(headers -> headers.frameOptions(f -> f.disable()));
    return http.build();
}
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:3000"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
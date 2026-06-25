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
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

<<<<<<< HEAD
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
            .requestMatchers("/uploads/**").permitAll() 
            .requestMatchers("/api/upload/**").permitAll() 
            .requestMatchers("/admin/loyalty/**").permitAll() // Cho phép Điểm & Thành viên
            .requestMatchers("/api/admin/loyalty/**").permitAll() // Cho phép Điểm & Thành viên (API)
            .requestMatchers("/admin/**").hasRole("ADMIN")
            .anyRequest().permitAll()
        )
        .httpBasic(Customizer.withDefaults()); 
=======
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Đảm bảo Spring Security nhận CORS
                                                                                   // config ở dưới
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/h2-console/**").permitAll()
                        .requestMatchers("/products/**").permitAll()
                        .requestMatchers("/users/**").permitAll()
                        .requestMatchers("/orders/**").permitAll()
                        .requestMatchers("/add-to-cart/**").permitAll()
                        .requestMatchers("/api/payment/**").permitAll()
                        .requestMatchers("/uploads/**").permitAll()
                        .requestMatchers("/api/upload/**").permitAll()
                        .requestMatchers("/admin/loyalty/**").permitAll()
                        .requestMatchers("/api/admin/loyalty/**").permitAll()
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        .anyRequest().permitAll())
                .httpBasic(Customizer.withDefaults());

        http.headers(headers -> headers.frameOptions(f -> f.disable()));
        return http.build();
    }
>>>>>>> bdc2f698b6fb92ee5be00fd643f7a03b92e99d97

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // Thêm chính xác các domain đang chạy của bạn (kể cả local lẫn deploy thật)
        config.setAllowedOrigins(Arrays.asList(
                "http://localhost:5173",
                "http://localhost:3000",
                "http://127.0.0.1:3000",
                "https://sporting-shop.vercel.app",
                "https://sporting-shop-fe.vercel.app",
                "https://doantotnghiep-1quw.vercel.app" // Thêm domain Vercel thực tế từ link log của bạn
        ));

        // Tuyệt chiêu: Cho phép mọi domain có đuôi .vercel.app để tránh lỗi khi đổi tên
        // miền preview
        config.setAllowedOriginPatterns(Arrays.asList(
                "https://*.vercel.app"));

        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowCredentials(true); // Giữ nguyên true nếu frontend có gửi cookie/token tự động bằng axios

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config); // Áp dụng CORS cho toàn bộ Endpoint nhận diện bởi Security
        return source;
    }
}
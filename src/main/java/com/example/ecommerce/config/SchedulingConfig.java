package com.example.ecommerce.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Cấu hình Scheduling cho các task định kỳ
 * Cho phép các scheduled methods chạy tự động
 */
@Configuration
@EnableScheduling
public class SchedulingConfig {
    // Class này được @EnableScheduling để cho phép @Scheduled hoạt động
}

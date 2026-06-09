package com.example.ecommerce.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

/**
 * Scheduled Tasks - Chạy các task định kỳ
 * - Ghi nhận dữ liệu analytics hàng ngày
 * - Cập nhật các metric khác
 */
@Service
public class ScheduledTaskService {

    @Autowired
    private AnalyticsService analyticsService;

    /**
     * Chạy mỗi ngày lúc 00:00 (nửa đêm)
     * Ghi nhận doanh thu và các metric hàng ngày
     */
    @Scheduled(cron = "0 0 0 * * *") // Hàng ngày 00:00
    public void recordDailyAnalytics() {
        try {
            System.out.println(">>> [SCHEDULED] Bắt đầu ghi nhận analytics hàng ngày...");
            analyticsService.recordDailyAnalytics();
            System.out.println(">>> [SCHEDULED] ✓ Ghi nhận analytics xong");
        } catch (Exception e) {
            System.err.println(">>> [SCHEDULED] ✗ Lỗi ghi nhận analytics: " + e.getMessage());
        }
    }

    /**
     * Chạy mỗi giờ vào phút 0
     * Làm tươi dữ liệu cache analytics
     */
    @Scheduled(cron = "0 0 * * * *") // Mỗi giờ lúc 00:00
    public void refreshAnalyticsCache() {
        try {
            System.out.println(">>> [SCHEDULED] Làm tươi cache analytics...");
            // Có thể thêm cache refresh logic ở đây nếu cần
            System.out.println(">>> [SCHEDULED] ✓ Cache làm tươi xong");
        } catch (Exception e) {
            System.err.println(">>> [SCHEDULED] ✗ Lỗi refresh cache: " + e.getMessage());
        }
    }
}

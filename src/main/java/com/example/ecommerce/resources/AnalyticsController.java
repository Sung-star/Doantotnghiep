package com.example.ecommerce.resources;

import com.example.ecommerce.services.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Analytics Controller - API cho phân tích doanh số
 */
@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "http://localhost:5173")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    /**
     * GET /api/analytics/today
     * Doanh thu hôm nay
     */
    @GetMapping("/today")
    public ResponseEntity<Map<String, Object>> getTodayRevenue() {
        Map<String, Object> revenue = analyticsService.getTodayRevenue();
        return ResponseEntity.ok(revenue);
    }

    /**
     * GET /api/analytics/revenue
     * Doanh thu theo khoảng ngày
     * ?from=2025-01-01&to=2025-01-31
     */
    @GetMapping("/revenue")
    public ResponseEntity<Map<String, Object>> getRevenueRange(
            @RequestParam String from,
            @RequestParam String to) {
        Map<String, Object> revenue = analyticsService.getRevenueRange(from, to);
        return ResponseEntity.ok(revenue);
    }

    /**
     * GET /api/analytics/top-products
     * Top 10 sản phẩm bán chạy hôm nay
     */
    @GetMapping("/top-products")
    public ResponseEntity<List<Map<String, Object>>> getTopProducts() {
        List<Map<String, Object>> topProducts = analyticsService.getTopProductsToday();
        return ResponseEntity.ok(topProducts);
    }

    /**
     * GET /api/analytics/orders
     * Thống kê đơn hàng
     */
    @GetMapping("/orders")
    public ResponseEntity<Map<String, Object>> getOrderStats() {
        Map<String, Object> stats = analyticsService.getOrderStats();
        return ResponseEntity.ok(stats);
    }

    /**
     * GET /api/analytics/top-customers
     * Top khách hàng theo chi tiêu
     * ?limit=10
     */
    @GetMapping("/top-customers")
    public ResponseEntity<List<Map<String, Object>>> getTopCustomers(
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "today") String period) {
        List<Map<String, Object>> topCustomers = analyticsService.getTopCustomers(limit, period);
        return ResponseEntity.ok(topCustomers);
    }

    /**
     * GET /api/analytics/products
     * Phân tích bán hàng theo sản phẩm
     */
    @GetMapping("/products")
    public ResponseEntity<List<Map<String, Object>>> getProductAnalytics() {
        List<Map<String, Object>> analytics = analyticsService.getProductSalesAnalytics();
        return ResponseEntity.ok(analytics);
    }
}

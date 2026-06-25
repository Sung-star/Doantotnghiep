package com.example.ecommerce.services;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.ecommerce.dto.OrderAnalytics;
import com.example.ecommerce.dto.TopProductDTO;
import com.example.ecommerce.entities.Order;
import com.example.ecommerce.entities.OrderItem;
import com.example.ecommerce.entities.enums.OrderStatus;
import com.example.ecommerce.repositories.OrderRepository;

@Service
public class AnalyticsService {

    @Autowired
    private OrderRepository orderRepository;

    // ===== REVENUE ANALYTICS =====
    public OrderAnalytics getRevenueAnalytics(String period) {
        List<Order> orders = getOrdersByPeriod(period);
        
        // Chỉ tính những đơn đã thanh toán
        List<Order> paidOrders = orders.stream()
            .filter(o -> o.getOrderStatus() == OrderStatus.PAID || 
                        o.getOrderStatus() == OrderStatus.DELIVERED ||
                        o.getOrderStatus() == OrderStatus.COMPLETED)
            .collect(Collectors.toList());
        
        Double totalRevenue = paidOrders.stream()
            .mapToDouble(o -> o.getTotal() != null ? o.getTotal() : 0)
            .sum();
        
        Set<Long> uniqueCustomers = paidOrders.stream()
            .map(o -> o.getClient().getId())
            .collect(Collectors.toSet());
        
        OrderAnalytics analytics = new OrderAnalytics(
            (long) paidOrders.size(),
            totalRevenue,
            (long) uniqueCustomers.size(),
            period
        );
        
        return analytics;
    }

    // ===== TOP PRODUCTS =====
    public List<TopProductDTO> getTopProducts(Integer limit, String period) {
        List<Order> orders = getOrdersByPeriod(period);
        
        // Chỉ tính những đơn đã thanh toán
        List<Order> paidOrders = orders.stream()
            .filter(o -> o.getOrderStatus() == OrderStatus.PAID || 
                        o.getOrderStatus() == OrderStatus.DELIVERED ||
                        o.getOrderStatus() == OrderStatus.COMPLETED)
            .collect(Collectors.toList());
        
        Map<Long, TopProductDTO> productMap = new HashMap<>();
        
        for (Order order : paidOrders) {
            for (OrderItem item : order.getItems()) {
                Long productId = item.getProduct().getId();
                TopProductDTO dto = productMap.getOrDefault(productId, 
                    new TopProductDTO(
                        productId,
                        item.getProduct().getName(),
                        item.getProduct().getImgUrl(),
                        0L,
                        0.0
                    )
                );
                
                dto.setQuantitySold(dto.getQuantitySold() + item.getQuantity());
                dto.setTotalRevenue(dto.getTotalRevenue() + (item.getPrice() * item.getQuantity()));
                
                productMap.put(productId, dto);
            }
        }
        
        List<TopProductDTO> result = new ArrayList<>(productMap.values());
        result.sort((a, b) -> Long.compare(b.getQuantitySold(), a.getQuantitySold()));
        
        // Set rank
        for (int i = 0; i < result.size(); i++) {
            result.get(i).setRank(i + 1);
        }
        
        return result.stream().limit(limit != null ? limit : 10).collect(Collectors.toList());
    }

    // ===== TOP CUSTOMERS =====
    public List<Map<String, Object>> getTopCustomers(Integer limit, String period) {
        List<Order> orders = getOrdersByPeriod(period);
        
        List<Order> paidOrders = orders.stream()
            .filter(o -> o.getOrderStatus() == OrderStatus.PAID || 
                        o.getOrderStatus() == OrderStatus.DELIVERED ||
                        o.getOrderStatus() == OrderStatus.COMPLETED)
            .collect(Collectors.toList());
        
        Map<Long, Map<String, Object>> customerMap = new HashMap<>();
        
        for (Order order : paidOrders) {
            Long customerId = order.getClient().getId();
            Map<String, Object> customer = customerMap.getOrDefault(customerId, new HashMap<>());
            
            customer.put("customerId", customerId);
            customer.put("customerName", order.getClient().getName());
            customer.put("customerEmail", order.getClient().getEmail());
            
            Long orderCount = (Long) customer.getOrDefault("orderCount", 0L);
            Double totalSpent = (Double) customer.getOrDefault("totalSpent", 0.0);
            
            customer.put("orderCount", orderCount + 1);
            customer.put("totalSpent", totalSpent + order.getTotal());
            
            customerMap.put(customerId, customer);
        }
        
        List<Map<String, Object>> result = new ArrayList<>(customerMap.values());
        result.sort((a, b) -> Double.compare(
            (Double) b.getOrDefault("totalSpent", 0.0),
            (Double) a.getOrDefault("totalSpent", 0.0)
        ));
        
        return result.stream().limit(limit != null ? limit : 10).collect(Collectors.toList());
    }

    // ===== ORDER STATUS DISTRIBUTION =====
    public Map<String, Long> getOrderStatusDistribution(String period) {
        List<Order> orders = getOrdersByPeriod(period);
        
        return orders.stream()
            .collect(Collectors.groupingBy(
                o -> o.getOrderStatus().name(),
                Collectors.counting()
            ));
    }

    private List<Order> getOrdersByPeriod(String period) {
        List<Order> allOrders = orderRepository.findAll();
        Instant now = Instant.now();
        LocalDate todayDate = now.atZone(ZoneId.systemDefault()).toLocalDate();
        
        return allOrders.stream().filter(o -> {
            LocalDate orderDate = o.getMoment().atZone(ZoneId.systemDefault()).toLocalDate();
            
            switch (period != null ? period.toLowerCase() : "today") {
                case "today":
                    return orderDate.equals(todayDate);
                case "this_week":
                    return orderDate.isAfter(todayDate.minusDays(7)) && !orderDate.isAfter(todayDate);
                case "this_month":
                    return orderDate.getYear() == todayDate.getYear() &&
                           orderDate.getMonthValue() == todayDate.getMonthValue();
                case "this_year":
                    return orderDate.getYear() == todayDate.getYear();
                default:
                    return true;
            }
        }).collect(Collectors.toList());
    }

    // ===== WRAPPER METHODS FOR CONTROLLER =====
    public Map<String, Object> getTodayRevenue() {
        OrderAnalytics analytics = getRevenueAnalytics("today");
        Map<String, Object> result = new HashMap<>();
        result.put("totalRevenue", analytics.getTotalRevenue());
        result.put("totalOrders", analytics.getTotalOrders());
        result.put("uniqueCustomers", analytics.getTotalCustomers());
        return result;
    }

    public Map<String, Object> getRevenueRange(String from, String to) {
        Map<String, Object> result = new HashMap<>();
        result.put("from", from);
        result.put("to", to);
        result.put("totalRevenue", 0.0);
        // TODO: Implement range-based revenue calculation
        return result;
    }

    public List<Map<String, Object>> getTopProductsToday() {
        return getTopProducts(10, "today").stream()
            .map(dto -> {
                Map<String, Object> map = new HashMap<>();
                map.put("productId", dto.getProductId());
                map.put("productName", dto.getProductName());
                map.put("quantitySold", dto.getQuantitySold());
                map.put("totalRevenue", dto.getTotalRevenue());
                map.put("rank", dto.getRank());
                return map;
            })
            .collect(Collectors.toList());
    }

    public Map<String, Object> getOrderStats() {
        OrderAnalytics analytics = getRevenueAnalytics("today");
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalOrders", analytics.getTotalOrders());
        stats.put("totalRevenue", analytics.getTotalRevenue());
        stats.put("uniqueCustomers", analytics.getTotalCustomers());
        stats.put("statusDistribution", getOrderStatusDistribution("today"));
        return stats;
    }

    public List<Map<String, Object>> getProductSalesAnalytics() {
        return getTopProducts(10, "this_month").stream()
            .map(dto -> {
                Map<String, Object> map = new HashMap<>();
                map.put("productId", dto.getProductId());
                map.put("productName", dto.getProductName());
                map.put("quantitySold", dto.getQuantitySold());
                map.put("totalRevenue", dto.getTotalRevenue());
                return map;
            })
            .collect(Collectors.toList());
    }

    // ===== DAILY ANALYTICS RECORDING =====
    public void recordDailyAnalytics() {
        OrderAnalytics dailyData = getRevenueAnalytics("today");
        // TODO: Save to AnalyticsRecord table for persistence
        System.out.println(">>> [ANALYTICS] Daily snapshot recorded: " + dailyData.getTotalOrders() + " orders, " + dailyData.getTotalRevenue() + "đ");
    }
}

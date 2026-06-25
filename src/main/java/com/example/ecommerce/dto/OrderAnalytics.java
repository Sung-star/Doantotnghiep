package com.example.ecommerce.dto;

import java.time.Instant;

/**
 * DTO cho Analytics - thống kê doanh thu
 */
public class OrderAnalytics {
    private Long totalOrders;
    private Double totalRevenue;
    private Double avgOrderValue;
    private Long totalCustomers;
    private String period; // "today", "this_week", "this_month", "this_year"
    private Instant startDate;
    private Instant endDate;

    // Constructor
    public OrderAnalytics() {}

    public OrderAnalytics(Long totalOrders, Double totalRevenue, Long totalCustomers, String period) {
        this.totalOrders = totalOrders;
        this.totalRevenue = totalRevenue;
        this.totalCustomers = totalCustomers;
        this.period = period;
        this.avgOrderValue = totalRevenue > 0 && totalOrders > 0 ? totalRevenue / totalOrders : 0;
    }

    // Getters & Setters
    public Long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(Long totalOrders) { this.totalOrders = totalOrders; }

    public Double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(Double totalRevenue) { this.totalRevenue = totalRevenue; }

    public Double getAvgOrderValue() { return avgOrderValue; }
    public void setAvgOrderValue(Double avgOrderValue) { this.avgOrderValue = avgOrderValue; }

    public Long getTotalCustomers() { return totalCustomers; }
    public void setTotalCustomers(Long totalCustomers) { this.totalCustomers = totalCustomers; }

    public String getPeriod() { return period; }
    public void setPeriod(String period) { this.period = period; }

    public Instant getStartDate() { return startDate; }
    public void setStartDate(Instant startDate) { this.startDate = startDate; }

    public Instant getEndDate() { return endDate; }
    public void setEndDate(Instant endDate) { this.endDate = endDate; }
}

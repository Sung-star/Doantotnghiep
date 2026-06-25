package com.example.ecommerce.entities;

import jakarta.persistence.*;
import java.time.Instant;

/**
 * Analytics Record - Lưu trữ dữ liệu analytics để query nhanh hơn
 */
@Entity
@Table(name = "analytics_records")
public class AnalyticsRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Ngày records
    @Column(nullable = false)
    private String recordDate; // YYYY-MM-DD

    // Loại metric: DAILY_REVENUE, DAILY_ORDERS, PRODUCT_SALES, etc
    @Column(nullable = false)
    private String metricType;

    // Product ID (nullable nếu là revenue overview)
    @Column
    private Long productId;

    // Giá trị
    @Column(name = "metric_value", nullable = false)
    private Double value = 0.0;

    // Số lượng
    @Column
    private Long quantity = 0L;

    // Timestamps
    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    @Column
    private Instant updatedAt;

    public AnalyticsRecord() {}

    public AnalyticsRecord(String recordDate, String metricType, Long productId, Double value, Long quantity) {
        this.recordDate = recordDate;
        this.metricType = metricType;
        this.productId = productId;
        this.value = value;
        this.quantity = quantity;
        this.createdAt = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRecordDate() { return recordDate; }
    public void setRecordDate(String recordDate) { this.recordDate = recordDate; }

    public String getMetricType() { return metricType; }
    public void setMetricType(String metricType) { this.metricType = metricType; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public Double getValue() { return value; }
    public void setValue(Double value) { this.value = value; }

    public Long getQuantity() { return quantity; }
    public void setQuantity(Long quantity) { this.quantity = quantity; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}

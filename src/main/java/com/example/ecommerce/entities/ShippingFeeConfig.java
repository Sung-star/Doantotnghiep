package com.example.ecommerce.entities;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/**
 * ShippingFeeConfig - Cấu hình phí vận chuyển
 * Quản lý phí vận chuyển cho từng khoảng giá/quận/huyện
 */
@Entity
@Table(name = "shipping_fee_configs")
public class ShippingFeeConfig {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "district_id", nullable = false)
    private District district;

    @Column(nullable = false)
    private String name; // Mô tả config (VD: "TPHCM Q1 - Standard")

    @Column(nullable = false)
    private Double minOrderValue = 0.0; // Giá đơn hàng tối thiểu

    @Column(nullable = false)
    private Double maxOrderValue = Double.MAX_VALUE; // Giá đơn hàng tối đa

    @Column(nullable = false)
    private Double baseFee = 30000.0; // Phí cơ bản

    @Column(nullable = false)
    private Double freeShippingThreshold = 500000.0; // Miễn phí nếu đơn > giá trị này

    @Column(nullable = false)
    private Double estimatedDays = 2.0; // Ước tính ngày giao

    @Column(nullable = false)
    private Boolean isActive = true;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    // Constructor
    public ShippingFeeConfig() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public ShippingFeeConfig(District district, String name, Double baseFee) {
        this.district = district;
        this.name = name;
        this.baseFee = baseFee;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public District getDistrict() { return district; }
    public void setDistrict(District district) { this.district = district; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Double getMinOrderValue() { return minOrderValue; }
    public void setMinOrderValue(Double minOrderValue) { this.minOrderValue = minOrderValue; }

    public Double getMaxOrderValue() { return maxOrderValue; }
    public void setMaxOrderValue(Double maxOrderValue) { this.maxOrderValue = maxOrderValue; }

    public Double getBaseFee() { return baseFee; }
    public void setBaseFee(Double baseFee) { this.baseFee = baseFee; }

    public Double getFreeShippingThreshold() { return freeShippingThreshold; }
    public void setFreeShippingThreshold(Double freeShippingThreshold) { this.freeShippingThreshold = freeShippingThreshold; }

    public Double getEstimatedDays() { return estimatedDays; }
    public void setEstimatedDays(Double estimatedDays) { this.estimatedDays = estimatedDays; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}

package com.example.ecommerce.entities;

import java.io.Serializable;
import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

/**
 * Loyalty Point - Hệ thống điểm thưởng khách hàng
 * Tổng điểm, điểm khả dụng, tier (BRONZE/SILVER/GOLD/PLATINUM)
 */
@Entity
@Table(name = "loyalty_points")
public class LoyaltyPoint implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    // Tổng điểm tích lũy
    @Column(nullable = false)
    private Long totalPoints = 0L;

    // Điểm hiện có (sau khi dùng)
    @Column(nullable = false)
    private Long availablePoints = 0L;

    // Level khách hàng: BRONZE, SILVER, GOLD, PLATINUM
    @Column(nullable = false)
    private String loyaltyTier = "BRONZE";

    // Ngày tham gia
    @Column(nullable = false, updatable = false)
    private Instant joinDate = Instant.now();

    // Lần cuối cập nhật
    @Column(nullable = false)
    private Instant lastUpdated = Instant.now();

    @PreUpdate
    protected void onUpdate() {
        lastUpdated = Instant.now();
    }

    // Getters & Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Long getTotalPoints() {
        return totalPoints;
    }

    public void setTotalPoints(Long totalPoints) {
        this.totalPoints = totalPoints;
    }

    public Long getAvailablePoints() {
        return availablePoints;
    }

    public void setAvailablePoints(Long availablePoints) {
        this.availablePoints = availablePoints;
    }

    public String getLoyaltyTier() {
        return loyaltyTier;
    }

    public void setLoyaltyTier(String loyaltyTier) {
        this.loyaltyTier = loyaltyTier;
    }

    public Instant getJoinDate() {
        return joinDate;
    }

    public void setJoinDate(Instant joinDate) {
        this.joinDate = joinDate;
    }

    public Instant getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(Instant lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        LoyaltyPoint that = (LoyaltyPoint) o;
        return id != null && id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0;
    }

    @Override
    public String toString() {
        return "LoyaltyPoint{" +
                "id=" + id +
                ", user=" + (user != null ? user.getId() : null) +
                ", totalPoints=" + totalPoints +
                ", availablePoints=" + availablePoints +
                ", loyaltyTier='" + loyaltyTier + '\'' +
                '}';
    }
}

package com.example.ecommerce.entities;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/**
 * LoyaltyTransaction - Lịch sử giao dịch điểm thưởng
 * EARN: Kiếm điểm từ mua hàng
 * REDEEM: Dùng điểm đổi voucher
 * REFUND: Hoàn điểm khi hủy đơn
 * DEDUCT: Trừ điểm (admin)
 */
@Entity
@Table(name = "loyalty_transactions")
public class LoyaltyTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // EARN, REDEEM, REFUND, DEDUCT, BONUS
    @Column(nullable = false, length = 20)
    private String type;

    // Số điểm thay đổi (dương = cộng, âm = trừ)
    @Column(nullable = false)
    private Long points;

    // Điểm còn lại sau giao dịch
    @Column(nullable = false)
    private Long balanceAfter;

    // Mô tả giao dịch (Đơn #123, Đổi voucher SUMMER20, v.v.)
    @Column(length = 255)
    private String description;

    // Tham chiếu (orderId, voucherCode, ...)
    @Column(length = 100)
    private String referenceId;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public LoyaltyTransaction() {}

    public LoyaltyTransaction(User user, String type, Long points, Long balanceAfter, String description, String referenceId) {
        this.user = user;
        this.type = type;
        this.points = points;
        this.balanceAfter = balanceAfter;
        this.description = description;
        this.referenceId = referenceId;
        this.createdAt = Instant.now();
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Long getPoints() { return points; }
    public void setPoints(Long points) { this.points = points; }

    public Long getBalanceAfter() { return balanceAfter; }
    public void setBalanceAfter(Long balanceAfter) { this.balanceAfter = balanceAfter; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getReferenceId() { return referenceId; }
    public void setReferenceId(String referenceId) { this.referenceId = referenceId; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}

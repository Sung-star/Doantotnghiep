package com.example.ecommerce.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Loyalty Tier - Các cấp độ thành viên
 * Bronze (0-1000 pts), Silver (1001-5000), Gold (5001-10000), Platinum (10000+)
 */
@Entity
@Table(name = "loyalty_tiers")
public class LoyaltyTier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name; // BRONZE, SILVER, GOLD, PLATINUM

    @Column(nullable = false)
    private Long minPoints; // Điểm tối thiểu để đạt tier này

    @Column(nullable = false)
    private Double discountPercent; // % giảm giá (0.05 = 5%)

    @Column(nullable = false)
    private Double bonusPointsMultiplier; // Nhân bonus (1.5 = +50% điểm)

    @Column(name = "description")
    private String description;

    // Constructor
    public LoyaltyTier() {}

    public LoyaltyTier(String name, Long minPoints, Double discountPercent, Double bonusPointsMultiplier) {
        this.name = name;
        this.minPoints = minPoints;
        this.discountPercent = discountPercent;
        this.bonusPointsMultiplier = bonusPointsMultiplier;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Long getMinPoints() { return minPoints; }
    public void setMinPoints(Long minPoints) { this.minPoints = minPoints; }

    public Double getDiscountPercent() { return discountPercent; }
    public void setDiscountPercent(Double discountPercent) { this.discountPercent = discountPercent; }

    public Double getBonusPointsMultiplier() { return bonusPointsMultiplier; }
    public void setBonusPointsMultiplier(Double bonusPointsMultiplier) { this.bonusPointsMultiplier = bonusPointsMultiplier; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}

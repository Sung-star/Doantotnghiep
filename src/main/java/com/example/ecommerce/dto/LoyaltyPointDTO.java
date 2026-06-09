package com.example.ecommerce.dto;

/**
 * DTO cho Loyalty Point response
 */
public class LoyaltyPointDTO {
    private Long userId;
    private Long totalPoints;
    private Long availablePoints;
    private Long usedPoints;
    private String currentTierName;
    private Double tierDiscountPercent;
    private Double tierBonusMultiplier;
    private Long pointsUntilNextTier;
    private Integer tierRank; // 1: Bronze, 2: Silver, 3: Gold, 4: Platinum

    // Constructor
    public LoyaltyPointDTO() {}

    public LoyaltyPointDTO(Long userId, Long totalPoints, Long availablePoints, String tierName) {
        this.userId = userId;
        this.totalPoints = totalPoints;
        this.availablePoints = availablePoints;
        this.currentTierName = tierName;
    }

    // Getters & Setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getTotalPoints() { return totalPoints; }
    public void setTotalPoints(Long totalPoints) { this.totalPoints = totalPoints; }

    public Long getAvailablePoints() { return availablePoints; }
    public void setAvailablePoints(Long availablePoints) { this.availablePoints = availablePoints; }

    public Long getUsedPoints() { return usedPoints; }
    public void setUsedPoints(Long usedPoints) { this.usedPoints = usedPoints; }

    public String getCurrentTierName() { return currentTierName; }
    public void setCurrentTierName(String currentTierName) { this.currentTierName = currentTierName; }

    public Double getTierDiscountPercent() { return tierDiscountPercent; }
    public void setTierDiscountPercent(Double tierDiscountPercent) { this.tierDiscountPercent = tierDiscountPercent; }

    public Double getTierBonusMultiplier() { return tierBonusMultiplier; }
    public void setTierBonusMultiplier(Double tierBonusMultiplier) { this.tierBonusMultiplier = tierBonusMultiplier; }

    public Long getPointsUntilNextTier() { return pointsUntilNextTier; }
    public void setPointsUntilNextTier(Long pointsUntilNextTier) { this.pointsUntilNextTier = pointsUntilNextTier; }

    public Integer getTierRank() { return tierRank; }
    public void setTierRank(Integer tierRank) { this.tierRank = tierRank; }
}

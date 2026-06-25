package com.example.ecommerce.dto;

/**
 * DTO cho tính toán phí vận chuyển
 */
public class ShippingFeeDTO {
    private Long districtId;
    private Long wardId;
    private Double orderTotal;
    private Double baseFee;
    private Double additionalFee;
    private Double totalShippingFee;
    private Boolean isFreeShipping;
    private Double estimatedDays;
    private String districtName;
    private String wardName;
    private String city;

    // Constructor
    public ShippingFeeDTO() {}

    public ShippingFeeDTO(Long districtId, Double orderTotal, Double totalShippingFee, Boolean isFreeShipping) {
        this.districtId = districtId;
        this.orderTotal = orderTotal;
        this.totalShippingFee = totalShippingFee;
        this.isFreeShipping = isFreeShipping;
    }

    // Getters & Setters
    public Long getDistrictId() { return districtId; }
    public void setDistrictId(Long districtId) { this.districtId = districtId; }

    public Long getWardId() { return wardId; }
    public void setWardId(Long wardId) { this.wardId = wardId; }

    public Double getOrderTotal() { return orderTotal; }
    public void setOrderTotal(Double orderTotal) { this.orderTotal = orderTotal; }

    public Double getBaseFee() { return baseFee; }
    public void setBaseFee(Double baseFee) { this.baseFee = baseFee; }

    public Double getAdditionalFee() { return additionalFee; }
    public void setAdditionalFee(Double additionalFee) { this.additionalFee = additionalFee; }

    public Double getTotalShippingFee() { return totalShippingFee; }
    public void setTotalShippingFee(Double totalShippingFee) { this.totalShippingFee = totalShippingFee; }

    public Boolean getIsFreeShipping() { return isFreeShipping; }
    public void setIsFreeShipping(Boolean isFreeShipping) { this.isFreeShipping = isFreeShipping; }

    public Double getEstimatedDays() { return estimatedDays; }
    public void setEstimatedDays(Double estimatedDays) { this.estimatedDays = estimatedDays; }

    public String getDistrictName() { return districtName; }
    public void setDistrictName(String districtName) { this.districtName = districtName; }

    public String getWardName() { return wardName; }
    public void setWardName(String wardName) { this.wardName = wardName; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
}

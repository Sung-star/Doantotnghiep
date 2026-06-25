package com.example.ecommerce.dto;

/**
 * DTO cho Top sản phẩm bán chạy
 */
public class TopProductDTO {
    private Long productId;
    private String productName;
    private String imageUrl;
    private Long quantitySold;
    private Double totalRevenue;
    private Integer rank;

    // Constructor
    public TopProductDTO() {}

    public TopProductDTO(Long productId, String productName, String imageUrl, Long quantitySold, Double totalRevenue) {
        this.productId = productId;
        this.productName = productName;
        this.imageUrl = imageUrl;
        this.quantitySold = quantitySold;
        this.totalRevenue = totalRevenue;
    }

    // Getters & Setters
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Long getQuantitySold() { return quantitySold; }
    public void setQuantitySold(Long quantitySold) { this.quantitySold = quantitySold; }

    public Double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(Double totalRevenue) { this.totalRevenue = totalRevenue; }

    public Integer getRank() { return rank; }
    public void setRank(Integer rank) { this.rank = rank; }
}

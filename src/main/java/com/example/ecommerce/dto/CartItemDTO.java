package com.example.ecommerce.dto;

public class CartItemDTO {
    private Long productId;
    private Integer quantity;
    private String sizeName; // <--- ĐÃ SỬA: Dùng String để nhận tên size (VD: "M", "L")
    private String color; // New field for variant selection

    public CartItemDTO() {
    }

    public CartItemDTO(Long productId, Integer quantity, String sizeName, String color) {
        this.productId = productId;
        this.quantity = quantity;
        this.sizeName = sizeName;
        this.color = color;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    // --- GETTER/SETTER CHO SIZE NAME (Dạng chuỗi) ---
    public String getSizeName() {
        return sizeName;
    }

    public void setSizeName(String sizeName) {
        this.sizeName = sizeName;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}
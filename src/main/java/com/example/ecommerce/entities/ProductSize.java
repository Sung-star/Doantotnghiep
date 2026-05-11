package com.example.ecommerce.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "tb_product_size")
public class ProductSize {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String size;
    private Integer quantity;

    // SỬA ĐỔI: Trỏ về ProductVariant thay vì Product
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "variant_id") 
    private ProductVariant productVariant;

    public ProductSize() {}

    public ProductSize(Long id, String size, Integer quantity, ProductVariant productVariant) {
        this.id = id;
        this.size = size;
        this.quantity = quantity;
        this.productVariant = productVariant;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public ProductVariant getProductVariant() {
        return productVariant;
    }

    public void setProductVariant(ProductVariant productVariant) {
        this.productVariant = productVariant;
    }

    // Hãy tạo các Getter và Setter cho các trường
}

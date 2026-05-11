package com.example.ecommerce.entities;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "tb_product_variant")
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String color;
    
    @Column(columnDefinition = "LONGTEXT")
    private String imgUrl;

    // Map ngược lại với Product
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    // 1 Phiên bản màu có nhiều Size và Tồn kho tương ứng
    @OneToMany(mappedBy = "productVariant", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ProductSize> productSizes = new HashSet<>();

    public ProductVariant() {}

    public ProductVariant(Long id, String color, String imgUrl, Product product) {
        this.id = id;
        this.color = color;
        this.imgUrl = imgUrl;
        this.product = product;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getImgUrl() {
        return imgUrl;
    }

    public void setImgUrl(String imgUrl) {
        this.imgUrl = imgUrl;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Set<ProductSize> getProductSizes() {
        return productSizes;
    }

    public void setProductSizes(Set<ProductSize> productSizes) {
        this.productSizes = productSizes;
    }

    // Hãy tạo các Getter và Setter cho tất cả các trường
}

package com.example.ecommerce.entities;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.io.Serializable;

@Entity
@Table(name = "product_sizes")
public class ProductSize implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer quantity;

    @Column(name = "size_name") 
    private String size; // <--- ĐÃ SỬA: Lưu tên size dạng chữ (String) thay vì đối tượng Size

    @ManyToOne
    @JoinColumn(name = "product_id")
    @JsonIgnore
    private Product product;

    public ProductSize() {
    }

    public ProductSize(Long id, Integer quantity, String size, Product product) {
        this.id = id;
        this.quantity = quantity;
        this.size = size;
        this.product = product;
    }

    // --- GETTERS & SETTERS ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getSize() { // Trả về String
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }
    @Override
public String toString() {
    return size + ": " + quantity;
}}
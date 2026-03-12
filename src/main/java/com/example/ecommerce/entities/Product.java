package com.example.ecommerce.entities;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "products")
public class Product implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private Double price;
    private String color;
    private String brand;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String imgUrl;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "product_category", 
               joinColumns = @JoinColumn(name = "product_id"), 
               inverseJoinColumns = @JoinColumn(name = "category_id"))
    private Set<Category> categories = new HashSet<>();
    
    @OneToMany(mappedBy = "id.product")
    private Set<OrderItem> items = new HashSet<>();

    @OneToMany(mappedBy = "product", fetch = FetchType.EAGER, 
               cascade = CascadeType.ALL, orphanRemoval = true) 
    private Set<ProductSize> productSizes = new HashSet<>();

    public Product() {}

    public Product(Long id, String name, String description, Double price, String color, String brand, String imgUrl) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.color = color;
        this.brand = brand;
        this.imgUrl = imgUrl;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }
    public String getImgUrl() { return imgUrl; }
    public void setImgUrl(String imgUrl) { this.imgUrl = imgUrl; }
    public Set<Category> getCategories() { return categories; }
    public Set<ProductSize> getProductSizes() { return productSizes; }
    public void setProductSizes(Set<ProductSize> productSizes) { this.productSizes = productSizes; }

    @JsonIgnore
    public Set<Order> getOrders(){
        Set<Order> orders = new HashSet<>();
        for(OrderItem orderItem : items) { orders.add(orderItem.getOrder()); }
        return orders;
    }

    @Override
    public int hashCode() { return Objects.hash(id); }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Product other = (Product) obj;
        return Objects.equals(id, other.id);
    }
    @Override
public String toString() {
    return String.format("{ID: %d, Tên: %s, Giá: %.0fđ, Ảnh: %s, Mô tả: %s}", 
                         id, name, price, imgUrl, description);
}
}
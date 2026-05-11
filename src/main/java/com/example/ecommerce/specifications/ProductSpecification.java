package com.example.ecommerce.specifications;

import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.example.ecommerce.entities.Product;

import jakarta.persistence.criteria.Join;

public class ProductSpecification {

    public static Specification<Product> hasNameContaining(String keyword) {
        return (root, query, criteriaBuilder) ->
            criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), "%" + keyword.toLowerCase() + "%");
    }

    public static Specification<Product> hasPriceBetween(Double minPrice, Double maxPrice) {
        return (root, query, criteriaBuilder) ->
            criteriaBuilder.between(root.get("price"), minPrice, maxPrice);
    }

    public static Specification<Product> hasCategoryIn(List<Long> categoryIds) {
        return (root, query, criteriaBuilder) -> {
            Join<Object, Object> categoryJoin = root.join("categories");
            return categoryJoin.get("id").in(categoryIds);
        };
    }
    
    public static Specification<Product> hasColor(String color) {
        return (root, query, criteriaBuilder) -> {
            Join<Object, Object> variantJoin = root.join("variants");
            return criteriaBuilder.equal(criteriaBuilder.lower(variantJoin.get("color")), color.toLowerCase());
        };
    }

    public static Specification<Product> hasBrand(String brand) {
        return (root, query, criteriaBuilder) ->
            criteriaBuilder.equal(criteriaBuilder.lower(root.get("brand")), brand.toLowerCase());
    }

    public static Specification<Product> hasSize(String size) {
        return (root, query, criteriaBuilder) -> {
            Join<Object, Object> variantJoin = root.join("variants");
            Join<Object, Object> sizeJoin = variantJoin.join("productSizes");
            return criteriaBuilder.equal(sizeJoin.get("size"), size);
        };
    }
}
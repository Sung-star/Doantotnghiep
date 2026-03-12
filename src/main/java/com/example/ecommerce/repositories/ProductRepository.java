package com.example.ecommerce.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.ecommerce.entities.Product;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);

    // dynamic filter query for name, color, brand (null parameters ignored)
    @Query("SELECT p FROM Product p WHERE " +
           "(:name IS NULL OR lower(p.name) LIKE lower(concat('%',:name,'%'))) AND " +
           "(:color IS NULL OR lower(p.color) LIKE lower(concat('%',:color,'%'))) AND " +
           "(:brand IS NULL OR lower(p.brand) LIKE lower(concat('%',:brand,'%')))" )
    Page<Product> findByFilters(@Param("name") String name,
                                @Param("color") String color,
                                @Param("brand") String brand,
                                Pageable pageable);

    // Phương thức mới để tìm các phiên bản màu khác
    List<Product> findByNameAndIdNot(String name, Long id);
}
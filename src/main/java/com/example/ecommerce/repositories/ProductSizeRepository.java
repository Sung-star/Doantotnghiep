package com.example.ecommerce.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.example.ecommerce.entities.ProductSize;
import java.util.Optional;

@Repository
public interface ProductSizeRepository extends JpaRepository<ProductSize, Long> {
    
    // --- ĐÃ SỬA: Tìm theo tên size (String) thay vì ID ---
    // ps.size ở đây tham chiếu đến field "String size" trong ProductSize.java
    @Query("SELECT ps FROM ProductSize ps WHERE ps.product.id = :productId AND ps.size = :sizeName")
    Optional<ProductSize> findByProductAndSize(@Param("productId") Long productId, @Param("sizeName") String sizeName);
}
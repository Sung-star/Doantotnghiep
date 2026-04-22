package com.example.ecommerce.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ecommerce.entities.Order;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderRepository extends JpaRepository<Order, Long>{
    @Query("SELECT COUNT(o) > 0 FROM Order o JOIN o.items i WHERE o.client.id = :userId AND i.product.id = :productId AND o.orderStatus IN (4, 5, 7)")
    boolean hasUserBoughtProduct(@Param("userId") Long userId, @Param("productId") Long productId);
}

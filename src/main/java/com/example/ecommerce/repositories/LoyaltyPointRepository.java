package com.example.ecommerce.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.ecommerce.entities.LoyaltyPoint;
import com.example.ecommerce.entities.User;

@Repository
public interface LoyaltyPointRepository extends JpaRepository<LoyaltyPoint, Long> {
    Optional<LoyaltyPoint> findByUser(User user);
    Optional<LoyaltyPoint> findByUserId(Long userId);
}

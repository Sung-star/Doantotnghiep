package com.example.ecommerce.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.ecommerce.entities.LoyaltyTier;

@Repository
public interface LoyaltyTierRepository extends JpaRepository<LoyaltyTier, Long> {
    Optional<LoyaltyTier> findByName(String name);
    
    // Tìm tier phù hợp dựa vào điểm
    Optional<LoyaltyTier> findFirstByMinPointsLessThanEqualOrderByMinPointsDesc(Long points);
}

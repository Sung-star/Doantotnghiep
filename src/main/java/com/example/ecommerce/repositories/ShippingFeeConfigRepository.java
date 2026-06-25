package com.example.ecommerce.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.ecommerce.entities.District;
import com.example.ecommerce.entities.ShippingFeeConfig;

@Repository
public interface ShippingFeeConfigRepository extends JpaRepository<ShippingFeeConfig, Long> {
    
    // Tìm config phí vận chuyển theo district
    List<ShippingFeeConfig> findByDistrictAndIsActiveTrue(District district);
    
    List<ShippingFeeConfig> findByIsActiveTrue();
}

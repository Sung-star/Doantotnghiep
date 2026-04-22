package com.example.ecommerce.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.ecommerce.entities.District;
import java.util.List;

public interface DistrictRepository extends JpaRepository<District, Long> {
    List<District> findByProvinceId(Long provinceId);
}

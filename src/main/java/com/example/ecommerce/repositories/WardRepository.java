package com.example.ecommerce.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.ecommerce.entities.Ward;
import java.util.List;

public interface WardRepository extends JpaRepository<Ward, Long> {
    List<Ward> findByDistrictId(Long districtId);
}

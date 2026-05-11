package com.example.ecommerce.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.ecommerce.entities.Province;

public interface ProvinceRepository extends JpaRepository<Province, Long> {}

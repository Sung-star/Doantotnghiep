package com.example.ecommerce.repositories;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.example.ecommerce.entities.Product;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);

    @Override
    @EntityGraph(attributePaths = {"categories", "variants.productSizes"})
    Optional<Product> findById(Long id);

    @Override
    @EntityGraph(attributePaths = {"categories", "variants.productSizes"})
    Page<Product> findAll(Pageable pageable);

    @Override
    @EntityGraph(attributePaths = {"categories", "variants.productSizes"})
    Page<Product> findAll(org.springframework.data.jpa.domain.Specification<Product> spec, Pageable pageable);
}
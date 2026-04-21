package com.example.ecommerce;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import com.example.ecommerce.repositories.ProductRepository;
import com.example.ecommerce.repositories.UserRepository;
import com.example.ecommerce.repositories.ProductVariantRepository;

@SpringBootTest
class CheckData {

    @Autowired private ProductRepository productRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private ProductVariantRepository variantRepository;

    @Test
    @Transactional
    void checkCounts() {
        System.out.println("USER COUNT: " + userRepository.count());
        System.out.println("PRODUCT COUNT: " + productRepository.count());
        System.out.println("VARIANT COUNT: " + variantRepository.count());
        
        productRepository.findAll().forEach(p -> {
            System.out.println("Product: " + p.getName() + " (ID: " + p.getId() + ")");
            System.out.println("  Variants: " + p.getVariants().size());
            p.getVariants().forEach(v -> {
                System.out.println("    Variant Color: " + v.getColor() + " (ID: " + v.getId() + ")");
                System.out.println("      Sizes: " + v.getProductSizes().size());
            });
        });
    }
}

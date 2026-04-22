package com.example.ecommerce.resources;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.ecommerce.entities.ProductSize;
import com.example.ecommerce.repositories.ProductSizeRepository;

import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping(value = "/api/product-sizes")
public class ProductSizeResource {

    @Autowired
    private ProductSizeRepository repository;

    @PutMapping(value = "/{id}")
    public ResponseEntity<ProductSize> updateQuantity(@PathVariable Long id, @RequestBody Map<String, Integer> payload) {
        ProductSize ps = repository.findById(id).orElseThrow(() -> new RuntimeException("Size not found"));
        if (payload.containsKey("quantity")) {
            ps.setQuantity(payload.get("quantity"));
        }
        ps = repository.save(ps);
        return ResponseEntity.ok().body(ps);
    }
}

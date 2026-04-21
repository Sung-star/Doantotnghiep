package com.example.ecommerce.resources;

import com.example.ecommerce.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/debug")
public class DebugResource {
    @Autowired
    private ProductRepository productRepository;

    @GetMapping("/count")
    public long count() {
        return productRepository.count();
    }
}

package com.example.ecommerce.resources;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.ecommerce.entities.Product;
import com.example.ecommerce.services.GeminiService;
import com.example.ecommerce.services.ProductService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping(value = "/api/search")
public class SearchResource {

    @Autowired
    private GeminiService geminiService;

    @Autowired
    private ProductService productService;

    @GetMapping(value = "/ai")
    public ResponseEntity<Page<Product>> aiSearch(@RequestParam String query, Pageable pageable) {
        Map<String, Object> params = geminiService.parseSearchQuery(query);
        
        String keyword = (String) params.get("keyword");
        Double minPrice = params.get("minPrice") != null ? Double.valueOf(params.get("minPrice").toString()) : null;
        Double maxPrice = params.get("maxPrice") != null ? Double.valueOf(params.get("maxPrice").toString()) : null;
        String color = (String) params.get("color");
        String brand = (String) params.get("brand");
        String size = (String) params.get("size");

        Page<Product> result = productService.findWithDynamicFilter(keyword, null, minPrice, maxPrice, color, brand, size, pageable);
        return ResponseEntity.ok().body(result);
    }
}

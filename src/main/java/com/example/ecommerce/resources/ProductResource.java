package com.example.ecommerce.resources;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.ecommerce.entities.Product;
import com.example.ecommerce.services.ProductService;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping(value = "/products")
public class ProductResource {
    
    @Autowired
    private ProductService service;
    
    @GetMapping
public ResponseEntity<Page<Product>> findAll(
        @RequestParam(value = "name", required = false) String name,
        @RequestParam(value = "color", required = false) String color,
        @RequestParam(value = "brand", required = false) String brand,
        @PageableDefault(sort = "id", direction = Sort.Direction.ASC, size = 12) Pageable pageable) {
    
    // Các filter sẽ được xử lý trong service
    if ((name != null && !name.trim().isEmpty()) ||
        (color != null && !color.trim().isEmpty()) ||
        (brand != null && !brand.trim().isEmpty())) {
        return ResponseEntity.ok().body(service.findByFilters(name, color, brand, pageable));
    }
    
    return ResponseEntity.ok().body(service.findAll(pageable));
}
    
    @GetMapping(value = "/{id}")
    public ResponseEntity<Product> findById(@PathVariable Long id){
         return ResponseEntity.ok().body(service.findById(id));
    }

    // --- Endpoint mới để lấy các phiên bản màu khác ---
    @GetMapping(value = "/{id}/variants")
    public ResponseEntity<List<Product>> findVariants(@PathVariable Long id) {
        return ResponseEntity.ok().body(service.findVariants(id));
    }

    @PostMapping
    public ResponseEntity<Product> insert(@RequestBody Product obj) {
        return ResponseEntity.ok().body(service.insert(obj));
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<Product> update(@PathVariable Long id, @RequestBody Product obj) {
        return ResponseEntity.ok().body(service.update(id, obj));
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
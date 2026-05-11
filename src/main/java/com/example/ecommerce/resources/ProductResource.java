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
import com.example.ecommerce.entities.ProductVariant;
import com.example.ecommerce.services.ProductService;

import java.util.List;
import java.util.Set;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping(value = "/api/products")
public class ProductResource {
    
    @Autowired
    private ProductService service;
    
    @GetMapping
    public ResponseEntity<Page<Product>> findAll(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "categoryIds", required = false) List<Long> categoryIds,
            @RequestParam(value = "minPrice", required = false) Double minPrice,
            @RequestParam(value = "maxPrice", required = false) Double maxPrice,
            @RequestParam(value = "color", required = false) String color,
            @RequestParam(value = "productSize", required = false) String productSize, // ĐỔI TÊN Ở ĐÂY
            @PageableDefault(sort = "id", direction = Sort.Direction.ASC, size = 12) Pageable pageable) {

        // Kiểm tra nếu không có tham số lọc thực sự nào (trừ phân trang)
        if (keyword == null && categoryIds == null && minPrice == null && maxPrice == null && color == null && productSize == null) {
            return ResponseEntity.ok().body(service.findAll(pageable));
        }

        return ResponseEntity.ok().body(service.findWithDynamicFilter(keyword, categoryIds, minPrice, maxPrice, color, null, productSize, pageable));
    }
    
    @GetMapping(value = "/{id}")
    public ResponseEntity<Product> findById(@PathVariable("id") Long id){
         return ResponseEntity.ok().body(service.findById(id));
    }

    @GetMapping(value = "/{id}/variants")
    public ResponseEntity<Set<ProductVariant>> findVariants(@PathVariable("id") Long id) {
        return ResponseEntity.ok().body(service.findVariants(id));
    }

    @PostMapping
    public ResponseEntity<Product> insert(@RequestBody Product obj) {
        return ResponseEntity.ok().body(service.insert(obj));
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<Product> update(@PathVariable("id") Long id, @RequestBody Product obj) {
        return ResponseEntity.ok().body(service.update(id, obj));
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
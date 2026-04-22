package com.example.ecommerce.resources;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ecommerce.entities.Review;
import com.example.ecommerce.services.ReviewService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping(value = "/api/reviews")
public class ReviewResource {

    @Autowired
    private ReviewService service;

    @GetMapping
    public ResponseEntity<List<Review>> findAll() {
        List<Review> list = service.findAll();
        return ResponseEntity.ok().body(list);
    }

    @GetMapping(value = "/product/{productId}")
    public ResponseEntity<List<Review>> findByProductId(@PathVariable Long productId) {
        List<Review> list = service.findByProductId(productId);
        return ResponseEntity.ok().body(list);
    }

    @PostMapping
    public ResponseEntity<Review> insert(@RequestBody Review obj) {
        obj = service.insert(obj);
        return ResponseEntity.ok().body(obj);
    }

    @GetMapping(value = "/can-review/{productId}/user/{userId}")
    public ResponseEntity<Boolean> canReview(@PathVariable Long productId, @PathVariable Long userId) {
        return ResponseEntity.ok(service.canUserReview(userId, productId));
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}

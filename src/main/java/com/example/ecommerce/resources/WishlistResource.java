package com.example.ecommerce.resources;

import java.net.URI;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.example.ecommerce.entities.Wishlist;
import com.example.ecommerce.services.WishlistService;

@RestController
@RequestMapping(value = "/api/Wishlist")
public class WishlistResource {

    @Autowired
    private WishlistService service;

    @GetMapping(value = "/user/{userId}")
    public ResponseEntity<List<Wishlist>> findByUserId(@PathVariable Long userId) {
        List<Wishlist> list = service.findByUserId(userId);
        return ResponseEntity.ok().body(list);
    }

    @PostMapping
    public ResponseEntity<Wishlist> insert(@RequestBody Map<String, Long> payload) {
        Long userId = payload.get("userId");
        Long productId = payload.get("productId");
        
        Wishlist obj = service.addProductToWishlist(userId, productId);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(obj.getId()).toUri();
        return ResponseEntity.created(uri).body(obj);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}

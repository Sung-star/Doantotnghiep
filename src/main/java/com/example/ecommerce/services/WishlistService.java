package com.example.ecommerce.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.ecommerce.entities.Product;
import com.example.ecommerce.entities.User;
import com.example.ecommerce.entities.Wishlist;
import com.example.ecommerce.repositories.ProductRepository;
import com.example.ecommerce.repositories.UserRepository;
import com.example.ecommerce.repositories.WishlistRepository;
import com.example.ecommerce.services.exceptions.ResourceNotFoundException;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository repository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProductRepository productRepository;

    @Transactional(readOnly = true)
    public List<Wishlist> findByUserId(Long userId) {
        return repository.findByUserId(userId);
    }

    @Transactional
    public Wishlist addProductToWishlist(Long userId, Long productId) {
        Optional<Wishlist> existing = repository.findByUserIdAndProductId(userId, productId);
        if (existing.isPresent()) {
            return existing.get();
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
                
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        wishlist.setProduct(product);
        
        return repository.save(wishlist);
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Wishlist item not found with id: " + id);
        }
        repository.deleteById(id);
    }
}

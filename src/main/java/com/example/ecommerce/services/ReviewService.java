package com.example.ecommerce.services;

import java.time.Instant;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.ecommerce.entities.Review;
import com.example.ecommerce.repositories.ReviewRepository;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository repository;

    public List<Review> findByProductId(Long productId) {
        return repository.findByProductId(productId);
    }

    @Transactional
    public Review insert(Review obj) {
        obj.setMoment(Instant.now());
        return repository.save(obj);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}

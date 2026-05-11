package com.example.ecommerce.services;

import java.time.Instant;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.ecommerce.entities.Review;
import com.example.ecommerce.repositories.ReviewRepository;
import com.example.ecommerce.repositories.OrderRepository;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository repository;

    @Autowired
    private OrderRepository orderRepository;

    public List<Review> findAll() {
        return repository.findAll();
    }

    public List<Review> findByProductId(Long productId) {
        return repository.findByProductId(productId);
    }

    public boolean canUserReview(Long userId, Long productId) {
        return orderRepository.hasUserBoughtProduct(userId, productId);
    }

    @Transactional
    public Review insert(Review obj) {
        if (!canUserReview(obj.getUser().getId(), obj.getProduct().getId())) {
            throw new RuntimeException("Bạn chỉ có thể đánh giá sản phẩm sau khi đã mua và nhận hàng thành công!");
        }
        obj.setMoment(Instant.now());
        return repository.save(obj);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}

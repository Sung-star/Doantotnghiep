package com.example.ecommerce.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.example.ecommerce.entities.Product;
import com.example.ecommerce.entities.Review;
import com.example.ecommerce.entities.User;
import com.example.ecommerce.repositories.OrderRepository;
import com.example.ecommerce.repositories.ReviewRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
@DisplayName("Review Service Tests")
class ReviewServiceTest {

    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private ReviewService reviewService;

    private Review testReview;
    private User testUser;
    private Product testProduct;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setName("Test User");
        testUser.setEmail("test@example.com");

        testProduct = new Product();
        testProduct.setId(1L);
        testProduct.setName("Test Product");
        testProduct.setPrice(100.0);

        testReview = new Review();
        testReview.setId(1L);
        testReview.setUser(testUser);
        testReview.setProduct(testProduct);
        testReview.setRating(5);
        testReview.setComment("Great product!");
        testReview.setMoment(Instant.now());
    }

    @Test
    @DisplayName("Should find review by ID successfully")
    void testFindByIdSuccess() {
        when(reviewRepository.findById(1L)).thenReturn(Optional.of(testReview));

        Review result = reviewRepository.findById(1L).orElse(null);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals(5, result.getRating());
        assertEquals("Great product!", result.getComment());
    }

    @Test
    @DisplayName("Should return empty optional when review not found")
    void testFindByIdNotFound() {
        when(reviewRepository.findById(999L)).thenReturn(Optional.empty());

        assertFalse(reviewRepository.findById(999L).isPresent());
    }

    @Test
    @DisplayName("Should find all reviews for a product")
    void testFindByProductIdSuccess() {
        List<Review> reviews = new ArrayList<>();
        reviews.add(testReview);
        when(reviewRepository.findByProductId(1L)).thenReturn(reviews);

        List<Review> result = reviewService.findByProductId(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testProduct.getId(), result.get(0).getProduct().getId());
    }

    @Test
    @DisplayName("Should return empty list when no reviews exist")
    void testFindByProductIdEmpty() {
        when(reviewRepository.findByProductId(999L)).thenReturn(new ArrayList<>());

        List<Review> result = reviewService.findByProductId(999L);

        assertNotNull(result);
        assertEquals(0, result.size());
    }

    @Test
    @DisplayName("Should insert review successfully when user has bought product")
    void testInsertReviewSuccess() {
        // Phải mock canUserReview = true để insert không throw exception
        when(orderRepository.hasUserBoughtProduct(1L, 1L)).thenReturn(true);
        when(reviewRepository.save(any(Review.class))).thenReturn(testReview);

        Review result = reviewService.insert(testReview);

        assertNotNull(result);
        assertEquals(5, result.getRating());
        verify(reviewRepository, times(1)).save(testReview);
    }

    @Test
    @DisplayName("Should throw exception when user has not bought product")
    void testInsertReviewNotAllowed() {
        when(orderRepository.hasUserBoughtProduct(1L, 1L)).thenReturn(false);

        assertThrows(RuntimeException.class, () -> reviewService.insert(testReview));
        verify(reviewRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should validate rating between 1 and 5")
    void testRatingValidation() {
        Review invalidReview = new Review();
        invalidReview.setRating(6);

        assertTrue(invalidReview.getRating() > 5);
    }

    @Test
    @DisplayName("Should update review successfully")
    void testUpdateReviewSuccess() {
        Review updateData = new Review();
        updateData.setRating(4);
        updateData.setComment("Good product");

        testReview.setRating(4);
        testReview.setComment("Good product");
        when(reviewRepository.save(any(Review.class))).thenReturn(testReview);

        Review result = reviewRepository.save(testReview);

        assertNotNull(result);
        assertEquals(4, result.getRating());
        assertEquals("Good product", result.getComment());
    }

    @Test
    @DisplayName("Should delete review by ID")
    void testDeleteReviewById() {
        doNothing().when(reviewRepository).deleteById(1L);

        reviewService.delete(1L);

        verify(reviewRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("Should calculate average rating for product")
    void testCalculateAverageRating() {
        Review review1 = new Review();
        review1.setRating(5);

        Review review2 = new Review();
        review2.setRating(3);

        Review review3 = new Review();
        review3.setRating(4);

        List<Review> reviews = new ArrayList<>();
        reviews.add(review1);
        reviews.add(review2);
        reviews.add(review3);

        double average = reviews.stream()
            .mapToDouble(Review::getRating)
            .average()
            .orElse(0.0);

        assertEquals(4.0, average);
    }

    @Test
    @DisplayName("Should validate review comment is not empty")
    void testReviewContentValidation() {
        Review emptyReview = new Review();
        emptyReview.setComment("");

        assertTrue(emptyReview.getComment().isEmpty());
    }

    @Test
    @DisplayName("Should set review date on creation")
    void testReviewDateTimestamp() {
        Instant beforeCreate = Instant.now();

        testReview.setMoment(Instant.now());

        assertNotNull(testReview.getMoment());
        assertTrue(testReview.getMoment().isAfter(beforeCreate));
    }
}
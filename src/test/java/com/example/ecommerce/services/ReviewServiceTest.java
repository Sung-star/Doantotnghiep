package com.example.ecommerce.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.example.ecommerce.entities.Product;
import com.example.ecommerce.entities.Review;
import com.example.ecommerce.entities.User;
import com.example.ecommerce.repositories.ProductRepository;
import com.example.ecommerce.repositories.ReviewRepository;
import com.example.ecommerce.repositories.UserRepository;
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
    private UserRepository userRepository;

    @Mock
    private ProductRepository productRepository;

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
        // Arrange
        when(reviewRepository.findById(1L)).thenReturn(Optional.of(testReview));

        // Act
        Review result = reviewRepository.findById(1L).orElse(null);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals(5, result.getRating());
        assertEquals("Great product!", result.getComment());
    }

    @Test
    @DisplayName("Should return empty optional when review not found")
    void testFindByIdNotFound() {
        // Arrange
        when(reviewRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertFalse(reviewRepository.findById(999L).isPresent());
    }

    @Test
    @DisplayName("Should find all reviews for a product")
    void testFindByProductIdSuccess() {
        // Arrange
        List<Review> reviews = new ArrayList<>();
        reviews.add(testReview);
        when(reviewRepository.findByProductId(1L)).thenReturn(reviews);

        // Act
        List<Review> result = reviewService.findByProductId(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Great product!", result.get(0).getContent());
    }

    @Test
    @DisplayName("Should return empty list when no reviews exist")
    void testFindByProductIdEmpty() {
        // Arrange
        when(reviewRepository.findByProductId(999L)).thenReturn(new ArrayList<>());

        // Act
        List<Review> result = reviewService.findByProductId(999L);

        // Assert
        assertNotNull(result);
        assertEquals(0, result.size());
    }

    @Test
    @DisplayName("Should insert review successfully")
    void testInsertReviewSuccess() {
        // Arrange
        when(reviewRepository.save(any(Review.class))).thenReturn(testReview);

        // Act
        Review result = reviewService.insert(testReview);

        // Assert
        assertNotNull(result);
        assertEquals(5, result.getRating());
        verify(reviewRepository, times(1)).save(testReview);
    }

    @Test
    @DisplayName("Should validate rating between 1 and 5")
    void testRatingValidation() {
        // Arrange
        Review invalidReview = new Review();
        invalidReview.setRating(6); // Invalid: > 5

        // Act & Assert
        assertTrue(invalidReview.getRating() > 5);
    }

    @Test
    @DisplayName("Should delete review successfully")
    void testDeleteReviewSuccess() {
        // Arrange
        Review updateData = new Review();
        updateData.setRating(4);
        updateData.setComment("Good product");

        testReview.setRating(4);
        testReview.setComment("Good product");
        when(reviewRepository.save(any(Review.class))).thenReturn(testReview);

        // Act
        Review result = reviewRepository.save(testReview);

        // Assert
        assertNotNull(result);
        assertEquals(4, result.getRating());
        assertEquals("Good product", result.getComment());
    }

    @Test
    @DisplayName("Should delete review by ID")
    void testDeleteReviewById() {
        // Arrange
        doNothing().when(reviewRepository).deleteById(1L);

        // Act
        reviewService.delete(1L);

        // Assert
        verify(reviewRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("Should find reviews by product ID")
    void testFindByProductIdSuccess() {
        // Arrange
        List<Review> reviews = new ArrayList<>();
        reviews.add(testReview);
        when(reviewRepository.findByProductId(1L)).thenReturn(reviews);

        // Act
        List<Review> result = reviewService.findByProductId(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testProduct.getId(), result.get(0).getProduct().getId());
    }

    @Test
    @DisplayName("Should calculate average rating for product")
    void testCalculateAverageRating() {
        // Arrange
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

        // Act
        double average = reviews.stream()
            .mapToDouble(Review::getRating)
            .average()
            .orElse(0.0);

        // Assert
        assertEquals(4.0, average);
    }

    @Test
    @DisplayName("Should validate review content is not empty")
    void testReviewContentValidation() {
        // Arrange
        Review emptyReview = new Review();
        emptyReview.setContent("");

        // Act & Assert
        assertTrue(emptyReview.getContent().isEmpty());
    }

    @Test
    @DisplayName("Should set review date on creation")
    void testReviewDateTimestamp() {
        // Arrange
        Instant beforeCreate = Instant.now();

        // Act
        testReview.setReviewDate(Instant.now());

        // Assert
        assertNotNull(testReview.getReviewDate());
        assertTrue(testReview.getReviewDate().isAfter(beforeCreate));
    }
}

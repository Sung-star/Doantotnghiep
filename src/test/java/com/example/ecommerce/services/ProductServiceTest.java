package com.example.ecommerce.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import com.example.ecommerce.entities.Category;
import com.example.ecommerce.entities.Product;
import com.example.ecommerce.entities.ProductVariant;
import com.example.ecommerce.entities.SizeType;
import com.example.ecommerce.repositories.ProductRepository;
import com.example.ecommerce.repositories.ProductSizeRepository;

@ExtendWith(MockitoExtension.class)
@DisplayName("Product Service Tests")
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ProductSizeRepository sizeRepository;

    @Mock
    private CategoryService categoryService;

    @InjectMocks
    private ProductService productService;

    private Product testProduct;
    private ProductVariant testVariant;

    @BeforeEach
    void setUp() {
        testProduct = new Product();
        testProduct.setId(1L);
        testProduct.setName("Test Product");
        testProduct.setPrice(500.0);
        testProduct.setDescription("Test Description");
        testProduct.setBrand("Adidas");
        testProduct.setImgUrl("http://example.com/img.jpg");

        testVariant = new ProductVariant();
        testVariant.setId(1L);
        testVariant.setColor("Red");
        testVariant.setProduct(testProduct);
        testProduct.setVariants(new java.util.HashSet<>());
        testProduct.getVariants().add(testVariant);
    }

    @Test
    @DisplayName("Should find product by ID successfully")
    void testFindByIdSuccess() {
        // Arrange
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));

        // Act
        Product result = productService.findById(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Test Product", result.getName());
        assertEquals(500.0, result.getPrice());
        verify(productRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Should throw exception when product not found")
    void testFindByIdNotFound() {
        // Arrange
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            productService.findById(999L);
        });
        assertEquals("Không tìm thấy sản phẩm", exception.getMessage());
    }

    @Test
    @DisplayName("Should find all products with pagination")
    void testFindAllPaginated() {
        // Arrange
        List<Product> products = new ArrayList<>();
        products.add(testProduct);
        Page<Product> productPage = new PageImpl<>(products, PageRequest.of(0, 10), 1);
        when(productRepository.findAll(any(org.springframework.data.domain.Pageable.class))).thenReturn(productPage);

        // Act
        Page<Product> result = productService.findAll(PageRequest.of(0, 10));

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("Test Product", result.getContent().get(0).getName());
    }

    @Test
    @DisplayName("Should insert product with default brand")
    void testInsertProductWithDefaultBrand() {
        // Arrange
        Product newProduct = new Product();
        newProduct.setName("New Product");
        newProduct.setPrice(300.0);
        newProduct.setCategories(new java.util.HashSet<>());
        when(productRepository.save(any())).thenReturn(newProduct);

        // Act
        Product result = productService.insert(newProduct);

        // Assert
        assertNotNull(result);
        assertEquals("Adidas", result.getBrand());
        verify(productRepository, times(1)).save(any());
    }

    @Test
    @DisplayName("Should set ALPHA size type for clothing")
    void testAutoSetSizeTypeAlpha() {
        // Arrange
        Category category = new Category();
        category.setName("Áo Sơ Mi");
        testProduct.setCategories(java.util.Set.of(category));
        when(productRepository.save(any())).thenReturn(testProduct);

        // Act
        Product result = productService.insert(testProduct);

        // Assert
        assertEquals(SizeType.ALPHA, result.getSizeType());
    }

    @Test
    @DisplayName("Should set NUMERIC size type for shoes")
    void testAutoSetSizeTypeNumeric() {
        // Arrange
        Category category = new Category();
        category.setName("Giày Chạy Bộ");
        testProduct.setCategories(java.util.Set.of(category));
        when(productRepository.save(any())).thenReturn(testProduct);

        // Act
        Product result = productService.insert(testProduct);

        // Assert
        assertEquals(SizeType.NUMERIC, result.getSizeType());
    }

    @Test
    @DisplayName("Should update product successfully")
    void testUpdateProductSuccess() {
        // Arrange
        Product updateProduct = new Product();
        updateProduct.setName("Updated Product");
        updateProduct.setPrice(600.0);
        updateProduct.setDescription("Updated Description");

        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));
        when(productRepository.save(any())).thenReturn(testProduct);

        // Act
        Product result = productService.update(1L, updateProduct);

        // Assert
        assertNotNull(result);
        assertEquals("Updated Product", result.getName());
        assertEquals(600.0, result.getPrice());
    }

    @Test
    @DisplayName("Should delete product successfully")
    void testDeleteProductSuccess() {
        // Arrange
        doNothing().when(productRepository).deleteById(1L);

        // Act
        productService.delete(1L);

        // Assert
        verify(productRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("Should find product variants")
    void testFindVariants() {
        // Arrange
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));

        // Act
        var variants = productService.findVariants(1L);

        // Assert
        assertNotNull(variants);
        assertEquals(1, variants.size());
        assertTrue(variants.contains(testVariant));
    }
}

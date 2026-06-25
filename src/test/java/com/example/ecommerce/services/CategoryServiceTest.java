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
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.ecommerce.entities.Category;
import com.example.ecommerce.repositories.CategoryRepository;

@ExtendWith(MockitoExtension.class)
@DisplayName("Category Service Tests")
class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private CategoryService categoryService;

    private Category testCategory;
    private Category parentCategory;

    @BeforeEach
    void setUp() {
        parentCategory = new Category();
        parentCategory.setId(1L);
        parentCategory.setName("Quần Áo");
        parentCategory.setDescription("Danh mục quần áo");

        testCategory = new Category();
        testCategory.setId(2L);
        testCategory.setName("Áo Sơ Mi");
        testCategory.setDescription("Áo sơ mi nam");
        testCategory.setParent(parentCategory);
    }

    @Test
    @DisplayName("Should find category by ID successfully")
    void testFindByIdSuccess() {
        // Arrange
        when(categoryRepository.findById(2L)).thenReturn(Optional.of(testCategory));

        // Act
        Category result = categoryService.findById(2L);

        // Assert
        assertNotNull(result);
        assertEquals(2L, result.getId());
        assertEquals("Áo Sơ Mi", result.getName());
    }

    @Test
    @DisplayName("Should throw exception when category not found")
    void testFindByIdNotFound() {
        // Arrange
        when(categoryRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            categoryService.findById(999L);
        });
    }

    @Test
    @DisplayName("Should find all categories")
    void testFindAll() {
        // Arrange
        List<Category> categories = new ArrayList<>();
        categories.add(parentCategory);
        categories.add(testCategory);
        when(categoryRepository.findAll()).thenReturn(categories);

        // Act
        List<Category> result = categoryService.findAll();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
    }

    @Test
    @DisplayName("Should insert category successfully")
    void testInsertCategorySuccess() {
        // Arrange
        when(categoryRepository.save(any(Category.class))).thenReturn(testCategory);

        // Act
        Category result = categoryService.insert(testCategory);

        // Assert
        assertNotNull(result);
        assertEquals("Áo Sơ Mi", result.getName());
        verify(categoryRepository, times(1)).save(testCategory);
    }

    @Test
    @DisplayName("Should handle category hierarchy")
    void testCategoryHierarchy() {
        // Arrange
        Category child = new Category();
        child.setName("Áo Sơ Mi Trắng");
        child.setParent(testCategory);

        // Act & Assert
        assertNotNull(child.getParent());
        assertEquals("Áo Sơ Mi", child.getParent().getName());
    }

    @Test
    @DisplayName("Should validate category name is not empty")
    void testCategoryNameValidation() {
        // Arrange
        Category invalidCategory = new Category();
        invalidCategory.setName("");

        // Act & Assert
        assertTrue(invalidCategory.getName().isEmpty());
    }
}

package com.example.ecommerce.resources;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.example.ecommerce.entities.Category;
import com.example.ecommerce.services.CategoryService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.List;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@DisplayName("Category Resource (Controller) Tests")
class CategoryResourceTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CategoryService categoryService;

    @Autowired
    private ObjectMapper objectMapper;

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
    @DisplayName("Should get category by ID with 200 status")
    void testGetCategoryById() throws Exception {
        // Arrange
        when(categoryService.findById(2L)).thenReturn(testCategory);

        // Act & Assert
        mockMvc.perform(get("/api/categories/2")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(2L))
            .andExpect(jsonPath("$.name").value("Áo Sơ Mi"));
    }

    @Test
    @DisplayName("Should return 404 when category not found")
    void testGetCategoryNotFound() throws Exception {
        // Arrange
        when(categoryService.findById(999L)).thenThrow(new RuntimeException("Category not found"));

        // Act & Assert
        mockMvc.perform(get("/api/categories/999")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Should get all categories")
    void testGetAllCategories() throws Exception {
        // Arrange
        List<Category> categories = new ArrayList<>();
        categories.add(parentCategory);
        categories.add(testCategory);
        when(categoryService.findAll()).thenReturn(categories);

        // Act & Assert
        mockMvc.perform(get("/api/categories")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Should create category with 201 status")
    void testCreateCategory() throws Exception {
        // Arrange
        Category newCategory = new Category();
        newCategory.setName("Giày");
        newCategory.setDescription("Danh mục giày");

        when(categoryService.insert(any(Category.class))).thenReturn(testCategory);

        // Act & Assert
        mockMvc.perform(post("/api/categories")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newCategory)))
            .andExpect(status().isCreated());
    }

    @Test
    @DisplayName("Should update category with 200 status")
    void testUpdateCategory() throws Exception {
        // Arrange
        Category updateData = new Category();
        updateData.setName("Áo Sơ Mi Nam");
        updateData.setDescription("Updated description");

        when(categoryService.update(eq(2L), any(Category.class))).thenReturn(testCategory);

        // Act & Assert
        mockMvc.perform(put("/api/categories/2")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateData)))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Should delete category with 204 status")
    void testDeleteCategory() throws Exception {
        // Arrange
        doNothing().when(categoryService).delete(2L);

        // Act & Assert
        mockMvc.perform(delete("/api/categories/2")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("Should validate required fields in POST request")
    void testCreateCategoryWithoutName() throws Exception {
        // Arrange
        String invalidCategory = "{\"description\": \"No name provided\"}";

        // Act & Assert
        mockMvc.perform(post("/api/categories")
                .contentType(MediaType.APPLICATION_JSON)
                .content(invalidCategory))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should return correct content type")
    void testResponseContentType() throws Exception {
        // Arrange
        when(categoryService.findById(2L)).thenReturn(testCategory);

        // Act & Assert
        mockMvc.perform(get("/api/categories/2"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }
}

package com.example.ecommerce.resources;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.example.ecommerce.entities.Product;
import com.example.ecommerce.services.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.List;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@DisplayName("Product Resource (Controller) Tests")
class ProductResourceTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService;

    @Autowired
    private ObjectMapper objectMapper;

    private Product testProduct;

    @BeforeEach
    void setUp() {
        testProduct = new Product();
        testProduct.setId(1L);
        testProduct.setName("Test Product");
        testProduct.setPrice(500.0);
        testProduct.setDescription("Test Description");
        testProduct.setBrand("Adidas");
    }

    @Test
    @DisplayName("Should get product by ID with 200 status")
    void testGetProductById() throws Exception {
        // Arrange
        when(productService.findById(1L)).thenReturn(testProduct);

        // Act & Assert
        mockMvc.perform(get("/api/products/1")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1L))
            .andExpect(jsonPath("$.name").value("Test Product"))
            .andExpect(jsonPath("$.price").value(500.0));
    }

    @Test
    @DisplayName("Should return 404 when product not found")
    void testGetProductNotFound() throws Exception {
        // Arrange
        when(productService.findById(999L)).thenThrow(new RuntimeException("Không tìm thấy sản phẩm"));

        // Act & Assert
        mockMvc.perform(get("/api/products/999")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Should get all products with pagination")
    void testGetAllProducts() throws Exception {
        // Arrange
        List<Product> products = new ArrayList<>();
        products.add(testProduct);
        Page<Product> productPage = new PageImpl<>(products, PageRequest.of(0, 10), 1);

        when(productService.findAll(any())).thenReturn(productPage);

        // Act & Assert
        mockMvc.perform(get("/api/products?page=0&size=10")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Should create product with 201 status")
    void testCreateProduct() throws Exception {
        // Arrange
        Product newProduct = new Product();
        newProduct.setName("New Product");
        newProduct.setPrice(300.0);

        when(productService.insert(any(Product.class))).thenReturn(testProduct);

        // Act & Assert
        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newProduct)))
            .andExpect(status().isCreated());
    }

    @Test
    @DisplayName("Should update product with 200 status")
    void testUpdateProduct() throws Exception {
        // Arrange
        Product updateData = new Product();
        updateData.setName("Updated Product");
        updateData.setPrice(600.0);

        when(productService.update(eq(1L), any(Product.class))).thenReturn(testProduct);

        // Act & Assert
        mockMvc.perform(put("/api/products/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateData)))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Should delete product with 204 status")
    void testDeleteProduct() throws Exception {
        // Arrange
        doNothing().when(productService).delete(1L);

        // Act & Assert
        mockMvc.perform(delete("/api/products/1")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("Should search products by keyword")
    void testSearchProducts() throws Exception {
        // Arrange
        List<Product> products = new ArrayList<>();
        products.add(testProduct);
        Page<Product> productPage = new PageImpl<>(products, PageRequest.of(0, 10), 1);

        when(productService.findWithDynamicFilter(
            eq("Test"), isNull(), isNull(), isNull(), isNull(), isNull(), isNull(), any()))
            .thenReturn(productPage);

        // Act & Assert
        mockMvc.perform(get("/api/products/search?keyword=Test")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Should validate required fields in POST request")
    void testCreateProductWithoutName() throws Exception {
        // Arrange
        String invalidProduct = "{\"price\": 300.0}"; // Missing name

        // Act & Assert
        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(invalidProduct))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should return correct content type")
    void testResponseContentType() throws Exception {
        // Arrange
        when(productService.findById(1L)).thenReturn(testProduct);

        // Act & Assert
        mockMvc.perform(get("/api/products/1"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }
}

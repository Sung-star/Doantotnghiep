package com.example.ecommerce.resources;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.example.ecommerce.dto.OrderDTO;
import com.example.ecommerce.entities.Order;
import com.example.ecommerce.entities.User;
import com.example.ecommerce.entities.enums.OrderStatus;
import com.example.ecommerce.services.OrderService;
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

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@DisplayName("Order Resource (Controller) Tests")
class OrderResourceTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private OrderService orderService;

    @Autowired
    private ObjectMapper objectMapper;

    private Order testOrder;
    private User testUser;
    private OrderDTO testOrderDTO;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setName("Test User");
        testUser.setEmail("test@example.com");

        testOrder = new Order();
        testOrder.setId(1L);
        testOrder.setClient(testUser);
        testOrder.setOrderStatus(OrderStatus.PENDING);
        testOrder.setMoment(Instant.now());

        testOrderDTO = new OrderDTO();
        testOrderDTO.setClientId(1L);
        testOrderDTO.setShippingName("Test User");
        testOrderDTO.setShippingPhone("0123456789");
        testOrderDTO.setShippingAddress("123 Street");
    }

    @Test
    @DisplayName("Should get order by ID with 200 status")
    void testGetOrderById() throws Exception {
        // Arrange
        when(orderService.findById(1L)).thenReturn(testOrder);

        // Act & Assert
        mockMvc.perform(get("/api/orders/1")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1L))
            .andExpect(jsonPath("$.orderStatus").value("PENDING"));
    }

    @Test
    @DisplayName("Should return 404 when order not found")
    void testGetOrderNotFound() throws Exception {
        // Arrange
        when(orderService.findById(999L)).thenThrow(new RuntimeException("Order not found"));

        // Act & Assert
        mockMvc.perform(get("/api/orders/999")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Should get all orders")
    void testGetAllOrders() throws Exception {
        // Arrange
        List<Order> orders = new ArrayList<>();
        orders.add(testOrder);
        when(orderService.findAll()).thenReturn(orders);

        // Act & Assert
        mockMvc.perform(get("/api/orders")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Should place order with 201 status")
    void testPlaceOrder() throws Exception {
        // Arrange
        when(orderService.placeOrder(any(OrderDTO.class))).thenReturn(testOrder);

        // Act & Assert
        mockMvc.perform(post("/api/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testOrderDTO)))
            .andExpect(status().isCreated());
    }

    @Test
    @DisplayName("Should update order status with 200 status")
    void testUpdateOrderStatus() throws Exception {
        // Arrange
        when(orderService.updateStatus(1L, OrderStatus.PAID)).thenReturn(testOrder);

        // Act & Assert
        mockMvc.perform(put("/api/orders/1/status")
                .contentType(MediaType.APPLICATION_JSON)
                .param("status", "PAID"))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Should delete order with 204 status")
    void testDeleteOrder() throws Exception {
        // Arrange
        doNothing().when(orderService).delete(1L);

        // Act & Assert
        mockMvc.perform(delete("/api/orders/1")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("Should validate required fields in place order request")
    void testPlaceOrderWithMissingData() throws Exception {
        // Arrange
        String invalidOrder = "{\"shippingAddress\": \"123 Street\"}"; // Missing clientId, items

        // Act & Assert
        mockMvc.perform(post("/api/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(invalidOrder))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should return correct content type for order response")
    void testResponseContentType() throws Exception {
        // Arrange
        when(orderService.findById(1L)).thenReturn(testOrder);

        // Act & Assert
        mockMvc.perform(get("/api/orders/1"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    @DisplayName("Should have correct order response structure")
    void testOrderResponseStructure() throws Exception {
        // Arrange
        when(orderService.findById(1L)).thenReturn(testOrder);

        // Act & Assert
        mockMvc.perform(get("/api/orders/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").exists())
            .andExpect(jsonPath("$.orderStatus").exists())
            .andExpect(jsonPath("$.orderDate").exists());
    }

    @Test
    @DisplayName("Should return PENDING status for new order")
    void testNewOrderStatus() throws Exception {
        // Arrange
        when(orderService.findById(1L)).thenReturn(testOrder);

        // Act & Assert
        mockMvc.perform(get("/api/orders/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.orderStatus").value("PENDING"));
    }
}

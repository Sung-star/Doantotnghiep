package com.example.ecommerce.services;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
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

import com.example.ecommerce.dto.CartItemDTO;
import com.example.ecommerce.dto.OrderDTO;
import com.example.ecommerce.entities.Order;
import com.example.ecommerce.entities.OrderItem;
import com.example.ecommerce.entities.Product;
import com.example.ecommerce.entities.ProductSize;
import com.example.ecommerce.entities.ProductVariant;
import com.example.ecommerce.entities.User;
import com.example.ecommerce.entities.enums.OrderStatus;
import com.example.ecommerce.repositories.OrderItemRepository;
import com.example.ecommerce.repositories.OrderRepository;
import com.example.ecommerce.repositories.ProductSizeRepository;
import com.example.ecommerce.repositories.ProductVariantRepository;
import com.example.ecommerce.repositories.UserRepository;
import com.example.ecommerce.repositories.VoucherRepository;
import com.example.ecommerce.services.exceptions.BadRequestException;

@ExtendWith(MockitoExtension.class)
@DisplayName("Order Service Tests")
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private OrderItemRepository orderItemRepository;

    @Mock
    private ProductSizeRepository productSizeRepository;

    @Mock
    private ProductVariantRepository productVariantRepository;

    @Mock
    private VoucherRepository voucherRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private OrderService orderService;

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
        testOrderDTO.setShippingName("Shipping Name");
        testOrderDTO.setShippingPhone("0123456789");
        testOrderDTO.setShippingAddress("123 Street");
        testOrderDTO.setItems(new ArrayList<>());
    }

    @Test
    @DisplayName("Should find order by ID successfully")
    void testFindByIdSuccess() {
        // Arrange
        when(orderRepository.findById(1L)).thenReturn(Optional.of(testOrder));

        // Act
        Order result = orderService.findById(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals(OrderStatus.PENDING, result.getOrderStatus());
    }

    @Test
    @DisplayName("Should throw exception when order not found")
    void testFindByIdNotFound() {
        // Arrange
        when(orderRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            orderService.findById(999L);
        });
    }

    @Test
    @DisplayName("Should find all orders")
    void testFindAll() {
        // Arrange
        List<Order> orders = new ArrayList<>();
        orders.add(testOrder);
        when(orderRepository.findAll()).thenReturn(orders);

        // Act
        List<Order> result = orderService.findAll();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
    }

    @Test
    @DisplayName("Should update order status successfully")
    void testUpdateStatusSuccess() {
        // Arrange
        when(orderRepository.findById(1L)).thenReturn(Optional.of(testOrder));
        when(orderRepository.save(any())).thenReturn(testOrder);
        doNothing().when(emailService).sendStatusUpdate(any());

        // Act
        Order result = orderService.updateStatus(1L, OrderStatus.PAID);

        // Assert
        assertNotNull(result);
        assertEquals(OrderStatus.PAID, result.getOrderStatus());
        assertNotNull(result.getPayment());
    }

    @Test
    @DisplayName("Should throw exception when placing order with non-existent user")
    void testPlaceOrderUserNotFound() {
        // Arrange
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            orderService.placeOrder(testOrderDTO);
        });
    }

    @Test
    @DisplayName("Should throw exception when placing order with empty items")
    void testPlaceOrderEmptyItems() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        // Act & Assert
        assertThrows(BadRequestException.class, () -> {
            orderService.placeOrder(testOrderDTO);
        });
    }

    @Test
    @DisplayName("Should place order with valid data")
    void testPlaceOrderSuccess() {
        // Arrange
        // Setup user
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        // Setup product variant
        Product product = new Product();
        product.setId(1L);
        product.setName("Test Product");
        product.setPrice(100.0);

        ProductVariant variant = new ProductVariant();
        variant.setId(1L);
        variant.setProduct(product);
        variant.setColor("Red");

        // Setup product size
        ProductSize size = new ProductSize();
        size.setId(1L);
        size.setProductVariant(variant);
        size.setSize("M");
        size.setQuantity(10);

        // Setup cart item
        CartItemDTO cartItem = new CartItemDTO();
        cartItem.setProductId(1L);
        cartItem.setColor("Red");
        cartItem.setSizeName("M");
        cartItem.setQuantity(2);
        testOrderDTO.setItems(java.util.List.of(cartItem));

        // Mock repositories
        when(productVariantRepository.findByProductAndColor(1L, "Red"))
            .thenReturn(Optional.of(variant));
        when(productSizeRepository.findByVariantAndSize(1L, "M"))
            .thenReturn(Optional.of(size));
        when(productSizeRepository.save(any())).thenReturn(size);
        when(orderRepository.save(any())).thenReturn(testOrder);
        when(orderItemRepository.save(any())).thenReturn(new OrderItem());
        doNothing().when(emailService).sendStatusUpdate(any());

        // Act
        Order result = orderService.placeOrder(testOrderDTO);

        // Assert
        assertNotNull(result);
        verify(orderRepository, times(2)).save(any());
        verify(productSizeRepository, times(1)).save(any());
        assertEquals(8, size.getQuantity()); // 10 - 2 = 8
    }

    @Test
    @DisplayName("Should throw exception when product stock insufficient")
    void testPlaceOrderInsufficientStock() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        ProductVariant variant = new ProductVariant();
        variant.setId(1L);
        variant.setColor("Red");

        Product product = new Product();
        product.setName("Test Product");
        variant.setProduct(product);

        ProductSize size = new ProductSize();
        size.setQuantity(1); // Only 1 item in stock

        CartItemDTO cartItem = new CartItemDTO();
        cartItem.setProductId(1L);
        cartItem.setColor("Red");
        cartItem.setSizeName("M");
        cartItem.setQuantity(5); // Trying to buy 5
        testOrderDTO.setItems(java.util.List.of(cartItem));

        when(productVariantRepository.findByProductAndColor(1L, "Red"))
            .thenReturn(Optional.of(variant));
        when(productSizeRepository.findByVariantAndSize(1L, "M"))
            .thenReturn(Optional.of(size));

        // Act & Assert
        assertThrows(BadRequestException.class, () -> {
            orderService.placeOrder(testOrderDTO);
        });
    }

    @Test
    @DisplayName("Should delete order successfully")
    void testDeleteOrderSuccess() {
        // Arrange
        when(orderRepository.findById(1L)).thenReturn(Optional.of(testOrder));
        doNothing().when(orderRepository).delete(any());

        // Act
        orderService.delete(1L);

        // Assert
        verify(orderRepository, times(1)).delete(any());
    }

    @Test
    @DisplayName("Should throw exception when deleting non-existent order")
    void testDeleteOrderNotFound() {
        // Arrange
        when(orderRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            orderService.delete(999L);
        });
    }
}

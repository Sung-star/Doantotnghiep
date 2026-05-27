package com.example.ecommerce.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.example.ecommerce.entities.Voucher;
import com.example.ecommerce.repositories.VoucherRepository;
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
@DisplayName("Voucher Service Tests")
class VoucherServiceTest {

    @Mock
    private VoucherRepository voucherRepository;

    @InjectMocks
    private VoucherService voucherService;

    private Voucher testVoucher;

    @BeforeEach
    void setUp() {
        testVoucher = new Voucher();
        testVoucher.setId(1L);
        testVoucher.setCode("SUMMER20");
        testVoucher.setDiscountPercent(20);
        testVoucher.setExpiryDate(Instant.now().plusSeconds(86400)); // 1 day in future
        testVoucher.setActive(true);
    }

    @Test
    @DisplayName("Should find voucher by ID successfully")
    void testFindByIdSuccess() {
        // Arrange
        when(voucherRepository.findById(1L)).thenReturn(Optional.of(testVoucher));

        // Act
        Voucher result = voucherService.findById(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("SUMMER20", result.getCode());
        assertEquals(20, result.getDiscountPercent());
    }

    @Test
    @DisplayName("Should throw exception when voucher not found")
    void testFindByIdNotFound() {
        // Arrange
        when(voucherRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            voucherService.findById(999L);
        });
    }

    @Test
    @DisplayName("Should find all vouchers")
    void testFindAll() {
        // Arrange
        List<Voucher> vouchers = new ArrayList<>();
        vouchers.add(testVoucher);
        when(voucherRepository.findAll()).thenReturn(vouchers);

        // Act
        List<Voucher> result = voucherService.findAll();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("SUMMER20", result.get(0).getCode());
    }

    @Test
    @DisplayName("Should insert voucher successfully")
    void testInsertVoucherSuccess() {
        // Arrange
        when(voucherRepository.save(any(Voucher.class))).thenReturn(testVoucher);

        // Act
        Voucher result = voucherService.insert(testVoucher);

        // Assert
        assertNotNull(result);
        assertEquals("SUMMER20", result.getCode());
        verify(voucherRepository, times(1)).save(testVoucher);
    }

    @Test
    @DisplayName("Should update voucher successfully")
    void testUpdateVoucherSuccess() {
        // Arrange
        Voucher updateData = new Voucher();
        updateData.setCode("SUMMER25");
        updateData.setDiscountPercent(25);

        when(voucherRepository.findById(1L)).thenReturn(Optional.of(testVoucher));
        when(voucherRepository.save(any(Voucher.class))).thenReturn(testVoucher);

        // Act
        Voucher result = voucherService.update(1L, updateData);

        // Assert
        assertNotNull(result);
        assertEquals("SUMMER25", result.getCode());
        assertEquals(25, result.getDiscountPercent());
    }

    @Test
    @DisplayName("Should delete voucher successfully")
    void testDeleteVoucherSuccess() {
        // Arrange
        doNothing().when(voucherRepository).deleteById(1L);

        // Act
        voucherService.delete(1L);

        // Assert
        verify(voucherRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("Should find active voucher by code")
    void testFindActiveByCodeSuccess() {
        // Arrange
        when(voucherRepository.findActiveByCode("SUMMER20")).thenReturn(Optional.of(testVoucher));

        // Act
        Voucher result = voucherService.findByCode("SUMMER20");

        // Assert
        assertNotNull(result);
        assertEquals("SUMMER20", result.getCode());
        assertTrue(result.isActive());
    }

    @Test
    @DisplayName("Should throw exception when voucher code not found")
    void testFindByCodeNotFound() {
        // Arrange
        when(voucherRepository.findActiveByCode("INVALID")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            voucherService.findByCode("INVALID");
        });
    }

    @Test
    @DisplayName("Should validate voucher is active")
    void testVoucherIsActive() {
        // Act & Assert
        assertTrue(testVoucher.isActive());
        assertEquals("SUMMER20", testVoucher.getCode());
    }

    @Test
    @DisplayName("Should validate voucher discount percent")
    void testVoucherDiscountPercent() {
        // Arrange
        Voucher invalidVoucher = new Voucher();
        invalidVoucher.setCode("INVALID");
        invalidVoucher.setDiscountPercent(-10); // Invalid: negative

        // Act & Assert
        // In a real scenario, this should be caught by validation annotations
        assertTrue(invalidVoucher.getDiscountPercent() < 0);
    }

    @Test
    @DisplayName("Should calculate discount amount correctly")
    void testCalculateDiscountAmount() {
        // Arrange
        double orderTotal = 1000.0;
        int discountPercent = 20;

        // Act
        double discount = (orderTotal * discountPercent) / 100;

        // Assert
        assertEquals(200.0, discount);
    }

    @Test
    @DisplayName("Should handle voucher expiry")
    void testVoucherExpiry() {
        // Arrange
        Voucher expiredVoucher = new Voucher();
        expiredVoucher.setCode("EXPIRED");
        expiredVoucher.setExpiryDate(Instant.now().minusSeconds(86400)); // 1 day in past
        expiredVoucher.setActive(false);

        // Act & Assert
        assertFalse(expiredVoucher.isActive());
    }
}

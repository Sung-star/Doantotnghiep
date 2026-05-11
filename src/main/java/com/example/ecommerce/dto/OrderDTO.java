package com.example.ecommerce.dto;

import java.util.List;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public class OrderDTO {
    @NotNull(message = "clientId is required")
    private Long clientId;

    @NotEmpty(message = "Order must contain at least one item")
    private List<CartItemDTO> items;

    @NotBlank(message = "Shipping name is required")
    private String shippingName;

    @NotBlank(message = "Shipping phone is required")
    private String shippingPhone;

    @NotBlank(message = "Shipping address is required")
    private String shippingAddress;

    private String voucherCode;

    public OrderDTO() {}

    // --- GETTERS AND SETTERS ---

    public Long getClientId() { return clientId; }
    public void setClientId(Long clientId) { this.clientId = clientId; }

    public List<CartItemDTO> getItems() { return items; }
    public void setItems(List<CartItemDTO> items) { this.items = items; }

    public String getShippingName() { return shippingName; }
    public void setShippingName(String shippingName) { this.shippingName = shippingName; }

    public String getShippingPhone() { return shippingPhone; }
    public void setShippingPhone(String shippingPhone) { this.shippingPhone = shippingPhone; }

    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }

    public String getVoucherCode() { return voucherCode; }
    public void setVoucherCode(String voucherCode) { this.voucherCode = voucherCode; }
}